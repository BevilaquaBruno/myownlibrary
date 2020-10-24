const express = require('express');
var router = express.Router();
var publisherModel = require('../schemas/publisher');
var helper = require('../lib/helper');
var conn = require('connect-ensure-login');
var log = require('../log').log;

router.get('/todos',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    publisherModel.find().populate('country_id').then(function (publishers) {
        res.json({ data: publishers });
    })
  }
);

router.get('/',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    res.render('publisher/list', { success: true, message : req.flash('tip')});
  }
);

router.get('/cadastrar',
  conn.ensureLoggedIn('/'),
  function (req, res) {
    res.render('publisher/formregister', { message: '', newPublisher: true, publisher : { name: '', country_id: '', _id: '' } });
  }
);

router.post('/cadastrar',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    if (req.body.name === '') {
      return res.render('publisher/formregister', { message: 'Nome é obrigatório.', newPublisher: true, publisher: req.body });
    }
    if (req.body.country_id == '') {
      return res.render('publisher/formregister', { message: 'País é obrigatório.', newPublisher: true, publisher: req.body });
    }
    let newPublisher = new publisherModel({ name: req.body.name, country_id: req.body.country_id });
    newPublisher.save().then(publisher => {
      log('PublisherRegister|Publisher:'+publisher+'|U:'+req.user, 'success');
      req.flash('tip', 'Editora cadastrada com sucesso.');
      res.redirect('/editora');
    }).catch(err => {
      log('PublisherRegister|err:'+err+'|U:'+req.user, 'error');
      return res.render('publisher/formregister', { message: 'Erro ao cadastrar editora', newPublisher: true, publisher: req.body });
    });
  }
);

router.get('/atualizar/:id',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    if (req.params.id != '') {
      publisherModel.findById(req.params.id).select('-createdAt -updatedAt').then(publisher => {
          publisher = (helper.tojson([publisher]))[0];
          return res.render('publisher/formregister', { message: '', newPublisher: false, publisher: publisher });
        }).catch(err => {
          req.flash('tip', 'Erro ao buscar editora.');
          return res.redirect('/editora');
        });
    }else{
      req.flash('tip', 'Erro ao buscar editora');
      res.redirect('/editora');
    }
  }
);

router.post('/atualizar',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    if (req.body._id == '') {
      req.flash('tip', 'Erro grave ao atualizar editora, comece de novo.');
      res.redirect('/editora');
    }
    if (req.body.name == '') {
      return res.render('publisher/formregister', { message: 'Nome é obrigatório.', newPublisher: false, publisher: req.body });
    }
    if (req.body.country_id == '') {
      return res.render('publisher/formregister', { message: 'País é obrigatório.', newPublisher: true, publisher: req.body });
    }
    publisherModel.findOneAndUpdate({ _id: req.body._id }, { name: req.body.name, country_id: req.body.country_id })
    .then( publisher => {
      req.flash('tip', 'Editora atualizada com sucesso !');
      log('PublisherUpdate|Publisher:'+publisher+'|U:'+req.user, 'success');
      res.redirect('/editora');
    }).catch(err => {
      log('PublisherUpdate|err:'+err+'|U:'+req.user, 'error');
      return res.render('publisher/formregister', { message: 'Erro ao atualizar editora.', newPublisher: false, publisher: req.body });
    });
  }
);

router.get('/excluir/:id',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    if (req.params.id != '') {
      publisherModel.findByIdAndDelete(req.params.id)
        .then(publisher =>{
          log('PublisherDelete|Publisher_id:'+req.params.id+'|U:'+req.user, 'success');
          req.flash('tip', 'Sucesso ao excluir editora.');
          res.redirect('/editora');
        }).catch(err => {
          log('PublisherDelete|err:'+err+'|U:'+req.user, 'error');
          req.flash('tip', 'Erro ao excluir editora.');
          res.redirect('/editora');
        });
    }else{
      req.flash('tip', 'Erro ao excluir editora.');
      res.redirect('/editora');
    }
  }
);

module.exports = router;
