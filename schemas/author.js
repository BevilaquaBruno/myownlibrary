var mongoose = require('mongoose');

var authorSchema = mongoose.Schema({
  public_name: { type: String, required: true },
  entire_name: { type: String },
  born_date: { type: String, required: true },
  death_date: { type: String },
  born_state: { type: String },
  born_city: { type: String },
  language_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Language' },
  country_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
},{
  timestamps: true
});

module.exports = mongoose.model('Author', authorSchema, 'author');
