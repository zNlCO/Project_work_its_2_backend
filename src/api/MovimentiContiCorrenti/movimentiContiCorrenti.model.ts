import mongoose, { Schema } from "mongoose";
import { MovimentiContiCorrenti } from "./movimentiContiCorrenti.entity";

const MovimentiContiCorrentiSchema: Schema = new Schema({
  contoCorrenteId: { type: Schema.Types.ObjectId, ref: "ContiCorrenti" },
  categoriaMovimentoId: {
    type: Schema.Types.ObjectId,
    ref: "CategoriaMovimenti",
  },
  data: { type: Date, default: Date.now, require: true },
  importo: { type: Number, require: true },
  saldo: { type: Number },
  descrizione: { type: String, require: true },
});

MovimentiContiCorrentiSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }});

MovimentiContiCorrentiSchema.set("toObject", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model<MovimentiContiCorrenti>(
  "MovimentoContoCorrente",
  MovimentiContiCorrentiSchema,
  "MovimentiContiCorrenti"
);
