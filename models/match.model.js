'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchSchema = Schema({
    teams: [{type: Schema.ObjectId, ref: "team"}],
    goals: [{type: Number}],
    winner: {type: Schema.ObjectId, ref: "team"}, 
    loser: {type: Schema.ObjectId, ref: "team"},
    league: {type: Schema.ObjectId, ref: "league"},
    location: {type: Schema.ObjectId, ref: "team"},
    date: Date
});

module.exports = mongoose.model('match', matchSchema);