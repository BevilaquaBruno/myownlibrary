var express = require('express');
var exphbs  = require('express-handlebars');
var helmet = require('helmet');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')

var app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(helmet());
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
 
app.get('/', function (req, res) {
    res.render('home');
});
 
app.listen(3000);