// Loads Express
var express = require('express');
var router = express();

// Loads models
var db = require("./../models");

/* Routers */

// Shows a list of characters belonging to the current user
router.get('/', function(req,res){
	res.render('characters/list', { layout: 'layouts/account-view' })
});

// Shows a form to make a new character
router.get('/new', function(req,res){
	res.render('characters/new', { layout: 'layouts/account-view' })
});

// Catches new character form data
router.post('/new', function(req,res){
	console.log(req.body);
	res.send('created');
	//remember to search for user, and then associate that user's new character to user

	// db.character.create({
	//     name: req.body.name,
	//     identifier: req.body.identifier,
	//     password: req.body.password,
	//     type: req.body.type
	// }).then(function() {
	//     res.redirect('list');
	// });
});

// Shows information about a given character with an option to edit it
router.get('/:id', function(req,res){
	res.render('characters/show', { layout: 'layouts/account-view' })
});

// Exports router
module.exports = router;