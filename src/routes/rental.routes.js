const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth.middleware');
const validateRequest = require('../middleware/validateRequest');
const {
  getAllRentals,
  getRental,
  createRental,
  updateRental,
  cancelRental,
  completeRental,
  updateRentalStatus
} = require('../controllers/rental.controller');

// Validazione per la creazione di un noleggio
const createRentalValidation = [
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
  body('frameType')
    .notEmpty()
    .withMessage('La taglia è obbligatoria'),
  body('startDate')
    .notEmpty()
    .withMessage('La data di inizio è obbligatoria')
    .isISO8601()
    .withMessage('Data di inizio non valida')
    .custom((value) => {
      return new Date(value) >= new Date();
    })
    .withMessage('La data di inizio deve essere futura'),
  body('endDate')
    .notEmpty()
    .withMessage('La data di fine è obbligatoria')
    .isISO8601()
    .withMessage('Data di fine non valida')
    .custom((value, { req }) => {
      return new Date(value) > new Date(req.body.startDate);
    })
    .withMessage('La data di fine deve essere successiva alla data di inizio'),
  body('accessories')
    .optional()
    .isArray()
    .withMessage('Gli accessori devono essere un array'),
  body('accessories.*.accessory')
    .optional()
    .isMongoId()
    .withMessage('ID accessorio non valido'),
  body('accessories.*.quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La quantità deve essere almeno 1'),
  body('insurance')
    .optional()
    .isMongoId()
    .withMessage('ID assicurazione non valido')
];

// Validazione per l'aggiornamento di un noleggio
const updateRentalValidation = [
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Data di inizio non valida')
    .custom((value) => {
      return new Date(value) >= new Date();
    })
    .withMessage('La data di inizio deve essere futura'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Data di fine non valida')
    .custom((value, { req }) => {
      const startDate = req.body.startDate || req.rental.startDate;
      return new Date(value) > new Date(startDate);
    })
    .withMessage('La data di fine deve essere successiva alla data di inizio'),
  body('accessories')
    .optional()
    .isArray()
    .withMessage('Gli accessori devono essere un array'),
  body('accessories.*.accessory')
    .optional()
    .isMongoId()
    .withMessage('ID accessorio non valido'),
  body('accessories.*.quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La quantità deve essere almeno 1'),
  body('insurance')
    .optional()
    .isMongoId()
    .withMessage('ID assicurazione non valido')
];

// Validazione per l'aggiornamento dello stato
const updateStatusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Lo stato è obbligatorio')
    .isIn(['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Stato non valido')
];

// Validazione per il completamento del noleggio
const completeRentalValidation = [
  body('damageReport.hasDamage')
    .optional()
    .isBoolean()
    .withMessage('hasDamage deve essere un booleano'),
  body('damageReport.description')
    .optional()
    .isString()
    .withMessage('La descrizione deve essere una stringa'),
  body('damageReport.images')
    .optional()
    .isArray()
    .withMessage('Le immagini devono essere un array'),
  body('damageReport.images.*')
    .optional()
    .isURL()
    .withMessage('URL immagine non valido'),
  body('damageReport.repairCost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Il costo di riparazione deve essere un numero positivo')
];

// Route pubbliche (per utenti autenticati)
router.use(protect);

router.get('/', getAllRentals);
router.get('/:id', getRental);
router.post('/', createRentalValidation, validateRequest, createRental);
router.put('/:id', updateRentalValidation, validateRequest, updateRental);
router.post('/:id/cancel', cancelRental);

// Route protette (solo per operatori)
router.use(restrictTo('operator'));

router.post('/:id/complete', completeRentalValidation, validateRequest, completeRental);
router.put('/:id/status', updateStatusValidation, validateRequest, updateRentalStatus);

module.exports = router; 