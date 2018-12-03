const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const FilmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 1000
  },
  imagePath: {
    type: String,
    default: 0
  },
  price: {
    type: Number,
    min:0,
    default: 0
  }
});

FilmSchema.plugin(timestamp);

const Film = mongoose.model('Film', FilmSchema);
module.exports = Film;
