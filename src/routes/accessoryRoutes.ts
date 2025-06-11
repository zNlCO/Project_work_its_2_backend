import { Router, Request, Response } from 'express';
import { AccessoryController } from '../controllers/AccessoryController';

const router = Router();
const accessoryController = new AccessoryController();

// GET all accessories
router.get('/', (req: Request, res: Response) => accessoryController.getAll(req, res));

// GET available accessories (optional storeId query parameter)
router.get('/available', (req: Request, res: Response) => accessoryController.getAvailable(req, res));

// GET accessories by store
router.get('/store/:storeId', (req: Request, res: Response) => accessoryController.getByStore(req, res));

// GET accessory by ID
router.get('/:id', (req: Request, res: Response) => accessoryController.getById(req, res));

// POST create new accessory
router.post('/', (req: Request, res: Response) => accessoryController.create(req, res));

// PUT update accessory
router.put('/:id', (req: Request, res: Response) => accessoryController.update(req, res));

// PUT update accessory stock
router.put('/:id/stock', (req: Request, res: Response) => accessoryController.updateStock(req, res));

// DELETE accessory
router.delete('/:id', (req: Request, res: Response) => accessoryController.delete(req, res));

export default router; 