import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema({
  location: { type: String, required: true }
});

module.exports = mongoose.model('PuntoVendita', StoreSchema);
