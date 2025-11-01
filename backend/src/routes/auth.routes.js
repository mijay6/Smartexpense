import { Router } from 'express';   
import { login, register, validateToken } from '../controller/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// routes

router.post('/register', register);
router.post('/login', login);

//  Verify if token is valid
router.get('/validate', authenticateToken, validateToken);

export default router;

