// Loads Express
var express = require('express');
var app = express();

// Loads models
var db = require("./models");

// Require Express Sessions
var session = require('express-session');
app.use(session({
  secret: 'sasdlfkajsldfkajweoriw234234ksdfjals23',
  resave: false,
  saveUninitialized: true
}));

// Require flash for user alerts
var flash = require('connect-flash');
app.use(flash());

// Require passport and related strategies
var passport = require('passport');
var strategies = require('./config/strategies');
app.use(passport.initialize());
app.use(passport.session());

// Loads Body Parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// Incorporate serializers for provider/server communication??
passport.serializeUser(strategies.serializeUser);
passport.deserializeUser(strategies.deserializeUser);

// Use middleware strategies for local and provider authorization
passport.use(strategies.localStrategy);
passport.use(strategies.facebookStrategy);

// Require isUnique validator
// var Sequelize = require('sequelize');
// require('sequelize-isunique-validator')(Sequelize);

// Use middleware for currentUser and alerts
app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.alerts = req.flash();
  next();
});

// Loads Ejs Layouts
var ejsLayouts = require('express-ejs-layouts');
app.set('view engine', 'ejs');
app.use(ejsLayouts);

// Uses Static Directory
app.use(express.static(__dirname + '/static'));

// Uses Controllers
app.use("/campaign", require("./controllers/campaign"));
app.use("/campaigns", require("./controllers/campaigns"));
app.use("/characters", require("./controllers/characters"));
app.use("/notes", require("./controllers/notes"));
app.use("/", require("./controllers/root"));

// Listens on Port 3000
app.listen(process.env.PORT || 3000);