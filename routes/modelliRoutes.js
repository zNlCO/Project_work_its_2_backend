const express = require('express');
const router = express.Router();
const Bike = require('../models/Bike');
const Prenotazione = require('../models/Prenotazione');
const Modello = require('../models/Modello');


// Middleware auth (puoi spostarlo qui o importarlo da file a parte)
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'mia-chiave-di-default';

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token mancante' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.isOperator = decoded.isOperator;
    next();
  } catch {
    res.status(401).json({ error: 'Token non valido' });
  }
};

router.get('/disponibili', async (req, res) => {
  try {
    const { start, stop, pickup_location } = req.query;

    if (!start || !stop || !pickup_location) {
        start="2025-01-01T00:00:00:000Z"
        stop="2025-01-01T00:00:01:000Z"
    //   return res.status(400).json({ error: 'start, stop e pickup_location sono obbligatori' });
    }

    const startDate = new Date(start);
    const stopDate = new Date(stop);

    // Trova solo le prenotazioni che si sovrappongono al periodo richiesto
    const prenotazioniConflittuali = await Prenotazione.find({
      cancelled: false,
      $nor: [
        { stop: { $lte: startDate } }, // completamente prima
        { start: { $gte: stopDate } }  // completamente dopo
      ]
    });

    const bikeIdsOccupate = new Set();
    for (const pren of prenotazioniConflittuali) {
      for (const b of pren.bikes) {
        bikeIdsOccupate.add(String(b.idBike));
      }
    }

    const biciDisponibili = await Bike.find({
      _id: { $nin: Array.from(bikeIdsOccupate) },
      idPuntoVendita: pickup_location
    }).populate('idModello');

    const conteggio = {};
    for (const bike of biciDisponibili) {
      const modelId = bike.idModello._id.toString();
      if (!conteggio[modelId]) {
        conteggio[modelId] = {
          modello: bike.idModello,
          disponibili: 0
        };
      }
      conteggio[modelId].disponibili++;
    }

    res.json(Object.values(conteggio));
  } catch (err) {
    console.error('Errore nel calcolo disponibilità modelli:', err);
    res.status(500).json({ error: 'Errore server' });
  }
});



// GET /api/modelli
router.get('/', async (req, res) => {
  try {
    const modelli = await Modello.find();
    res.json(modelli);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero dei modelli' });
  }
});

// POST /api/modelli (solo operatori)
router.post('/', auth, async (req, res) => {
  if (!req.isOperator)
    return res.status(403).json({ error: 'Accesso negato: solo operatori possono creare modelli' });

  try {
    const modello = await Modello.create(req.body);
    res.status(201).json(modello);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;