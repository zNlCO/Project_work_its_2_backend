import express from 'express';
import userRoutes from './user/user.route';
// import bikeRoutes from './bike/bike.routes';
// import bikeModelRoutes from './bike-model/bike-model.routes';
// import accessoryRoutes from './accessory/accessory.routes';
// import insuranceRoutes from './insurance/insurance.routes';
import storeRoutes from './store/store.routes';

const router = express.Router();

router.use('/auth', userRoutes);
// router.use('/bikes', bikeRoutes);
// router.use('/bikes-model', bikeModelRoutes);
// router.use('/accessory', accessoryRoutes);
// router.use('/insurance', insuranceRoutes);
router.use('/store', storeRoutes);


export default router;