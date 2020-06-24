const express = require('express');
var router = express.Router();
var languageModel = require('../schemas/language');
var validator = require('validator');
var helper = require('../lib/helper');
var conn = require('connect-ensure-login');

router.get('/todos', 
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    languageModel.find().then(function (languages) {
        res.json({ languages: languages });
    })
  }
);

module.exports = router;