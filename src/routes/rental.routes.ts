import express from 'express';
import { RentalController } from '../controllers/RentalController';

const router = express.Router();
const rentalController = new RentalController();

// Get all rentals
router.get('/', (req, res) => rentalController.getAllRentals(req, res));

// Get active rentals
router.get('/active', (req, res) => rentalController.getActiveRentals(req, res));

// Get rentals by user
router.get('/user/:userId', (req, res) => rentalController.getRentalsByUser(req, res));

// Get rental by ID
router.get('/:id', (req, res) => rentalController.getRentalById(req, res));

// Create new rental
router.post('/', (req, res) => rentalController.createRental(req, res));

// Update rental
router.put('/:id', (req, res) => rentalController.updateRental(req, res));

// Cancel rental
router.post('/:id/cancel', (req, res) => rentalController.cancelRental(req, res));

// Complete rental
router.post('/:id/complete', (req, res) => rentalController.completeRental(req, res));

export default router; 