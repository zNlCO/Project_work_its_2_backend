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
  manutenzione: { type: Boolean, default: false },
  cancelled: { type: Boolean, default: false },

  // ✅ Nuovo campo "status"
  status: {
    type: String,
    enum: ['Da Ritirare', 'In Corso', 'Riconsegnato'],
    default: 'Da Ritirare'
  }

}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


// Metodo statico per aggiornare status di una singola prenotazione
PrenotazioneSchema.statics.aggiornaStatus = async function (prenotazioneId) {
  const prenotazione = await this.findById(prenotazioneId);
  if (!prenotazione) throw new Error('Prenotazione non trovata');

  const now = new Date();

  if (now < prenotazione.start) {
    prenotazione.status = 'Da Ritirare';
  } else if (now >= prenotazione.start && now <= prenotazione.stop) {
    prenotazione.status = 'In Corso';
  } else if (now > prenotazione.stop) {
    prenotazione.status = 'Riconsegnato';
  }

  await prenotazione.save();
  return prenotazione;
};


// Virtual per il prezzo (calcolo da fare lato controller)
PrenotazioneSchema.virtual('prezzo').get(function () {
  const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
  const durataInGiorni = Math.ceil((this.stop - this.start) / MILLISECONDS_IN_DAY);

  const prezzoPerGiornoPerBici = 20; // esempio: €20 al giorno per bici
  const prezzoPerAccessorio = 5;     // esempio: €5 per ogni accessorio
  const prezzoAssicurazione = {
    base: 10,
    premium: 20
  };

  let prezzoTotale = 0;

  for (const item of this.bikes) {
    // Prezzo base bici
    prezzoTotale += durataInGiorni * prezzoPerGiornoPerBici;

    // Accessori
    if (Array.isArray(item.accessories)) {
      prezzoTotale += item.accessories.length * prezzoPerAccessorio;
    }

    // Assicurazione
    if (item.assicurazione && prezzoAssicurazione[item.assicurazione]) {
      prezzoTotale += prezzoAssicurazione[item.assicurazione];
    }
  }

  return prezzoTotale;
});


module.exports = mongoose.model('Prenotazione', PrenotazioneSchema);
