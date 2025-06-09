const express = require('express');
const router = express.Router();
const Bike = require('../models/Bike');
const Prenotazione = require('../models/Prenotazione');

// GET /api/bikes/disponibili
router.get('/disponibili', async (req, res) => {
  try {
    const { start, stop, pickup_location } = req.query;

    if (!start || !stop || !pickup_location) {
      return res.status(400).json({ error: 'start, stop e pickup_location sono obbligatori' });
    }

    const startDate = new Date(start);
    const stopDate = new Date(stop);

    const prenotazioniConflittuali = await Prenotazione.find({
      cancelled: false,
      $or: [{ start: { $lt: stopDate }, stop: { $gt: startDate } }]
    });

    const bikeIdsOccupate = new Set();
    for (const p of prenotazioniConflittuali) {
      for (const b of p.bikes) {
        bikeIdsOccupate.add(String(b.idBike));
      }
    }

    const biciDisponibili = await Bike.find({
      _id: { $nin: Array.from(bikeIdsOccupate) },
      idPuntoVendita: pickup_location
    });

    res.json(biciDisponibili);
  } catch (err) {
    console.error('Errore nel recupero delle bici disponibili:', err);
    res.status(500).json({ error: 'Errore server' });
  }
});


module.exports = router;
