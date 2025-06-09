const express = require('express');
const Prenotazione = require('../models/Prenotazione');
const router = express.Router();

// Middleware auth
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

// POST /api/prenotazioni
router.post('/', auth, async (req, res) => {
  try {
    const {
      bikes,
      start,
      stop,
      pickup_location,
      dropoff_location,
      manutenzione // opzionale
    } = req.body;

    // Validazioni base
    if (!Array.isArray(bikes) || bikes.length === 0) {
      return res.status(400).json({ error: 'Devi specificare almeno una bici' });
    }
    if (!start || !stop) {
      return res.status(400).json({ error: 'Start e stop sono obbligatori' });
    }

    // Creazione della prenotazione
    const prenotazione = await Prenotazione.create({
      idUser: req.userId,
      bikes,
      start,
      stop,
      pickup_location,
      dropoff_location,
      manutenzione // solo se fornito
    });

    res.status(201).json(prenotazione);
  } catch (err) {
    console.error('Errore nella creazione della prenotazione:', err);
    res.status(400).json({ error: err.message });
  }
});


// GET /api/prenotazioni/mie
router.get('/mie', auth, async (req, res) => {
  try {
    const prenotazioni = await Prenotazione.find({ idUser: req.userId })
      .populate('bikes.idBike')
      .populate('pickup_location dropoff_location');
    res.json(prenotazioni);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero delle tue prenotazioni' });
  }
});

// GET /api/prenotazioni (solo operatori)
router.get('/', auth, async (req, res) => {
  if (!req.isOperator) return res.status(403).json({ error: 'Accesso negato' });

  try {
    const prenotazioni = await Prenotazione.find()
      .populate('idUser', 'name email')
      .populate('bikes.idBike')
      .populate('pickup_location dropoff_location');
    res.json(prenotazioni);
  } catch (err) {
    res.status(500).json({ error: 'Errore nel recupero delle prenotazioni' });
  }
});


// POST /api/prenotazioni/filtrate (solo operatori)
router.post('/filtrate', auth, async (req, res) => {
  if (!req.isOperator) return res.status(403).json({ error: 'Accesso negato' });

  try {
    const { status, userName, startDate, endDate } = req.body;
    const filters = {};

    // Filtra per status (opzionale)
    if (status) filters.status = status;

    // Cerca utente per nome
    if (userName) {
        const users = await require('../models/User').find({
            name: { $regex: userName, $options: 'i' }  // like '%userName%', case-insensitive
        });

        if (users.length === 0)
            return res.status(404).json({ error: 'Nessun utente trovato con questo nome' });

        const userIds = users.map(u => u._id);
        filters.idUser = { $in: userIds };
    }


    // Filtra per range di date (opzionale)
    if (startDate && endDate) {
      filters.start = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const prenotazioni = await Prenotazione.find(filters)
      .populate('idUser', 'name email')
      .populate('bikes.idBike')
      .populate('pickup_location dropoff_location');

    res.json(prenotazioni);
  } catch (err) {
    console.error('Errore filtri prenotazioni:', err);
    res.status(500).json({ error: 'Errore nel recupero delle prenotazioni' });
  }
});


// GET /api/prenotazioni/:id
router.get('/detail/:id',auth, async (req, res) => {
  try {
    const prenotazione = await Prenotazione.findById(req.params.id)
      .populate('idUser')
      .populate('bikes.idBike')
      .populate('pickup_location dropoff_location');

    if (!prenotazione) return res.status(404).json({ error: 'Prenotazione non trovata' });
    res.json(prenotazione);
  } catch (err) {
    res.status(500).json({ error: 'Errore server' });
  }
});

// PUT /api/prenotazioni/:id
router.put('/modify/:id', async (req, res) => {
  try {
    const prenotazione = await Prenotazione.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('idUser')
      .populate('bikes.idBike')
      .populate('pickup_location dropoff_location');

    if (!prenotazione) return res.status(404).json({ error: 'Prenotazione non trovata' });

    res.json({ message: 'Prenotazione aggiornata con successo', prenotazione });
  } catch (err) {
    res.status(500).json({ error: 'Errore server' });
  }
});

// PUT /api/prenotazioni/:id/aggiorna-status
router.put('/aggiorna-status/:id', async (req, res) => {
  try {
    const updated = await Prenotazione.aggiornaStatus(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// router.get('/test/:id',async (req,res)=>{
//     try {
//     const prenotazione = await Prenotazione.findById(req.params.id); // <- Mostra il prezzo calcolato

//     if (!prenotazione) return res.status(404).json({ error: 'Prenotazione non trovata' });

//     res.json({ message: 'Test', prenotazione});
//   } catch (err) {
//     res.status(500).json({ error: 'Errore server' });
//   }
// });

module.exports = router;
