const Rental = require('../models/rental.model');
const BikeAvailability = require('../models/bikeAvailability.model');
const Store = require('../models/store.model');

// Ottieni tutti i noleggi
const getAllRentals = async (req, res) => {
  try {
    const { user, store, status, startDate, endDate } = req.query;
    
    // Costruisci il filtro
    const filter = {};
    if (user) filter.user = user;
    if (store) filter.store = store;
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }

    const rentals = await Rental.find(filter)
      .populate('user', 'name email')
      .populate('store', 'name address')
      .populate('bikeType', 'name brand model category')
      .populate('accessories.accessory', 'name category')
      .populate('insurance', 'name coverage');

    res.json({
      success: true,
      count: rentals.length,
      data: rentals
    });
  } catch (error) {
    console.error('Get all rentals error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero dei noleggi'
    });
  }
};

// Ottieni un noleggio specifico
const getRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id)
      .populate('user', 'name email')
      .populate('store', 'name address')
      .populate('bikeType', 'name brand model category')
      .populate('accessories.accessory', 'name category')
      .populate('insurance', 'name coverage');
    
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Noleggio non trovato'
      });
    }

    res.json({
      success: true,
      data: rental
    });
  } catch (error) {
    console.error('Get rental error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero del noleggio'
    });
  }
};

// Crea un nuovo noleggio
const createRental = async (req, res) => {
  try {
    // Verifica che il negozio sia aperto negli orari richiesti
    const store = await Store.findById(req.body.store);
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);

    if (!store.isOpenAt(startDate)) {
      return res.status(400).json({
        success: false,
        message: 'Il negozio è chiuso all\'orario di ritiro'
      });
    }

    if (!store.isOpenAt(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Il negozio è chiuso all\'orario di riconsegna'
      });
    }

    const rental = await Rental.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Noleggio creato con successo',
      data: rental
    });
  } catch (error) {
    console.error('Create rental error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nella creazione del noleggio',
      error: error.message
    });
  }
};

// Aggiorna un noleggio
const updateRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Noleggio non trovato'
      });
    }

    // Verifica che lo stato del noleggio permetta modifiche
    if (['completed', 'cancelled'].includes(rental.status)) {
      return res.status(400).json({
        success: false,
        message: 'Non è possibile modificare un noleggio completato o cancellato'
      });
    }

    // Se si stanno modificando le date, verifica che il negozio sia aperto
    if (req.body.startDate || req.body.endDate) {
      const store = await Store.findById(rental.store);
      const startDate = new Date(req.body.startDate || rental.startDate);
      const endDate = new Date(req.body.endDate || rental.endDate);

      if (!store.isOpenAt(startDate)) {
        return res.status(400).json({
          success: false,
          message: 'Il negozio è chiuso all\'orario di ritiro'
        });
      }

      if (!store.isOpenAt(endDate)) {
        return res.status(400).json({
          success: false,
          message: 'Il negozio è chiuso all\'orario di riconsegna'
        });
      }
    }

    // Aggiorna solo i campi presenti nel body
    Object.keys(req.body).forEach(key => {
      rental[key] = req.body[key];
    });

    await rental.save();

    res.json({
      success: true,
      message: 'Noleggio aggiornato con successo',
      data: rental
    });
  } catch (error) {
    console.error('Update rental error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nell\'aggiornamento del noleggio',
      error: error.message
    });
  }
};

// Cancella un noleggio
const cancelRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Noleggio non trovato'
      });
    }

    // Verifica che il noleggio possa essere cancellato
    if (['completed', 'cancelled'].includes(rental.status)) {
      return res.status(400).json({
        success: false,
        message: 'Non è possibile cancellare un noleggio completato o già cancellato'
      });
    }

    rental.status = 'cancelled';
    await rental.save();

    res.json({
      success: true,
      message: 'Noleggio cancellato con successo',
      data: rental
    });
  } catch (error) {
    console.error('Cancel rental error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nella cancellazione del noleggio'
    });
  }
};

// Completa un noleggio
const completeRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Noleggio non trovato'
      });
    }

    // Verifica che il noleggio possa essere completato
    if (rental.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Solo i noleggi in corso possono essere completati'
      });
    }

    // Aggiorna lo stato e aggiungi il report danni se presente
    rental.status = 'completed';
    if (req.body.damageReport) {
      rental.damageReport = req.body.damageReport;
    }

    await rental.save();

    res.json({
      success: true,
      message: 'Noleggio completato con successo',
      data: rental
    });
  } catch (error) {
    console.error('Complete rental error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel completamento del noleggio'
    });
  }
};

// Aggiorna lo stato del noleggio
const updateRentalStatus = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    const { status } = req.body;

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Noleggio non trovato'
      });
    }

    // Verifica che il nuovo stato sia valido
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['in-progress', 'cancelled'],
      'in-progress': ['completed'],
      completed: [],
      cancelled: []
    };

    if (!validTransitions[rental.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Non è possibile cambiare lo stato da ${rental.status} a ${status}`
      });
    }

    rental.status = status;
    await rental.save();

    res.json({
      success: true,
      message: 'Stato del noleggio aggiornato con successo',
      data: rental
    });
  } catch (error) {
    console.error('Update rental status error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nell\'aggiornamento dello stato del noleggio'
    });
  }
};

module.exports = {
  getAllRentals,
  getRental,
  createRental,
  updateRental,
  cancelRental,
  completeRental,
  updateRentalStatus
}; 