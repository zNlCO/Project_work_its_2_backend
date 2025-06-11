const mongoose = require('mongoose');

const accessorySchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  }
}, {
  timestamps: true
});

const Accessory = mongoose.model('Accessory', accessorySchema);

module.exports = Accessory; 