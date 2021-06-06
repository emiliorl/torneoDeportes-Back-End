'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var leaugeSchema = Schema({
    nameLeauge: String,
    descriptionLeauge: String,
    teams: [{type: Schema.ObjectId, ref: "team"}, {points: Number}],
    matches: [{type: Schema.ObjectId, ref: "match"}]
});

module.exports = mongoose.model('leauge', leaugeSchema);