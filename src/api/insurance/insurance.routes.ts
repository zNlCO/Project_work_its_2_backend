import express from 'express';
import { isAuthenticated } from '../utils/auth/authenticated-middleware';
import { fetchAll, modifyInsurance, insertInsurance } from '././insurance.controller';

const router = express.Router();

router.get('/', fetchAll)
router.put('/update/:id', isAuthenticated, modifyInsurance)
router.post('/', isAuthenticated, insertInsurance)

export default router;