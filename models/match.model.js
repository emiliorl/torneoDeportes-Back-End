'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchSchema = Schema({
    teams: [{type: Schema.ObjectId, ref: "team"}, {goals: Number}],
    winner: {type: Schema.ObjectId, ref: "team"}, 
    loser: {type: Schema.ObjectId, ref: "team"},
    location: String,
    date: Date
});

module.exports = mongoose.model('match', matchSchema);