const express = require('express');
var router = express.Router();
var userModel = require('../schemas/user');
var passport = require('passport');
var validator = require('validator');

router.get('/',
  require('connect-ensure-login').ensureLoggedIn('/login'),
  function (req, res) {
    res.render('user/list', { message : req.flash('tip')});
  }
);

router.get('/register',
  require('connect-ensure-login').ensureLoggedIn('/login'),
  function(req, res){
    res.render('user/formregister', { message: '', newUser: true, user : { name: '', email: '', username: '', password: '', _id: '' } });
  }
);

router.post('/register',
  require('connect-ensure-login').ensureLoggedIn('/login'),
  function(req, res){
    if ( !validator.isEmail(req.body.email) ) {
      res.render('user/formregister', { message: 'Email inválido.', newUser: true, user: req.body });
    }
    if (req.body.password == '') {
      res.render('user/formregister', { message: 'Senha é obrigatório.', newUser: true, user: req.body });
    }
    if (req.body.username == '') {
      res.render('user/formregister', { message: 'Usuário é obrigatório.', newUser: true, user: req.body });
    }
    if (req.body.password != req.body.confirmpassword) {
      res.render('user/formregister', { message: 'As senhas não coincidem.', newUser: true, user: req.body });
    }
    if(req.body.name == '' || validator.isAlphanumeric(req.body.name)){
      res.render('user/formregister', { message: 'Nome é obrigatório.', newUser: true, user: req.body });
    }
    var newUser = new userModel({name: req.body.name, email: req.body.email, password: req.body.password, username: req.body.username});
    newUser.save().then(user => {
      req.flash('tip', 'Usuário cadastrado com sucesso.');
      res.redirect('/user');
    }).catch(err => {
      res.render('user/formregister', { message: 'Erro ao cadastrar usuário', newUser: true, user: req.body });
    });
  }
 );

module.exports = router;
