'use strict'

var User = require('../models/user.model');
var League = require('../models/league.model');

var fs = require('fs');
var path = require('path');

function createLeague(req, res){
    let userId = req.params.id;
    let params = req.body;

    if(userId != req.user.sub){
        return res.status(401).send({message:'No tienes permiso para agregar a la liga'});
    }else{
        if(params.nameLeague && params.startingDate && params.share){
            params.nameLeague = params.nameLeague.toLowerCase();
            League.findOne({nameLeague : params.nameLeague}, (err, leagueFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al buscar liga con el mismo nombre'});
                }else if(leagueFind){
                    return res.send({message: 'El nombre de la liga ingresado ya esta en uso'});
                }else{
                    let league = new League();
                    league.nameLeague = params.nameLeague;
                    league.startingDate = params.startingDate;
                    league.user = userId;
                    league.share = params.share;
                    league.save((err, leagueSaved) => {
                        if(err){
                            return res.status(400).send({message:'Error general al intentar crear la liga'});
                        }else if(leagueSaved){
                            User.findByIdAndUpdate(userId, {$push:{leagues: leagueSaved._id}}, {new: true}, (err, leaguePush)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al agergar la liga'})
                                }else if(leaguePush){
                                    return res.send({message:'La liga se creo exitosamente', leagueSaved});
                                }else{
                                    return res.status(500).send({message: 'Error al agregar la liga'})
                                }
                            })
                        }else{
                            return res.status(400).send({message:'No sea ha podido crear la liga'});
                        }
                    })
                }
            });
        }else{
            return res.status(404).send({message:'Ingrese los parametros mínimos'});
        }
    }

}

function deleteLeague(req, res){
    var userId = req.params.id;
    var leagueId = req.params.idL;

    if(userId != req.user.sub){
        return res.status(400).send({message:'No posees permisos para eliminar la liga'});
    }else{
        User.findOneAndUpdate({_id: userId, leagues: leagueId},
            {$pull:{leagues: leagueId}}, {new:true}, (err, leaguePull)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al eliminar la liga del usuario'});
                }else if(leaguePull){
                    League.findByIdAndRemove({_id: leagueId},(err, leagueRemoved) => {
                        if(err){
                            return res.status(500).send({message:'Error al eliminar la liga'});
                        }else if(leagueRemoved){
                            return res.send({message: 'La liga fue eliminada', leagueRemoved});
                        }else{
                            return res.status(404).send({message:'No se pudo eliminar la liga o ya fue eliminada'});
                        }
                    })
                }else{
                    return res.status(500).send({message: 'No se pudo eliminar la liga del usuario'});
                }
            }
        ).populate('leagues')
    }
}

function updateLeague(req, res){
    let userId = req.params.id;
    let leagueId = req.params.idL;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(404).send({message:'No tienes permiso para actualizar este servicio'});
    }else{
        if(update.nameLeague){
            update.nameLeague = update.nameLeague.toLowerCase();

            League.findOne({nameLeague: update.nameLeague}, (err, leagueFind) => {
                if(err){
                    return res.status(500).send({message:'Error al buscar liga'});
                }else if(leagueFind && leagueFind._id != leagueId){
                    return res.send({message: 'Ya existente una liga con este nombre'})
                }else{
                    League.findOneAndUpdate({_id: leagueId, user:userId}, update, {new: true}, (err, leagueUpdate) => {
                        if(err){
                            return res.status(500).send({message:'Error al actualizar la liga'});
                        }else if(leagueUpdate){
                            return res.status(200).send({message:'Liga actualizada', leagueUpdate});
                        }else{
                            return res.status(404).send({message:'No se pudo actualizar la liga'});
                        }
                    })
                }
            })
        }else{
            League.findOneAndUpdate({_id: leagueId, user: userId}, update, {new: true}, (err, leagueUpdate) => {
                if(err){
                    return res.status(500).send({message:'Error al actualizar la liga'});
                }else if(leagueUpdate){
                    return res.send({message:'Liga actualizada', leagueUpdate});
                }else{
                    return res.status(404).send({message:'No se pudo actualizar la liga'});
                }
            })
        }
    }
}

function listLeagues(req,res){

    League.find({share: 'public'}).select("-__v").exec((err, leagueFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al obtener las ligas'});
        }else if(leagueFind){
            return res.send({message: 'Ligas encontradas', leagueFind});
        }else{
            return res.status(404).send({message:'No se encontraron ligas'});
        }
    });

}

function listMyLeagues(req,res){
    let userId = req.params.id;

    League.find({user: userId}).select("-__v").exec((err, leagueFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al obtener las ligas'});
        }else if(leagueFind){
            return res.send({message: 'Ligas encontradas', leagueFind});
        }else{
            return res.status(404).send({message:'No se encontraron ligas'});
        }
    });

}

function listLeaguesUser(req,res){
    let userId = req.params.id;

    League.find({user: userId}).select("-__v").exec((err, leagueFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al obtener las ligas'});
        }else if(leagueFind){
            return res.send({message: 'Ligas encontradas', leagueFind});
        }else{
            return res.status(404).send({message:'No se encontraron ligas'});
        }
    });

}

function getLeague(req,res){
    let params = req.body;

    League.find({$or : [{nameLeague : {$regex: params.search}}]}).select("-__v").exec((err, leagueFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al obtener las ligas'});
        }else if(leagueFind){
            return res.send({message: 'Ligas encontradas', leagueFind});
        }else{
            return res.status(404).send({message:'No se encontraron ligas'});
        }
    });

}

module.exports = {
    createLeague,
    deleteLeague,
    updateLeague,
    listLeagues,
    listLeaguesUser,
    getLeague,
    listMyLeagues
}