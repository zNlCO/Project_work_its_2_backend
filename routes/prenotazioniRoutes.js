const express = require('express');
const Prenotazione = require('../models/Prenotazione');
const Accessorio = require('../models/Accessorio');
const Assicurazione = require('../models/Assicurazione');
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

// POST /api/prenotazioni create
// POST /api/prenotazioni create
router.post('/', auth, async (req, res) => {
  try {
    const {
      bikes,
      start,
      stop,
      pickup_location,
      dropoff_location,
      manutenzione
    } = req.body;

    if (!Array.isArray(bikes) || bikes.length === 0) {
      return res.status(400).json({ error: 'Devi specificare almeno una bici' });
    }
    if (!start || !stop) {
      return res.status(400).json({ error: 'Start e stop sono obbligatori' });
    }

    // Estrai gli ID delle bici richieste
    const requestedBikeIds = bikes.map(b => b.idBike);

    // Verifica sovrapposizioni con altre prenotazioni
    const overlappingPrenotazioni = await Prenotazione.find({
      cancelled: false,
      'bikes.idBike': { $in: requestedBikeIds },
      $or: [
        {
          start: { $lt: new Date(stop) },
          stop: { $gt: new Date(start) }
        }
      ]
    });

    if (overlappingPrenotazioni.length > 0) {
      return res.status(409).json({
        error: 'Una o più bici sono già prenotate in questo intervallo',
        conflictingPrenotazioni: overlappingPrenotazioni
      });
    }

    // Mappa i campi delle bici
    const bikesFormatted = bikes.map(b => ({
      idBike: b.idBike,
      accessories: b.accessories || [],
      assicurazione: b.assicurazione || null
    }));

    // Crea la prenotazione
    const prenotazioneBase = await Prenotazione.create({
      idUser: req.userId,
      bikes: bikesFormatted,
      start,
      stop,
      pickup_location,
      dropoff_location,
      manutenzione
    });

    // 🔄 Popola i riferimenti prima di inviare la risposta
    const prenotazione = await Prenotazione.findById(prenotazioneBase._id)
      .populate('idUser', 'name email')
      .populate('pickup_location dropoff_location')
      .populate('bikes.idBike')
      .populate('bikes.accessories')
      .populate('bikes.assicurazione');

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
      .populate('idUser', 'name email')
      .populate({
        path: 'bikes.idBike', // Popola idBike
        populate: [
          { path: 'idPuntoVendita' },
          { path: 'idModello' } // <-- Questo popola idModello all'interno di idBike
        ]
      })
      .populate({
        path: 'bikes.accessories', // Popola accessories
        model: 'Accessorio'
      })
      .populate({
        path: 'bikes.assicurazione', // Popola assicurazione
        model: 'Assicurazione'
      })
      .populate('pickup_location')
      .populate('dropoff_location');

    // if (prenotazioni.length > 0) {
    //   res.status(201).json(prenotazioni);
    // } else {
    //   res.status(200).json("non ci sono prenotazioni a tuo nome");
    // }

   res.status(200).json(mongoose.modelNames());
   console.log(mongoose.modelNames()) // <--- AGGIUNGI QUESTA RIGA
  } catch (err) {
    console.error(err);
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
      .populate('bikes.accessories','descrizione prezzo')
      .populate('bikes.assicurazione','descrizione prezzo')
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



module.exports = router;
