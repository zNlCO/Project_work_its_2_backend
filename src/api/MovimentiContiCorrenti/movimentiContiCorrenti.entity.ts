import { Document } from "mongoose";

export interface MovimentiContiCorrenti extends Document {
  id?: string;
  contoCorrenteId: string;
  categoriaMovimentoId: string;
  data: Date;
  importo: number;
  saldo: number;
  descrizione: string;
}
