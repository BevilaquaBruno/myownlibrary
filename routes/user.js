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
    res.render('user/formregister', { message: '', btnValue: 'Cadastrar', newUser: true, user : { name: '', email: '', username: '', password: '', _id: '' } });
  }
);

router.post('/register',
  require('connect-ensure-login').ensureLoggedIn('/login'),
  function(req, res){
    if ( !validator.isEmail(req.body.email) ) {
      return res.render('user/formregister', { message: 'Email inválido.', btnValue: 'Cadastrar', newUser: true, user: req.body });
    }
    if (req.body.password == '') {
      return res.render('user/formregister', { message: 'Senha é obrigatório.', btnValue: 'Cadastrar', newUser: true, user: req.body });
    }
    if (req.body.username == '') {
      return res.render('user/formregister', { message: 'Usuário é obrigatório.', btnValue: 'Cadastrar', newUser: true, user: req.body });
    }
    if (req.body.password != req.body.confirmpassword) {
      return res.render('user/formregister', { message: 'As senhas não coincidem.', btnValue: 'Cadastrar', newUser: true, user: req.body });
    }
    if(req.body.name == ''){
      return res.render('user/formregister', { message: 'Nome é obrigatório.', btnValue: 'Cadastrar', newUser: true, user: req.body });
    }
    var newUser = new userModel({name: req.body.name, email: req.body.email, password: req.body.password, username: req.body.username});
    newUser.save().then(user => {
      req.flash('tip', 'Usuário cadastrado com sucesso.');
      res.redirect('/user');
    }).catch(err => {
      return res.render('user/formregister', { message: 'Erro ao cadastrar usuário', btnValue: 'Cadastrar', newUser: true, user: req.body });
    });
  }
 );

router.get('/update/:id',
  require('connect-ensure-login').ensureLoggedIn('/login'),
  function (req, res) {
    var id = req.params.id;
    userModel.findById(id, '-password -createdAt -updatedAt', null,
      function (err, user) {
        if (err) {
          req.flash('tip', 'Erro ao buscar usuário.');
          return res.redirect('/user');
        }
        res.render('user/formregister', { message: '', btnValue: 'Atualizar', newUser: false, user: (helper.tojson([user]))[0] });
      }
    );
  }
);

router.post('/update',
  require('connect-ensure-login').ensureLoggedIn('/login'),
  function (req, res) {
    if ( !validator.isEmail(req.body.email) ) {
      return res.render('user/formregister', { message: 'Email inválido.', btnValue: 'Atualizar', newUser: false, user: req.body });;
    }
    if (req.body.password == '') {
      return res.render('user/formregister', { message: 'Senha é obrigatório.', btnValue: 'Atualizar', newUser: false, user: req.body });
    }
    if (req.body.username == '') {
      return res.render('user/formregister', { message: 'Usuário é obrigatório.', btnValue: 'Atualizar', newUser: false, user: req.body });
    }
    if(req.body.name == ''){
      return res.render('user/formregister', { message: 'Nome é obrigatório.', btnValue: 'Atualizar', newUser: false, user: req.body });
    }
    userModel.findOneAndUpdate({ _id: req.body._id }, { $set: {
      name: req.body.name,
      email: req.body.email,
      username: req.body.username } }, (err, user) =>{
        if (err) {
          return res.render('user/formregister', { message: 'Erro ao atualizar usuário.', btnValue: 'Atualizar', newUser: false, user: req.body });
        }
        req.flash('tip', 'Usuário atualizado com sucesso !');
        res.redirect('/user');
    });
  }
);

module.exports = router;
