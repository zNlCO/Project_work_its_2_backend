import express from 'express';
import { isAuthenticated } from '../utils/auth/authenticated-middleware';
import { fetchAll, modifyAccessory,insertAccessory } from './accessory.controller';

const router = express.Router();

router.get('/', isAuthenticated, fetchAll)
router.put('/update/:id', isAuthenticated,modifyAccessory)
router.post('/',isAuthenticated,insertAccessory)

export default router;