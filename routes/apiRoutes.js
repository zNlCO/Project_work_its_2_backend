const express = require('express');
const Modello = require('../models/Modello');
const Prenotazione = require('../models/Prenotazione');
const Bike = require('../models/Bike'); 
const PuntoVendita = require('../models/PuntoVendita'); 

const router = express.Router();

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

// GET /api/modelli
router.get('/modelli', async (req, res) => {
  try {
    const modelli = await Modello.find();
    res.json(modelli);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero dei modelli' });
  }
});

// POST /api/modelli (solo operatori)
router.post('/modelli', auth, async (req, res) => {
  if (!req.isOperator)
    return res.status(403).json({ error: 'Accesso negato: solo operatori possono creare modelli' });

  try {
    const modello = await Modello.create(req.body);
    res.status(201).json(modello);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/prenotazioni
router.post('/prenotazioni', auth, async (req, res) => {
  try {
    const prenotazione = await Prenotazione.create({ ...req.body, idUser: req.userId });
    res.status(201).json(prenotazione);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/prenotazioni/mie
router.get('/prenotazioni/mie', auth, async (req, res) => {
  console.log('GET /prenotazioni/mie - userId:', req.userId, 'isOperator:', req.isOperator);
  try {
    const prenotazioni = await Prenotazione.find({ idUser: req.userId })
      .populate('bikes.idBike')
      .populate('pickup_location dropoff_location');

    res.json(prenotazioni);
  } catch (err) {
    console.error('Errore nel recupero delle tue prenotazioni:', err);
    res.status(500).json({ error: 'Errore nel recupero delle tue prenotazioni' });
  }
});

// GET /api/prenotazioni (operatori)
router.get('/prenotazioni', auth, async (req, res) => {
  console.log('GET /prenotazioni - userId:', req.userId, 'isOperator:', req.isOperator);
  if (!req.isOperator) {
    console.log('Accesso negato - non operatore');
    return res.status(403).json({ error: 'Accesso negato: solo operatori possono visualizzare tutte le prenotazioni' });
  }

  try {
    const prenotazioni = await Prenotazione.find()
      .populate('idUser', 'name email')
      .populate('bikes.idBike')
      .populate('pickup_location dropoff_location');

    res.json(prenotazioni);
  } catch (err) {
    console.error('Errore nel recupero delle prenotazioni:', err);
    res.status(500).json({ error: 'Errore nel recupero delle prenotazioni' });
  }
});


module.exports = router;
