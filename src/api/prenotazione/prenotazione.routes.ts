import express from 'express';
import { isAuthenticated } from '../utils/auth/authenticated-middleware';
import { fetchAll,insertBooking } from './prenotazione.controller';

const router = express.Router();

// router.get('/:id', auth, fetch())
router.get('/',isAuthenticated, fetchAll)
router.post('/', isAuthenticated, insertBooking)
//router.put('/update/:id',isAuthenticated,modifyBikeModel)
// router.delete('/:id',auth,fetch())

export default router;