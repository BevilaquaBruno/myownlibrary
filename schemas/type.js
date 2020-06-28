var mongoose = require('mongoose');

var typeSchema = mongoose.Schema({
  description: { type: String }
},{
  timestamps: true
});

module.exports = mongoose.model('Type', typeSchema, 'type');
