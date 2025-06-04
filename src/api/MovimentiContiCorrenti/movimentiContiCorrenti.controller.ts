import { Request, Response } from "express";
import MovimentiContiCorrentiService from "./movimentiContiCorrenti.service";
import categorieMovimentiService from "../CategorieMovimenti/categorieMovimenti.service";
import { Q } from "@faker-js/faker/dist/airline-BBTAAfHZ";

class MovimentiContiCorrentiController {
  // Gestione della richiesta di bonifico (POST)
  public async effettuaBonifico(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      console.log("a")
      // Estrai i dati dal corpo della richiesta
      const { ibanMittente, ibanDestinatario, importo, descrizione } = req.body;
      console.log(req.body);

      // Verifica che tutti i campi necessari siano presenti
      if (!ibanMittente || !ibanDestinatario || !importo || isNaN(importo)) {
        return res.status(400).json({ message: "Dati mancanti o non validi." });
      }

      // Usa il service per eseguire il bonifico
      const result = await MovimentiContiCorrentiService.effettuaBonifico({
        ibanMittente,
        ibanDestinatario,
        importo: parseFloat(importo), // Assicurati che sia un numero
        descrizione,
      });

      // Restituisci il risultato della transazione
      return res.status(200).json(result);
    } catch (error) {
      // Gestione degli errori
      console.error("Errore nell'effettuare il bonifico: ", error);
      return res.status(500).json({
        message: "Errore nel server. Impossibile completare il bonifico.",
      });
    }
  }

  public async getAllUSerMovimenti(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { id } = req.params;
      const movimenti = await MovimentiContiCorrentiService.getAllUSerMovimenti(
        id
      );

      res.json(movimenti);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error as Error });
    }
    return res;
  }

  public async ricaricaTelefonica(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const data: { contocorrenteId; importo; descrizione } = req.body;
      const movimentoRicarica =
        await MovimentiContiCorrentiService.ricaricaTelefonica(data);
      res.json(movimentoRicarica);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error as Error });
    }
    return res;
  }

  public async getSaldoCorrente(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const contoCorrenteId = req.params.contoCorrenteId;
      res.set("Cache-Control", "no-store");

      const saldo = await MovimentiContiCorrentiService.getUserSaldo(
        contoCorrenteId
      );
      res.json(saldo);
      console.log(saldo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error as Error });
    }
    return res;
  }

  public async getUltimoMovimento(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const contoCorrenteId = req.params.contoCorrenteId;
      const ultimoMovimento =
        await MovimentiContiCorrentiService.getUltimoMovimento(contoCorrenteId);
      res.json(ultimoMovimento);
    } catch (error) {
      res.status(500).json({ error: error as Error });
    }
    return res;
  }

  public async addFirstMovimento(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const {contoCorrenteId} = req.body;
      const categoriaMovimento = await categorieMovimentiService.getByName("Apertura conto");
      console.log(categoriaMovimento);
      const movimenti = await MovimentiContiCorrentiService.addFirstMoviemento(
        contoCorrenteId,
        categoriaMovimento?._id
      );
      console.log(movimenti);
      res.json(movimenti);
    } catch (error) {
      res.status(500).json({ error: error as Error });
    }
    return res;
  }
}
export default new MovimentiContiCorrentiController();
