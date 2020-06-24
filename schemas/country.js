var mongoose = require('mongoose');

var countrySchema = mongoose.Schema({
  name: { type: String }
},{
  timestamps: true
});

module.exports = mongoose.model('Country', countrySchema, 'country');
