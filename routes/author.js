const express = require('express');
var router = express.Router();
var authorModel = require('../schemas/author');
var helper = require('../lib/helper');
var conn = require('connect-ensure-login');
var validator = require('validator');
var moment = require('moment');
moment.locale('pt-br');

function createAndReturnAuthor(data, id='') {
  return({
    public_name: data.public_name,
    entire_name: data.entire_name,
    born_date: data.born_date,
    death_date: data.death_date,
    born_state: data.born_state,
    born_city: data.born_city,
    language_id: data.language_id,
    country_id: data.country_id,
    _id: id });
}

router.get('/',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    authorModel.find().populate('language_id').populate('country_id').select('-createdAt -updatedAt')
      .exec(function (err, authors) {
        if (err) {
          res.render('author/list', { success: false, message : 'Erro ao pegar autores', authors: [] });
        }else{
          res.render('author/list', { success: true, message : req.flash('tip'), authors: helper.tojson(authors) });
        }
      }
    )
  }
);

router.get('/cadastrar',
  conn.ensureLoggedIn('/login'),
  function(req, res){
    res.render('author/formregister', { message: '', newAuthor: true, author : { public_name: '',
    entire_name: '', born_date: '', death_date: '', born_state: '', born_city: '',  language_id: '', country_id: '',  _id: '' } });
  }
);

router.post('/cadastrar',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    let currentAuthor = createAndReturnAuthor(req.body);
    if (currentAuthor.public_name == '')
      return res.render('author/formregister', { message: 'Nome público inválido (Se você não sabe o nome, procure em um livro do autor).', newAuthor: true, author: currentAuthor });

    if(currentAuthor.born_date == '')
      return res.render('author/formregister', { message: 'Data de nascimento inválida.', newAuthor: true, author: currentAuthor });
    if (!validator.isDate(currentAuthor.born_date, 'YYYY-MM-DD'))
      return res.render('author/formregister', { message: 'Data de nascimento inválida.', newAuthor: true, author: currentAuthor });
    if (validator.isAfter(currentAuthor.born_date, moment().format('YYYY-MM-DD')))
      return res.render('author/formregister', { message: 'Data de nascimento maior que hoje.', newAuthor: true, author: currentAuthor });

    if (currentAuthor.death_date != ''){
      if (!validator.isDate(currentAuthor.death_date, 'YYYY-MM-DD'))
        return res.render('author/formregister', { message: 'Data de falecimento inválida.', newAuthor: true, author: currentAuthor });
      if (validator.isAfter(currentAuthor.death_date, moment().format('YYYY-MM-DD')))
        return res.render('author/formregister', { message: 'Data de falecimento maior que hoje.', newAuthor: true, author: currentAuthor });
    }

    if (currentAuthor.born_date != '' && currentAuthor.death_date != '') {
      if (validator.isAfter(currentAuthor.born_date, currentAuthor.death_date))
        return res.render('author/formregister', { message: 'Data de falecimento maior que a data de nascimento.', newAuthor: true, author: currentAuthor });
    }

    if (currentAuthor.language_id == '')
      return res.render('author/formregister', { message: 'Idioma do autor é obrigatório.', newAuthor: true, author: currentAuthor });

    if (currentAuthor.country_id == '')
      return res.render('author/formregister', { message: 'País do autor é obrigatório.', newAuthor: true, author: currentAuthor });

    let na = currentAuthor;
    delete na._id;
    let newAuthor = new authorModel(na);
    newAuthor.save().then(author => {
      req.flash('tip', 'Autor cadastrado com sucesso.');
      res.redirect('/autor');
    }).catch(err => {
      console.log(err);
      return res.render('author/formregister', { message: 'Erro ao cadastrar autor', newAuthor: true, author: currentAuthor });
    });
  }
);

router.get('/atualizar/:id',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    var id = req.params.id;
    authorModel.findById(id, '-createdAt -updatedAt', null,
      function (err, author) {
        if (err) {
          req.flash('tip', 'Erro ao buscar autor.');
          return res.redirect('/autor');
        }
        author = (helper.tojson([author]))[0];
        return res.render('author/formregister', { message: '', newAuthor: false, author: author });
      }
    );
  }
);

router.post('/atualizar',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    let currentAuthor = createAndReturnAuthor(req.body, req.body._id);
    if (currentAuthor.public_name == '')
      return res.render('author/formregister', { message: 'Nome público inválido (Se você não sabe o nome, procure em um livro do autor).', newAuthor: true, author: currentAuthor });

    if (currentAuthor.born_date != ''){
      if (!validator.isDate(currentAuthor.born_date, 'YYYY-MM-DD'))
        return res.render('author/formregister', { message: 'Data de nascimento inválida.', newAuthor: true, author: currentAuthor });
      if (validator.isAfter(currentAuthor.born_date, moment().format('YYYY-MM-DD')))
        return res.render('author/formregister', { message: 'Data de nascimento maior que hoje.', newAuthor: true, author: currentAuthor });
    }

    if (currentAuthor.death_date != ''){
      if (!validator.isDate(currentAuthor.death_date, 'YYYY-MM-DD'))
        return res.render('author/formregister', { message: 'Data de falecimento inválida.', newAuthor: true, author: currentAuthor });
      if (validator.isAfter(currentAuthor.death_date, moment().format('YYYY-MM-DD')))
        return res.render('author/formregister', { message: 'Data de falecimento maior que hoje.', newAuthor: true, author: currentAuthor });
    }

    if (currentAuthor.born_date != '' && currentAuthor.death_date != '') {
      if (validator.isAfter(currentAuthor.born_date, currentAuthor.death_date))
        return res.render('author/formregister', { message: 'Data de falecimento maior que a data de nascimento.', newAuthor: true, author: currentAuthor });
    }

    if (currentAuthor.language_id == '')
      return res.render('author/formregister', { message: 'Idioma do autor é obrigatório.', newAuthor: true, author: currentAuthor });

    if (currentAuthor.country_id == '')
      return res.render('author/formregister', { message: 'País do autor é obrigatório.', newAuthor: true, author: currentAuthor });

    authorModel.findOneAndUpdate({ _id: currentAuthor._id }, { $set: {
      public_name: currentAuthor.public_name,
      entire_name: currentAuthor.entire_name,
      death_date: currentAuthor.death_date,
      born_date: currentAuthor.born_date,
      born_state: currentAuthor.born_state,
      born_city: currentAuthor.born_city,
      language_id: currentAuthor.language_id,
      country_id: currentAuthor.country_id, } }, (err, author) =>{
        if (err) {
          return res.render('author/formregister', { message: 'Erro ao atualizar autor.', newAuthor: false, author: currentAuthor });
        }
        req.flash('tip', 'Autor atualizado com sucesso !');
        res.redirect('/autor');
    });
  }
);

router.get('/excluir/:id',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    if (req.params.id != '') {
      authorModel.findByIdAndDelete(req.params.id, null, function (err, doc) {
        if (err) {
          req.flash('tip', 'Erro ao excluir autor.');
        }else{
          req.flash('tip', 'Sucesso ao excluir autor.');
        }
        res.redirect('/autor');
      });
    }else{
      req.flash('tip', 'Erro ao excluir autor.');
      res.redirect('/autor');
    }
  }

);

module.exports = router;
