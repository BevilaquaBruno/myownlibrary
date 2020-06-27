const express = require('express');
var router = express.Router();
var countryModel = require('../schemas/country');
var helper = require('../lib/helper');
var conn = require('connect-ensure-login');
var log = require('../log').log;

router.get('/todos',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    countryModel.find().then(function (countries) {
        res.json({ countries: countries });
    })
  }
);

router.get('/',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    countryModel.find().select('-createdAt -updatedAt').then(countries => {
      res.render('country/list', { success: true, message : req.flash('tip'), countries: helper.tojson(countries) });
    }).catch(err => {
      res.render('country/list', { success: false, message : 'Erro ao buscar autores', countries: [] });
    });
  }
);

router.get('/cadastrar',
  conn.ensureLoggedIn('/'),
  function (req, res) {
    res.render('country/formregister', { message: '', newCountry: true, country : { name: '', _id: '' } });
  }
);

router.post('/cadastrar',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    if (req.body.name == '') {
      return res.render('country/formregister', { message: 'Nome é obrigatório.', newCountry: true, country: req.body });
    }
    let newCountry = new countryModel({ name: req.body.name });
    newCountry.save().then(country => {
      log('CountryRegister|Country:'+country+'|U:'+req.user, 'success');
      req.flash('tip', 'País cadastrado com sucesso.');
      res.redirect('/pais');
    }).catch(err => {
      log('CountryRegister|err:'+err+'|U:'+req.user, 'error');
      return res.render('country/formregister', { message: 'Erro ao cadastrar País', newCountry: true, country: req.body });
    });
  }
);

router.get('/atualizar/:id',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    if (req.params.id != '') {
      countryModel.findById(req.params.id).select('-createdAt -updatedAt').then(country => {
          country = (helper.tojson([country]))[0];
          return res.render('country/formregister', { message: '', newCountry: false, country: country });
        }).catch(err => {
          req.flash('tip', 'Erro ao buscar país.');
          return res.redirect('/pais');
        });
    }else{
      req.flash('tip', 'Erro ao buscar país');
      res.redirect('/pais');
    }
  }
);

router.post('/atualizar',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    if (req.body.name == '') {
      return res.render('country/formregister', { message: 'Nome é obrigatório.', newCountry: false, country: req.body });
    }
    if (req.body._id == '') {
      req.flash('tip', 'Erro grave ao atualizar país, comece de novo.');
      res.redirect('/pais');
    }

    countryModel.findOneAndUpdate({ _id: req.body._id }, { name: req.body.name })
    .then( country => {
      req.flash('tip', 'País atualizado com sucesso !');
      log('CountryUpdate|Country:'+country+'|U:'+req.user, 'success');
      res.redirect('/pais');
    }).catch(err => {
      log('CountryUpdate|err:'+err+'|U:'+req.user, 'error');
      return res.render('country/formregister', { message: 'Erro ao atualizar país.', newCountry: false, country: req.body });
    });
  }
);

router.get('/excluir/:id',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    if (req.params.id != '') {
      countryModel.findByIdAndDelete(req.params.id)
        .then(country =>{
          log('CountryDelete|Country_id:'+req.params.id+'|U:'+req.user, 'success');
          req.flash('tip', 'Sucesso ao excluir pais.');
          res.redirect('/pais');
        }).catch(err => {
          log('CountryDelete|err:'+err+'|U:'+req.user, 'error');
          req.flash('tip', 'Erro ao excluir pais.');
          res.redirect('/pais');
        });
    }else{
      req.flash('tip', 'Erro ao excluir país.');
      res.redirect('/pais');
    }
  }
);

module.exports = router;
