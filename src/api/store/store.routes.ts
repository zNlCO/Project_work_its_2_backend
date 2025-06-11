import express from 'express';
import { fetchAll } from './store.controller';

const router = express.Router();

// router.get('/:id', auth, fetch())
router.get('/', fetchAll)
// router.get('/:id/inventory', auth, fetch())
// router.post('/',AuthenticatorAssertionResponse,fetch())

export default router;