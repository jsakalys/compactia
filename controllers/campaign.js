// Loads Express
var express = require('express');
var router = express.Router();

// Require bcrypt
var bcrypt = require("bcryptjs");

// Loads models
var db = require("./../models");

// Require cloudinary
var cloudinary = require('cloudinary');

/* Routers */

// Shows overview page for a given campaign
router.get('/:identifier', function(req, res){
	// only show if user is logged in
	if (req.user) {
		db.campaign.findOne({where: {identifier: req.params.identifier}}).then(function(campaign){
			db.location.findOne({where: {campaignId: campaign.id}}).then(function(location){
				campaign.getUsers().then(function(users){
					campaign.getNotes({order: [['createdAt', 'DESC']]}).then(function(notes){
						var userImages = {};
						var campaignImages = {
						banner: cloudinary.url(campaign.banner, {width: 2600, height: 800, crop: "fill", gravity: "center"}),
						insignia: cloudinary.url(campaign.insignia, {width: 256, height: 256, crop: "fill", gravity: "center"}),
						};
						users.forEach(function(user){
							userImages[user.id] = cloudinary.url(user.pic, {width: 100, height: 100, crop: "fill", gravity: "face"});
						});
						// only show if current user is a member of that campaign
						users.forEach(function(user){
							if (user.id == req.user.id) {
								console.log('comparing campaign and user');
								console.log(user.id + ' ' + req.user.id);
								res.render('campaign/main', {
									layout: 'layouts/campaign-view',
									campaign: campaign,
									location: location,
									users: users,
									notes: notes,
									userImages: userImages,
									campaignImages: campaignImages
								});
							};
						});
						res.redirect('/campaign/join/'+req.params.identifier);
					});
				});
			});
		});
	} else {
		res.send('Access denied: you are not logged in.');
	};
});

// Shows campaign-specific characters for a given campaign
router.get('/characters/:identifier', function(req, res){
	// only show if user is logged in
	if (req.user) {
		db.campaign.findOne({where: {identifier: req.params.identifier}}).then(function(campaign){
			// only show if current user is associated with campaign
			campaign.getUsers().then(function(users){
				campaign.getCharacters({
					include: [
						{
						model: db.attribute
						}
					]
				}).then(function(characters){
					users.forEach(function(user){
						if (user.id == req.user.id) {
							console.log('User confirmed as part of campaign.');
							console.log('Listing characters in campaign..');
							var characterImages = {};
							if (characters[0]) {
								characters.forEach(function(character){
									characterImages[character.id] = {};
									characterImages[character.id].environment = cloudinary.url(character.environment, {width: 2600, height: 800, crop: "fill", gravity: "center"});
									characterImages[character.id].profile = cloudinary.url(character.profile, {width: 256, height: 256, crop: "fill", gravity: "face"});
								});
							};
							console.log('rendering page...');
							res.render('characters/list', {
								layout: 'layouts/campaign-view',
								campaign: campaign,
								characters: characters,
								characterImages: characterImages
							});
						};
					});
					res.redirect('/campaign/join/'+req.params.identifier);
				});
			});
		});
	} else {
		res.send('Access denied: you are not logged in.');
	};
});

// Shows campaign-specific notes for a given campaign
router.get('/notes/:identifier', function(req, res){
	// only show if user is logged in
	if (req.user) {
		db.campaign.findOne({where: {identifier: req.params.identifier}}).then(function(campaign){
			// only show if current user is associated with campaign
			campaign.getUsers().then(function(users){
				campaign.getNotes().then(function(notes){
					users.forEach(function(user){
						if (user.id == req.user.id) {
							res.render('notes/list', {
								layout: 'layouts/campaign-view',
								campaign: campaign,
								notes: notes
							});
						};
					});
					res.redirect('/campaign/join/'+req.params.identifier);
				});
			});
		});
	} else {
		res.send('Access denied: you are not logged in.');
	};
});

// Shows a page that lets a user join the campaign
router.get('/join/:identifier', function(req,res){
	// only show if user is logged in
	if (req.user) {
		db.campaign.findOne({where: {identifier: req.params.identifier}}).then(function(campaign){
			if (campaign) {
				campaign.getUsers().then(function(users){
					// users.forEach(function(user){
					// 	// show campaign home if user is already in that campaign
					// 	if (user.id == req.user.id) {
					// 		res.redirect('/campaign/' + campaign.identifier);
					// 	};
					// });
					res.render('campaign/join', {
						layout: 'layouts/account-view',
						campaign: campaign
					});
				});
			} else {
				req.flash('Sorry, no such campaign exists.');
				res.redirect('/');
			};
		});
	} else {
		res.send('Access denied: you are not logged in.')
	};
});

// Catches join campaign form data and adds user to campaign
router.post('/join/:identifier', function(req,res){
	// only show if user is logged in
	if (req.user) {
		// Search for campaign and add user to it if password matches
		db.campaign.findOne({where: {identifier: req.params.identifier}}).then(function(campaign){
			if (campaign) {
				// check if user entered the correct campaign password
				bcrypt.compare(req.body.password, campaign.password, function(err, result) {
	    			if (result) {
						db.user.findOne({where: {id: req.user.id}}).then(function(user){
							campaign.addUser(user).then(function(){
								res.redirect('/campaign/'+req.params.identifier);
							});
						});
	    			} else {
	    				res.redirect('/campaign/join/'+req.params.identifier);
	    			};
				});
			} else {
				req.flash('Sorry, no such campaign exists.');
				res.redirect('/');
			};
		});
	} else {
		res.send('Access denied: you are not logged in.')
	};
});

// Adds a character to the campaign
router.put('/character/add', function(req,res){
	// only allow access priviliges if user is logged in
	if (req.user) {
		// find campaign and associate character with it
			db.campaign.find({where: {identifier: req.body.identifier,}}).then(function(campaign){
				if (campaign) {
					db.character.find({where: {id: parseInt(req.body.characterId)}}).then(function(character) {
						campaign.addCharacter(character);
						res.sendStatus(200);
						// don't need anything else here, cause ajax
					});
				} else {
					res.sendStatus(400);
				};
			});
	} else {
		res.send('Access denied: you are not logged in.');
	};
});

// Removes a character from a campaign
router.put('/character/remove', function(req,res){
	// only allow access priviliges if user is logged in
	if (req.user) {
		// find campaign and associate character with it
			db.campaign.find({where: {identifier: req.body.identifier,}}).then(function(campaign){
				db.character.find({where: {id: parseInt(req.body.characterId)}}).then(function(character) {
					campaign.removeCharacter(character);
					res.sendStatus(200);
					// don't need anything here, cause ajax
				});
			});
	} else {
		res.send('Access denied: you are not logged in.');
	};
});

router.get('/:catchall', function(req,res){
	res.sendStatus(404);
});

// Catchall for invalid urls
router.get('/:catchall', function(req,res){
	res.redirect('/');
});

// Exports router
module.exports = router;