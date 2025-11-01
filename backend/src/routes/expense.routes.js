import { Router } from 'express';
import { getExpenses, getExpense, createExpense, updateExpense, deleteExpense } from '../controller/expense.controller.js'; 
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// all routes below require authentication
router.use(authenticateToken);

// routes
router.get('/', getExpenses);                  
router.get('/:id', getExpense);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;
