import { BikeModelModel } from './../bike-model/bike-model.model';
import { StoreModel } from './../store/store.model';
import mongoose from "mongoose";

const BikeSchema = new mongoose.Schema({
    idPuntoVendita: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    idModello: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BikeModelModel',
        required: true
    },
    quantity: { type: Number, required: true }
});

export const BikeModel = mongoose.model('BikeModel', BikeSchema);
