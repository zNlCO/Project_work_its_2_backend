import express from 'express';
import userRoutes from './user/user.route';

const router = express.Router();

router.use('/auth', userRoutes);

export default router;