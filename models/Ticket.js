const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const TicketSchema = new mongoose.Schema({
  filmId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true 
  },
  seansId: {
    type: String,
    required: true 
  },
  description: {
    type: String,
    maxlength: 1000
  },
  status: {
    type: Number,
    min: 0,
    default: 0
  },
  price: {
    type: Number,
    min: 0,
    default: 0
  }
});

TicketSchema.plugin(timestamp);

const Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;
