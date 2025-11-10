import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';
import { getAllUsers, getUserById, updateUserRole, deleteUser, getGlobalStats, createUser} from '../controller/admin.controller.js';

const router = Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/stats', getGlobalStats);

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.get('/users/:id', getUserById);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;