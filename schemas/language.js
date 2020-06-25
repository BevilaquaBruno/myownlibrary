var mongoose = require('mongoose');

var languageSchema = mongoose.Schema({
  description: { type: String, required: true },
  country_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
},{
  timestamps: true
});

module.exports = mongoose.model('Language', languageSchema, 'language');
