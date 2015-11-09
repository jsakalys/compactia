// Loads Express
var express = require('express');
var router = express.Router();

// Loads models
var db = require("./../models");

// Loads multer
var multer = require('multer');
var upload = multer({ dest: './uploads/' });

// Require cloudinary
var cloudinary = require('cloudinary');

/* Routers */

// Shows a list of characters belonging to the current user
router.get('/list', function(req,res){
	// lookup user in database..find all characters and pass them in
	if (req.user) {
		db.user.findOne({where: {id: req.user.id}}).then(function(user){
			user.getCharacters({
				include: [
					{
						model: db.attribute
					}
				]
			}).then(function(characters){
				var characterImages = {};
				if (characters[0]) {
					characters.forEach(function(character){
						characterImages[character.id] = {};
						characterImages[character.id].environment = cloudinary.url(character.environment, {width: 2600, height: 800, crop: "fill", gravity: "center"});
						characterImages[character.id].profile = cloudinary.url(character.profile, {width: 256, height: 256, crop: "fill", gravity: "face"});
					});
					res.render('characters/list', {
						layout: 'layouts/account-view',
						characters: characters,
						characterImages: characterImages
					});
				} else {
					res.redirect('/characters/new');
				};
			});
		});
	} else {
		res.send('Access denied: you are not logged in.')
	};
});

// Shows a form to make a new character
router.get('/new', function(req,res){
	// only allow access if logged in
	if (req.user) {
		res.render('characters/new', { layout: 'layouts/account-view' });
	} else {
		res.send('Access denied: you are not logged in.')
	};
});

// Catches new character form data
router.post('/new', function(req,res){
	// only allow access if logged in
	if (req.user) {
		db.user.findOne({where: {id: req.user.id}}).then(function(user){
			user.createCharacter({
			    name: req.body.name,
			    exp: parseInt(req.body.exp),
			    gold: parseInt(req.body.gold)
			}).then(function(character) {
				db.attribute.create({
					race: req.body.race,
				    gender: req.body.gender,
				    birthplace: req.body.birthplace,
				    class: req.body.class,
				    hp: parseInt(req.body.hp),
				    def: parseInt(req.body.def),
				    desc: req.body.desc,
				    characterId: character.id
				}).then(function(){
					res.redirect('list');	
				});
			});
		});
	} else {
		res.send('Access denied: you are not logged in.')
	};
});

// Shows information about a given character with an option to edit it
router.get('/:id', function(req,res){
	// only allow access priviliges if associated user is current user
	if (req.user) {
		// look up user in database and get characters where character id matches
		db.character.findOne(
			{
			where: {
				id: req.params.id
			},
			include: [
					{
						model: db.attribute
					}
				]
		}).then(function(character){
			var characterImages = {
				environment: cloudinary.url(character.environment, {width: 2600, height: 800, crop: "fill", gravity: "center"}),
				profile: cloudinary.url(character.profile, {width: 256, height: 256, crop: "fill", gravity: "face"}),
			};
			db.attribute.find({where: {characterId: character.id}}).then(function(attribute){
				character.getCampaign().then(function(campaign){
					res.render('characters/show', {
						layout: 'layouts/account-view',
						character: character,
						characterImages: characterImages,
						campaign: campaign,
						attribute: attribute
					});	
				});
			});
		});
	} else {
		res.send('Access denied: you are not logged in.');
	};
});

// Catches image upload for character profile
router.post('/profile/:id', upload.single('characterProfile'), function(req,res){
	// only allow if user is logged in, else redirect to signup page
	if (req.user) {
		db.character.find({where: {id: req.params.id}}).then(function(character){
			cloudinary.uploader.upload(req.file.path, function(result) {
		    	//store public_id from the result in database
		    	character.updateAttributes({
					profile: result.public_id
				}).then(function(){
		    		res.redirect('/characters/list');
				});
		  	});
		});
	} else {
		res.send('Access denied: you are not logged in.')
	};
});

// Catches image upload for character environment
router.post('/environment/:id', upload.single('characterEnvironment'), function(req,res){
	// only allow if user is logged in, else redirect to signup page
	if (req.user) {
		db.character.find({where: {id: req.params.id}}).then(function(character){
			cloudinary.uploader.upload(req.file.path, function(result) {
		    	//store public_id from the result in database
		    	character.updateAttributes({
					environment: result.public_id
				}).then(function(){
		    		res.redirect('/characters/list');
				});
		  	});
		});
	} else {
		res.send('Access denied: you are not logged in.')
	};
});

// Catches updated character info and updates to database
router.put('/:id', function(req,res){
	// only allow access priviliges if user is logged in
	if (req.user) {
		// find character of param name belonging to current user
		db.character.find({where: {id: req.params.id}}).then(function(character){
			character.updateAttributes({
	    		name: req.body.name,
	    		exp: parseInt(req.body.exp),
	    		gold: parseInt(req.body.gold)
		    }).then(function(character){
		    	db.attribute.find({where: {characterId: character.id}}).then(function(attribute){
		    		attribute.updateAttributes({
	    				race: req.body.race,
			    		gender: req.body.gender,
			    		birthplace: req.body.birthplace,
			    		class: req.body.class,
			    		hp: parseInt(req.body.hp),
			    		def: parseInt(req.body.def),
			    		desc: req.body.desc,
		    		}).then(function(){
			  			// don't need anything here, cause ajax
		    		});
		    	});
			});
		});
	} else {
		res.send('Access denied: you are not logged in.');
	};
});

// Exports router
module.exports = router;