'use strict'

var User = require('../models/user.model');
var League = require('../models/league.model');
var Match = require('../models/match.model');

function createMatch(req, res){
    var userId = req.params.idUser;
    var leagueId = req.params.idLeague;
    var match = [];
    var count = 1

    if(userId != req.user.sub){
        return res.status(400).send({message:'No posees permisos para hacer esta accion'});
    }else{
        League.findOne({_id: leagueId, user:userId}).populate('teams').exec((err, leagueFind)=>{
            if(err){
                return res.status(500).send({message:'Error al buscar la liga'});
            }else if(leagueFind){
                var num = leagueFind.teams.map(team => {return team._id});
                for(var i = 0;i< num.length;i++){
                    for(var j = i+1;j< num.length;j++){
                        if(match.includes([num[i],num[j]]) || match.includes([num[i],num[j]]) || i == j){
                        }else{
                            match.push([num[i],num[j]])
                        }
                    }
                };
                var matchN = [];
                var verify = [...match];
                var count = 0;
                for(var x = 0; x < match.length;x++){
                    var check = true;
                    let matchItem = new Match();
                    if(matchN.length == 0){
                        matchN.push([verify[x],x+1])
                        matchItem.teams = verify[x];
                        matchItem.date = leagueFind.startingDate;
                        matchItem.location = verify[x][0]
                        matchItem.save((err, matchSaved) => {
                            if(err){
                                return res.status(400).send({message:'Error general al intentar crear el partido'});
                            }else if(matchSaved){
                                League.findByIdAndUpdate(leagueId, {$push:{matches: matchSaved._id}}, {new: true}, (err, matchPush)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general al agergar la partida'})
                                    }else if(matchPush){
                                    }else{
                                        return res.status(500).send({message: 'Error al agregar la partida'})
                                    }
                                })
                            }else{
                                return res.status(400).send({message:'No sea ha podido crear el partido'});
                            }
                        })
                        verify.splice(x,1)
                    
                    }else{
                        var full = 0;
                        while(check){
                            if(count == verify.length){
                                count = 0;
                                full+= 1;
                            }else if(full > 1){
                                matchN.push([verify[count],x+1])
                                matchItem.teams = verify[count];
                                matchItem.date = leagueFind.startingDate;
                                matchItem.location = verify[count][0]
                                matchItem.save((err, matchSaved) => {
                                    if(err){
                                        return res.status(400).send({message:'Error general al intentar crear el partido'});
                                    }else if(matchSaved){
                                        League.findByIdAndUpdate(leagueId, {$push:{matches: matchSaved._id}}, {new: true}, (err, matchPush)=>{
                                            if(err){
                                                return res.status(500).send({message: 'Error general al agergar la partida'})
                                            }else if(matchPush){
                                            }else{
                                                return res.status(500).send({message: 'Error al agregar la partida'})
                                            }
                                        })
                                    }else{
                                        return res.status(400).send({message:'No sea ha podido crear el partido'});
                                    }
                                })
                                verify.splice(count,1)
                                check = false;
                            }else if(matchN[x-1][0].includes(verify[count][0]) || matchN[x-1][0].includes(verify[count][1])){
                                count+= 1;
                            }/* else if(matchN.length > 1 && num.length > 6){
                                if(matchN[x-1][0].includes(verify[count][0]) || matchN[x-1][0].includes(verify[count][1]) || matchN[x-2][0].includes(verify[count][0]) || matchN[x-2][0].includes(verify[count][1])){
                                    count+=1
                                }else{
                                    matchN.push([verify[count],x+1])
                                    verify.splice(count,1)
                                    check = false;
                                }
                            }else if(matchN.length > 2 && num.length > 8){
                                if(matchN[x-1][0].includes(verify[count][0]) || matchN[x-1][0].includes(verify[count][1]) || matchN[x-2][0].includes(verify[count][0]) || matchN[x-2][0].includes(verify[count][1]) || matchN[x-3][0].includes(verify[count][0]) || matchN[x-3][0].includes(verify[count][1])){
                                    count+=1
                                }else{
                                    matchN.push([verify[count],x+1])
                                    verify.splice(count,1)
                                    check = false;
                                }
                            } */ else{
                                matchN.push([verify[count],x+1])
                                matchItem.teams = verify[count];
                                matchItem.date = leagueFind.startingDate;
                                matchItem.location = verify[count][0]
                                matchItem.save((err, matchSaved) => {
                                    if(err){
                                        return res.status(400).send({message:'Error general al intentar crear el partido'});
                                    }else if(matchSaved){
                                        League.findByIdAndUpdate(leagueId, {$push:{matches: matchSaved._id}}, {new: true}, (err, matchPush)=>{
                                            if(err){
                                                return res.status(500).send({message: 'Error general al agergar la partida'})
                                            }else if(matchPush){
                                            }else{
                                                return res.status(500).send({message: 'Error al agregar la partida'})
                                            }
                                        })
                                    }else{
                                        return res.status(400).send({message:'No sea ha podido crear el partido'});
                                    }
                                })
                                verify.splice(count,1)
                                check = false;
                            }
                        }
                    }
                }
                return res.send({message: leagueFind})
            }else{
                return res.status(404).send({message:'No se encontro la liga'});
            }
        })
    }
}

/* var num = [1,2,3,4,5,6,7,8];
        var match = [];
        var count = 1
        for(var i = 0;i< num.length;i++){
            for(var j = i+1;j< num.length;j++){
                if(match.includes([num[i],num[j]]) || match.includes([num[i],num[j]]) || i == j){
                    
                }else{
                    match.push([num[i],num[j]])
                }
            }
        };
        var matchN = [];
        var verify = [...match];
        var count = 0;
        for(var x = 0; x < match.length;x++){
            var check = true;
            if(matchN.length == 0){
                matchN.push([verify[x],x+1])
                verify.splice(x,1)
            }else if(num.length == 3){
                matchN.push([verify[x-1],x+1])
            }else if(num.length == 4){
                if(x < 3){
                    count+=2;
                    matchN.push([verify[x-1],count+1])
                }else if(count == 4){
                    count = 5;
                    matchN.push([verify[x-1],count+1])
                }else{
                    count-=2;
                    matchN.push([verify[x-1],count+1])
                }

                console.log(count)
                
            }else{
                var full = 0;
                while(check){
                    if(count == verify.length){
                        count = 0;
                        full+= 1;
                    }else if(full > 1){
                        matchN.push([verify[count],x+1])
                        verify.splice(count,1)
                        check = false;
                    }else if(matchN[x-1][0].includes(verify[count][0]) || matchN[x-1][0].includes(verify[count][1])){
                        count+= 1;
                    }else if(matchN.length > 1 && num.length > 6){
                        if(matchN[x-1][0].includes(verify[count][0]) || matchN[x-1][0].includes(verify[count][1]) || matchN[x-2][0].includes(verify[count][0]) || matchN[x-2][0].includes(verify[count][1])){
                            count+=1
                        }else{
                            matchN.push([verify[count],x+1])
                            verify.splice(count,1)
                            check = false;
                        }
                    }else if(matchN.length > 2 && num.length > 8){
                        if(matchN[x-1][0].includes(verify[count][0]) || matchN[x-1][0].includes(verify[count][1]) || matchN[x-2][0].includes(verify[count][0]) || matchN[x-2][0].includes(verify[count][1]) || matchN[x-3][0].includes(verify[count][0]) || matchN[x-3][0].includes(verify[count][1])){
                            count+=1
                        }else{
                            matchN.push([verify[count],x+1])
                            verify.splice(count,1)
                            check = false;
                        }
                    } else{
                        matchN.push([verify[count],x+1])
                        verify.splice(count,1)
                        check = false;
                    }
                }
            }
        }
        console.log(matchN); */

//GOOD FUNCTION

        /* var num = [1,2,3,4,5,6,7,8,9,10];
        var match = [];
        var count = 1
        for(var i = 0;i< num.length;i++){
            for(var j = i+1;j< num.length;j++){
                if(match.includes([num[i],num[j]]) || match.includes([num[i],num[j]]) || i == j){
                    
                }else{
                    match.push([num[i],num[j]])
                }
            }
        };
        var matchN = [];
        var verify = [...match];
        var count = 0;
        for(var x = 0; x < match.length;x++){
            var check = true;
            if(matchN.length == 0){
                matchN.push([verify[x],x+1])
                verify.splice(x,1)
            
            }else{
                var full = 0;
                while(check){
                    if(count == verify.length){
                        count = 0;
                        full+= 1;
                    }else if(full > 1){
                        matchN.push([verify[count],x+1])
                        verify.splice(count,1)
                        check = false;
                    }else if(matchN[x-1][0].includes(verify[count][0]) || matchN[x-1][0].includes(verify[count][1])){
                        count+= 1;
                    } *//* else if(matchN.length > 1 && num.length > 6){
                        if(matchN[x-1][0].includes(verify[count][0]) || matchN[x-1][0].includes(verify[count][1]) || matchN[x-2][0].includes(verify[count][0]) || matchN[x-2][0].includes(verify[count][1])){
                            count+=1
                        }else{
                            matchN.push([verify[count],x+1])
                            verify.splice(count,1)
                            check = false;
                        }
                    }else if(matchN.length > 2 && num.length > 8){
                        if(matchN[x-1][0].includes(verify[count][0]) || matchN[x-1][0].includes(verify[count][1]) || matchN[x-2][0].includes(verify[count][0]) || matchN[x-2][0].includes(verify[count][1]) || matchN[x-3][0].includes(verify[count][0]) || matchN[x-3][0].includes(verify[count][1])){
                            count+=1
                        }else{
                            matchN.push([verify[count],x+1])
                            verify.splice(count,1)
                            check = false;
                        }
                    } *//* else{
                        matchN.push([verify[count],x+1])
                        verify.splice(count,1)
                        check = false;
                    }
                }
            }
        }
        console.log(matchN); */

module.exports = {
    createMatch
}