import { Router, Request, Response } from 'express';
import { BikeController } from '../controllers/BikeController';

const router = Router();
const bikeController = new BikeController();

// GET all bikes
router.get('/', (req: Request, res: Response) => bikeController.getAll(req, res));

// GET available bikes (optional storeId query parameter)
router.get('/available', (req: Request, res: Response) => bikeController.getAvailable(req, res));

// GET bikes by store
router.get('/store/:storeId', (req: Request, res: Response) => bikeController.getByStore(req, res));

// GET bikes by type
router.get('/type/:bikeTypeId', (req: Request, res: Response) => bikeController.getByType(req, res));

// GET bike by ID
router.get('/:id', (req: Request, res: Response) => bikeController.getById(req, res));

// POST create new bike
router.post('/', (req: Request, res: Response) => bikeController.create(req, res));

// PUT update bike
router.put('/:id', (req: Request, res: Response) => bikeController.update(req, res));

// DELETE bike
router.delete('/:id', (req: Request, res: Response) => bikeController.delete(req, res));

export default router; 