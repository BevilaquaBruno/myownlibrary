const logger = require('log-to-file');

var f = {
  "log": function (data, state) {
    logger('------ START LOG -------'+JSON.stringify(data)+'------ END LOG -------', __dirname+'/logs/'+state+'.log');
  }
}

module.exports = f;
