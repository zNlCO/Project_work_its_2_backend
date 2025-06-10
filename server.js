const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();


require('./models/User'); // Assicurati che il tuo modello User sia in models/User.js
require('./models/Bike'); // Assicurati che il tuo modello Bike sia in models/Bike.js
require('./models/Modello'); // Assicurati che il tuo modello Modello sia in models/Modello.js
require('./models/PuntoVendita'); // Assicurati che il tuo modello PuntoVendita sia in models/PuntoVendita.js
require('./models/Accessorio'); // ✅ Questo è il tuo Accessorio.js
require('./models/Assicurazione')

const Prenotazione = require('./models/Prenotazione'); // ✅ IMPORTANTE

const app = express();
app.use(express.json());

// Rotte
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');
const prenotazioniRoutes = require('./routes/prenotazioniRoutes');
const puntiVenditaRoutes = require('./routes/puntiVenditaRoutes');
const bikesRoutes = require('./routes/bikesRoutes');
const modelliRoutes = require('./routes/modelliRoutes');

app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api/prenotazioni', prenotazioniRoutes);
app.use('/api/punti-vendita', puntiVenditaRoutes);
app.use('/api/bikes', bikesRoutes);
app.use('/api/modelli', modelliRoutes);

// Funzione per aggiornare gli stati
async function aggiornaStatusPrenotazioni() {
  const now = new Date();
  const prenotazioni = await Prenotazione.find({ cancelled: false });

  for (const prenotazione of prenotazioni) {
    if (now < prenotazione.start) {
      prenotazione.status = 'Da Ritirare';
    } else if (now >= prenotazione.start && now <= prenotazione.stop) {
      prenotazione.status = 'In Corso';
    } else if (now > prenotazione.stop) {
      prenotazione.status = 'Riconsegnato';
    }
    await prenotazione.save();
  }

  console.log(`[${now.toISOString()}] Stati aggiornati`);
}

// Connessione DB e avvio cron job
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server avviato`)
    );

    // ✅ Avvia il cron job dopo la connessione
    setInterval(aggiornaStatusPrenotazioni, 60000);
  })
  .catch(err => console.error('Errore connessione MongoDB:', err));
