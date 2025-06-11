const mongoose = require('mongoose');

const bikeTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Il nome del modello è obbligatorio'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La descrizione del modello è obbligatoria']
  },
  brand: {
    type: String,
    required: [true, 'La marca è obbligatoria'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Il modello è obbligatorio'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, "L'anno del modello è obbligatorio"],
    min: [2000, "L'anno deve essere successivo al 2000"],
    max: [new Date().getFullYear() + 1, "L'anno non può essere futuro"]
  },
  isElectric: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: [true, 'La categoria è obbligatoria'],
    enum: {
      values: ['mountain', 'road', 'city', 'bmx', 'kids', 'touring'],
      message: 'Categoria non valida'
    }
  },
  frameTypes: [{
    type: String,
    enum: {
      values: ['S', 'M', 'L', 'XL'],
      message: 'Dimensione telaio non valida'
    }
  }],
  pricePerHour: {
    type: Number,
    required: [true, "Il prezzo orario è obbligatorio"],
    min: [0, 'Il prezzo non può essere negativo']
  },
  specifications: {
    weight: {
      type: Number,
      required: [true, 'Il peso è obbligatorio'],
      min: [0, 'Il peso deve essere positivo']
    },
    frameColor: {
      type: String,
      required: [true, 'Il colore del telaio è obbligatorio']
    },
    suspension: {
      type: String,
      enum: {
        values: ['none', 'front', 'full'],
        message: 'Tipo sospensione non valido'
      },
      default: 'none'
    },
    gears: {
      type: Number,
      required: [true, 'Il numero di marce è obbligatorio'],
      min: [1, 'Il numero di marce deve essere positivo']
    }
  },
  features: [{
    type: String,
    trim: true
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: 'Immagine bicicletta'
    }
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  maintenanceRequired: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String
  }
}, {
  timestamps: true,
  collection: 'bikeTypes'
});

// Metodo per verificare se una taglia specifica è disponibile
bikeTypeSchema.methods.isFrameTypeAvailable = function(frameType) {
  return this.frameTypes.includes(frameType);
};

const BikeType = mongoose.model('BikeType', bikeTypeSchema);

module.exports = BikeType; 