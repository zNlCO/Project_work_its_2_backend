const mongoose = require('mongoose');

const AccessorySchema = new mongoose.Schema({
  descrizione: {
    type: String,
    required: true,
  },
  prezzo: {
    type: Number,
    required: true,
    min: 0
  }
});

module.exports = mongoose.model('AccessoryModel', AccessorySchema);