// Load Express
var express = require('express');
var router = express.Router();

// Loads models
var db = require("./../models");

/* Routers */

router.get('/new/:identifier', function(req,res){
	if (req.user) {
		db.campaign.findOne({where: {identifier: req.params.identifier}}).then(function(campaign){
			res.render('notes/new', {
				layout: 'layouts/campaign-view',
				campaign: campaign
			});	
		});
	} else {
		res.send('Access denied: you are not logged in.')
	};
});

router.get('/:title/:identifier', function(req,res){
	res.render('notes/show', {
		layout: 'layouts/campaign-view'
	});
});

router.post('/:title/:identifier', function(req,res){
	// only allow access if logged in
	if (req.user) {
		db.campaign.findOne({where: {identifier: req.params.identifier}}).then(function(campaign){
			campaign.createNote({
				author: req.user.name,
			    title: req.body.title,
			    body: req.body.body,
			}).then(function() {
			    res.redirect('/campaign/notes/' + campaign.identifier);
			});
		});
	} else {
		res.send('Access denied: you are not logged in.')
	};
});

// Export router
module.exports = router;