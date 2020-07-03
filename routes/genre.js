const express = require('express');
var router = express.Router();
var genreModel = require('../schemas/genre');
var helper = require('../lib/helper');
var conn = require('connect-ensure-login');
var log = require('../log').log;

router.get('/todos',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    genreModel.find().then(function (genres) {
        res.json({ genres: genres });
    })
  }
);

router.get('/',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    genreModel.find().select('-createdAt -updatedAt').then(genres => {
      res.render('genre/list', { success: true, message : req.flash('tip'), genres: helper.tojson(genres) });
    }).catch(err => {
      res.render('genre/list', { success: false, message : 'Erro ao buscar autores', genres: [] });
    });
  }
);

router.get('/cadastrar',
  conn.ensureLoggedIn('/'),
  function (req, res) {
    res.render('genre/formregister', { message: '', newGenre: true, genre : { description: '', _id: '' } });
  }
);

router.post('/cadastrar',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    if (req.body.description == '') {
      return res.render('genre/formregister', { message: 'Descrição é obrigatória.', newGenre: true, genre: req.body });
    }
    let newGenre = new genreModel({ description: req.body.description });
    newGenre.save().then(genre => {
      log('GenreRegister|Genre:'+genre+'|U:'+req.user, 'success');
      req.flash('tip', 'genero cadastrado com sucesso.');
      res.redirect('/genero');
    }).catch(err => {
      log('GenreRegister|err:'+err+'|U:'+req.user, 'error');
      return res.render('genre/formregister', { message: 'Erro ao cadastrar gênero', newGenre: true, genre: req.body });
    });
  }
);

router.get('/atualizar/:id',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    if (req.params.id != '') {
      genreModel.findById(req.params.id).select('-createdAt -updatedAt').then(genre => {
          genre = (helper.tojson([genre]))[0];
          return res.render('genre/formregister', { message: '', newGenre: false, genre: genre });
        }).catch(err => {
          req.flash('tip', 'Erro ao buscar gênero.');
          return res.redirect('/genero');
        });
    }else{
      req.flash('tip', 'Erro ao buscar gênero');
      res.redirect('/genero');
    }
  }
);

router.post('/atualizar',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    if (req.body.description == '') {
      return res.render('genre/formregister', { message: 'Descrição é obrigatória.', newGenre: false, genre: req.body });
    }
    if (req.body._id == '') {
      req.flash('tip', 'Erro grave ao atualizar gênero, comece de novo.');
      res.redirect('/genero');
    }

    genreModel.findOneAndUpdate({ _id: req.body._id }, { description: req.body.description })
    .then( genre => {
      req.flash('tip', 'genero atualizado com sucesso !');
      log('GenreUpdate|Country:'+genre+'|U:'+req.user, 'success');
      res.redirect('/genero');
    }).catch(err => {
      log('GenreUpdate|err:'+err+'|U:'+req.user, 'error');
      return res.render('genre/formregister', { message: 'Erro ao atualizar gênero.', newGenre: false, genre: req.body });
    });
  }
);

router.get('/excluir/:id',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    if (req.params.id != '') {
      genreModel.findByIdAndDelete(req.params.id)
        .then(genre =>{
          log('GenreDelete|Genre_id:'+req.params.id+'|U:'+req.user, 'success');
          req.flash('tip', 'Sucesso ao excluir gênero.');
          res.redirect('/genero');
        }).catch(err => {
          log('GenreDelete|err:'+err+'|U:'+req.user, 'error');
          req.flash('tip', 'Erro ao excluir gênero.');
          res.redirect('/genero');
        });
    }else{
      req.flash('tip', 'Erro ao excluir gênero.');
      res.redirect('/genero');
    }
  }
);

module.exports = router;
