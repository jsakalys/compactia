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
		db.campaign.findAll({where: {ownerId: req.user.id}}).then(function(campaigns){
			if (campaigns) {
				res.render('campaigns/list', {
					layout: 'layouts/account-view',
					campaigns: campaigns
				});
			} else {
				res.redirect('/campaigns/new');
			};
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
		db.campaign.findOne({where: {identifier: req.body.identifier}}).then(function(campaign){
			if (!campaign) {
				if (req.body.password == req.body.password2) {
					db.campaign.create({
						ownerId: req.user.id,
						name: req.body.name,
						identifier: req.body.identifier,
						password: req.body.password,
						type: req.body.type,
						status: 'Active'
					}).then(function(campaign) {
				    	db.location.create({
				  			street: req.body.street,
				  			city: req.body.city,
				  			state: req.body.state,
				  			country: req.body.country,
				  			zip: req.body.zip,
				  			campaignId: campaign.id
				  		}).then(function() {
				  			campaign.addUser(req.user.id).then(function(){
				  				res.redirect('list');	
				  			});	
				  		});
					});
				} else {
					console.log('Passwords do not match.');
					req.flash('Campaign passwords do not match.');
					res.redirect('/');
				};
			} else {
				console.log('A campaign with that identifier already exists.');
				req.flash('Sorry, a campaign with that identifier already exists.');
				res.redirect('/');
			};
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
	// only allow write priviliges if owner is current user
	if (req.user) {
		db.campaign.find({where: {identifier: req.params.identifier}}).then(function(campaign) {
			if (campaign.ownerId == req.user.id) {
				campaign.updateAttributes({
		    		name: req.body.name,
		    		identifier: req.body.identifier,
		    		type: req.body.type,
		    		desc: req.body.desc
		  		}).then(function(campaign) {
		  			// separate this into two routes eventually
					db.location.find({where: {campaignId: req.body.campaignId}}).then(function(location) {
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
		  	} else {
		  		res.send('Access denied: you are not the owner of this campaign.')
		  		return false;
		  	};
		});
	} else {
		res.send('Access denied: you are not logged in.');
	};
});

// Exports router
module.exports = router;