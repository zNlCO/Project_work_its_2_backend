import { Router, Request, Response } from 'express';
import { BikeTypeController } from '../controllers/BikeTypeController';

const router = Router();
const bikeTypeController = new BikeTypeController();

// GET all bike types
router.get('/', (req: Request, res: Response) => bikeTypeController.getAll(req, res));

// GET bike type by ID
router.get('/:id', (req: Request, res: Response) => bikeTypeController.getById(req, res));

// POST create new bike type
router.post('/', (req: Request, res: Response) => bikeTypeController.create(req, res));

// PUT update bike type
router.put('/:id', (req: Request, res: Response) => bikeTypeController.update(req, res));

// DELETE bike type
router.delete('/:id', (req: Request, res: Response) => bikeTypeController.delete(req, res));

export default router; 