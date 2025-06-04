import { model } from 'mongoose';
import logSchema from './log.entity';

// Crea il modello 'Log' a partire dallo schema
const Log = model('Log', logSchema);

// Esporta il modello per poterlo utilizzare in altre parti dell'applicazione
export default Log;
