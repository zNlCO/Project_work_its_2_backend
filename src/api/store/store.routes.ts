import express from 'express';
import { fetchAll, insertStore,modifyStore } from './store.controller';
import { isAuthenticated } from '../utils/auth/authenticated-middleware';

const router = express.Router();

// router.get('/:id', auth, fetch())
router.get('/',fetchAll)
// router.get('/:id/inventory', auth, fetch())
router.post('/',isAuthenticated,insertStore)
router.put('/modify/:id',isAuthenticated,modifyStore)

export default router;