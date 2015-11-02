// Loads Express
var express = require('express');
var router = express();

// Loads models
var db = require("./../models");

// Variable for currentUser
var currentUser = 1

/* Routers */

// Lists all campaigns for a given account
router.get('/list', function(req,res){
	// look up current user in database, find all campaigns for that user and pass them in
	res.render('campaigns/list', { layout: 'layouts/account-view' });
});

// Shows a wizard to generate a new campaign
router.get('/new', function(req,res){
	// allow access priviliges only if logged in, if not logged in, redirect to signup page
	// look up current user, pass in user id
	res.render('campaigns/new', { layout: 'layouts/account-view' });
});

// Catches campaign wizard form data and creates new database record
router.post('/new', function(req,res){
	db.user.findOne({where: {id: currentUser}}).then(function(user){
		user.createCampaign({
			name: req.body.name,
			identifier: req.body.identifier,
			password: req.body.password,
			type: req.body.type
		}).then(function(campaign) {
		    db.location.create({
	  			street: req.body.street,
	  			city: req.body.city,
	  			state: req.body.state,
	  			country: req.body.country,
	  			zip: req.body.zip,
	  			campaignId: campaign.id
	  		}).then(function() {
		    	res.redirect('list');			
	  		});
		});
	});
});

// Shows a specific campaign with an option to edit it
router.get('/:name', function(req,res){
	// look up campaign in database, allow access priviliges only if associated user is current user
	res.render('campaigns/show', { layout: 'layouts/account-view' });
});

// Catches updated campaign info and updates to database
router.put('/:name', function(req,res){
	// only allow access priviliges if associated user is current user
	db.campaign.find({where: {id: req.body.id}}).then(function(campaign) {
		campaign.updateAttributes({
    		name: req.body.name,
    		identifier: req.body.identifier,
    		type: req.body.type,
    		status: req.body.status,
    		desc: req.body.desc
  		}).then(function(campaign) {
  			// separate this into two routes eventually
			db.location.find({where: {campaignId: req.body.id}}).then(function(location) {
				location.updateAttributes({
		    		street: req.body.street,
		    		city: req.body.city,
		    		state: req.body.state,
		    		country: req.body.country,
		    		zip: req.body.zip
		  		}).then(function() {
		  			// don't need anything here, cause ajax
		  		});
			});
  		});
	});
});

// Exports router
module.exports = router;