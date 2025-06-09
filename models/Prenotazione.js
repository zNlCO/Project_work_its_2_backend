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
    accessories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Accessorio'
    }],
    assicurazione: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assicurazione'
    }
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

  status: {
    type: String,
    enum: ['Da Ritirare', 'In Corso', 'Riconsegnato'],
    default: 'Da Ritirare'
  }

}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Metodo per aggiornare lo status
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

// Virtual per il prezzo (ora basato sui modelli referenziati)
PrenotazioneSchema.virtual('prezzo').get(function () {
  const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
  const durataInGiorni = Math.ceil((this.stop - this.start) / MILLISECONDS_IN_DAY);


  let prezzoTotale = 0;

  for (const item of this.bikes) {
    prezzoTotale += durataInGiorni * item.prezzo;

    if (Array.isArray(item.accessories)) {
      for (const acc of item.accessories) {
        prezzoTotale += acc.prezzo || 0; // solo se popolato
      }
    }

    if (item.assicurazione && item.assicurazione.prezzo) {
      prezzoTotale += item.assicurazione.prezzo;
    }
  }

  return prezzoTotale;
});

module.exports = mongoose.model('Prenotazione', PrenotazioneSchema);
