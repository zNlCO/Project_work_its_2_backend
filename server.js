const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Importa le rotte
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');

// Usa le rotte con prefisso
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server avviato su http://localhost:${process.env.PORT}`)
    );
  })
  .catch(err => console.error('Errore connessione MongoDB:', err));
