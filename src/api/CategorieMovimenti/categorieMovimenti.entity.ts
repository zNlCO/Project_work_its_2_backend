import { Document } from "mongoose";

export interface CategoriaMovimento extends Document {
  id?: string;
  nomeCategoria: string;
  tipologia: string;
}
