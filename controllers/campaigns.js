// Loads Express
var express = require('express');
var router = express();

/* Routers */

// Lists all campaigns for a given account
router.get('/list', function(req,res){
	res.render('campaigns/list', { layout: 'layouts/account-view' })
});

// Shows a wizard to generate a new campaign
router.get('/new', function(req,res){
	res.render('campaigns/new', { layout: 'layouts/account-view' })
});

// Shows a specific campaign with an option to edit it
router.get('/:id', function(req,res){
	res.render('campaigns/show', { layout: 'layouts/account-view' })
});

// Exports router
module.exports = router;