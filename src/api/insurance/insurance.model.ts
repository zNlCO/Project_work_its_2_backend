import mongoose from "mongoose";

const InsuranceSchema = new mongoose.Schema({
  descrizione: {
    type: String,
    required: true
  },
  prezzo: {
    type: Number,
    required: true,
    min: 0
  }
});

export const InsuranceModel = mongoose.model('Insurance', InsuranceSchema);