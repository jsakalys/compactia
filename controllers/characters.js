// Loads Express
var express = require('express');
var router = express();

/* Routers */

// Shows a list of characters belonging to the current user
router.get('/', function(req,res){
	res.render('characters/list', { layout: 'layouts/account-view' })
});

// Shows a form to make a new character
router.get('/new', function(req,res){
	res.render('characters/new', { layout: 'layouts/account-view' })
});

// Shows information about a given character with an option to edit it
router.get('/:id', function(req,res){
	res.render('characters/show', { layout: 'layouts/account-view' })
});

// Exports router
module.exports = router;