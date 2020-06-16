var express = require('express');
var exphbs  = require('express-handlebars');
var helmet = require('helmet');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');

var app = express()

mongoose.connect('mongodb://bevilaqua:bruno123@ds259154.mlab.com:59154/bevilaqualibrary', {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(helmet());

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

var userRouter = require('./routes/user');

app.use('/user', userRouter);
app.use('*', function (req, res) {
    res.render('404Page');
});

app.listen(3000);
console.log('Listen on :3000');
