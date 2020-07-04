var mongoose = require('mongoose');

var publisherSchema = mongoose.Schema({
  name: { type: String, required: true },
  country_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
},{
  timestamps: true
});

module.exports = mongoose.model('Publisher', publisherSchema, 'publisher');
