'use strict'

var express = require('express');
var teamController = require('../controllers/team.controller');
var mdAuth = require('../middleware/authenticated');
var connectMultiparty = require('connect-multiparty');
var upload = connectMultiparty({ uploadDir: './uploads/teams'});

var api = express.Router();

api.post('/:userId/createTeam/:leagueId', [mdAuth.ensureAuth, mdAuth.validRolAdmin], teamController.createTeam);
api.put('/:userId/updateTeam/:leagueId/:teamId', [mdAuth.ensureAuth, mdAuth.validRolAdmin], teamController.updateTeam);
api.post('/:userId/deleteTeam/:leagueId/:teamId', [mdAuth.ensureAuth, mdAuth.validRolAdmin], teamController.deleteTeam);
api.get('/:idLeague/listTeams', teamController.listTeam);
api.get('/:teamId/getTeam', teamController.getTeamById);
api.post('/getTeam', teamController.getTeam);
api.put('/:userId/:leagueId/uploadImage/:teamId', [mdAuth.ensureAuth, upload], teamController.uploadImage);
api.get('/getImageTeam/:fileName', [upload], teamController.getImage);

    
module.exports = api; 