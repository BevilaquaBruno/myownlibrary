const logger = require('log-to-file');

var f = {
  "log": function (data, state) {
    logger('------ INICIO LOG -------'+JSON.stringify(data)+'------ FINAL LOG -------', __dirname+'/logs/'+state+'.log');
  }
}

module.exports = f;
