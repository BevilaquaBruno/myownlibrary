const express = require('express');
var router = express.Router();
var bookModel = require('../schemas/book');
var helper = require('../lib/helper');
var conn = require('connect-ensure-login');
var log = require('../log').log;

function createAndReturnBook(data, id='') {
  return({
    name: data.name,
    release_date: data.release_date,
    number_pages: data.number_pages,
    description: data.description,
    language_id: data.language_id,
    publisher_id: data.publisher_id,
    country_id: data.country_id,
    author_id: data.author_id,
    genre_id: data.genre_id,
    type_id: data.type_id,
    user_id: data.user_id,
    _id: id});
}

router.get('/',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    bookModel.find()
      .populate('language_id').populate('publisher_id')
      .populate('country_id').populate('author_id')
      .populate('genre_id').populate('type_id')
      .select('-createdAt -updatedAt')
      .then(function (books){
        res.render('book/list', { success: true, message: req.flash('tip'), books: helper.tojson(books) });
      }).catch(err => {
        res.render('book/list', { success: false, message: 'Erro ao buscar livros', books: [] });
      });
  }
);

router.get('/cadastrar',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    res.render('book/formregister', { message: '', newBook: true, book: {
      name: '', release_date: '',
      number_pages: '', description: '', comments: '', votes: '',
      language_id: '', publisher_id: '', country_id: '', author_id: '',
      genre_id: '', type_id: '', user_id: '', _id: '' }
    });
  }
);

router.post('/cadastrar',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    let currentBook = createAndReturnBook(req.body);
    if (currentBook.name == '')
      return res.render('book/formregister', { message: 'Nome é obrigatório', newBook: true, book: currentBook });
    if(currentBook.description == '')
      return res.render('book/formregister', { message: 'Descrição é obrigatória', newBook: true, book: currentBook });
    if(currentBook.number_pages == '' || currentBook.number_pages == 0)
      return res.render('book/formregister', { message: 'Número de páginas é obrigatório', newBook: true, book: currentBook });

    let nb = currentBook;
    delete nb._id;
    let newBook = new bookModel(nb);
    newBook.save().then(book => {
      log('BookRegister|Book:'+book+'|U:'+req.user, 'success');
      req.flash('tip', 'Livro cadastrado com sucesso');
      res.redirect('/livro');
    }).catch(err =>{
      log('BookRegister|err:'+err+'|U:'+req.user, 'error');
      return res.render('book/formregister', { message: 'Erro ao cadastrar livro', newBook: true, book: currentBook });
    });
  }
);

router.get('/atualizar/:id',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    if (req.params.id != '') {
      bookModel.findById(req.params.id).select('-createdAt -updatedAt -votes -comments').then(book => {
        book = (helper.tojson([book]))[0];
        return res.render('book/formregister', { message: '', newBook: false, book: book });
      }).catch(err => {
        req.flash('tip', 'Erro ao buscar livro.');
        return res.redirect('/livro');
      });
    }else{
      req.flash('tip', 'Erro ao buscar livro.');
      return res.redirect('/livro');
    }
  }
);

router.post('/atualizar',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    let currentBook = createAndReturnBook(req.body, req.body._id);
    if (currentBook.name == '')
      return res.render('book/formregister', { message: 'Nome é obrigatório', newBook: false, book: currentBook });
    if(currentBook.description == '')
      return res.render('book/formregister', { message: 'Descrição é obrigatória', newBook: false, book: currentBook });
    if(currentBook.number_pages == '' || currentBook.number_pages == 0)
      return res.render('book/formregister', { message: 'Número de páginas é obrigatório', newBook: false, book: currentBook });

    bookModel.findOneAndUpdate({ _id: currentBook._id }, { $set: {
      name: currentBook.name,
      release_date: currentBook.release_date,
      number_pages: currentBook.number_pages,
      description: currentBook.description,
      language_id: currentBook.language_id,
      publisher_id: currentBook.publisher_id,
      country_id: currentBook.country_id,
      author_id: currentBook.author_id,
      genre_id: currentBook.genre_id,
      type_id: currentBook.type_id,
      user_id: currentBook.user_id,
    } }).then(book => {
      req.flash('tip', 'Livro atualizado com sucesso !');
      log('BookUpdate|Book:'+book+'|U:'+req.user, 'success');
      res.redirect('/livro');
    }).catch(err => {
      log('BookUpdate|err:'+err+'|U:'+req.user, 'error');
      return res.render('book/formregister', { message: 'Erro ao atualizar livro.', newBook: false, book: currentBook });
    });
  }
);

router.get('/excluir/:id',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    if (req.params.id != '') {
      bookModel.findByIdAndDelete(req.params.id)
        .then(book => {
          log('BookDelete|Author_id:'+req.params.id+'|U:'+req.user, 'success');
          req.flash('tip', 'Sucesso ao excluir livro.');
          res.redirect('/livro');
        }).catch(err => {
          log('BookDelete|err:'+err+'|U:'+req.user, 'error');
          req.flash('tip', 'Erro ao excluir livro.');
          res.redirect('/livro');
        });
    }else{
      req.flash('tip', 'Erro ao excluir livro.');
      res.redirect('/livro');
    }
  }

);

module.exports = router;
