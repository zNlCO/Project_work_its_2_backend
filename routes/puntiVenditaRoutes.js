const express = require('express');
const PuntoVendita = require('../models/PuntoVendita'); // Assumendo il modello PuntoVendita
const router = express.Router();

// Middleware autenticazione (lo puoi importare da apiRoutes o authRoutes)
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

// GET /punti-vendita - recupera tutti i punti vendita
router.get('/', async (req, res) => {
  try {
    const puntiVendita = await PuntoVendita.find();
    res.json(puntiVendita);
  } catch (err) {
    console.error('Errore nel recupero punti vendita:', err);
    res.status(500).json({ error: 'Errore server' });
  }
});

// POST /punti-vendita - crea un nuovo punto vendita (solo operatori)
router.post('/', auth, async (req, res) => {
  if (!req.isOperator) {
    return res.status(403).json({ error: 'Accesso negato: solo operatori possono creare punti vendita' });
  }

  try {
    const nuovoPuntoVendita = await PuntoVendita.create(req.body);
    res.status(201).json(nuovoPuntoVendita);
  } catch (err) {
    console.error('Errore creazione punto vendita:', err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
