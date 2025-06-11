const mongoose = require('mongoose');

const bikeAvailabilitySchema = new mongoose.Schema({
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: [true, 'Il punto vendita è obbligatorio']
  },
  bikeType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BikeType',
    required: [true, 'Il tipo di bicicletta è obbligatorio']
  },
  totalQuantity: {
    type: Number,
    required: [true, 'La quantità totale è obbligatoria'],
    min: [0, 'La quantità non può essere negativa']
  },
  availableQuantity: {
    type: Number,
    required: [true, 'La quantità disponibile è obbligatoria'],
    min: [0, 'La quantità disponibile non può essere negativa'],
    validate: {
      validator: function(v) {
        return v <= this.totalQuantity;
      },
      message: 'La quantità disponibile non può essere maggiore della quantità totale'
    }
  },
  frameTypesAvailable: [{
    size: {
      type: String,
      enum: {
        values: ['S', 'M', 'L', 'XL'],
        message: 'Dimensione telaio non valida'
      }
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'La quantità non può essere negativa']
    }
  }],
  status: {
    type: String,
    enum: {
      values: ['disponibile', 'scorta-bassa', 'esaurito', 'manutenzione'],
      message: 'Stato non valido'
    },
    default: 'disponibile'
  },
  lastInventoryCheck: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'bikeAvailabilities'
});

// Middleware pre-save per aggiornare lo status in base alla quantità
bikeAvailabilitySchema.pre('save', function(next) {
  if (this.availableQuantity === 0) {
    this.status = 'esaurito';
  } else if (this.availableQuantity < this.totalQuantity * 0.2) { // 20% della quantità totale
    this.status = 'scorta-bassa';
  } else {
    this.status = 'disponibile';
  }
  next();
});

// Metodo per verificare la disponibilità di una taglia specifica
bikeAvailabilitySchema.methods.isFrameTypeAvailable = function(frameType, quantity = 1) {
  const frameTypeStock = this.frameTypesAvailable.find(ft => ft.size === frameType);
  return frameTypeStock && frameTypeStock.quantity >= quantity;
};

// Metodo per aggiornare la quantità disponibile
bikeAvailabilitySchema.methods.updateAvailableQuantity = function() {
  this.availableQuantity = this.frameTypesAvailable.reduce((total, ft) => total + ft.quantity, 0);
  return this.save();
};

const BikeAvailability = mongoose.model('BikeAvailability', bikeAvailabilitySchema);

module.exports = BikeAvailability; 