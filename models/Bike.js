const mongoose = require('mongoose');

const BikeSchema = new mongoose.Schema({
  idPuntoVendita: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PuntoVendita',
    required: true
  },
  idModello: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Modello',
    required: true
  }
});

module.exports = mongoose.model('Bike', BikeSchema);
