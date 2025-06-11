import express from 'express';
import { fetchDisponibili } from './bike.controller';
import { validate } from '../utils/validation-middleware';
import { FilterDateLocationDTO } from './bike.dto';

const router = express.Router();

// router.get('/:id', auth, fetch())
router.get('/disponibili', validate(FilterDateLocationDTO), fetchDisponibili)
// router.post('/', auth, fetch())
// router.delete('/:id',auth,fetch())

export default router;