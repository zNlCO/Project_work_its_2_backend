import express from 'express';
import { isAuthenticated } from '../utils/auth/authenticated-middleware';
import { fetchAll, insertBikeModel,modifyBikeModel } from './bike-model.controller';

const router = express.Router();

// router.get('/:id', auth, fetch())
router.get('/', fetchAll)
router.post('/', isAuthenticated, insertBikeModel)
router.put('/update/:id',isAuthenticated,modifyBikeModel)
// router.delete('/:id',auth,fetch())

export default router;