'use strict'

var express = require('express');
var playerController = require('../controllers/player.controller');
var mdAuth = require('../middleware/authenticated');

var api = express.Router();

api.post('/:id/createPlayer', [mdAuth.ensureAuth], playerController.createPlayer);
api.put('/:id/updatePlayer/:idP', [mdAuth.ensureAuth], playerController.updatePlayer);
api.post('/:id/deletePlayer/:idP', [mdAuth.ensureAuth], playerController.deletePlayer);
api.get('/listPlayer', playerController.listPlayer);

module.exports = api;