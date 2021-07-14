'use strict'

var User = require('../models/user.model');
var League = require('../models/league.model');
var Match = require('../models/match.model');
var Team = require('../models/team.model');

function createMatch(req, res){
    var userId = req.params.idUser;
    var leagueId = req.params.idLeague;
    var match = [];
    var count = 1;

    if(userId != req.user.sub){
        return res.status(400).send({message:'No posees permisos para hacer esta accion'});
    }else{
        League.findOne({_id: leagueId, user:userId}).populate('teams').exec((err, leagueFind)=>{
            if(err){
                return res.status(500).send({message:'Error al buscar la liga'+err});
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
                var today = new Date(leagueFind.startingDate);
                var matchDate = new Date(today);
                for(var x = 0; x < match.length;x++){
                    var check = true;
                    let matchItem = new Match();
                    if(matchN.length == 0){
                        matchN.push([verify[x],x+1])
                        matchItem.teams = verify[x];
                        matchDate.setDate(today.getDate() + x)
                        console.log(matchDate.toLocaleDateString())
                        matchItem.date = matchDate.toLocaleDateString();
                        matchItem.league = leagueFind._id
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
                                matchDate.setDate(today.getDate() + x)
                                matchItem.date = matchDate.toLocaleDateString();;
                                matchItem.league = leagueFind._id;
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
                                matchDate.setDate(today.getDate() + x)
                                matchItem.date = matchDate.toLocaleDateString();
                                matchItem.league = leagueFind._id;
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

function listMatches(req, res){
    let idLeague = req.params.idLeague;

    Match.find({league: idLeague}).populate("teams").populate("location").populate("winner").populate("loser").sort({"date": "asc"}).exec((err, matchFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al obtener los partidos'});
        }else if(matchFind){
            return res.send({message: 'Partidos encontrados', matchFind});
        }else{
            return res.status(404).send({message:'No se encontraron partidos registrados'});
        }
    })
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
    
        function searchMatch(req, res){
            var params = req.body;
        
            if(params.search){
                Match.find({$or:[{location: params.search},
                                {date: params.search},
                                {teams: params.search}]}, (err, resultSearch)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general'});
                                    }else if(resultSearch){
                                        return res.send({message: 'Coincidencias encontradas: ', resultSearch});
                                    }else{
                                        return res.status(403).send({message: 'Búsqueda sin coincidencias'});
                                    }
                                })
            }else{
                return res.status(403).send({message: 'Ingrese datos en el campo de búsqueda'});
            }
        }
        
        function updateMatch(req, res) {
            var matchId = req.params.idMatch;
            var leagueId = req.params.idLeague;
            let update = req.body;
        

                if(update.date){
                    Match.findById(matchId, (err, matchFind)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al buscar los partidos'});
                        }else if(matchFind){
                            League.findOne({_id: leagueId}, (err, leagueFind)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general'});
                                }else if(leagueFind){
                                    var updateDate = new Date(update.date)
                                    updateDate.setDate(updateDate.getDate()+1)
                                    update.date = updateDate.toLocaleDateString()
                                    Match.findByIdAndUpdate(matchId, update, {new: true}, (err, matchUpdated)=>{
                                        if(err){
                                            return res.status(500).send({message: 'Error general en la actualización'+err});
                                        }else if(matchUpdated){
                                            return res.send({message: 'Match actualizado', matchUpdated});
                                        }else{
                                            return res.status(404).send({message: 'Match no actualizado'});
                                        }
                                    })
                                }else{
                                    return res.status(404).send({message: 'League no existente'})
                                }
                            })
                        }else{
                            return res.status(404).send({message: 'Match a actualizar inexistente'});
                        }
                    })
                }else{
                    return res.status(404).send({message: 'Por favor ingresa los datos mínimos para actualizar'});
             }
        }

        /* function results(req,res){
                let params = req.body;
                let idLeague = req.params.idLeague;
                let match = new Match();

                if ( params.teamId && params.goals && params.winner && params.loser) {
                    if(params.team == params.teamId) return res.status(500).send({ message:'No se pueden poner dos equipos iguales'})
                    if(params.points < 0 || params.points < 0) return res.status(500).send({ message:'No se pueden ingresar valores negativos en los goles'})
                    League.find({ _id: idLeague }).exec((err, leagueFound) => {
                        if (err) return res.status(500).send({ message: 'Error en la petición buscar liga' })
                        if (leagueFound.length <= 0) return res.status(404).send({ message: 'No se encontro la liga' })
                        if (leagueFound) {
                            Team.find({ _id: params.teamId }).exec((err, teamFound) => {
                                if (err) return res.status(500).send({ message: 'Error en la petición buscar Team' })
                                if (teamFound.length <= 0) return res.status(404).send({ message: 'No se encontro el Team'})
                                if (teamFound) {
                                    Team.find({ _id: params.team }).exec((err, teamFound) => {
                                        if (err) return res.status(500).send({ message: 'Error en la petición buscar Team B' })
                                        if (teamFound) {
                                            match.goals = params.goals;
                                            match.teamId = params.teamId;
                                            match.winner = params.winner;
                                            match.loser = params.loser;
                                            Match.findByIdAndUpdate((err, matchSaved) => {
                                                if (err) return res.status(500).send({ message: 'Error al guardar match' })
                                                if (matchSaved) {
                                                    if (params.teamA > params.teamB) {
                                                        Match.findByIdAndUpdate(params.teamId, { $inc: { teamA: 3, teamB: 0} }, (err, teamAUpdated) => {
                                                            if (err) return res.status(500).send({ message: 'error en la peticion actualizar team A' })
                                                            if (teamAUpdated) {
                                                                Team.findByIdAndUpdate(params.teamId, { $inc: { teamA: 3, teamB: 0} }, (err, team2Updated) => {
                                                                    if (err) return res.status(500).send({ message: 'error en la peticion actualizar' })
                                                                    if (!team2Updated) return res.status(500).send({ message: 'error guardar update' })
                                                                })
                                                            }
            
                                                        })
                                                    }
                                                    if (params.teamA < params.teamB) {
                                                        Match.findByIdAndUpdate(params.teamId, { $inc: { teamA: 0, teamB: 3} }, (err, teamBUpdated) => {
                                                            if (err) return res.status(500).send({ message: 'error en la peticion actualizar team B' })
                                                            if (teamBUpdated) {
                                                                Team.findByIdAndUpdate(params.teamId, { $inc: { teamA: 0, teamB: 3} }, (err, teamAUpdated) => {
                                                                    if (err) return res.status(500).send({ message: 'error en la peticion actualizar team A' })
                                                                    if (!teamAUpdated) return res.status(500).send({ message: 'error guardar update team A' })
                                                                })
                                                            }
            
                                                        })
                                                    }
                                                    if (params.teamA == params.teamB) {
                                                        Match.findByIdAndUpdate(params.teamId, { $inc: { teamA: 1, teamB: 1} }, (err, teamAUpdated) => {
                                                            if (err) return res.status(500).send({ message: 'error en la peticion actualizar' })
                                                            if (teamAUpdated) {
                                                                Team.findByIdAndUpdate(params.teamId, { $inc: { points: 1 } }, (err, teamBUpdated) => {
                                                                    if (err) return res.status(500).send({ message: 'error en la peticion actualizar'})
                                                                    if (!teamBUpdated) return res.status(500).send({ message: 'error al guardar el team B' })
            
                                                                })
            
                                                                
            
            
                                                            } else {
                                                                return res.status(500).send({ message: 'error en guardar' })
                                                            }
            
                                                        })
                                                    }
                                                    return res.status(200).send({matchSaved})
            
                                                } else {
                                                    return res.status(500).send({ message: 'No se guardo match' })
                                                }
                                            })
                                        } else {
                                            return res.status(500).send({ message: 'No se encontro TeamB' })
                                        }
                                    })
            
                                } else {
                                    return res.status(500).send({ message: 'No se encontro TeamA' })
                                }
                            })
                        } else {
                            return res.status(500).send({ message: 'No se encontro liga con ese id' })
                        }
            
                    })
            
            
                } else {
                    return res.status(500).send({ message: 'Ingrese todos los parametros que se solicitan' })
                }
            
        } */

    function results(req,res){
        let leagueId = req.params.idLeague;
        let userId = req.params.idUser;
        let matchId = req.params.idMatch;
        let update = req.body;

        if(userId != req.user.sub){
            return res.status(404).send({message:'No tienes permiso para actualizar el partido'});
        }else{
            if(update.team1 && update.team2){
                League.findOne({_id: leagueId, user: userId}, (err, leagueFind) => {
                    if(err){
                        return res.status(500).send({message:'Error general al buscar liga'});
                    }else if(leagueFind){
                        Match.findOne({_id: matchId, league: leagueId}, (err, matchFind) => {
                            if(err){
                                return res.status(500).send({message:'Error general al buscar la partida'});
                            }else if(matchFind && matchFind.goals.length != 0 ){
                                return res.status(404).send({message:'No se pudede actualizar la partida desde aqui'});
                            }else if(matchFind){
                                
                                Match.findByIdAndUpdate(matchId, {$push:{goals: [update.team1, update.team2]}}, {new: true}).exec((err, matchUpdate) => {
                                    if(err){
                                        return res.status(500).send({message:'Error genaral al actualizar el partido'});
                                    }else if(matchUpdate){
/*                                         return res.status(200).send({message:'Partido actualizado', matchUpdate});
*/                                       if(update.team1 > update.team2){
                                            Match.findByIdAndUpdate(matchId, {winner: matchFind.teams[0], loser:matchFind.teams[1]},{new: true}, (err, matchUpdateWinner) => {
                                                if(err){
                                                    return res.status(500).send({message:'Error genaral al actualizar el ganador del partido'});
                                                }else if(matchUpdateWinner){
                                                    /* return res.status(200).send({message:'Ganador actualizado', matchUpdateWinner}); */
                                                }else{
                                                    return res.status(404).send({message:'No se pudo actualizar al ganador'});
                                                }
                                            })
                                            Team.findByIdAndUpdate(matchFind.teams[0], {$inc:{points: 3}}).exec((err, teamUpdate) => {
                                                if(err){
                                                    return res.status(500).send({message:'Error genaral al actualizar el equipo'});
                                                }else if(teamUpdate){
/*                                                     return res.status(200).send({message:'Equipo actualizado', teamUpdate});
 */                                                }else{
                                                    return res.status(404).send({message:'No se pudo actualizar el equipo'});
                                                }
                                            })
                                            Match.findById(matchId).exec((err,FinalMatch)=>{
                                                return res.status(200).send({message:'Partido actualizado', FinalMatch});
                                            })
                                        }else if(update.team1 < update.team2){
                                            Match.findByIdAndUpdate(matchId, {winner: matchFind.teams[1], loser:matchFind.teams[0]},{new: true}, (err, matchUpdateWinner) => {
                                                if(err){
                                                    return res.status(500).send({message:'Error genaral al actualizar el ganador del partido'});
                                                }else if(matchUpdateWinner){
                                                    /* return res.status(200).send({message:'Ganador actualizado', matchUpdateWinner}); */
                                                }else{
                                                    return res.status(404).send({message:'No se pudo actualizar al ganador'});
                                                }
                                            })
                                            Team.findByIdAndUpdate(matchFind.teams[1], {$inc:{points: 3}}).exec((err, teamUpdate) => {
                                                if(err){
                                                    return res.status(500).send({message:'Error genaral al actualizar el equipo'});
                                                }else if(teamUpdate){
/*                                                     return res.status(200).send({message:'Equipo actualizado', teamUpdate});
 */                                                }else{
                                                    return res.status(404).send({message:'No se pudo actualizar el equipo'});
                                                }
                                            })
                                            Match.findById(matchId).exec((err,FinalMatch)=>{
                                                return res.status(200).send({message:'Partido actualizado', FinalMatch});
                                            })
                                        }else if(update.team1 == update.team2){
                                            Match.findByIdAndUpdate(matchId, {winner: null, loser:null},{new: true}, (err, matchUpdateWinner) => {
                                                if(err){
                                                    return res.status(500).send({message:'Error genaral al actualizar el ganador del partido'});
                                                }else if(matchUpdateWinner){
                                                    /* return res.status(200).send({message:'Ganador actualizado', matchUpdateWinner}); */
                                                }else{
                                                    return res.status(404).send({message:'No se pudo actualizar al ganador'});
                                                }
                                            })
                                            Team.findByIdAndUpdate(matchFind.teams[0], {$inc:{points: 1}}).exec((err, teamUpdate) => {
                                                if(err){
                                                    return res.status(500).send({message:'Error genaral al actualizar el equipo'});
                                                }else if(teamUpdate){
                                                    /* return res.status(200).send({message:'Equipo actualizado', teamUpdate}); */
                                                }else{
                                                    return res.status(404).send({message:'No se pudo actualizar el equipo'});
                                                }
                                            })
                                            Team.findByIdAndUpdate(matchFind.teams[1], {$inc:{points: 1}}).exec((err, teamUpdate) => {
                                                if(err){
                                                    return res.status(500).send({message:'Error genaral al actualizar el equipo'});
                                                }else if(teamUpdate){
/*                                                     return res.status(200).send({message:'Equipos actualizados', teamUpdate});
 */                                                }else{
                                                    return res.status(404).send({message:'No se pudo actualizar el equipo'});
                                                }
                                            })
                                            Match.findById(matchId).exec((err,FinalMatch)=>{
                                                return res.status(200).send({message:'Partido actualizado', FinalMatch});
                                            })
                                        }   
                                    }else{
                                        return res.status(404).send({message:'No se pudo actualizar el partido'});
                                    }
                                })
                            }else{
                                return res.status(404).send({message:'No se encontro la partida'});
                            }
                        })
                    }else{
                        return res.status(404).send({message:'No se encontro la liga'});
                    }
                })
            }else{
                return res.status(404).send({message:'Faltan parametros'});
            }
        }
    }

    


module.exports = {
    createMatch,
    listMatches,
    updateMatch,
    searchMatch,
    results
}



/*if(teamA > teamB){
                teamA = 3
                teamB = 0
            }else if(teamB > teamA){
                teamB = 3
                teamA = 0
            }else if(teamA = teamB){
                teamA = 1
                teamB = 1
            }else{
                teamA = 0
                teamB = 0
        }*/