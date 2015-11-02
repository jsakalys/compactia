// Loads Express
var express = require('express');
var router = express();

// Loads models
var db = require("./../models");

// Variable for current user
var currentUser = 1

/* Routers */

// Shows a list of characters belonging to the current user
router.get('/list', function(req,res){
	// lookup user in database..find all characters and pass them in
	res.render('characters/list', { layout: 'layouts/account-view' })
});

// Shows a form to make a new character
router.get('/new', function(req,res){
	// only allow access if logged in, else redirect to signup page
	// look up current user, pass in user id
	res.render('characters/new', { layout: 'layouts/account-view' })
});

// Catches new character form data
router.post('/new', function(req,res){
	db.user.findOne({where: {id: currentUser}}).then(function(user){
		user.createCharacter({
		    name: req.body.name,
		    exp: parseInt(req.body.exp),
		    gold: parseInt(req.body.gold)
		}).then(function() {
		    res.redirect('list');
		});
	});
});

// Shows information about a given character with an option to edit it
router.get('/:name', function(req,res){
	// only allow access priviliges if associated user is current user
	res.render('characters/show', { layout: 'layouts/account-view' })
});

// Catches updated character info and updates to database
router.put('/:name', function(req,res){
	// only allow access priviliges if associated user is current user
	db.character.find({where: {id: req.body.id}}).then(function(character){
		character.updateAttributes({
    		name: req.body.name,
    		exp: parseInt(req.body.exp),
    		gold: parseInt(req.body.gold)
  		}).then(function() {
  			// don't need anything here, cause ajax
  		});
	});
});

// Exports router
module.exports = router;