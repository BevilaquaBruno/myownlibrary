const express = require('express');
var router = express.Router();
var languageModel = require('../schemas/language');
var helper = require('../lib/helper');
var conn = require('connect-ensure-login');
var log = require('../log').log;

router.get('/todos',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    languageModel.find().then(function (languages) {
        res.json({ languages: languages });
    })
  }
);

router.get('/',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    languageModel.find().populate('country_id').select('-createdAt -updatedAt').then(languages => {
      res.render('language/list', { success: true, message : req.flash('tip'), languages: helper.tojson(languages) });
    }).catch(err => {
      res.render('language/list', { success: false, message : 'Erro ao buscar idiomas', languages: [] });
    });
  }
);

router.get('/cadastrar',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    res.render('language/formregister', { message: '', newLanguage: true, language : { description: '', country_id: '', _id: '' } });
  }
);

router.post('/cadastrar',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    if (req.body.description == '') {
      return res.render('language/formregister', { message: 'Descrição é obrigatório.', newLanguage: true, language: req.body });
    }
    if (req.body.country_id == '') {
      return res.render('language/formregister', { message: 'País é obrigatório.', newLanguage: true, language: req.body });
    }

    let newLanguage = new languageModel({ description: req.body.description, country_id: req.body.country_id });
    newLanguage.save().then(language => {
      log('LanguageRegister|Language:'+language+'|U:'+req.user, 'success');
      req.flash('tip', 'Idioma cadastrado com sucesso.');
      res.redirect('/idioma');
    }).catch(err => {
      log('LanguageRegister|err:'+err+'|U:'+req.user, 'error');
      return res.render('language/formregister', { message: 'Erro ao cadastrar idioma.', newLanguage: true, language: req.body });
    });
  }
);

router.get('/atualizar/:id',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    if (req.params.id != '') {
      languageModel.findById(req.params.id).select('-createdAt -updatedAt').then(language => {
          language = (helper.tojson([language]))[0];
          return res.render('language/formregister', { message: '', newLanguage: false, language: language });
        }).catch(err => {
          req.flash('tip', 'Erro ao buscar idioma.');
          return res.redirect('/idioma');
        });
    }else{
      req.flash('tip', 'Erro ao buscar idioma');
      res.redirect('/idioma');
    }
  }
);

router.post('/atualizar',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    if (req.body.description == '') {
      return res.render('language/formregister', { message: 'Descrição é obrigatório.', newLanguage: false, language: req.body });
    }
    if (req.body.country_id == '') {
      return res.render('language/formregister', { message: 'País é obrigatório.', newLanguage: false, language: req.body });
    }

    languageModel.findOneAndUpdate({ _id: req.body._id }, { description: req.body.description, country_id: req.body.country_id })
    .then( language => {
      req.flash('tip', 'Idioma atualizado com sucesso !');
      log('LanguageUpdate|Language:'+language+'|U:'+req.user, 'success');
      res.redirect('/idioma');
    }).catch(err => {
      log('LanguageUpdate|err:'+err+'|U:'+req.user, 'error');
      return res.render('language/formregister', { message: 'Erro ao atualizar idioma.', newLanguage: false, language: req.body });
    });
  }
);

router.get('/excluir/:id',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    if (req.params.id != '') {
      languageModel.findByIdAndDelete(req.params.id)
        .then(language =>{
          log('LanguageDelete|Language_id:'+req.params.id+'|U:'+req.user, 'success');
          req.flash('tip', 'Sucesso ao excluir idioma.');
          res.redirect('/idioma');
        }).catch(err => {
          log('LanguageDelete|err:'+err+'|U:'+req.user, 'error');
          req.flash('tip', 'Erro ao excluir idioma.');
          res.redirect('/idioma');
        });
    }else{
      req.flash('tip', 'Erro ao excluir idioma.');
      res.redirect('/idioma');
    }
  }
);

module.exports = router;
