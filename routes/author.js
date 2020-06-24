const express = require('express');
var router = express.Router();
var authorModel = require('../schemas/author');
var helper = require('../lib/helper');
var conn = require('connect-ensure-login');

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
    if (currentAuthor.public_name == '') {
      return res.render('author/formregister', { message: 'Nome público inválido (Se você não sabe o nome, procure em um livro do autor).', newAuthor: true, 
        author: currentAuthor });
    }
    if (currentAuthor.language_id == '') {
      return res.render('author/formregister', { message: 'Idioma do autor é obrigatório.', newAuthor: true, 
        author: currentAuthor });
    }
    if (currentAuthor.country_id == '') {
      return res.render('author/formregister', { message: 'País do autor é obrigatório.', newAuthor: true, 
        author: currentAuthor });
    }
    let na = currentAuthor;
    delete na._id;
    let newAuthor = new authorModel(na);
    newAuthor.save().then(author => {
      req.flash('tip', 'Autor cadastrado com sucesso.');
      res.redirect('/autor');
    }).catch(err => {
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

module.exports = router;
