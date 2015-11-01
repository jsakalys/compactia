// Loads Express
var express = require('express');
var router = express();

/* Routers */

// Shows landing page at site root
router.get('/', function(req, res){
	res.render('landing', { layout: 'layouts/landing-view' });
});

// Shows create page upon login if no characters or campaigns exist
router.get('/create', function(req, res){
	res.render('create', { layout: 'layouts/account-view' });
});

// Shows create page upon login if no characters or campaigns exist
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