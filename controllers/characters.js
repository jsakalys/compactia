// Load Express
var express = require('express');
var router = express();

// Routers
router.get('/', function(req,res){
	res.render('characters/list')
});

router.get('/new', function(req,res){
	res.render('characters/new')
});

router.get('/:id', function(req,res){
	res.render('characters/show')
});

// Export router
module.exports = router;