import mongoose, { Schema } from "mongoose";
import { CategoriaMovimento } from "./categorieMovimenti.entity";

const CategorieMovimentiSchema: Schema = new Schema({
  nomeCategoria: { type: String, required: true },
  tipologia: { type: String, required: true, enum: ["Entrata", "Uscita"] },
});

CategorieMovimentiSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

CategorieMovimentiSchema.set("toObject", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model<CategoriaMovimento>(
  "CategoriaMovimenti",
  CategorieMovimentiSchema,
  "CategorieMovimenti"
);
