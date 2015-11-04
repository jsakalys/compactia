// Load Express
var express = require('express');
var router = express.Router();

// Loads models
var db = require("./../models");

/* Routers */

// Shows a form to create a new note
router.get('/new/:identifier', function(req,res){
	if (req.user) {
		db.campaign.findOne({where: {identifier: req.params.identifier}}).then(function(campaign){
			// only show to users associated with the campaign in question
			campaign.getUsers().then(function(users){
				users.forEach(function(user){
					if (user.id == req.user.id) {
						res.render('notes/new', {
							layout: 'layouts/campaign-view',
							campaign: campaign
						});	
					};
				});
			});
		});
	} else {
		res.send('Access denied: you are not logged in.')
	};
});

// Creates a new note
router.post('/new/:identifier', function(req,res){
	if (req.user) {
		db.campaign.findOne({where: {identifier: req.params.identifier}}).then(function(campaign){
			// only show to users associated with the campaign in question
			campaign.getUsers().then(function(users){
				users.forEach(function(user){
					if (user.id == req.user.id) {
						campaign.createNote({
							author: req.user.name,
						    title: req.body.title,
						    body: req.body.body,
						}).then(function() {
						    res.redirect('/campaign/notes/' + campaign.identifier);
						});
					};
				});
			});
		});
	} else {
		res.send('Access denied: you are not logged in.')
	};
});

// Displays a note that has been published with an option to edit it
router.get('/:title/:identifier', function(req,res){
	db.campaign.findOne({where: {identifier: req.params.identifier}}).then(function(campaign){
		// only give read permissions to users associated with the campaign in question
		campaign.getUsers().then(function(users){
			users.forEach(function(user){
				if (user.id == req.user.id) {
					db.note.find({where: {campaignId: campaign.id, title: req.params.title}}).then(function(note){
						res.render('notes/show', {
							layout: 'layouts/campaign-view',
							campaign: campaign,
							note: note
						});
					});
				};
			});
		});
	});
});

// Updates a note
router.put('/:title/:identifier', function(req,res){
	// only show if user is logged in
	if (req.user) {
		db.campaign.findOne({where: {identifier: req.params.identifier}}).then(function(campaign){
			// only give update permissions if user is the author of that note
			campaign.getUsers().then(function(users){
				users.forEach(function(user){
					if (user.id == req.user.id) {
						db.note.find({where: {id: req.body.id}}).then(function(note){
							console.log('note found');
							console.log(note.body + note.title + note.author);
							note.updateAttributes({
								author: req.user.name,
							    title: req.body.title,
							    body: req.body.body,
							}).then(function(){
								// don't need anything here, cause ajax
							});
						});
					};
				});
			});
		});
	} else {
		res.send('Access denied: you are not logged in.')
	};
});

// Export router
module.exports = router;