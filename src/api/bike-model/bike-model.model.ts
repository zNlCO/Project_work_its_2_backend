import mongoose from "mongoose";

const BikeModelSchema = new mongoose.Schema({
  descrizione: { type: String, required: true },
  type: {
    type: String,
    enum: ['Mountain bike', 'City bike', 'Road bike', 'Gravel'],
    required: true
  },
  size: {
    type: String,
    enum: ['S', 'M', 'L', 'XL'],
    required: true
  },
  elettrica: { type: Boolean, required: true },
  prezzo: { type: Number, required: true },
  imgUrl: { type: String }  // campo opzionale per URL immagine
});

module.exports = mongoose.model('BikeModelModel', BikeModelSchema);
