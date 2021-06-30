'use strict'

var express = require('express');
var matchController = require('../controllers/match.controller');
var mdAuth = require('../middleware/authenticated');

var api = express.Router();

api.post('/:idUser/:idLeague/createMatches', mdAuth.ensureAuth, matchController.createMatch);
api.get('/:idLeague/listMatches', matchController.listMatches);
api.put('/:idMatch/:idLeague/updateMatch', mdAuth.ensureAuth, matchController.updateMatch);
api.post('/search', mdAuth.ensureAuth, matchController.searchMatch);

module.exports = api;