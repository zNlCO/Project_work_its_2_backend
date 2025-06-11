import express from 'express';
import { isAuthenticated } from '../utils/auth/authenticated-middleware';
import { login, me, register } from './user.controller';

const router = express.Router();   
 

router.get('/me', isAuthenticated, me)
router.get('/users', fetchAll)
router.post('/register', register)
router.post('/login', login)
router.put('/verify-email', verifyEmail)

export default router;