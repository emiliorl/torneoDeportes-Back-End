'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchSchema = Schema({
    teams: [{type: Schema.ObjectId, ref: "team"}, {goals: Number}],
    winner: {type: Schema.ObjectId, ref: "team"}, 
    loser: {type: Schema.ObjectId, ref: "team"},
    league: {type: Schema.ObjectId, ref: "league"},
    location: String,
    date: Date
});

module.exports = mongoose.model('match', matchSchema);