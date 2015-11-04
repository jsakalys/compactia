// Loads Express
var express = require('express');
var router = express.Router();

// Loads models
var db = require("./../models");

/* Routers */

// Shows overview page for a given campaign
router.get('/:identifier', function(req, res){
	// only show if user is logged in
	if (req.user) {
		db.campaign.findOne({where: {identifier: req.params.identifier}}).then(function(campaign){
			// only show if current user is associated with campaign
			campaign.getUsers().then(function(users){
				users.forEach(function(user){
					if (user.id == req.user.id) {
						res.render('campaign/main', {
							layout: 'layouts/campaign-view',
							campaign: campaign
						});
					};
				});
			});
		});
	} else {
		res.send('Access denied: you are not logged in.');
	};
});

// Shows campaign-specific characters for a given campaign
router.get('/characters/:identifier', function(req, res){
	// only show if user is logged in
	if (req.user) {
		db.campaign.findOne({where: {identifier: req.params.identifier}}).then(function(campaign){
			// only show if current user is associated with campaign
			campaign.getUsers().then(function(users){
				users.forEach(function(user){
					if (user.id == req.user.id) {
						campaign.getCharacters().then(function(characters){
							res.render('characters/list', {
								layout: 'layouts/campaign-view',
								campaign: campaign,
								characters: characters
							});
						});
					};
				});
			});
		});
	} else {
		res.send('Access denied: you are not logged in.');
	};
});

// Shows campaign-specific notes for a given campaign
router.get('/notes/:identifier', function(req, res){
	// only show if user is logged in
	if (req.user) {
		db.campaign.findOne({where: {identifier: req.params.identifier}}).then(function(campaign){
			// only show if current user is associated with campaign
			campaign.getUsers().then(function(users){
				users.forEach(function(user){
					if (user.id == req.user.id) {
						campaign.getNotes().then(function(notes){
							res.render('notes/list', {
								layout: 'layouts/campaign-view',
								campaign: campaign,
								notes: notes
							});
						});
					};
				});
			});
		});
	} else {
		res.send('Access denied: you are not logged in.');
	};
});

// Exports router
module.exports = router;