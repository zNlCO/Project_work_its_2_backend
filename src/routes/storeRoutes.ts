import { Router, Request, Response } from 'express';
import { StoreController } from '../controllers/StoreController';

const router = Router();
const storeController = new StoreController();

// GET all stores
router.get('/', (req: Request, res: Response) => storeController.getAll(req, res));

// GET store by ID
router.get('/:id', (req: Request, res: Response) => storeController.getById(req, res));

// POST create new store
router.post('/', (req: Request, res: Response) => storeController.create(req, res));

// PUT update store
router.put('/:id', (req: Request, res: Response) => storeController.update(req, res));

// DELETE store
router.delete('/:id', (req: Request, res: Response) => storeController.delete(req, res));

export default router; 