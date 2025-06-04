import Log from './log.model';

// Classe che gestisce la logica di business per i log
class LogService {
  // Metodo per creare un nuovo log
  async createLog(ipAddress: string, operationType: string, success: boolean) {
    const log = new Log({ ipAddress, operationType, success });
    return await log.save();
  }

  // Metodo per ottenere tutti i log
  async findAllLogs() {
    return await Log.find();
  }
}

// Esporta un'istanza della classe LogService
export default new LogService();
