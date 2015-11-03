// Loads Express
var express = require('express');
var router = express.Router();

// Loads models
var db = require("./../models");

/* Routers */

// Lists all campaigns in database
router.get('/all', function(req,res){
	if (req.user) {
		db.campaign.findAll().then(function(campaigns){
			res.render('campaigns/list', {
				layout: 'layouts/account-view',
				campaigns: campaigns
			});
		});
	} else {
		res.send('Access denied: you are not logged in.')
	}
});

// Lists all campaigns for a given account
router.get('/list', function(req,res){
	// look up current user in database, find all campaigns for that user and pass them in
	if (req.user) {
		db.user.findOne({where: {id: req.user.id}}).then(function(user){
			user.getCampaigns().then(function(campaigns){
				if (campaigns) {
					res.render('campaigns/list', {
						layout: 'layouts/account-view',
						campaigns: campaigns
					});
				} else {
					res.redirect('/campaigns/new');
				};
			});
		});
	} else {
		res.send('Access denied: you are not logged in.')
	};
});

// Shows a wizard to generate a new campaign
router.get('/new', function(req,res){
	// allow access priviliges only if logged in
	if (req.user) {
		res.render('campaigns/new', { layout: 'layouts/account-view' });
	} else {
		res.send('Access denied: you are not logged in.')
	};
});

// Catches campaign wizard form data and creates new database record
router.post('/new', function(req,res){
	if (req.user) {
		db.user.findOne({where: {id: req.user.id}}).then(function(user){
			db.campaign.findOne({where: {identifier: req.body.identifier}}).then(function(campaign){
				if (!campaign) {
					if (req.body.password == req.body.password2) {
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
					} else {
						console.log('Passwords do not match.');
						req.flash('Passwords do not match.');
					}
				} else {
					console.log('A campaign with that identifier already exists.');
					req.flash('Sorry, a campaign with that identifier already exists.');
				};
			});
		});
	} else {
		res.send('Access denied: you are not logged in.')
	}
});

// Shows a specific campaign with an option to edit it
router.get('/:identifier', function(req,res){
	// look up campaign in database, allow access priviliges only if associated user is current user
	if (req.user) {
		db.campaign.find({where: {identifier: req.params.identifier}}).then(function(campaign){
			db.location.find({where: {campaignId: campaign.id}}).then(function(location){
				res.render('campaigns/show', {
					layout: 'layouts/account-view',
					campaign: campaign,
					location: location
				});
			});	
		});
	} else {
		res.send('Access denied: you are not logged in.');
	};
});

// Catches updated campaign info and updates to database
router.put('/:identifier', function(req,res){
	// only allow access priviliges if associated user is current user
	if (req.user) {
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
	} else {
		res.send('Access denied: you are not logged in.');
	};
});

// Exports router
module.exports = router;