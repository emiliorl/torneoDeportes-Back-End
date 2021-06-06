'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tournamentSchema = Schema({
    tournament: String,
    descriptionTournament: String,
    teams: [{type: Schema.ObjectId, ref: "team"}],
    matches: [{type: Schema.ObjectId, ref: "match"}]
});

module.exports = mongoose.model('tournament', tournamentSchema);