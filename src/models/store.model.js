const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  }
}, {
  timestamps: true
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store; 