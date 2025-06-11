import express from 'express';

const router = express.Router();    

router.get('/me', auth, fetch())
router.get('/users', auth, fetch())
router.post('/register', auth, fetch())
router.post('/login', auth, fetch())
router.put('/verify-email', auth, fetch())

export default router;