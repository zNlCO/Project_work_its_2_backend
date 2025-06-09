const mongoose = require('mongoose');

const PrenotazioneSchema = new mongoose.Schema({
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bikes: [{
    idBike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bike',
      required: true
    },
    accessories: [String],
    assicurazione: { type: String }
  }],
  start: { type: Date, required: true },
  stop: { type: Date, required: true },
  pickup_location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PuntoVendita',
    required: true
  },
  dropoff_location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PuntoVendita',
    required: true
  },
  manutenzione: { type: Boolean, default: false }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual per il prezzo (calcolo da fare lato controller)
PrenotazioneSchema.virtual('prezzo').get(function () {
  return 0;
});

module.exports = mongoose.model('Prenotazione', PrenotazioneSchema);
