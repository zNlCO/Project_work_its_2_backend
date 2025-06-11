import express from 'express';
import userRoutes from './user.routes';
import storeRoutes from './store.routes';
import accessoryRoutes from './accessory.routes';
import insuranceRoutes from './insurance.routes';
import bikeTypeRoutes from './bikeType.routes';
import bikeRoutes from './bike.routes';
import rentalRoutes from './rental.routes';

const router = express.Router();

// Mount routes
router.use('/users', userRoutes);
router.use('/stores', storeRoutes);
router.use('/accessories', accessoryRoutes);
router.use('/insurances', insuranceRoutes);
router.use('/bike-types', bikeTypeRoutes);
router.use('/bikes', bikeRoutes);
router.use('/rentals', rentalRoutes);

// Add other routes here as they are created
// Example:
// router.use('/products', productRoutes);
// router.use('/orders', orderRoutes);

export default router; 