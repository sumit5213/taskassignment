import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { protect } from '../middleware/authMiddleware';

const router = Router();
const userController = new UserController();

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/', protect, userController.getUsers);

export default router;