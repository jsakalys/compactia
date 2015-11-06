// Loads Express
var express = require('express');
var router = express.Router();

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
				// only show if current user is associated with campaign
				campaign.getUsers().then(function(users){
					var userImages = {};
					var campaignImages = {
						banner: cloudinary.url(campaign.banner, {width: 2600, height: 800, crop: "fill", gravity: "center"}),
						insignia: cloudinary.url(campaign.insignia, {width: 256, height: 256, crop: "fill", gravity: "center"}),
					};
					users.forEach(function(user){
						userImages[user.id] = cloudinary.url(user.pic, {width: 100, height: 100, crop: "fill", gravity: "face"});
						if (user.id == req.user.id) {
							campaign.getNotes({order: [['createdAt', 'DESC']]}).then(function(notes){
								res.render('campaign/main', {
									layout: 'layouts/campaign-view',
									campaign: campaign,
									location: location,
									users: users,
									notes: notes,
									//activity: activity,
									userImages: userImages,
									campaignImages: campaignImages
								});
							});
						};
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
				users.forEach(function(user){
					if (user.id == req.user.id) {
						campaign.getCharacters().then(function(characters){
							res.render('characters/list', {
								layout: 'layouts/campaign-view',
								campaign: campaign,
								characters: characters
							});
						});
					};
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
				users.forEach(function(user){
					if (user.id == req.user.id) {
						campaign.getNotes().then(function(notes){
							res.render('notes/list', {
								layout: 'layouts/campaign-view',
								campaign: campaign,
								notes: notes
							});
						});
					};
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
			campaign.getUsers().then(function(users){
				users.forEach(function(user){
					// show campaign home if user is already in that campaign
					if (user.id == req.user.id) {
						res.redirect('/campaign/' + campaign.identifier);
					} else {
						res.render('campaign/join', {
							layout: 'layouts/account-view',
							campaign: campaign
						});
					};
				});
			});
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
			if (campaign.password == req.body.password) {
				db.user.findOne({where: {id: req.user.id}}).then(function(user){
					campaign.addUser(user).then(function(){
						res.redirect('/campaign/' + campaign.identifier);
					});
				});	
			} else {
				console.log('Incorrect password.');
				res.redirect('/campaign/join/' + campaign.identifier);
			};
		});
	};
});

// Adds a character to the campaign
router.put('/character/add', function(req,res){
	// only allow access priviliges if user is logged in
	if (req.user) {
		// find campaign and associate character with it
			db.campaign.find({where: {identifier: req.body.identifier,}}).then(function(campaign){
				db.character.find({where: {id: parseInt(req.body.characterId)}}).then(function(character) {
					campaign.addCharacter(character).then(function() {
		  				res.send('character added.');
		  			});
				});
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
					campaign.removeCharacter(character).then(function() {
		  				res.send('character removed.')
		  			});
				});
			});
	} else {
		res.send('Access denied: you are not logged in.');
	};
});

// Exports router
module.exports = router;