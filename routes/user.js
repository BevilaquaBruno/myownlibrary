const express = require('express');
var router = express.Router();
var userModel = require('../schemas/user');
var passport = require('passport');
var validator = require('validator');
var helper = require('../lib/helper');

router.get('/',
  require('connect-ensure-login').ensureLoggedIn('/login'),
  function (req, res) {
    userModel.find({}, '-password -createdAt -updatedAt', null,
      function (err, users) {
        if (err) {
          res.render('user/list', { success: false, message : 'Erro ao pegar usuários', users: [] });
        }else{
          res.render('user/list', { success: true, message : req.flash('tip'), users: helper.tojson(users) });
        }
      }
    )
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
      return;
    }
    if (req.body.password == '') {
      res.render('user/formregister', { message: 'Senha é obrigatório.', newUser: true, user: req.body });
      return;
    }
    if (req.body.username == '') {
      res.render('user/formregister', { message: 'Usuário é obrigatório.', newUser: true, user: req.body });
      return;
    }
    if (req.body.password != req.body.confirmpassword) {
      res.render('user/formregister', { message: 'As senhas não coincidem.', newUser: true, user: req.body });
      return;
    }
    if(req.body.name == '' || !validator.isAlphanumeric(req.body.name)){
      res.render('user/formregister', { message: 'Nome é obrigatório.', newUser: true, user: req.body });
      return;
    }
    var newUser = new userModel({name: req.body.name, email: req.body.email, password: req.body.password, username: req.body.username});
    newUser.save().then(user => {
      req.flash('tip', 'Usuário cadastrado com sucesso.');
      res.redirect('/user');
    }).catch(err => {
      res.render('user/formregister', { message: 'Erro ao cadastrar usuário', newUser: true, user: req.body });
      return;
    });
  }
 );

module.exports = router;
