'use strict'

var express = require('express');
var playerController = require('../controllers/player.controller');
var mdAuth = require('../middleware/authenticated');

var api = express.Router();



module.exports = api;