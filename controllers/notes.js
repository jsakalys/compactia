// Load Express
var express = require('express');
var router = express.Router();

// Routers
router.get('/', function(req,res){
	res.render('notes/list')
});

router.get('/new', function(req,res){
	res.render('notes/new')
});

router.get('/:id', function(req,res){
	res.render('notes/show')
});

// Export router
module.exports = router;