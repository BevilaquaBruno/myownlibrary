var mongoose = require('mongoose');

var genreSchema = mongoose.Schema({
  description: { type: String }
},{
  timestamps: true
});

module.exports = mongoose.model('Genre', genreSchema, 'genre');
