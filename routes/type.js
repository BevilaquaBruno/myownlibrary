const express = require('express');
var router = express.Router();
var typeModel = require('../schemas/type');
var helper = require('../lib/helper');
var conn = require('connect-ensure-login');
var log = require('../log').log;

router.get('/todos',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    typeModel.find().then(function (types) {
        res.json({ types: types });
    })
  }
);

router.get('/',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    typeModel.find().select('-createdAt -updatedAt').then(types => {
      res.render('type/list', { success: true, message : req.flash('tip'), types: helper.tojson(types) });
    }).catch(err => {
      res.render('type/list', { success: false, message : 'Erro ao buscar autores', types: [] });
    });
  }
);

router.get('/cadastrar',
  conn.ensureLoggedIn('/'),
  function (req, res) {
    res.render('type/formregister', { message: '', newType: true, type : { description: '', _id: '' } });
  }
);

router.post('/cadastrar',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    if (req.body.description == '') {
      return res.render('type/formregister', { message: 'Nome é obrigatório.', newType: true, type: req.body });
    }
    let newType = new typeModel({ description: req.body.description });
    newType.save().then(type => {
      log('TypeRegister|Type:'+type+'|U:'+req.user, 'success');
      req.flash('tip', 'tipo cadastrado com sucesso.');
      res.redirect('/tipo');
    }).catch(err => {
      log('TypeRegister|err:'+err+'|U:'+req.user, 'error');
      return res.render('type/formregister', { message: 'Erro ao cadastrar tipo', newType: true, type: req.body });
    });
  }
);

router.get('/atualizar/:id',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    if (req.params.id != '') {
      typeModel.findById(req.params.id).select('-createdAt -updatedAt').then(type => {
          type = (helper.tojson([type]))[0];
          return res.render('type/formregister', { message: '', newType: false, type: type });
        }).catch(err => {
          req.flash('tip', 'Erro ao buscar tipo.');
          return res.redirect('/tipo');
        });
    }else{
      req.flash('tip', 'Erro ao buscar tipo');
      res.redirect('/tipo');
    }
  }
);

router.post('/atualizar',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    if (req.body.description == '') {
      return res.render('type/formregister', { message: 'Nome é obrigatório.', newType: false, type: req.body });
    }
    if (req.body._id == '') {
      req.flash('tip', 'Erro grave ao atualizar tipo, comece de novo.');
      res.redirect('/tipo');
    }

    typeModel.findOneAndUpdate({ _id: req.body._id }, { description: req.body.description })
    .then( type => {
      req.flash('tip', 'tipo atualizado com sucesso !');
      log('TypeUpdate|Country:'+type+'|U:'+req.user, 'success');
      res.redirect('/tipo');
    }).catch(err => {
      log('TypeUpdate|err:'+err+'|U:'+req.user, 'error');
      return res.render('type/formregister', { message: 'Erro ao atualizar tipo.', newType: false, type: req.body });
    });
  }
);

router.get('/excluir/:id',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    if (req.params.id != '') {
      typeModel.findByIdAndDelete(req.params.id)
        .then(type =>{
          log('TypeDelete|Type_id:'+req.params.id+'|U:'+req.user, 'success');
          req.flash('tip', 'Sucesso ao excluir tipo.');
          res.redirect('/tipo');
        }).catch(err => {
          log('TypeDelete|err:'+err+'|U:'+req.user, 'error');
          req.flash('tip', 'Erro ao excluir tipo.');
          res.redirect('/tipo');
        });
    }else{
      req.flash('tip', 'Erro ao excluir tipo.');
      res.redirect('/tipo');
    }
  }
);

module.exports = router;
