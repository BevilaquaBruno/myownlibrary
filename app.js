var express = require('express');
var exphbs  = require('express-handlebars');
var helmet = require('helmet');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var Strategy = require('passport-local').Strategy;
const passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var log = require('./log').log;
var conn = require('connect-ensure-login');
require('dotenv').config()

var app = express()

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser('keyboardcatgod'))
app.use(helmet());
app.use(flash());

const cookieExpirationDate = new Date();
const cookieExpirationDays = 365;
cookieExpirationDate.setDate(cookieExpirationDate.getDate() + cookieExpirationDays);

app.set('trust proxy', 1);
app.use(session({
  secret: 'keyboardcatgod',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: cookieExpirationDate
}
}));

app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

var userModel = require('./schemas/user');
var md5 = require('md5');
passport.use(new Strategy(
  function (username, password, callback) {
    var md5password = md5(password);
    userModel.findOne({username: username},'-created',null , function (err, user) {
      if (err) { return callback(null, false, { message: 'Erro ao buscar usuário' } ); }
      if(!user) { return callback(null, false, { message: 'Usuário ou senha incorretos !' } ); }
      if (user.password != md5password) { return callback(null, false, { message: 'Usuário ou senha incorretos !' } ); }
      return callback(null, user);
    })
  }
));

passport.serializeUser(function (user, callback) {
  callback(null, user._id);
});

passport.deserializeUser(function(id, callback) {
  userModel.findById(id, function (err, user) {
    if (err) { return callback(err); }
      callback(null, user);
    });
  });

app.use('*', function (req, res, next) {
  app.locals.pagetitle = 'Biblioteca Bevilaqua';
  if (!req.session.theme)
    req.session.theme = 'dark';
  app.locals.theme = req.session.theme;

  if (req.user) {
    app.locals.isLogged = true;
    app.locals.user = req.user;
  }
  next();
});

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/setTheme/:theme', function (req, res) {
  req.session.theme = req.params.theme;
  res.json({msg: 'Theme changed successfully'});
});

app.get('/login',
  conn.ensureLoggedOut('/livro'),
  function(req, res){
  res.render('login', { message: req.flash('error')});
});

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function (req, res) {
    log('Login'+'|U:'+req.user, 'login');
    res.redirect('/livro');
  }
);

app.get('/logout',
  conn.ensureLoggedIn('/'),
  function (req, res) {
    log('Logout'+'|U:'+req.user, 'login');
    app.locals.isLogged = false;
    app.locals.user = {};
    req.logout();
    res.redirect('/login');
});

app.use('/public', express.static(__dirname + '/public'));
app.use('/axios', express.static(__dirname + '/node_modules/axios/dist/'));
app.use('/moment', express.static(__dirname + '/node_modules/moment/'));
app.use('/gralig', express.static(__dirname + '/node_modules/gralig/dist/'));

var userRouter = require('./routes/user');
var authorRouter = require('./routes/author');
var languageRouter = require('./routes/language');
var countryRouter = require('./routes/country');
var typeRouter = require('./routes/type');
var genreRouter = require('./routes/genre');
var publisherRouter = require('./routes/publisher');
var bookRouter = require('./routes/book');

app.use('/usuario', userRouter);
app.use('/autor', authorRouter);
app.use('/idioma', languageRouter);
app.use('/pais', countryRouter);
app.use('/tipo', typeRouter);
app.use('/genero', genreRouter);
app.use('/editora', publisherRouter);
app.use('/livro', bookRouter);

app.use('*', function (req, res) {
    res.render('404Page');
});

app.listen(3000);
console.log('Listen on :3000');
