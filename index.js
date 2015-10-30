// Load Express
var express = require('express');
var app = express();

// Load Ejs Layouts
var ejsLayouts = require('express-ejs-layouts');
app.set('view engine', 'ejs');
app.use(ejsLayouts);

// Load Body Parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res){
	res.render('index');
});

// Listen on Port 3000
app.listen(3000);