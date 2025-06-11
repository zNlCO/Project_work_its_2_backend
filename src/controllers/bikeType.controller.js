const BikeType = require('../models/bikeType.model');

// Ottieni tutti i tipi di biciclette
const getAllBikeTypes = async (req, res) => {
  try {
    const { category, isElectric, minPrice, maxPrice, sortBy } = req.query;
    
    // Costruisci il filtro
    const filter = {};
    if (category) filter.category = category;
    if (isElectric !== undefined) filter.isElectric = isElectric === 'true';
    if (minPrice || maxPrice) {
      filter.pricePerHour = {};
      if (minPrice) filter.pricePerHour.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerHour.$lte = Number(maxPrice);
    }

    // Costruisci l'ordinamento
    let sort = {};
    if (sortBy) {
      const [field, order] = sortBy.split(':');
      sort[field] = order === 'desc' ? -1 : 1;
    } else {
      sort = { createdAt: -1 };
    }

    const bikeTypes = await BikeType.find(filter).sort(sort);

    res.json({
      success: true,
      count: bikeTypes.length,
      data: bikeTypes
    });
  } catch (error) {
    console.error('Get all bike types error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero dei tipi di biciclette'
    });
  }
};

// Ottieni un tipo di bicicletta specifico
const getBikeType = async (req, res) => {
  try {
    const bikeType = await BikeType.findById(req.params.id);
    
    if (!bikeType) {
      return res.status(404).json({
        success: false,
        message: 'Tipo di bicicletta non trovato'
      });
    }

    res.json({
      success: true,
      data: bikeType
    });
  } catch (error) {
    console.error('Get bike type error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero del tipo di bicicletta'
    });
  }
};

// Crea un nuovo tipo di bicicletta
const createBikeType = async (req, res) => {
  try {
    const bikeType = await BikeType.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Tipo di bicicletta creato con successo',
      data: bikeType
    });
  } catch (error) {
    console.error('Create bike type error:', error);
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({
        success: false,
        message: 'Esiste già un tipo di bicicletta con questo nome'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Errore nella creazione del tipo di bicicletta',
      error: error.message
    });
  }
};

// Aggiorna un tipo di bicicletta
const updateBikeType = async (req, res) => {
  try {
    // Troviamo prima il bike type
    const existingBikeType = await BikeType.findById(req.params.id);

    if (!existingBikeType) {
      return res.status(404).json({
        success: false,
        message: 'Tipo di bicicletta non trovato'
      });
    }

    // Aggiorniamo solo i campi presenti nel body
    Object.keys(req.body).forEach(key => {
      existingBikeType[key] = req.body[key];
    });

    // Salviamo con validazione
    await existingBikeType.save({ validateModifiedOnly: true });

    res.json({
      success: true,
      message: 'Tipo di bicicletta aggiornato con successo',
      data: existingBikeType
    });
  } catch (error) {
    console.error('Update bike type error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Esiste già un tipo di bicicletta con questo nome'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Errore nell\'aggiornamento del tipo di bicicletta',
      error: error.message
    });
  }
};

// Elimina un tipo di bicicletta
const deleteBikeType = async (req, res) => {
  try {
    const bikeType = await BikeType.findByIdAndDelete(req.params.id);

    if (!bikeType) {
      return res.status(404).json({
        success: false,
        message: 'Tipo di bicicletta non trovato'
      });
    }

    res.json({
      success: true,
      message: 'Tipo di bicicletta eliminato con successo'
    });
  } catch (error) {
    console.error('Delete bike type error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nell\'eliminazione del tipo di bicicletta'
    });
  }
};

// Cerca tipi di biciclette
const searchBikeTypes = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Il parametro di ricerca è obbligatorio'
      });
    }

    const bikeTypes = await BikeType.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
        { model: { $regex: query, $options: 'i' } }
      ]
    });

    res.json({
      success: true,
      count: bikeTypes.length,
      data: bikeTypes
    });
  } catch (error) {
    console.error('Search bike types error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nella ricerca dei tipi di biciclette'
    });
  }
};

module.exports = {
  getAllBikeTypes,
  getBikeType,
  createBikeType,
  updateBikeType,
  deleteBikeType,
  searchBikeTypes
}; 