const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
require('dotenv').config();
const auth = require('../middleware/auth');

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_ACTIVATE_URL;


// const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'mia-chiave-di-default';

// const auth = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ error: 'Token mancante' });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.userId = decoded.userId;
//     req.isOperator = decoded.isOperator;
//     next();
//   } catch {
//     res.status(401).json({ error: 'Token non valido' });
//   }
// };





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
    const verificationLink = `${FRONTEND_URL}?token=${token}`;

    await transporter.sendMail({
      from: `"Bike Rental" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Conferma la tua registrazione',
      html: `
           <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f7; padding: 40px 0;">
  <tr>
    <td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; padding: 30px; font-family: Arial, sans-serif; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <tr>
          <td style="font-size: 18px; color: #333333;">
            <p style="margin-top: 0;">Ciao ${user.name},</p>
            <p style="margin-bottom: 30px;">Grazie per esserti registrato! Per completare la registrazione, clicca sul bottone qui sotto:</p>

            <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto 30px auto;">
              <tr>
                <td align="center" bgcolor="#4CAF50" style="border-radius: 6px;">
                  <a href="${verificationLink}" target="_blank" style="
                    display: inline-block;
                    padding: 14px 28px;
                    font-size: 16px;
                    font-weight: bold;
                    color: #ffffff;
                    background-color: #4CAF50;
                    text-decoration: none;
                    border-radius: 6px;
                    font-family: Arial, sans-serif;
                  ">Attiva il tuo account</a>
                </td>
              </tr>
            </table>

            <p style="font-size: 14px; color: #777777;">
              Questo link è valido per 24 ore. Se non hai richiesto la registrazione, puoi ignorare questa email.
            </p>

            <p style="font-size: 14px; color: #777777; margin-top: 30px;">Grazie,<br><strong>Il team</strong></p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>


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


router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  if (!user) return res.status(404).json({ error: 'Utente non trovato' });
  res.json(user);
});


router.get('/users', auth, async (req, res) => {
  try {
    // Solo operatori possono accedere a questa rotta
    if (!req.isOperator) {
      return res.status(403).json({ error: 'Accesso negato: non sei un operatore' });
    }

    const users = await User.find().select('-password');
    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'Nessun utente trovato' });
    }

    res.json(users);
  } catch (err) {
    console.error('Errore recupero utenti:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

//TO ADD
// user/list

module.exports = router;