import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { protect } from '../middleware/authMiddleware';
import { AuditLogController } from '../controllers/AuditLogController';

const auditController = new AuditLogController();

const router = Router();
const taskController = new TaskController();

router.use(protect);

router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/dashboard', taskController.getDashboard);
// Added PATCH to match frontend api service
router.patch('/:id', taskController.updateTask); 
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

router.get('/:taskId/logs', auditController.getTaskLogs);

export default router;