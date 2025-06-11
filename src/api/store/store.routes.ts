import express from 'express';

const router = express.Router();    

router.get('/:id', auth, fetch())
router.get('/', auth, fetch())
router.get('/:id/inventory', auth, fetch())
router.post('/',AuthenticatorAssertionResponse,fetch())

export default router;