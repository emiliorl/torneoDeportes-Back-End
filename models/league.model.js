'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var leaugeSchema = Schema({
    nameLeague: String,
    descriptionLeague: String,
    startingDate: Date,
    user: {type: Schema.ObjectId, ref: "user"},
    share: String,
    teams: [ {type: Schema.ObjectId, ref: "team"}],
    matches: [{type: Schema.ObjectId, ref: "match"}],
    imageLeague: String
});

module.exports = mongoose.model('league', leaugeSchema);