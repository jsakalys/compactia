// Loads Express
var express = require('express');
var router = express.Router();

// Loads models
var db = require("./../models");

// Require passport
var passport = require('passport');

/* Routers */

// Shows landing page at site root
router.get('/', function(req, res){
	res.render('landing', { 
		layout: 'layouts/landing-view'
	 });
});

// Catches signup form input
router.post('/signup', function(req, res){
	if (req.body.password != req.body.password2) {
      	req.flash('danger', 'Passwords do not match.');
      	res.redirect('/');
  } else {
		db.user.findOrCreate({where: { 
			name: req.body.name, 
			email: req.body.email, 
			password: req.body.password 
		}}).spread(function(user, created) {
	    	if (created) {
	    		res.render('create', {
	    			layout: 'layouts/account-view',
	    			user: user
	    		});
	    	} else {
	    		req.flash('danger', 'A user with that e-mail address already exists.');
		    	res.redirect('/');
		    }
  		});
	}
});

// Catches login form input
router.post('/login',function(req,res){
  passport.authenticate('local', function(err, user, info) {
    if (user) {
      req.login(user, function(err) {
        if (err) throw err;
        req.flash('success', 'You are now logged in.');
        res.redirect('/create');
      });
    } else {
      req.flash('danger', 'Error');
      res.redirect('/'); // add AJAX thing here
    }
  })(req, res);
});

// Facebook Oauth login
router.get('/passport/:provider', function(req, res) {
  passport.authenticate(
    req.params.provider,
    {scope: ['public_profile', 'email']}
  )(req, res);
});

// Facebook Oauth callback
router.get('/callback/:provider', function(req, res) {
  passport.authenticate(req.params.provider, function(err, user, info) {
    if (err) throw err;
    if (user) {
      req.login(user, function(err) {
        if (err) throw err;
        req.flash('success', 'You are now logged in with ' + req.params.provider);
        res.redirect('/create');
      });
    } else {
      req.flash('danger', 'Error');
      res.redirect('/');
    }
  })(req, res);
});

// Redirects to index after logout
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('info', 'You have been logged out.');
  res.redirect('/');
});

// Shows create page upon login
router.get('/create', function(req, res){
	// only show if user logged in, else redirect to signup page
	if (req.user) {
		res.render('create', { 
			layout: 'layouts/account-view'
		});
	} else {
		res.send('Access denied: you are not logged in.')
	}
});

// Shows account information for a given user
router.get('/user/:name', function(req, res){
	// only show if user logged in, else redirect to signup page
	if (req.user) {
		// lookup current user in database, pass in user
		res.render('account', {
			layout: 'layouts/account-view'
		});
	} else {
		res.send('Access denied: you are not logged in.')	
	}
});

// Shows overview page for a given campaign
router.get('/:campaign', function(req, res){
	// this is the hard part, only show if campaign is owned by user or if a user's character belongs to the campaign
	res.render('dash', {
		layout: 'layouts/campaign-view'
	});
});

// Shows campaign-specific characters for a given campaign
router.get('/:campaign/characters', function(req, res){
	// this is the hard part, only show if campaign is owned by user or if a user's character belongs to the campaign
	// look up campaign in database, and pass in all associated characters
	res.render('characters/list', {
		layout: 'layouts/campaign-view'
	});
});

// Shows campaign-specific notes for a given campaign
router.get('/:campaign/notes', function(req, res){
	res.render('notes/list', {
		layout: 'layouts/campaign-view'
	});
});

// Exports router
module.exports = router;