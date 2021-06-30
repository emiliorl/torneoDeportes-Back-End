'use strict'

var moongose = require('mongoose');
var Schema = moongose.Schema;

var teamSchema = Schema({
    nameTeam : String,
    coach : String,
    nameStadium : String,
    adress : String,
    country : String,
    state : String,
    city : String,
    imageTeam : String,
    points: {type: Number, default: 0},
    league : {type: Schema.ObjectId, ref: "league"},
    players : {type: Schema.ObjectId, ref: "player"}
});

module.exports = moongose.model('team', teamSchema);