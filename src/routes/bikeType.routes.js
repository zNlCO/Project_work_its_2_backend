const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth.middleware');
const validateRequest = require('../middleware/validateRequest');
const {
  getAllBikeTypes,
  getBikeType,
  createBikeType,
  updateBikeType,
  deleteBikeType,
  searchBikeTypes
} = require('../controllers/bikeType.controller');

// Validazione per la creazione di un tipo di bicicletta
const createBikeTypeValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Il nome è obbligatorio')
    .isLength({ min: 2, max: 100 })
    .withMessage('Il nome deve essere tra 2 e 100 caratteri'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('La descrizione è obbligatoria'),
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('La marca è obbligatoria'),
  body('model')
    .trim()
    .notEmpty()
    .withMessage('Il modello è obbligatorio'),
  body('year')
    .isInt({ min: 2000, max: new Date().getFullYear() + 1 })
    .withMessage('Anno non valido'),
  body('category')
    .isIn(['mountain', 'road', 'city', 'bmx', 'kids', 'touring'])
    .withMessage('Categoria non valida'),
  body('frameTypes')
    .isArray()
    .withMessage('Le taglie devono essere un array')
    .custom((value) => {
      const validSizes = ['S', 'M', 'L', 'XL'];
      return value.every(size => validSizes.includes(size));
    })
    .withMessage('Taglie non valide'),
  body('pricePerHour')
    .isFloat({ min: 0 })
    .withMessage('Il prezzo orario deve essere maggiore di 0'),
  body('specifications.weight')
    .isFloat({ min: 0 })
    .withMessage('Il peso deve essere maggiore di 0'),
  body('specifications.frameColor')
    .trim()
    .notEmpty()
    .withMessage('Il colore del telaio è obbligatorio'),
  body('specifications.suspension')
    .isIn(['none', 'front', 'full'])
    .withMessage('Tipo sospensione non valido'),
  body('specifications.gears')
    .isInt({ min: 1 })
    .withMessage('Il numero di marce deve essere maggiore di 0'),
  body('images')
    .isArray()
    .withMessage('Le immagini devono essere un array')
    .custom((value) => {
      return value.every(img => img.url && typeof img.url === 'string');
    })
    .withMessage('Ogni immagine deve avere un URL valido')
];

// Validazione per l'aggiornamento di un tipo di bicicletta
const updateBikeTypeValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Il nome deve essere tra 2 e 100 caratteri'),
  body('description')
    .optional()
    .trim(),
  body('brand')
    .optional()
    .trim(),
  body('model')
    .optional()
    .trim(),
  body('year')
    .optional()
    .isInt({ min: 2000, max: new Date().getFullYear() + 1 })
    .withMessage('Anno non valido'),
  body('category')
    .optional()
    .isIn(['mountain', 'road', 'city', 'bmx', 'kids', 'touring'])
    .withMessage('Categoria non valida'),
  body('frameTypes')
    .optional()
    .isArray()
    .withMessage('Le taglie devono essere un array')
    .custom((value) => {
      const validSizes = ['S', 'M', 'L', 'XL'];
      return value.every(size => validSizes.includes(size));
    })
    .withMessage('Taglie non valide'),
  body('pricePerHour')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Il prezzo orario deve essere maggiore di 0'),
  body('specifications.weight')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Il peso deve essere maggiore di 0'),
  body('specifications.frameColor')
    .optional()
    .trim(),
  body('specifications.suspension')
    .optional()
    .isIn(['none', 'front', 'full'])
    .withMessage('Tipo sospensione non valido'),
  body('specifications.gears')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Il numero di marce deve essere maggiore di 0'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Le immagini devono essere un array')
    .custom((value) => {
      return value.every(img => img.url && typeof img.url === 'string');
    })
    .withMessage('Ogni immagine deve avere un URL valido')
];

// Route pubbliche
router.get('/', getAllBikeTypes);
router.get('/search', searchBikeTypes);
router.get('/:id', getBikeType);

// Route protette (solo per operatori)
router.use(protect);
router.use(restrictTo('operator'));

router.post('/', createBikeTypeValidation, validateRequest, createBikeType);
router.put('/:id', updateBikeTypeValidation, validateRequest, updateBikeType);
router.delete('/:id', deleteBikeType);

module.exports = router; 