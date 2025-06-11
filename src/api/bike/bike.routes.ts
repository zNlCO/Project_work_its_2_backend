import express from 'express';

const router = express.Router();    

router.get('/:id', auth, fetch())
router.get('/', auth, fetch())
router.post('/', auth, fetch())
router.delete('/:id',auth,fetch())

export default router;