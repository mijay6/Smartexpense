import { Router } from 'express';   
import { login, register, validateToken } from '../controller/auth.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// /api/auth/register
router.post('/register', register);

// /api/auth/login
router.post('/login', login);

// /api/auth/validate - Verify if token is valid
router.get('/validate', authenticateToken, validateToken);

export default router;

