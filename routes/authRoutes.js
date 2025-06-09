const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mia-chiave-di-default';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Configurazione nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/register', async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email già registrata' });
    }

    // Qui non serve più fare l'hash manuale, Mongoose lo fa nel pre-save
    const user = await User.create({
      ...req.body,
      isVerified: false,
    });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
    const verificationLink = `http://localhost:3001/verify-email?token=${token}`;

    await transporter.sendMail({
      from: `"Bike Rental" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Conferma la tua registrazione',
      html: `
        <p>Ciao ${user.name},</p>
        <p>Grazie per esserti registrato! Clicca il bottone qui sotto per attivare il tuo account:</p>
        <a href="${verificationLink}" style="
          display: inline-block;
          padding: 10px 20px;
          font-size: 16px;
          color: white;
          background-color: #007bff;
          text-decoration: none;
          border-radius: 5px;
        ">Attiva il tuo account</a>
        <p>Il link scade in 24 ore.</p>
      `,
    });

    res.status(201).json({ message: 'Utente registrato. Controlla la tua email per attivare il tuo account.' });
  } catch (err) {
    console.error('Errore register:', err);
    res.status(400).json({ error: err.message });
  }
});


router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.redirect(`${FRONTEND_URL}/verify-email?status=error&message=token_missing`);

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.redirect(`${FRONTEND_URL}/verify-email?status=error&message=user_not_found`);

    if (user.isVerified) {
      return res.redirect(`${FRONTEND_URL}/verify-email?status=already_verified`);
    }

    user.isVerified = true;
    await user.save();

    return res.redirect(`${FRONTEND_URL}/verify-email?status=success`);
  } catch (err) {
    console.error('Errore verifica email:', err);
    return res.redirect(`${FRONTEND_URL}/verify-email?status=error&message=invalid_or_expired_token`);
  }
});





// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ error: 'Credenziali non valide' });

  if (!user.isVerified) {
    return res.status(403).json({ error: 'Verifica l\'email prima di accedere.' });
  }

  const token = jwt.sign({ userId: user._id, isOperator: user.isOperator }, JWT_SECRET);
  res.json({ token });
});

module.exports = router;
