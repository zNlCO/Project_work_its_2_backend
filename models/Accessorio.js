const mongoose = require('mongoose');

const AccessorioSchema = new mongoose.Schema({
  descrizione: {
    type: String,
    required: true,
    trim: true
  },
  prezzo: {
    type: Number,
    required: true,
    min: 0
  }
});

module.exports = mongoose.model('Accessorio', AccessorioSchema);
