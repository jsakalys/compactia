// Loads Express
var express = require('express');
var router = express();

// Loads models
var db = require("./../models");

/* Routers */

// Shows landing page at site root
router.get('/', function(req, res){
	res.render('landing', { layout: 'layouts/landing-view' });
});

// Catches signup form input
router.post('/signup', function(req, res){
	db.user.findOrCreate({where: { name: req.body.name, email: req.body.email, password: req.body.password }}).spread(function(user, created) {
	    if (created) {
	    	res.render('create', {
	    		layout: 'layouts/account-view',
	    		user: user
	    	});
	    } else {
	    	res.redirect('/')
	    }
  });
});

// Catches login form input
router.post('/login', function(req, res){
	// db.user.find({where: { email: req.body.email, password: req.body.password }}).then(function(user) {
	//     if (user) {
	//     	res.redirect('/create', {user: user});
	//     } else {
	//     	console.log('User not found.')
	//     }
 //  });
});

// Shows create page upon login if no characters or campaigns exist
router.get('/create', function(req, res){
	res.render('create', { layout: 'layouts/account-view' });
});

// Shows account information for a given user
router.get('/user/:name', function(req, res){
	res.render('account', { layout: 'layouts/account-view' });
});

// Shows overview page for a given campaign
router.get('/:campaign', function(req, res){
	res.render('dash', { layout: 'layouts/campaign-view' });
});

// Shows campaign-specific characters for a given campaign
router.get('/:campaign/characters', function(req, res){
	res.render('characters/list', { layout: 'layouts/campaign-view' });
});

// Shows campaign-specific notes for a given campaign
router.get('/:campaign/notes', function(req, res){
	res.render('notes/list', { layout: 'layouts/campaign-view' });
});

// Exports router
module.exports = router;