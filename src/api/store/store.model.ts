import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema({
    location: { type: String, required: true }
});

export const StoreModel = mongoose.model('PuntoVendita', StoreSchema);
