import express from 'express';
import categoryPermitRoute from './category-permit/category-permit.route';
import requestPermitroute from './request-permit/request-permit.route';
import authRouter from './auth/auth.router';

const router = express.Router();

router.use('/category-permit', categoryPermitRoute);
router.use('/request-permit', requestPermitroute);
router.use(authRouter);

export default router;