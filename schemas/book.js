var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
  name: { type: String, required: true },
  release_date: { type: String, required: true },
  number_pages: { type: String, required: true },
  description: { type: String },
  comments: [{ body: String, date: String }],
  votes: { positives: Number, negatives: Number },
  language_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Language' },
  publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'Publisher' },
  country_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  genre_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre' },
  type_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Type' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},{
  timestamps: true
});

module.exports = mongoose.model('Book', authorSchema, 'book');
