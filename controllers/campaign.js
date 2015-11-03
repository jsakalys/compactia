// Loads Express
var express = require('express');
var router = express.Router();

// Loads models
var db = require("./../models");

/* Routers */

// Shows campaign-specific characters for a given campaign
router.get('/characters/:identifier', function(req, res){
	// only show if campaign is owned by user or if a user's character belongs to the campaign
	if (req.user) {
		db.campaign.findOne({where: {identifier: req.params.identifier}}).then(function(campaign){
			campaign.getCharacters().then(function(characters){
				if (campaign.userId == req.user.id) {
					// look up campaign in database, and pass in all associated characters
					res.render('characters/list', {
						layout: 'layouts/campaign-view',
						campaign: campaign,
						characters: characters
					});
				} else {
					return false;
				};
			});
		});
	} else {
		res.send('Access denied: you are not logged in.');
	};
});

// Shows campaign-specific notes for a given campaign
router.get('/notes/:identifier', function(req, res){
	res.render('notes/list', {
		layout: 'layouts/campaign-view',
	});
});

// Shows overview page for a given campaign
router.get('/:identifier', function(req, res){
	// only show if campaign is owned by user or if a user's character belongs to the campaign
	if (req.user) {
		db.campaign.findOne({where: {identifier: req.params.identifier}}).then(function(campaign){
			if (campaign.userId == req.user.id) {
				res.render('dash', {
					layout: 'layouts/campaign-view',
					campaign: campaign
				});
			} else {
				return false;
			};
		});
	} else {
		res.send('Access denied: you are not logged in.');
	};
});

// Exports router
module.exports = router;