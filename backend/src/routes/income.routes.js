import { Router } from 'express';
import { getIncomes, getIncome, createIncome, updateIncome, deleteIncome} from '../controller/income.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getIncomes);
router.get('/:id', getIncome);
router.post('/', createIncome);
router.put('/:id', updateIncome);
router.delete('/:id', deleteIncome);

export default router;
