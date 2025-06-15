import express from 'express';
import { fetchAllbyStore, fetchDisponibili, insertBike,fetchAll,updateBike,deleteBike } from './bike.controller';
import { validate } from '../utils/validation-middleware';
import { AddBikeDTO, FilterDateLocationDTO } from './bike.dto';
import { isAuthenticated } from '../utils/auth/authenticated-middleware';

const router = express.Router();

// router.get('/:id', auth, fetch())
router.get('/:store', isAuthenticated, fetchAllbyStore)
router.post('/disponibili', validate(FilterDateLocationDTO), fetchDisponibili)
router.post('/', isAuthenticated, validate(AddBikeDTO), insertBike)
router.get('/',isAuthenticated,fetchAll);
router.put('/:id',isAuthenticated,updateBike)
router.delete('/:id',isAuthenticated,deleteBike)

export default router;