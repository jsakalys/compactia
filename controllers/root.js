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
		db.user.findOrCreate({
		where: {email: req.body.email},
        defaults: {
          password: req.body.password,
          name: req.body.name
		}}).spread(function(user, created) {
			if (created) {
				req.login(user, function(err){
					if (err) throw err;
					res.redirect('/create');
				});
			} else {
				req.flash('danger', 'A user with that e-mail address already exists.');
				res.redirect('/');
			};
		}).catch(function(err) {
        	req.flash('danger', err.message);
        	res.redirect('/auth/signup');
      	});
	};
});

// Catches login form input
router.post('/login',function(req,res){
	passport.authenticate('local', function(err, user, info) {
		if (user) {
	  		req.login(user, function(err) {
				if (err) throw err;
				req.flash('success', 'You are now logged in.');
				res.sendStatus('PASS');
			});
  		} else {
	  		req.flash('danger', 'Invalid ID/password combo.');
	  		res.sendStatus('FAIL');
		};
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
		};
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
	};
});

// Shows account information for a given user
router.get('/account', function(req, res){
	// only show if user logged in, else redirect to signup page
	if (req.user) {
		var userPic = cloudinary.url(req.user.pic, { width: 125, height: 125, crop: 'crop', gravity: 'face' });
		res.render('account', {
			layout: 'layouts/account-view',
			userPic: userPic
		});
	} else {
		res.send('Access denied: you are not logged in.')	
	};
});

// Catches updated account information for a given user
router.put('/account', function(req, res){
	// only show if user logged in, else redirect to signup page
	if (req.user) {
		db.user.find({where: {id: req.user.id}}).then(function(user){
			user.updateAttributes({
				name: req.body.name,
				email: req.body.email
				// add option to change password with bcrypt?
			}).then(function() {
				// don't need anything here, cause ajax
			});
		});
	} else {
		res.send('Access denied: you are not logged in.')	
	};
});

// Catches image upload for user profile pic
router.post('/account', upload.single('userPicture'), function(req,res){
	// only allow if user is logged in, else redirect to signup page
	if (req.user) {
		db.user.find({where: {id: req.user.id}}).then(function(user){
			cloudinary.uploader.upload(req.file.path, function(result) {
		    	//store public_id from the result in database
		    	user.updateAttributes({
					pic: result.public_id
				}).then(function(){
		    		res.redirect('/account');
				});
		  	});
		});
	} else {
		res.send('Access denied: you are not logged in.')
	};
});

// Catchall for invalid urls
router.get('/:catchall', function(req,res){
	res.redirect('/');
});

// Exports router
module.exports = router;