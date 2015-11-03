// Loads Express
var express = require('express');
var router = express.Router();

// Loads models
var db = require("./../models");

/* Routers */

// Shows a list of characters belonging to the current user
router.get('/list', function(req,res){
	// lookup user in database..find all characters and pass them in
	if (req.user) {
		db.user.findOne({where: {id: req.user.id}}).then(function(user){
			user.getCharacters().then(function(characters){
				console.log(characters);
				if (characters[0]) {
					res.render('characters/list', {
						layout: 'layouts/account-view',
						characters: characters
					});
				} else {
					res.redirect('/characters/new');
				};
			});
		});
	} else {
		res.send('Access denied: you are not logged in.')
	}
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
			}).then(function() {
			    res.redirect('list');
			});
		});
	} else {
		res.send('Access denied: you are not logged in.')
	};
});

// Shows information about a given character with an option to edit it
router.get('/:name', function(req,res){
	// only allow access priviliges if associated user is current user
	if (req.user) {
		// look up user in database and get characters where character id matches
		db.character.find({where: {
			userId: req.user.id,
			name: req.params.name
		}}).then(function(character){
			res.render('characters/show', {
				layout: 'layouts/account-view',
				character: character
			});
		});
	} else {
		res.send('Access denied: you are not logged in.');
	};
});

// Catches updated character info and updates to database
router.put('/:name', function(req,res){
	// only allow access priviliges if user is logged in
	if (req.user) {
		// find character of param name belonging to current user
			db.character.find({where: {
				userId: req.user.id,
				name: req.params.name
			}}).then(function(character){
				character.updateAttributes({
		    		name: req.body.name,
		    		exp: parseInt(req.body.exp),
		    		gold: parseInt(req.body.gold)
		  		}).then(function() {
		  			// don't need anything here, cause ajax
		  		});
			});
	} else {
		res.send('Access denied: you are not logged in.');
	};
});

// Exports router
module.exports = router;