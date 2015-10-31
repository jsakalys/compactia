// Load Express
var express = require('express');
var app = express();

// Load Ejs Layouts
var ejsLayouts = require('express-ejs-layouts');
app.set('view engine', 'ejs');
app.use(ejsLayouts);

// Use Static Directory
app.use(express.static(__dirname + '/static'));

// Load Body Parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// Render Landing Page at Root
app.get('/', function(req, res){
	res.render('index');
});

// Render Create Page upon Login
app.get('/create', function(req, res){
	res.render('create');
});

// Use Controllers
app.use("/campaigns", require("./controllers/campaigns"));
app.use("/characters", require("./controllers/characters"));
app.use("/notes", require("./controllers/notes"));

// Listen on Port 3000
app.listen(3000);