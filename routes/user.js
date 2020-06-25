const express = require('express');
var router = express.Router();
var userModel = require('../schemas/user');
var validator = require('validator');
var helper = require('../lib/helper');
var conn = require('connect-ensure-login');
var log = require('../log').log;

function createAndReturnUser(data, id='') {
  return({
    name: data.name,
    email: data.email,
    password: data.password,
    username: data.username,
    _id: id
  });
}

router.get('/',
  conn.ensureLoggedIn('/login'),
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

router.get('/cadastrar',
  conn.ensureLoggedIn('/login'),
  function(req, res){
    res.render('user/formregister', { message: '', newUser: true, user : { name: '', email: '', username: '', password: '', _id: '' } });
  }
);

router.post('/cadastrar',
  conn.ensureLoggedIn('/login'),
  function(req, res){
    let currentUser = createAndReturnUser(req.body);

    if(currentUser.name == '')
      return res.render('user/formregister', { message: 'Nome é obrigatório.', newUser: true, user: currentUser });

    if (!validator.isEmail(currentUser.email))
      return res.render('user/formregister', { message: 'Email inválido.', newUser: true, user: currentUser });

    if (currentUser.username == '')
      return res.render('user/formregister', { message: 'Usuário é obrigatório.', newUser: true, user: currentUser });

    if (currentUser.password == '')
      return res.render('user/formregister', { message: 'Senha é obrigatório.', newUser: true, user: currentUser });

    if (currentUser.password != req.body.confirmpassword)
      return res.render('user/formregister', { message: 'As senhas não coincidem.', newUser: true, user: currentUser });

    let nu = currentUser;
    delete nu._id;
    let newUser = new userModel(nu);
    newUser.save().then(user => {
      log('UserRegister|user:'+user+'|U:'+req.user, 'success');
      req.flash('tip', 'Usuário cadastrado com sucesso.');
      res.redirect('/usuario');
    }).catch(err => {
      log('UserRegister|err:'+err+'|U:'+req.user, 'error');
      return res.render('user/formregister', { message: 'Erro ao cadastrar usuário', newUser: true, user: currentUser });
    });
  }
 );

router.get('/atualizar/:id',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    var id = req.params.id;
    userModel.findById(id, '-password -createdAt -updatedAt', null,
      function (err, user) {
        if (err) {
          req.flash('tip', 'Erro ao buscar usuário.');
          return res.redirect('/usuario');
        }
        res.render('user/formregister', { message: '', newUser: false, user: (helper.tojson([user]))[0] });
      }
    );
  }
);

router.post('/atualizar',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    let currentUser = createAndReturnUser(req.body, req.body._id);

    if(currentUser.name == '')
      return res.render('user/formregister', { message: 'Nome é obrigatório.', newUser: false, user: currentUser });

    if ( !validator.isEmail(currentUser.email) )
      return res.render('user/formregister', { message: 'Email inválido.', newUser: false, user: currentUser });;

    if (currentUser.username == '')
      return res.render('user/formregister', { message: 'Usuário é obrigatório.', newUser: false, user: currentUser });

    userModel.findOneAndUpdate({ _id: currentUser._id }, { $set: {
      name: currentUser.name,
      email: currentUser.email,
      username: currentUser.username } }, (err, user) =>{
        if (err){
          log('UserUpdate|err:'+err+'|U:'+req.user, 'error');
          return res.render('user/formregister', { message: 'Erro ao atualizar usuário.', newUser: false, user: currentUser });
        }
        log('UserUpdate|user:'+user+'|U:'+req.user, 'success');
        req.flash('tip', 'Usuário atualizado com sucesso !');
        res.redirect('/usuario');
    });
  }
);

router.get('/excluir/:id',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    if (req.params.id != '') {
      userModel.findByIdAndDelete(req.params.id, null, function (err, doc) {
        if (err){
          log('UserDelete|err:'+err+'|U:'+req.user, 'error');
          req.flash('tip', 'Erro ao excluir usuário.');
        }else{
          log('UserDelete|User_id:'+req.params.id+'|U:'+req.user, 'success');
          req.flash('tip', 'Sucesso ao excluir usuário.');
        }

        res.redirect('/usuario');
      });
    }else{
      req.flash('tip', 'Erro ao excluir usuário');
      res.redirect('/usuario');
    }
  }
);

module.exports = router;
