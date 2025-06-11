import express from 'express';
import { isAuthenticated } from '../utils/auth/authenticated-middleware';
import { fetchAll } from './bike-model.controller';

const router = express.Router();

// router.get('/:id', auth, fetch())
router.get('/', fetchAll)
// router.post('/', auth, fetch())
// router.put('/:id/update',auth,fetch())
// router.delete('/:id',auth,fetch())

export default router;