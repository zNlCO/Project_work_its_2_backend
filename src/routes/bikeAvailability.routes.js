const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth.middleware');
const validateRequest = require('../middleware/validateRequest');
const {
  getAllAvailabilities,
  getAvailability,
  createAvailability,
  updateAvailability,
  deleteAvailability,
  checkAvailabilityForPeriod
} = require('../controllers/bikeAvailability.controller');

// Validazione per la creazione di una disponibilità
const createAvailabilityValidation = [
  body('store')
    .notEmpty()
    .withMessage('Il punto vendita è obbligatorio')
    .isMongoId()
    .withMessage('ID punto vendita non valido'),
  body('bikeType')
    .notEmpty()
    .withMessage('Il tipo di bicicletta è obbligatorio')
    .isMongoId()
    .withMessage('ID tipo bicicletta non valido'),
  body('frameTypesAvailable')
    .isArray()
    .withMessage('Le taglie disponibili devono essere un array')
    .notEmpty()
    .withMessage('Almeno una taglia deve essere specificata'),
  body('frameTypesAvailable.*.size')
    .notEmpty()
    .withMessage('La taglia è obbligatoria'),
  body('frameTypesAvailable.*.quantity')
    .isInt({ min: 0 })
    .withMessage('La quantità deve essere un numero intero non negativo'),
  body('status')
    .optional()
    .isIn(['active', 'maintenance', 'inactive'])
    .withMessage('Stato non valido'),
  body('maintenanceNotes')
    .optional()
    .isString()
    .withMessage('Le note di manutenzione devono essere una stringa')
];

// Validazione per l'aggiornamento di una disponibilità
const updateAvailabilityValidation = [
  body('frameTypesAvailable')
    .optional()
    .isArray()
    .withMessage('Le taglie disponibili devono essere un array')
    .notEmpty()
    .withMessage('Almeno una taglia deve essere specificata'),
  body('frameTypesAvailable.*.size')
    .optional()
    .notEmpty()
    .withMessage('La taglia è obbligatoria'),
  body('frameTypesAvailable.*.quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('La quantità deve essere un numero intero non negativo'),
  body('status')
    .optional()
    .isIn(['active', 'maintenance', 'inactive'])
    .withMessage('Stato non valido'),
  body('maintenanceNotes')
    .optional()
    .isString()
    .withMessage('Le note di manutenzione devono essere una stringa')
];

// Route pubbliche
router.get('/', getAllAvailabilities);
router.get('/check', checkAvailabilityForPeriod);
router.get('/:id', getAvailability);

// Route protette (solo per operatori)
router.use(protect);
router.use(restrictTo('operator'));

router.post('/', createAvailabilityValidation, validateRequest, createAvailability);
router.put('/:id', updateAvailabilityValidation, validateRequest, updateAvailability);
router.delete('/:id', deleteAvailability);

module.exports = router; 