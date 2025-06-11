import mongoose, { Schema } from 'mongoose';

export type PrenotazioneStatus = "Da Ritirare" | "In Corso" | "Riconsegnato";;


const BikeSchema = new Schema({
    id: { type: String, required: true },
    quantity: { type: Number, required: true },
    accessori: [{ type: String }],
    assicurazione: { type: String }
});

const PrenotazioneSchema = new mongoose.Schema({
    idUser: { type: String, required: true },
    bikes: { type: [BikeSchema], required: true },
    start: { type: Date, required: true },
    stop: { type: Date, required: true },
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    manutenzione: { type: Boolean, required: true },
    cancelled: { type: Boolean, required: true },
    status: {
        type: String,
        enum: ["Cancellato", "In corso", "Completato", "Prenotato"],
        required: true
    }
});

export const PrenotazioneModel = mongoose.model('Prenotazione', PrenotazioneSchema);