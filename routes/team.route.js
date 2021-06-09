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
api.get('/listTeams', teamController.listTeam);
api.post('/getTeam', teamController.getTeam);
api.put('/:userId/uploadImage/:teamId', [mdAuth.ensureAuth, upload], teamController.uploadImage);
api.get('/getImage/:fileName', [upload], teamController.getImage);


module.exports = api; 