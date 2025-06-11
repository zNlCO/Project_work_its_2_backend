import express from 'express';
import { fetchDisponibili, insertBike } from './bike.controller';
import { validate } from '../utils/validation-middleware';
import { AddBikeDTO, FilterDateLocationDTO } from './bike.dto';
import { isAuthenticated } from '../utils/auth/authenticated-middleware';

const router = express.Router();

// router.get('/:id', auth, fetch())
router.get('/disponibili', validate(FilterDateLocationDTO), fetchDisponibili)
router.post('/', isAuthenticated,validate(AddBikeDTO),insertBike)
// router.delete('/:id',auth,fetch())

export default router;