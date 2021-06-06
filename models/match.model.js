'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchSchema = Schema({
    teams: [{type: Schema.ObjectId, ref: "team"}],
    date: Date
});

module.exports = mongoose.model('match', matchSchema);