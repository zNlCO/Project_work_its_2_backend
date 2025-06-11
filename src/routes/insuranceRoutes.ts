import { Router, Request, Response } from 'express';
import { InsuranceController } from '../controllers/InsuranceController';

const router = Router();
const insuranceController = new InsuranceController();

// GET all insurances
router.get('/', (req: Request, res: Response) => insuranceController.getAll(req, res));

// GET insurance by ID
router.get('/:id', (req: Request, res: Response) => insuranceController.getById(req, res));

// POST create new insurance
router.post('/', (req: Request, res: Response) => insuranceController.create(req, res));

// PUT update insurance
router.put('/:id', (req: Request, res: Response) => insuranceController.update(req, res));

// DELETE insurance
router.delete('/:id', (req: Request, res: Response) => insuranceController.delete(req, res));

export default router; 