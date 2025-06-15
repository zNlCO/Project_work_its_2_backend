import express from 'express';
import { isAuthenticated } from '../utils/auth/authenticated-middleware';
import { fetchAll, modifyInsurance, insertInsurance, deleteInsurance } from '././insurance.controller';

const router = express.Router();

router.get('/', fetchAll)
router.put('/update/:id', isAuthenticated, modifyInsurance)
router.post('/', isAuthenticated, insertInsurance)
router.delete('/:id',isAuthenticated,deleteInsurance)

export default router;