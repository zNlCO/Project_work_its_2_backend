import express from 'express';


const router = express.Router();

router.use('/auth', categoryPermitRoute);

export default router;