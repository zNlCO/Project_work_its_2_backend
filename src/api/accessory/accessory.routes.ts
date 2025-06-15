import express from 'express';
import { isAuthenticated } from '../utils/auth/authenticated-middleware';
import { fetchAll, modifyAccessory, insertAccessory, deleteAccessory} from './accessory.controller';

const router = express.Router();

router.get('/', fetchAll)
router.put('/update/:id', isAuthenticated, modifyAccessory)
router.post('/', isAuthenticated, insertAccessory)
router.delete('/:id',isAuthenticated,deleteAccessory)

export default router;