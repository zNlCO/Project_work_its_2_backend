import CategorieMovimentiModel from "./categorieMovimenti.model";
import { CategoriaMovimento } from "./categorieMovimenti.entity";

class CategorieMovimentiService {
  public async getCategorieMovimenti(): Promise<CategoriaMovimento[]> {
    return await CategorieMovimentiModel.find();
  }

  public async getByName(nomeCategoria: string): Promise<CategoriaMovimento | null> {
    return await CategorieMovimentiModel.findOne({ nomeCategoria });
  }

  public async getById(categoriaId: string): Promise<CategoriaMovimento | null> {
    console.log(categoriaId);
    const prova = await CategorieMovimentiModel.findOne({ id: categoriaId });
    console.log("aaaaa")
    console.log(prova)
    return prova
  }

  public async createCategoriaMovimento(
    nomeCategoria: string,
    tipologia: string
  ): Promise<CategoriaMovimento> {
    const categoria = new CategorieMovimentiModel({nomeCategoria, tipologia});
    return await categoria.save();
  }

  public async updateCategoriaMovimento(
    id: string,
    data: CategoriaMovimento
  ): Promise<CategoriaMovimento | null> {
    return await CategorieMovimentiModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  public async deleteCategoriaMovimento(
    id: string
  ): Promise<CategoriaMovimento | null> {
    return await CategorieMovimentiModel.findByIdAndDelete(id);
  }
}

export default new CategorieMovimentiService();
