// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'mia-chiave-di-default';


const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token mancante o malformato' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.userId = decoded.userId;
    req.isOperator = decoded.isOperator;

    next();
  } catch (err) {
    console.error('Errore token JWT:', err.message);
    res.status(401).json({ error: 'Token non valido o scaduto' });
  }
};

module.exports = auth;

