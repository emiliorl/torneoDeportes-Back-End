'use strict'

var moongose = require('mongoose');
var Schema = moongose.Schema;

var teamSchema = Schema({
    nameTeam : String,
    couch : String,
    nameStadium : String,
    adress : String,
    country : String,
    state : String,
    city : String,
    image : String,
    league : {type: Schema.ObjectId, ref: "league"}
});

module.exports = moongose.model('team', teamSchema);