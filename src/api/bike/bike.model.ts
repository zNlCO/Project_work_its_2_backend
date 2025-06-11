import mongoose from "mongoose";

const BikeSchema = new mongoose.Schema({
    idPuntoVendita: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PuntoVendita',
        required: true
    },
    idModello: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Modello',
        required: true
    },
    quantity: { type: Number, required: true }
});

export const BikeModel = mongoose.model('BikeModel', BikeSchema);
