import express from 'express';
import { isAuthenticated } from '../utils/auth/authenticated-middleware';
import { fetchAll, login, me, register, verifyEmail, modifyUser, deleteUser} from './user.controller';
import { validate } from '../utils/validation-middleware';
import { AddUserDTO, LoginDTO } from './user.dto';

const router = express.Router();


router.get('/me', isAuthenticated, me)
router.get('/all', isAuthenticated, fetchAll)
router.post('/register', validate(AddUserDTO), register)
router.post('/login', validate(LoginDTO), login)
router.get('/verify-email/:token', verifyEmail)
router.put('/modify/:id', isAuthenticated, modifyUser)
router.delete('/:id', isAuthenticated, deleteUser)

export default router;