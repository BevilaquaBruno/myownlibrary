const express = require('express');
var router = express.Router();
var userModel = require('../schemas/user');
var md5 = require('md5');
var passport = require('passport');

router.get('/',
  require('connect-ensure-login').ensureLoggedIn('/login'),
  function (req, res) {
    res.render('user/list');
  }
);

router.get('/register',
  require('connect-ensure-login').ensureLoggedIn('/login'),
  function(req, res){
    res.render('user/formregister', { user : { name: '', email: '', username: '', password: '', _id: '' } });
  }
);
module.exports = router;
