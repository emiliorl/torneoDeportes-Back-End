'use strict'

var Team = require('../models/team.model');
var User = require('../models/user.model');
var Player = require('../models/player.model');

function createPlayer(req, res){
    let userId = req.params.id;
    let teamId = req.params.id;
    let params = req.body;

    /*if(userId != req.user.sub){
        return res.status(401).send({message:'No tienes permiso para crear jugadores'});
    }else{*/
        if(params.name){
            params.name = params.name.toLowerCase();
            Player.findOne({name : params.name}, (err, playerFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al buscar jugadores con el mismo nombre'});
                }else if(playerFind){
                    return res.send({message: 'El nombre del jugador ya esta en uso'});
                }else{
                    let player = new Player();
                    player.name = params.name;
                    player.lastname = params.lastname;
                    player.country = params.country;
                    player.age = params.age;
                    player.height = params.height;
                    player.weight = params.weight;
                    player.birthday = params.birthday;
                    player.user = userId;
                    player.save((err, playerSaved) => {
                        if(err){
                            return res.status(400).send({message:'Error general al intentar agregar jugador'});
                        }else if(playerSaved){
                            User.findByIdAndUpdate(userId, {$push:{player: playerSaved._id}}, {new: true}, (err, playerPush)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al crear un jugador'})
                                }else if(playerPush){
                                    return res.send({message:'El jugador ha sido creado', playerSaved});
                                }else{
                                    return res.status(500).send({message: 'Error al crear jugador'})
                                }
                            })
                        }else{
                            return res.status(400).send({message:'No sea ha podido crear jugador'});
                        }
                    })
                }
            });
        }else{
            return res.status(404).send({message:'Ingrese los parametros mínimos'});
        }
    }

/*}*/

function updatePlayer(req, res){
    let userId = req.params.id;
    let playerId = req.params.idL;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(404).send({message:'No tienes permiso para actualizar jugadores'});
    }else{
        if(update.name){
            update.name = update.name.toLowerCase();

            Player.findOne({name: update.name}, (err, playerFind) => {
                if(err){
                    return res.status(500).send({message:'Error al encontrar jugadores'});
                }else if(playerFind){
                    return res.send({message: 'Ya hay un jugador con ese nombre'})
                }else{
                    Player.findOneAndUpdate({_id: playerId, user:userId}, update, {new: true}, (err, playerUpdate) => {
                        if(err){
                            return res.status(500).send({message:'Error al actualizar el jugador'});
                        }else if(playerUpdate){
                            return res.status(200).send({message:'Jugador actualizado', playerUpdate});
                        }else{
                            return res.status(404).send({message:'No se pudo actualizar el jugador'});
                        }
                    })
                }
            })
        }else{
            Player.findOneAndUpdate({_id: playerId, user: userId}, update, {new: true}, (err, playerUpdate) => {
                if(err){
                    return res.status(500).send({message:'Error al actualizar el jugador'});
                }else if(playerUpdate){
                    return res.send({message:'Jugador actualizado', playerUpdate});
                }else{
                    return res.status(404).send({message:'No se pudo actualizar el jugador'});
                }
            })
        }
    }
}

function deletePlayer(req, res){
    var userId = req.params.id;
    var playerId = req.params.idL;

    if(userId != req.user.sub){
        return res.status(400).send({message:'No posees permisos para eliminar la liga'});
    }else{
        User.findOneAndUpdate({_id: userId, players: playerId},
            {$pull:{players: playerId}}, {new:true}, (err, playerPull)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al eliminar la liga del usuario'});
                }else if(playerPull){
                    Player.findByIdAndRemove({_id: playerId},(err, playerRemoved) => {
                        if(err){
                            return res.status(500).send({message:'Error al eliminar la liga'});
                        }else if(playerRemoved){
                            return res.send({message: 'La liga fue eliminada', playerRemoved});
                        }else{
                            return res.status(404).send({message:'No se pudo eliminar la liga o ya fue eliminada'});
                        }
                    })
                }else{
                    return res.status(500).send({message: 'No se pudo eliminar la liga del usuario'});
                }
            }
        ).populate('players')
    }
}

function listPlayer(req, res){
    Player.find({}).exec((err, playerFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al listar jugadores'});
        }else if(playerFind){
            return res.send({message: 'Jugadores encontrados', playerFind});
        }else{
            return res.status(404).send({message:'No se encontraron jugadores registrados'});
        }
    })
}

module.exports = {
    createPlayer,
    updatePlayer,
    deletePlayer,
    listPlayer
}