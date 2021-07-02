'use strict'

var Team = require('../models/team.model');
var User = require('../models/user.model');
var League = require('../models/league.model');
var bcrypt = require('bcrypt-nodejs');

var fs = require('fs');
var path = require('path');

function createTeam(req, res){
    var userId = req.params.userId;
    var leagueId = req.params.leagueId;
    var params = req.body;
    params.nameTeam = params.nameTeam.toLowerCase();

    if(userId != req.user.sub){
        return res.status(400).send({message:'No posees permisos para hacer esta accion'});
    }else{
        League.findOne({_id: leagueId, user: userId}, (err, leagueFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general al buscar la liga'});
            }else if(leagueFind){
                Team.findOne({nameTeam : params.nameTeam}, (err, teamFind)=>{
                    if(err){
                        return res.status(400).send({message:'Error general al buscar el equipo con dicho nombre'});
                    }else if(teamFind){
                        return res.send({message: 'El nombre del equipo ingresado ya esta en uso'});
                    }else{
                        let team = new Team();
                        team.nameTeam = params.nameTeam;
                        team.coach = params.coach;
                        team.nameStadium = params.nameStadium;
                        team.adress = params.adress;
                        team.country = params.country;
                        team.state = params.state;
                        team.city = params.city;
                        team.league = leagueId;
                        team.save((err, teamSaved)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al guardar el equipo'});
                            }else if(teamSaved){
                                League.findByIdAndUpdate(leagueId, {$push:{teams: teamSaved._id}}, {new: true}).populate('teams').exec((err, teamPush)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general al agregar el equipo a la liga'})
                                    }else if(teamPush){
                                        return res.send({message: 'El equipo se guardo satisfactoriamente', teamPush});
                                    }else{
                                        return res.status(500).send({message: 'Error al agregar el equipo a la liga'})
                                    }
                                })
                            }else{
                                return res.send({message: 'No se pudo agregar el equipo con exito'});
                            }
                        })
                    }
                })                
            }else{
                return res.status(404).send({message:'No se encontro la liga deseada'});
            }
        });
    }
}

function updateTeam(req, res){
    var userId = req.params.userId;
    var leagueId = req.params.leagueId;
    var teamId = req.params.teamId;
    var update = req.body;

    if(userId != req.user.sub){
        return res.status(400).send({message:'No posees permisos para hacer esta accion'});
    }else{
        League.findOne({_id : leagueId}, (err, leagueFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general al buscar la liga'});
            }else if(leagueFind){
                Team.findById(teamId, (err, teamFind)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al buscar el equipo'});
                    }else if(teamFind.league == leagueId){
                        if(update.nameTeam != teamFind.nameTeam){
                            Team.findOne({nameTeam : update.nameTeam}, (err, existingTeam)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al buscar el nombre del equipo'});
                                }else if(existingTeam){
                                    return res.send({message: 'Este nombre del equipo ya esta en uso'})
                                }else{
                                    Team.findOneAndUpdate({_id : teamId}, update,{new: true}, (err, teamUpdated)=>{
                                        if(err){
                                            return res.status(500).send({message: 'Error general al actualizar el equipo'});
                                        }else if(teamUpdated){
                                            return res.send({message: 'El equipo se actualizo satisfactoriamente', teamUpdated});
                                        }else{
                                            return res.status(404).send({message:'No se pudo actualizar el equipo'});
                                        }
                                    });
                                }
                            });
                        }else{
                            Team.findByIdAndUpdate(teamId, update, (err, teamUpdated)=>{
                                console.log(update);
                                if(err){
                                    return res.status(500).send({message: 'Error general al actualizar el equipo'});
                                }else if(teamUpdated){
                                    return res.send({message: 'El equipo se actualizo satisfactoriamente', teamUpdated});
                                }else{
                                    return res.status(404).send({message:'No se pudo actualizar el equipo'});
                                }
                            });
                        }
                    }else{
                        return res.status(404).send({message:'No se encontro el equipo a actualizar'});
                    }
                });
                
            }else{
                return res.status(404).send({message:'No se encontro la liga deseada'});
            }
        });
    }
}


function deleteTeam(req, res){
    
    var userId = req.params.userId;
    var leagueId = req.params.leagueId;
    var teamId = req.params.teamId;
    var params = req.body;

    if(userId != req.user.sub){
        return res.status(400).send({message:'No posees permisos para hacer esta accion'});
    }else{
        if(params.password){
            User.findById(userId, (err, userFind) => {
                if(err){
                    return res.status(500).send({message:'Error al buscar equipo'});
                }else if(userFind){
                    League.findOne({_id: leagueId}, (err, leagueFind) => {
                        if(err){
                            return res.status(500).send({message:'Error al buscar la liga'});
                        }else if(leagueFind){
                            bcrypt.compare(params.password, userFind.password, (err, equalsPassword) => {
                                if(err){
                                    return res.status(500).send({message:'Error al comparar contraseñas'});
                                }else if(equalsPassword){
                                    League.findByIdAndUpdate({_id: leagueId, teams: teamId}, {$pull:{teams : teamId}}, {new: true}, (err, leagueUpdated)=>{
                                        if(err){
                                            return res.status(500).send({message:'Error general al actualizar la liga'});
                                        }else if(leagueUpdated){
                                            Team.findByIdAndRemove({_id: teamId}, (err, teamRemoved) => {
                                                if(err){
                                                    return res.status(500).send({message:'Error al eliminar el equipo'});
                                                }else if(teamRemoved){
                                                    return res.send({message: 'El equipo fue eliminado', teamRemoved});
                                                }else{
                                                    return res.status(404).send({message:'No se pudo eliminar el equipo ya fue eliminado'});
                                                }
                                            })
                                        }else{
                                            return res.status(404).send({message:'No se pudo eliminar el equipo de la liga'});
                                        }
                                    })
                                    
                                }else{
                                    return res.status(404).send({message:'No hay coincidencias en la password'});
                                }
                            })
                        }else{
                            return res.status(404).send({message:'Tu password es incorrecta'});
                        }
                    })
                }else{
                    return res.status(404).send({message:'No se encontro el equipo'});
                }
            })                        
        }else{
            return res.status(400).send({message:'No olvides colocar tu password de administrador'});
        }
    }
}

function listTeam(req, res){
    let idLeague = req.params.idLeague;

    Team.find({league: idLeague}).sort({"points": "desc"}).exec((err, teamsFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al obtener los equipos'});
        }else if(teamsFind){
            return res.send({message: 'Equipos encontrados', teamsFind});
        }else{
            return res.status(404).send({message:'No se encontraron equipos registrados'});
        }
    })
}

function getTeam(req, res){
    var params = req.body;

    if(params.search){
        Team.find({$or : [{nameTeam : params.search},
                          {coach : params.search},
                          {nameStadium : params.search},
                          {country : params.search},
                          {state : params.search}, 
                          {city : params.search},
                          {adress : params.search}]}, (err,  resultSerarch)=>{
            if(err){
                return res.status(500).send({message: 'Error general al obtener los equipos'});
            }else if(resultSerarch){
                return res.send({message: 'Equipos encontrados', resultSerarch})
            }else{
                return res.status(404).send({message:'No se encontraron coincidencias'});
            }
        });
    }else{
        return res.status(404).send({message:'No se encontraron equipos registrados'});
    }

}

function getTeamById(req, res){
    var teamId = req.params.teamId;

    if(teamId){
        Team.findById(teamId, (err,  resultSerarch)=>{
            if(err){
                return res.status(500).send({message: 'Error general al obtener el equipo'});
            }else if(resultSerarch){
                return res.send({message: 'Equipo encontrado', resultSerarch})
            }else{
                return res.status(404).send({message:'No se encontraron coincidencias'});
            }
        });
    }else{
        return res.status(404).send({message:'No se encontraro el equipo'});
    }

}

function uploadImage(req, res){
    var userId = req.params.userId;
    var leagueId = req.params.leagueId;
    var teamId = req.params.teamId;
    var fileName;

    if(userId != req.user.sub){
        res.status(401).send({message:'No tienes permisos'});
    }else{
        // Identifica si vienen archivos
        if(req.files.imageTeam){
            //ruta en la que llega la imagen
            var filePath = req.files.imageTeam.path;
            
            //fileSplit separa palabras, direcciones, etc
            // Separar en jerarquia la ruta de la imagen alt + 92 "\\   alt + 124 ||"
            var fileSplit = filePath.split('\\');
            //filePath: document/image/mi-imagen.jpg   0/1/2
            var fileName = fileSplit[2];

            var extension = fileName.split('\.');
            var fileExt = extension[1];
            if( fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif'){
                Team.findOneAndUpdate({_id: teamId, league:leagueId}, {imageTeam: fileName}, {new: true}, (err, teamUpdate) => {
                    if(err){
                        res.status(500).send({message:'Error general en imagen'});
                    }else if(teamUpdate){
                        res.send({team: teamUpdate, imageTeam: teamUpdate.imageTeam});
                    }else{
                        res.status(401).send({message:'No se ha podido actualizar'});
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
    var pathFile = './uploads/teams/' + fileName;

    fs.exists(pathFile, (exists) => {
        if(exists){
            res.sendFile(path.resolve(pathFile));
        }else{
            res.status(404).send({message:'Imagen inexistente'})
        }
    })
}

module.exports = {
    createTeam,
    updateTeam,
    deleteTeam,
    listTeam,
    getTeam,
    uploadImage,
    getImage,
    getTeamById
}