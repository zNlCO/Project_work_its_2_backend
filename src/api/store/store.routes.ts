import express from 'express';
import { fetchAll, insertStore } from './store.controller';
import { isAuthenticated } from '../utils/auth/authenticated-middleware';

const router = express.Router();

// router.get('/:id', auth, fetch())
router.get('/', isAuthenticated,fetchAll)
// router.get('/:id/inventory', auth, fetch())
router.post('/',isAuthenticated,insertStore)

export default router;