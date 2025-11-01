import { Router } from 'express';
import { getExpenseCategories } from '../controller/category.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/expenses', getExpenseCategories);

export default router;