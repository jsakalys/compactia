// Loads Express
var express = require('express');
var router = express();

// Loads models
var db = require("./../models");

/* Routers */

// Lists all campaigns for a given account
router.get('/list', function(req,res){
	res.render('campaigns/list', { layout: 'layouts/account-view' });
});

// Shows a wizard to generate a new campaign
router.get('/new', function(req,res){
	res.render('campaigns/new', { layout: 'layouts/account-view' });
});

// Catches campaign wizard form data
router.post('/new', function(req,res){
	db.campaign.find({where: { identifier: req.body.identifier }}).then(function(campaign) {
	    if (campaign) {
	    	res.send('Sorry, that identifier is already taken. Please choose another.')
	    } else {
	    	db.campaign.create({
	    		name: req.body.name,
	    		identifier: req.body.identifier,
	    		password: req.body.password,
	    		type: req.body.type
	    	}).then(function() {
	    		res.redirect('list');
			});
	    }
  	});
});

// Shows a specific campaign with an option to edit it
router.get('/:name', function(req,res){
	res.render('campaigns/show', { layout: 'layouts/account-view' });
});

// Catches updated campaign info and updates to database
router.put('/:name', function(req,res){
	db.campaign.find({where: {id: req.body.id}}).then(function(campaign) {
		campaign.updateAttributes({
    		name: req.body.name,
    		identifier: req.body.identifier,
    		type: req.body.type,
    		status: req.body.status,
    		desc: req.body.desc
  		}).then(function() {
 			//res.render('campaigns/show', { layout: 'layouts/account-view' })
  		});
	});
});

// Exports router
module.exports = router;