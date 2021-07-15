'use strict'

var express = require('express');
var leagueController = require('../controllers/league.controller');
var mdAuth = require('../middleware/authenticated');
var connectMultiparty = require('connect-multiparty');
var upload = connectMultiparty({ uploadDir: './uploads/leagues'});

var api = express.Router();

api.post('/:id/createLeague', mdAuth.ensureAuth, leagueController.createLeague);
api.put('/:id/updateLeague/:idL', [mdAuth.ensureAuth], leagueController.updateLeague);
api.post('/:id/deleteLeague/:idL', mdAuth.ensureAuth, leagueController.deleteLeague);
api.get('/listLeagues', leagueController.listLeagues);
api.get('/:id/listLeagues', mdAuth.ensureAuth, leagueController.listMyLeagues);
api.post('/getLeague', leagueController.getLeague);
api.put('/:id/:idL/uploadImage', [mdAuth.ensureAuth, upload], leagueController.uploadImage);
api.get('/getImageLeague/:fileName', [upload], leagueController.getImage);

module.exports = api;