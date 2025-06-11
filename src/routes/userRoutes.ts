import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const userController = new UserController();

// GET all users
router.get('/', (req, res) => userController.getAll(req, res));

// GET user by ID
router.get('/:id', (req, res) => userController.getById(req, res));

// POST create new user
router.post('/', (req, res) => userController.create(req, res));

// PUT update user
router.put('/:id', (req, res) => userController.update(req, res));

// DELETE user
router.delete('/:id', (req, res) => userController.delete(req, res));

export default router; 