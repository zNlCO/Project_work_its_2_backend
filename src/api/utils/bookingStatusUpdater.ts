import {PrenotazioneModel} from '../prenotazione/prenotazione.model'; // adatta il path se necessario

export const startBookingStatusUpdater = () => {
  let running = false;

  setInterval(async () => {
    if (running) return;
    running = true;

    const now = new Date();

    try {
      // "Prenotato" → "In corso"
      await PrenotazioneModel.updateMany(
        {
          status: 'Prenotato',
          start: { $lte: now },
          stop: { $gt: now }
        },
        { $set: { status: 'In corso' } }
      );

      // "In corso" → "Completato"
      await PrenotazioneModel.updateMany(
        {
          status: 'In corso',
          stop: { $lte: now }
        },
        { $set: { status: 'Completato' } }
      );
    } catch (err) {
      console.error('[BookingStatusUpdater] Errore:', err);
    } finally {
      running = false;
    }
  }, 120000); // ogni 1 secondo
};
