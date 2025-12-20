import { TaskRepository } from '../repositories/TaskRepository';
import { ITask, ITaskDocument } from '../models/Task';
import { AuditLog } from '../models/AuditLog'; 
import { io } from '../server';

const taskRepository = new TaskRepository();

export class TaskService {
  async createTask(taskData: Partial<ITask>) {
    const newTask = await taskRepository.create(taskData);

    io.to(newTask.assignedToId.toString()).emit('notification', {
      message: `You have been assigned a new task: ${newTask.title}`,
      taskId: newTask._id
    });

    io.emit('task_updated'); 
    return newTask;
  }

  async updateTask(id: string, updateData: any, userId: string): Promise<ITaskDocument> {
    const existingTask = await taskRepository.findById(id);
    if (!existingTask) throw new Error('Task not found');

    const previousStatus = existingTask.status;

    const dataWithAuditor = {
      ...updateData,
      lastEditedBy: userId 
    };

    const updatedTask = await taskRepository.update(id, dataWithAuditor);

    // Audit Logging Logic
    if (updateData.status && updateData.status !== previousStatus) {
      await AuditLog.create({
        taskId: id,
        userId: userId,
        action: 'STATUS_CHANGE',
        previousStatus: previousStatus,
        newStatus: updateData.status,
        timestamp: new Date()
      });
    }

    io.emit('task_updated'); 
    return updatedTask!;
  }

  async getDashboardData(userId: string) {
    const [assigned, created, overdue] = await Promise.all([
      taskRepository.findByAssignee(userId),
      taskRepository.findByCreator(userId),
      taskRepository.findOverdue(userId)
    ]);

    return { assigned, created, overdue };
  }

  async getAllTasks(filters: any) {
    const query: any = {};
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    return await taskRepository.findAll(query);
  }

  async deleteTask(id: string) {
    const deleted = await taskRepository.delete(id);
    if (deleted) io.emit('task_updated');
    return deleted;
  }

  async getTaskAuditLogs(taskId: string) {
    return await AuditLog.find({ taskId })
      .populate('userId', 'name email')
      .sort({ timestamp: -1 });
  }
}