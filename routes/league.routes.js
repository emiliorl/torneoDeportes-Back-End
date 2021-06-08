'use strict'

var express = require('express');
var leagueController = require('../controllers/league.controller');
var mdAuth = require('../middleware/authenticated');

var api = express.Router();

api.post('/:id/createLeague', [mdAuth.ensureAuth, mdAuth.validRolAdmin], leagueController.createHotel);
api.put('/:id/updateLeague/:idL', [mdAuth.ensureAuth, mdAuth.validRolAdmin], leagueController.updateHotel);
api.post('/:id/deleteLeague/:idL', [mdAuth.ensureAuth, mdAuth.validRolAdmin], leagueController.deleteHotel);
api.get('/listLeagues', leagueController.listHotels);
api.post('/getLeague', leagueController.getHotel);
api.get('/:id/getHoteles', [mdAuth.ensureAuth, mdAuth.validRolAdmin], leagueController.getHotelsAdmin);

module.exports = api;