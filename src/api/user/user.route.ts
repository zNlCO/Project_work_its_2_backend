import express from 'express';
import { isAuthenticated } from '../utils/auth/authenticated-middleware';
import { fetchOperatori, login, me, register, verifyEmail,modifyOperator } from './user.controller';
import { validate } from '../utils/validation-middleware';
import { AddUserDTO, LoginDTO } from './user.dto';

const router = express.Router();


router.get('/me', isAuthenticated, me)
router.get('/operators',isAuthenticated, fetchOperatori)
router.post('/register', validate(AddUserDTO), register)
router.post('/login', validate(LoginDTO), login)
router.put('/verify-email/:token', verifyEmail)
router.put('/modify/:id',isAuthenticated,modifyOperator)

export default router;