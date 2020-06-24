var mongoose = require('mongoose');

var authorSchema = mongoose.Schema({
  public_name: { type: String, required: true },
  entire_name: { type: String },
  born_date: { type: Date, required: true },
  death_date: { type: Date },
  born_state: { type: String },
  born_city: { type: String },
  books_writed: { type: Number },
  main_language: { type: mongoose.Schema.Types.ObjectId, ref: 'Language' }, 
  born_country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
},{
  timestamps: true
});

module.exports = mongoose.model('Author', authorSchema, 'author');
