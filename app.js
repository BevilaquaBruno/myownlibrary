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


var app = express()

mongoose.connect('mongodb://bevilaqua:bruno123@ds259154.mlab.com:59154/bevilaqualibrary', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

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

app.get('/', function (req, res) {
  res.render('home');
})

app.get('/login', function(req, res){
  res.render('login', { message: req.flash('error')});
});

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function (req, res) {
    res.redirect('/livro');
  }
);

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});

app.use('/javascript', express.static(__dirname + '/public'));
app.use('/axios', express.static(__dirname + '/node_modules/axios/dist/'));
app.use('/moment', express.static(__dirname + '/node_modules/moment/'));

var userRouter = require('./routes/user');
var authorRouter = require('./routes/author');
var languageRouter = require('./routes/language');
var countryRouter = require('./routes/country');

app.use('/usuario', userRouter);
app.use('/autor', authorRouter);
app.use('/idioma', languageRouter);
app.use('/pais', countryRouter);

app.use('*', function (req, res) {
    res.render('404Page');
});

app.listen(3000);
console.log('Listen on :3000');
