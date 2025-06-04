import MovimentiContiCorrenteModel from "./movimentiContiCorrenti.model";
import { ContoCorrente } from "../ContiCorrenti/contiCorrenti.model";
import { MovimentiContiCorrenti } from "./movimentiContiCorrenti.entity";
import movimentiContiCorrentiModel from "./movimentiContiCorrenti.model";

export class MovimentiContiCorrentiService {

  public async addFirstMoviemento(contoCorrenteId: string, categoriaMovimentoId: string | null) {
    const movimento = new MovimentiContiCorrenteModel({
      contoCorrenteId,
      categoriaMovimentoId: categoriaMovimentoId,
      data: new Date(),
      importo: 1000,
      saldo: 1000,
      descrizione: "Apertura conto",
    });
    await movimento.save();
    return movimento;
  }

  // Funzione per ottenere il saldo attuale basato sui movimenti
  private async getSaldoCorrente(contoCorrenteId: string): Promise<number> {
    // Trova il movimento più recente in base alla data
    const ultimoMovimento = await MovimentiContiCorrenteModel.findOne({
      contoCorrenteId,
    })
      .sort({ data: -1 }) // Ordina per data in ordine decrescente (il più recente per primo)
      .exec();

    if (!ultimoMovimento) {
      throw new Error("Nessun movimento trovato per questo conto corrente");
    }

    console.log("Ultimo movimento:", ultimoMovimento);

    // Restituisci il saldo associato all'ultimo movimento
    return ultimoMovimento.saldo;
  }

  // Funzione per gestire il bonifico
  public async effettuaBonifico(data: {
    ibanMittente: string;
    ibanDestinatario: string;
    importo: number;
    descrizione: string;
  }) {
    const { ibanMittente, ibanDestinatario, importo, descrizione } = data;
    console.log(data);
    // Trova i conti correnti del mittente e del destinatario
    const contoMittente = await ContoCorrente.findOne({ IBAN: ibanMittente });
    const contoDestinatario = await ContoCorrente.findOne({
      IBAN: ibanDestinatario,
    });
    console.log(contoMittente, contoDestinatario);

    if (!contoMittente || !contoDestinatario) {
      throw new Error("Conto corrente non trovato");
    }

    // Calcola il saldo corrente del mittente
    const saldoMittente = await this.getSaldoCorrente(
      contoMittente._id.toString()
    );

    // Verifica che il mittente abbia fondi sufficienti
    if (saldoMittente < importo) {
      throw new Error("Fondi insufficienti nel conto del mittente");
    }

    // Crea un movimento di uscita per il mittente
    const movimentoMittente = new MovimentiContiCorrenteModel({
      contoCorrenteId: contoMittente._id,
      categoriaMovimentoId: "66f998bd93cf5d497ba4b9b2", // gestisci correttamente questa categoria
      importo,
      saldo: saldoMittente - importo, // Il nuovo saldo dopo il movimento
      descrizione,
    });
    await movimentoMittente.save();

    // Calcola il saldo corrente del destinatario
    const saldoDestinatario = await this.getSaldoCorrente(
      contoDestinatario._id.toString()
    );

    // Crea un movimento di entrata per il destinatario
    const movimentoDestinatario = new MovimentiContiCorrenteModel({
      contoCorrenteId: contoDestinatario._id,
      categoriaMovimentoId: "66f998b293cf5d497ba4b9af", // gestisci correttamente questa categoria
      importo,
      saldo: saldoDestinatario + importo, // Il nuovo saldo dopo il movimento
      descrizione,
    });
    await movimentoDestinatario.save();

    return { success: true, message: "Bonifico eseguito con successo" };
  }

  public async ricaricaTelefonica(data: {
    contocorrenteId: string;
    importo: number;
    descrizione: string;
  }) {
    if (data.importo <= 0) {
      throw new Error("L'importo deve essere maggiore di zero");
    }

    // Recupera il saldo corrente del conto
    const saldoCorrente = await this.getSaldoCorrente(data.contocorrenteId);
    console.log(`Saldo corrente prima della ricarica: ${saldoCorrente}`);

    // Controlla se ci sono fondi sufficienti
    if (saldoCorrente < data.importo) {
      throw new Error("Fondi insufficienti per effettuare la ricarica");
    }

    // Calcola il nuovo saldo
    const nuovoSaldo = saldoCorrente - data.importo;

    // Crea il movimento per la ricarica telefonica
    const movimento = new MovimentiContiCorrenteModel({
      contoCorrenteId: data.contocorrenteId,
      categoriaMovimentoId: "66f998e293cf5d497ba4b9bb", // Assumi che tu abbia una categoria per le ricariche
      importo: data.importo,
      saldo: nuovoSaldo,
      descrizione: "Ricarica Telefonica",
      // La data viene impostata automaticamente nel modello
    });

    // Salva il movimento
    await movimento.save();

    // Aggiorna il saldo del conto corrente se necessario
    await ContoCorrente.findByIdAndUpdate(data.contocorrenteId, {
      saldo: nuovoSaldo,
    });

    return movimento;
  }

  public async getAllUSerMovimenti(
    contoCorrenteId: string
  ): Promise<MovimentiContiCorrenti[]> {
    // Recupera i movimenti per il conto corrente specificato
    const movimenti = await MovimentiContiCorrenteModel.find({
      contoCorrenteId,
    }).populate('categoriaMovimentoId');
    // Restituisce i movimenti trovati
    return movimenti;
  }

  public async getUserSaldo(contoCorrenteId: string): Promise<number> {
    const saldoContoCorrente = await this.getSaldoCorrente(contoCorrenteId);
    return saldoContoCorrente;
  }

  public async getUltimoMovimento(
    contoCorrenteId: string
  ): Promise<MovimentiContiCorrenti> {
    const ultimoMovimento = await movimentiContiCorrentiModel
      .findOne({
        contoCorrenteId,
      })
      .sort({ data: -1 });

    if (!ultimoMovimento) {
      throw new Error("Nessun movimento trovato per questo conto corrente");
    }

    return ultimoMovimento;
  }
}

export default new MovimentiContiCorrentiService();
