'use strict'

var express = require('express');
var playerController = require('../controllers/player.controller');
var mdAuth = require('../middleware/authenticated');

var api = express.Router();

api.post('/:userId/createPlayer', [mdAuth.ensureAuth, mdAuth.validRolAdmin], playerController.createPlayer);
api.put('/:userId/updatePlayer/:playerId', [mdAuth.ensureAuth, mdAuth.validRolAdmin], playerController.updatePlayer);
api.post('/:userId/deletePlayer/:playerId', [mdAuth.ensureAuth, mdAuth.validRolAdmin], playerController.deletePlayer);
api.get('/listPlayer', playerController.listPlayer);

module.exports = api;