import { Schema } from 'mongoose';

// Definisce lo schema per il log
const logSchema = new Schema({
  // Indirizzo IP dell'utente
  ipAddress: { type: String, required: true },
  // Data e ora in cui è stato creato il log, di default l'ora attuale
  timestamp: { type: Date, default: Date.now },
  // Indica se l'operazione è andata a buon fine
  success: { type: Boolean, required: true },
  // Specifica quale operazione è stata eseguita
  operationType: { type: String, required: true },
});

// Esporta lo schema per poterlo utilizzare in altre parti dell'applicazione
export default logSchema;
