const express = require('express');
var router = express.Router();
var userModel = require('../schemas/user');
var md5 = require('md5');
var validator = require('validator');

router.get('/login', function(req, res){
  res.render('user/formLogin', { message: ''});
});

router.post('/login', function (req, res) {
  if (req.body.username === undefined || req.body.password === undefined ||
    !validator.isAlphanumeric(req.body.username, 'pt-BR') || !validator.isAlphanumeric(req.body.password, 'pt-BR')) {
    res.render('user/formLogin', {message: 'Dados inválidos'});
  }else{
    req.body.password = md5(req.body.password);
    userModel.find({username: req.body.username, password: req.body.password},'-password -created',null , function (err, docs) {
      if (err != undefined && err.length > 0) {
        res.render('user/formLogin', {message: 'Erro ao entrar no sistema.'});
      }else if (docs === undefined || docs.length == 0) {
        res.render('user/formLogin', {message: 'Usuário ou senha incorretos.'});
      }else{
        res.render('user/formLogin', {message: 'Sucesso'});
      }
    });
    }
});

module.exports = router;
