import mongoose, { Schema } from 'mongoose';
import { UserModel } from '../user/user.model';
import { BikeModel } from '../bike/bike.model';
import { AccessoryModel } from '../accessory/accessory.model';
import { InsuranceModel } from '../insurance/insurance.model';
import { StoreModel } from '../store/store.model';

export type PrenotazioneStatus = "Da Ritirare" | "In Corso" | "Riconsegnato";;


const BikeSchema = new Schema({
    id: { type: Schema.Types.ObjectId, required: true, ref: 'BikeModel' },
    quantity: { type: Number, required: true },
    accessori: [{ type: Schema.Types.ObjectId, ref: 'Accessory' }],
    assicurazione: { type: Schema.Types.ObjectId, ref: 'Insurance', default: null, required: false }
});

const PrenotazioneSchema = new mongoose.Schema({
    idUser: { type: Schema.Types.ObjectId, default: null, ref: 'User' },
    bikes: { type: [BikeSchema], required: true },
    start: { type: Date, required: true },
    stop: { type: Date, required: true },
    pickupLocation: { type: Schema.Types.ObjectId, required: true, ref: 'Store' },
    dropLocation: { type: Schema.Types.ObjectId, required: true, ref: 'Store' },
    manutenzione: { type: Boolean, required: true, default: false },
    cancelled: { type: Boolean, required: true, default: false },
    status: {
        type: String,
        enum: ["Cancellato", "In corso", "Completato", "Prenotato","Con Problemi"],
        default: "Prenotato",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 120,
    },
    problems: {
        type: [String],
        default: []
    },
});

export const PrenotazioneModel = mongoose.model('Prenotazione', PrenotazioneSchema);