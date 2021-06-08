'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = Schema({
    name: String,
    lastname: String,
    country: String,
    age: Number,
    height: Number,
    weight: Number,
    birthday: Date,
    team: [{type: Schema.ObjectId, ref: "team"}]
});

module.exports = mongoose.model('player', playerSchema);