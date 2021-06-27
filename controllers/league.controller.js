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
        User.findOneAndUpdate({_id: userId},
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

function uploadImage(req, res){
    var userId = req.params.id;
    var leagueId = req.params.idL;
    var fileName;

    if(userId != req.user.sub){
        res.status(401).send({message:'No tienes permisos'});
    }else{
        // Identifica si vienen archivos
        if(req.files.imageLeague){
            
            //ruta en la que llega la imagen
            var filePath = req.files.imageLeague.path;

            //fileSplit separa palabras, direcciones, etc
            // Separar en jerarquia la ruta de la imagen alt + 92 "\\   alt + 124 ||"
            var fileSplit = filePath.split('\\');
            //filePath: document/image/mi-imagen.jpg   0/1/2
            var fileName = fileSplit[2];

            var extension = fileName.split('\.');
            var fileExt = extension[1];
            if( fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
                League.findOneAndUpdate({_id:leagueId, user: userId}, {imageLeague: fileName}, {new: true}, (err, leagueUpdate) => {
                    if(err){
                        res.status(500).send({message:'Error general al subir la imagen'});
                    }else if(leagueUpdate){
                        res.send({league: leagueUpdate, imageLeague: leagueUpdate.imageLeague});
                    }else{
                        res.status(401).send({message:'No se ha podido actualizar la imagen de portada de la liga'});
                    }
                });
            }else{
                fs.unlink(filePath, (err) =>{
                    if(err){
                        res.status(500).send({message:'Extension no valida y error al eliminar el archivo'});
                    }else{
                        res.send({message:'Extension no valida'});
                    }
                })
            }
        }else{
            res.status(404).send({message:'No has enviado una imagen a subir'});
        }
    }
}

function getImage(req, res){
    var fileName = req.params.fileName;
    var pathFile = './uploads/leagues/' + fileName;

    fs.exists(pathFile, (exists) => {
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(404).send({message:'Imagen inexistente'})
        }
    })
}

module.exports = {
    createLeague,
    deleteLeague,
    updateLeague,
    listLeagues,
    listLeaguesUser,
    getLeague,
    listMyLeagues,
    uploadImage,
    getImage
}