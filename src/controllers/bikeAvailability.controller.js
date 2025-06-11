const BikeAvailability = require('../models/bikeAvailability.model');
const BikeType = require('../models/bikeType.model');
const Store = require('../models/store.model');

// Ottieni tutte le disponibilità
const getAllAvailabilities = async (req, res) => {
  try {
    const { store, bikeType, status } = req.query;
    
    // Costruisci il filtro
    const filter = {};
    if (store) filter.store = store;
    if (bikeType) filter.bikeType = bikeType;
    if (status) filter.status = status;

    const availabilities = await BikeAvailability.find(filter)
      .populate('store', 'name address')
      .populate('bikeType', 'name brand model category pricePerHour');

    res.json({
      success: true,
      count: availabilities.length,
      data: availabilities
    });
  } catch (error) {
    console.error('Get all availabilities error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero delle disponibilità'
    });
  }
};

// Ottieni una disponibilità specifica
const getAvailability = async (req, res) => {
  try {
    const availability = await BikeAvailability.findById(req.params.id)
      .populate('store', 'name address')
      .populate('bikeType', 'name brand model category pricePerHour');
    
    if (!availability) {
      return res.status(404).json({
        success: false,
        message: 'Disponibilità non trovata'
      });
    }

    res.json({
      success: true,
      data: availability
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero della disponibilità'
    });
  }
};

// Crea una nuova disponibilità
const createAvailability = async (req, res) => {
  try {
    // Verifica che il negozio e il tipo di bici esistano
    const [store, bikeType] = await Promise.all([
      Store.findById(req.body.store),
      BikeType.findById(req.body.bikeType)
    ]);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Punto vendita non trovato'
      });
    }

    if (!bikeType) {
      return res.status(404).json({
        success: false,
        message: 'Tipo di bicicletta non trovato'
      });
    }

    // Verifica che non esista già una disponibilità per questa bici in questo negozio
    const existingAvailability = await BikeAvailability.findOne({
      store: req.body.store,
      bikeType: req.body.bikeType
    });

    if (existingAvailability) {
      return res.status(400).json({
        success: false,
        message: 'Esiste già una disponibilità per questa bici in questo negozio'
      });
    }

    // Verifica che le taglie specificate siano valide per il tipo di bici
    const invalidSizes = req.body.frameTypesAvailable
      .filter(ft => !bikeType.frameTypes.includes(ft.size));

    if (invalidSizes.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Le seguenti taglie non sono valide per questo tipo di bici: ${invalidSizes.map(s => s.size).join(', ')}`
      });
    }

    const availability = await BikeAvailability.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Disponibilità creata con successo',
      data: availability
    });
  } catch (error) {
    console.error('Create availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nella creazione della disponibilità',
      error: error.message
    });
  }
};

// Aggiorna una disponibilità
const updateAvailability = async (req, res) => {
  try {
    const availability = await BikeAvailability.findById(req.params.id);

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: 'Disponibilità non trovata'
      });
    }

    // Se si stanno aggiornando le taglie, verifica che siano valide
    if (req.body.frameTypesAvailable) {
      const bikeType = await BikeType.findById(availability.bikeType);
      const invalidSizes = req.body.frameTypesAvailable
        .filter(ft => !bikeType.frameTypes.includes(ft.size));

      if (invalidSizes.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Le seguenti taglie non sono valide per questo tipo di bici: ${invalidSizes.map(s => s.size).join(', ')}`
        });
      }
    }

    // Aggiorna solo i campi presenti nel body
    Object.keys(req.body).forEach(key => {
      availability[key] = req.body[key];
    });

    // Aggiorna la quantità disponibile totale
    if (req.body.frameTypesAvailable) {
      await availability.updateAvailableQuantity();
    }

    await availability.save();

    res.json({
      success: true,
      message: 'Disponibilità aggiornata con successo',
      data: availability
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nell\'aggiornamento della disponibilità',
      error: error.message
    });
  }
};

// Elimina una disponibilità
const deleteAvailability = async (req, res) => {
  try {
    const availability = await BikeAvailability.findById(req.params.id);

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: 'Disponibilità non trovata'
      });
    }

    await availability.remove();

    res.json({
      success: true,
      message: 'Disponibilità eliminata con successo'
    });
  } catch (error) {
    console.error('Delete availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nell\'eliminazione della disponibilità'
    });
  }
};

// Verifica disponibilità per periodo
const checkAvailabilityForPeriod = async (req, res) => {
  try {
    const { store, bikeType, frameType, startDate, endDate } = req.query;

    if (!store || !bikeType || !frameType || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Tutti i parametri sono obbligatori'
      });
    }

    const availability = await BikeAvailability.findOne({
      store,
      bikeType
    });

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: 'Nessuna disponibilità trovata per questa bici in questo negozio'
      });
    }

    // Verifica la disponibilità della taglia
    if (!availability.isFrameTypeAvailable(frameType)) {
      return res.json({
        success: true,
        data: {
          isAvailable: false,
          reason: 'La taglia richiesta non è disponibile'
        }
      });
    }

    // Conta le prenotazioni sovrapposte
    const Rental = require('../models/rental.model');
    const overlappingRentals = await Rental.countDocuments({
      store,
      bikeType,
      frameType,
      status: { $nin: ['completed', 'cancelled'] },
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ]
    });

    const frameTypeStock = availability.frameTypesAvailable
      .find(ft => ft.size === frameType);
    const quantityAvailable = frameTypeStock ? frameTypeStock.quantity : 0;

    const isAvailable = overlappingRentals < quantityAvailable;

    res.json({
      success: true,
      data: {
        isAvailable,
        quantityAvailable,
        quantityBooked: overlappingRentals,
        quantityRemaining: quantityAvailable - overlappingRentals
      }
    });
  } catch (error) {
    console.error('Check availability for period error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nella verifica della disponibilità'
    });
  }
};

module.exports = {
  getAllAvailabilities,
  getAvailability,
  createAvailability,
  updateAvailability,
  deleteAvailability,
  checkAvailabilityForPeriod
}; 