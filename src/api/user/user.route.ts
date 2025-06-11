import express from 'express';

const router = express.Router();    

router.get('/me', auth, fetch())

export default router;