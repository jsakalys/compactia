// Loads Express
var express = require('express');
var app = express();

// Loads Ejs Layouts
var ejsLayouts = require('express-ejs-layouts');
app.set('view engine', 'ejs');
app.use(ejsLayouts);

// Uses Static Directory
app.use(express.static(__dirname + '/static'));

// Loads Body Parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// Uses Controllers
app.use("/", require("./controllers/root"));
app.use("/campaigns", require("./controllers/campaigns"));
app.use("/characters", require("./controllers/characters"));
app.use("/notes", require("./controllers/notes"));

// Listens on Port 3000
app.listen(3000);