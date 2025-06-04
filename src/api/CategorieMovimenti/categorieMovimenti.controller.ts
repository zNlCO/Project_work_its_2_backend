import { Request, Response } from "express";
import CategorieMovimentiService from "./categorieMovimenti.service";

class CategorieMovimentiController {
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const categorie = await CategorieMovimentiService.getCategorieMovimenti();
      res.status(200).json(categorie);
    } catch (error) {
      res.status(500).json({ message: "Errore nel recupero delle categorie" });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const {nomeCategoria, tipologia} = req.body;
      const categoria =
        await CategorieMovimentiService.createCategoriaMovimento(nomeCategoria, tipologia);
      res.status(201).json(categoria);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Errore nella creazione della categoria" });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const categoria =
        await CategorieMovimentiService.updateCategoriaMovimento(
          req.params.id,
          req.body
        );
      if (categoria) {
        res.status(200).json(categoria);
      } else {
        res.status(404).json({ message: "Categoria non trovata" });
      }
    } catch (error) {
      res
        .status(400)
        .json({ message: "Errore nell'aggiornamento della categoria" });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const categoria =
        await CategorieMovimentiService.deleteCategoriaMovimento(req.params.id);
      if (categoria) {
        res.status(200).json({ message: "Categoria eliminata" });
      } else {
        res.status(404).json({ message: "Categoria non trovata" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Errore nella cancellazione della categoria" });
    }
  }
}

export default new CategorieMovimentiController();
