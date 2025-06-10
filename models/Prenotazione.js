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
        // ASSICURATI che item.idBike e item.idBike.idModello siano popolati!
        if (item.idBike && item.idBike.idModello && item.idBike.idModello.prezzoOrario) {
            prezzoTotale += durataInGiorni * item.idBike.idModello.prezzoOrario;
        } else {
            // Se non è popolato o manca il prezzo, potresti voler loggare un errore o gestire la cosa
            console.warn("Attenzione: Prezzo del modello non disponibile per una bici nella prenotazione.");
            // Potresti voler lanciare un errore o saltare questa bici nel calcolo
        }

        if (Array.isArray(item.accessories)) {
            for (const acc of item.accessories) {
                // Questo funziona SOLO SE item.accessories è popolato
                prezzoTotale += acc.prezzo || 0;
            }
        }

        if (item.assicurazione && item.assicurazione.prezzo && item.assicurazione!=null) {
            // Questo funziona SOLO SE item.assicurazione è popolato
            prezzoTotale += item.assicurazione.prezzo;
        }
    }

    return prezzoTotale;
});

module.exports = mongoose.model('Prenotazione', PrenotazioneSchema);
