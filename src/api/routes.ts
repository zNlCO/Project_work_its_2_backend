import express from 'express';
import userRoutes from './user/user.route';
import bikeRoutes from './bike/bike.routes';
import bikeModelRoutes from './bike-model/bike-model.routes';
import accessoryRoutes from './accessory/accessory.routes';
import insuranceRoutes from './insurance/insurance.routes';
import storeRoutes from './store/store.routes';
import prenotazioneRoutes from './prenotazione/prenotazione.routes';

const router = express.Router();

router.use('/auth', userRoutes);
router.use('/bikes', bikeRoutes);
router.use('/bike-model', bikeModelRoutes);
router.use('/accessories', accessoryRoutes);
router.use('/insurances', insuranceRoutes);
router.use('/store', storeRoutes);
router.use('/bookings',prenotazioneRoutes);

export default router;