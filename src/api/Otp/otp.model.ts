import mongoose, { Schema, Types } from "mongoose";
import { Otp as OtpEntity } from "./otp.entity";

export const OtpSchema: Schema = new Schema({
  email: String,
  otp: String,
  createdAt: {
    type: Date,
    default: () => new Date(), // Assegna l'orario corrente al campo createdAt
    index: { expires: '5m' } // Questo fa sì che il record venga eliminato automaticamente dopo la scadenza
  },
  valid: {
    type: Boolean,
    default: false
  }
});

OtpSchema.set("toJSON", {
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

OtpSchema.set("toObject", {
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

OtpSchema.pre('save', async function(next) {
  // `this` si riferisce al documento che sta per essere salvato
  const otp = this;
  await mongoose.model<OtpEntity>('OtpModel').deleteMany({ email: otp.email });
  
  if (otp.valid === true) {
    otp.createdAt = undefined; // Rimuovi `createdAt` per non far scadere il documento
  }

  next();
});

export const OtpModel = mongoose.model<OtpEntity>(
  "OtpModel",
  OtpSchema,
  "OtpCodes"
);
