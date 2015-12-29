// Loads Express
var express = require('express');
var router = express.Router();

// Loads models
var db = require("./../models");

// Loads multer
var multer = require('multer');
var upload = multer({ dest: './uploads/' });

// Require cloudinary
var cloudinary = require('cloudinary');

/* Routers */

// Lists all campaigns in database
router.get('/all', function(req,res){
	if (req.user) {
		db.campaign.findAll().then(function(campaigns){
			var campaignImages = {};
			campaigns.forEach(function(campaign){
				campaignImages[campaign.id] = {};
				campaignImages[campaign.id].banner = cloudinary.url(campaign.banner, {width: 2600, height: 800, crop: "fill", gravity: "center"});
				campaignImages[campaign.id].insignia = cloudinary.url(campaign.insignia, {width: 256, height: 256, crop: "fill", gravity: "center"});
			});
			res.render('campaigns/list', {
				layout: 'layouts/account-view',
				campaigns: campaigns,
				campaignImages: campaignImages
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
			if (campaigns[0]) {
				var campaignImages = {};
				campaigns.forEach(function(campaign){
					campaignImages[campaign.id] = {};
					campaignImages[campaign.id].banner = cloudinary.url(campaign.banner, {width: 2600, height: 800, crop: "fill", gravity: "center"});
					campaignImages[campaign.id].insignia = cloudinary.url(campaign.insignia, {width: 256, height: 256, crop: "fill", gravity: "center"});
				});
				res.render('campaigns/list', {
					layout: 'layouts/account-view',
					campaigns: campaigns,
					campaignImages: campaignImages
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
		res.render('campaigns/new', { layout: 'layouts/account-view', cssFile: 'gsdk-base' });
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
			var campaignImages = {
				banner: cloudinary.url(campaign.banner, {width: 2600, height: 800, crop: "fill", gravity: "center"}),
				insignia: cloudinary.url(campaign.insignia, {width: 256, height: 256, crop: "fill", gravity: "center"}),
			};
			db.location.find({where: {campaignId: campaign.id}}).then(function(location){
				res.render('campaigns/show', {
					layout: 'layouts/account-view',
					campaign: campaign,
					location: location,
					campaignImages: campaignImages
				});
			});
		});
	} else {
		res.send('Access denied: you are not logged in.');
	};
});

// Catches image upload for campaign banner
router.post('/banner/:identifier', upload.single('campaignBanner'), function(req,res){
	// only allow if user is logged in, else redirect to signup page
	if (req.user) {
		db.campaign.find({where: {identifier: req.params.identifier}}).then(function(campaign){
			cloudinary.uploader.upload(req.file.path, function(result) {
		    	//store public_id from the result in database
		    	campaign.updateAttributes({
					banner: result.public_id
				}).then(function(){
		    		res.redirect('/campaigns/' + campaign.identifier);
				});
		  	});
		});
	} else {
		res.send('Access denied: you are not logged in.')
	};
});

// Catches image upload for campaign insignia
router.post('/insignia/:identifier', upload.single('campaignInsignia'), function(req,res){
	// only allow if user is logged in, else redirect to signup page
	if (req.user) {
		db.campaign.find({where: {identifier: req.params.identifier}}).then(function(campaign){
			cloudinary.uploader.upload(req.file.path, function(result) {
		    	//store public_id from the result in database
		    	campaign.updateAttributes({
					insignia: result.public_id
				}).then(function(){
		    		res.redirect('/campaigns/' + campaign.identifier);
				});
		  	});
		});
	} else {
		res.send('Access denied: you are not logged in.')
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

// Catchall for invalid urls
router.get('/:catchall', function(req,res){
	res.redirect('/');
});

// Exports router
module.exports = router;