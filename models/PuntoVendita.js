const mongoose = require('mongoose');

const PuntoVenditaSchema = new mongoose.Schema({
  location: { type: String, required: true }
});

module.exports = mongoose.model('PuntoVendita', PuntoVenditaSchema);
