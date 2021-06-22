'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var mdAuth = require('../middleware/authenticated');
var connectMultiparty = require('connect-multiparty');
var upload = connectMultiparty({ uploadDir: './uploads/users'});

var api = express.Router();

//FUNCIONES PARA CUALQUIER TIPO DE ROL
api.post('/signUp', userController.signUp); //YA
api.post('/login', userController.login); //YA
api.put('/updateUser/:id', [mdAuth.ensureAuth], userController.updateUser);//YA
api.put('/removeUser/:id', mdAuth.ensureAuth, userController.removeUser); //YA
api.put('/:id/uploadImage', [mdAuth.ensureAuth, upload], userController.uploadImage); //YA
api.get('/getImage/:fileName', [upload], userController.getImage); //YA
api.post('/createUserByAdmin/:id', [mdAuth.ensureAuth, mdAuth.validRolAdmin], userController.creatUser_ByAdmin), //YA
api.get('/listUsers', [mdAuth.ensureAuth, mdAuth.validRolAdmin], userController.listUser), //YA
api.post('/optionsOfAdmin', userController.validOptionsOfAdmin); //YA
api.put('/editUserByAdmin/:id/:idA', [mdAuth.ensureAuth, mdAuth.validRolAdmin], userController.EditUser_ByAdmin);//YA
api.put('/DeleteUserByAdmin/:id/:idA', [mdAuth.ensureAuth, mdAuth.validRolAdmin], userController.DeleteUser_ByAdmin);//YA

module.exports = api;