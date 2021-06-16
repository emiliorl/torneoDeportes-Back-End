'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var mdAuth = require('../middleware/authenticated');
var connectMultiparty = require('connect-multiparty');
var upload = connectMultiparty({ uploadDir: './uploads/users'});

var api = express.Router();

//FUNCIONES PARA CUALQUIER TIPO DE ROL
api.post('/signUp', userController.signUp);
api.post('/login', userController.login);
api.put('/updateUser/:id', [mdAuth.ensureAuth], userController.updateUser);
api.put('/removeUser/:id', mdAuth.ensureAuth, userController.removeUser);
api.put('/:id/uploadImage', [mdAuth.ensureAuth, upload], userController.uploadImage);
api.get('/getImage/:fileName', [upload], userController.getImage);
api.post('/createUserByAdmin/:id', [mdAuth.ensureAuth, mdAuth.validRolAdmin], userController.creatUser_ByAdmin),
api.get('/listUsers', [mdAuth.ensureAuth, mdAuth.validRolAdmin], userController.listUser),
api.post('/optionsOfAdmin', userController.validOptionsOfAdmin);
api.put('/editUserByAdmin/:id/:idA', [mdAuth.ensureAuth, mdAuth.validRolAdmin], userController.EditUser_ByAdmin);
api.put('/DeleteUserByAdmin/:id/:idA', [mdAuth.ensureAuth, mdAuth.validRolAdmin], userController.DeleteUser_ByAdmin);

module.exports = api;