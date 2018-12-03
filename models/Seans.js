const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const config = require('../config');

const SeansSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    maxlength: 100
  },
  filmId:{
    type: String,
    maxlength: 100
  },
  areas: [{
    row:{
      type: Number,
      required: true,
      min:1,
      max:30
    },
    col:{
      type: Number, 
      required: true,
      min:1,
      max:40
    },
    status:{
      type: Number, // 0-free 1-reserved 2-sold
      default: 0,
      min:1
    },
    userId: {
      type: String,
      required: true,
    }
  }]
});

SeansSchema.plugin(timestamp);



const Seans = mongoose.model('Seans', SeansSchema);
module.exports = Seans;
