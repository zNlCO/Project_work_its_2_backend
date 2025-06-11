import mongoose from "mongoose";

const AccessorySchema = new mongoose.Schema({
  descrizione: {
    type: String,
    required: true,
  },
  prezzo: {
    type: Number,
    required: true,
    min: 0
  }
});

export const AccessoryModel = mongoose.model('Accessory', AccessorySchema);