const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utente è obbligatorio']
  },
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
  frameType: {
    type: String,
    required: [true, 'La taglia è obbligatoria']
  },
  startDate: {
    type: Date,
    required: [true, 'La data di inizio è obbligatoria']
  },
  endDate: {
    type: Date,
    required: [true, 'La data di fine è obbligatoria']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  accessories: [{
    accessory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Accessory',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'La quantità deve essere almeno 1']
    }
  }],
  insurance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Insurance'
  },
  basePrice: {
    type: Number,
    required: [true, 'Il prezzo base è obbligatorio']
  },
  accessoriesPrice: {
    type: Number,
    default: 0
  },
  insurancePrice: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: [true, 'Il prezzo totale è obbligatorio']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'cash']
  },
  paymentId: String,
  damageReport: {
    hasDamage: {
      type: Boolean,
      default: false
    },
    description: String,
    images: [{
      type: String,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+\..+/.test(v);
        },
        message: 'URL immagine non valido'
      }
    }],
    repairCost: {
      type: Number,
      min: [0, 'Il costo di riparazione non può essere negativo']
    }
  },
  notes: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indici
rentalSchema.index({ user: 1 });
rentalSchema.index({ store: 1 });
rentalSchema.index({ status: 1 });
rentalSchema.index({ startDate: 1 });
rentalSchema.index({ endDate: 1 });

// Calcola la durata del noleggio in ore
rentalSchema.virtual('duration').get(function() {
  return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60));
});

// Calcola i prezzi prima del salvataggio
rentalSchema.pre('save', async function(next) {
  if (this.isModified('startDate') || this.isModified('endDate') || 
      this.isModified('accessories') || this.isModified('insurance')) {
    const duration = this.duration;

    // Calcola il prezzo base
    const BikeType = mongoose.model('BikeType');
    const bikeType = await BikeType.findById(this.bikeType);
    this.basePrice = bikeType.pricePerHour * duration;

    // Calcola il prezzo degli accessori
    if (this.accessories && this.accessories.length > 0) {
      const Accessory = mongoose.model('Accessory');
      const accessoryPrices = await Promise.all(
        this.accessories.map(async (acc) => {
          const accessory = await Accessory.findById(acc.accessory);
          return accessory.pricePerHour * duration * acc.quantity;
        })
      );
      this.accessoriesPrice = accessoryPrices.reduce((a, b) => a + b, 0);
    }

    // Calcola il prezzo dell'assicurazione
    if (this.insurance) {
      const Insurance = mongoose.model('Insurance');
      const insurance = await Insurance.findById(this.insurance);
      this.insurancePrice = insurance.pricePerHour * duration;
    }

    // Calcola il prezzo totale
    this.totalPrice = this.basePrice + this.accessoriesPrice + this.insurancePrice;
  }
  next();
});

// Verifica la disponibilità prima del salvataggio
rentalSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('startDate') || this.isModified('endDate')) {
    const BikeAvailability = mongoose.model('BikeAvailability');
    
    // Verifica la disponibilità
    const availability = await BikeAvailability.findOne({
      store: this.store,
      bikeType: this.bikeType
    });

    if (!availability) {
      throw new Error('Bicicletta non disponibile in questo punto vendita');
    }

    // Verifica la disponibilità della taglia
    if (!availability.isFrameTypeAvailable(this.frameType)) {
      throw new Error('Taglia non disponibile');
    }

    // Conta le prenotazioni sovrapposte
    const overlappingRentals = await this.constructor.countDocuments({
      _id: { $ne: this._id }, // escludi il noleggio corrente
      store: this.store,
      bikeType: this.bikeType,
      frameType: this.frameType,
      status: { $nin: ['completed', 'cancelled'] },
      $or: [
        {
          startDate: { $lte: this.endDate },
          endDate: { $gte: this.startDate }
        }
      ]
    });

    const frameTypeStock = availability.frameTypesAvailable
      .find(ft => ft.size === this.frameType);
    const quantityAvailable = frameTypeStock ? frameTypeStock.quantity : 0;

    if (overlappingRentals >= quantityAvailable) {
      throw new Error('Bicicletta non disponibile per il periodo selezionato');
    }
  }
  next();
});

const Rental = mongoose.model('Rental', rentalSchema);

module.exports = Rental; 