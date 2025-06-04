import { Request, Response } from "express";
import logService from "./log.service";

// Classe che gestisce le richieste HTTP relative ai log
class LogController {
  // Metodo per gestire la creazione di un nuovo log
  async createLog(req: Request, res: Response) {
    const { operationType, success } = req.body; // Aggiungi operationType
    try {
      const ipAddress = req.ip;
      const log = await logService.createLog(ipAddress!, operationType, success);
      return res.status(201).json(log); // Ritorna 201 Created con il log creato
    } catch (error) {
      return res.status(500).json({ message: "Error creating log", error });
    }
  }
}

// Esporta un'istanza della classe LogController
export default new LogController();
