// Loads Express
var express = require('express');
var router = express();

// Loads models
var db = require("./../models");

/* Routers */

// Shows a list of characters belonging to the current user
router.get('/list', function(req,res){
	res.render('characters/list', { layout: 'layouts/account-view' })
});

// Shows a form to make a new character
router.get('/new', function(req,res){
	res.render('characters/new', { layout: 'layouts/account-view' })
});

// Catches new character form data
router.post('/new', function(req,res){
	//remember to search for user, and then associate that user's new character to user
	db.character.create({
	    name: req.body.name,
	    exp: parseInt(req.body.exp),
	    gold: parseInt(req.body.gold)
	}).then(function() {
	    res.redirect('list');
	});
});

// Shows information about a given character with an option to edit it
router.get('/:name', function(req,res){
	res.render('characters/show', { layout: 'layouts/account-view' })
});

// Catches updated character info and updates to database
router.put('/:name', function(req,res){
	db.character.find({where: {id: req.body.id}}).then(function(character) {
		character.updateAttributes({
    		name: req.body.name,
    		exp: parseInt(req.body.exp),
    		gold: parseInt(req.body.gold)
  		}).then(function() {
			//res.render('characters/show', { layout: 'layouts/account-view' })
  		});
	});
});

// Exports router
module.exports = router;