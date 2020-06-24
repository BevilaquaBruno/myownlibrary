var mongoose = require('mongoose');

var languageSchema = mongoose.Schema({
  description: { type: String, required: true },
  name: { type: String }
},{
  timestamps: true
});

module.exports = mongoose.model('Language', languageSchema, 'language');
