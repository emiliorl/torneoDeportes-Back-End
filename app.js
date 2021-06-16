'use strict'

var express = require('express');
var bodyParser =  require('body-parser');
var userRoute = require('./routes/user.route');
var leagueRoute = require('./routes/league.route');
var matchRoute = require('./routes/match.route');
var playerRoute = require('./routes/player.route');
var teamRoute = require('./routes/team.route');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

app.use('/v1', userRoute);
app.use('/v1', leagueRoute);
app.use('/v1', teamRoute);
app.use('/v1', playerRoute);
app.use('/v1', matchRoute);

module.exports = app;