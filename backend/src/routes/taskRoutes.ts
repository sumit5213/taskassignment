import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { protect } from '../middleware/authMiddleware';

const router = Router();
const taskController = new TaskController();

// All routes here require authentication
router.use(protect);

router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/dashboard', taskController.getDashboard);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;