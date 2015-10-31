// Load Express
var express = require('express');
var router = express();

// Routers
router.get('/', function(req,res){
	res.render('campaigns/list')
});

router.get('/new', function(req,res){
	res.render('campaigns/new', { layout: 'layouts/new-campaign' })
});

router.get('/:id', function(req,res){
	res.render('campaigns/show')
});

// Export router
module.exports = router;