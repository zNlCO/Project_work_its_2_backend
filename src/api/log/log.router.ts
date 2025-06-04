import { Router } from 'express';
import logController from './log.controller';
import { isAuthenticated } from '../../utils/auth/authenticated.middleware';

// Crea un router per gestire le rotte relative ai log
const router = Router();
router.use(isAuthenticated);
// Definisce la rotta POST per creare un nuovo log
router.post('/', logController.createLog);


// Esporta il router per essere utilizzato in altre parti dell'app
export default router;
