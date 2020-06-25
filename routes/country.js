const express = require('express');
var router = express.Router();
var countryModel = require('../schemas/country');
var validator = require('validator');
var helper = require('../lib/helper');
var conn = require('connect-ensure-login');

router.get('/todos',
  conn.ensureLoggedIn('/login'),
  function (req, res) {
    countryModel.find().then(function (countries) {
        res.json({ countries: countries });
    })
  }
);

module.exports = router;