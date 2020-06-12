var express = require('express');
var exphbs  = require('express-handlebars');
var helmet = require('helmet');

var app = express();

app.use(helmet());
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
 
app.get('/', function (req, res) {
    res.render('home');
});
 
app.listen(3000);