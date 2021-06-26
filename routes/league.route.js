'use strict'

var express = require('express');
var leagueController = require('../controllers/league.controller');
var mdAuth = require('../middleware/authenticated');

var api = express.Router();

api.post('/:id/createLeague', [mdAuth.ensureAuth, mdAuth.validRolAdmin], leagueController.createLeague);
api.put('/:id/updateLeague/:idL', [mdAuth.ensureAuth, mdAuth.validRolAdmin], leagueController.updateLeague);
api.post('/:id/deleteLeague/:idL', [mdAuth.ensureAuth, mdAuth.validRolAdmin], leagueController.deleteLeague);
api.get('/listLeagues', leagueController.listLeagues);
api.get('/:id/listLeagues', mdAuth.ensureAuth, leagueController.listMyLeagues);
api.post('/getLeague', leagueController.getLeague);
api.get('/:id/getHoteles', [mdAuth.ensureAuth, mdAuth.validRolAdmin], leagueController.listLeaguesUser);

module.exports = api;