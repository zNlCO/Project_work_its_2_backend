import express from 'express';
import { isAuthenticated } from '../utils/auth/authenticated-middleware';
import { fetchAll,insertBooking,fetchMie,fetchSingola, insertLoggedBooking, analyticsHome } from './prenotazione.controller';

const router = express.Router();

router.get('/detail/:id', isAuthenticated, fetchSingola)
router.get('/all',isAuthenticated, fetchAll)
router.get('/mie',isAuthenticated, fetchMie)
router.post('/insert', insertBooking)
router.post('/insertLogged', isAuthenticated, insertLoggedBooking)
router.get('/analytics',isAuthenticated,analyticsHome)
//router.put('/update/:id',isAuthenticated,modifyBikeModel)
// router.delete('/:id',auth,fetch())

export default router;