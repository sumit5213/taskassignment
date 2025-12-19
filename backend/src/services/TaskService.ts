import { TaskRepository } from '../repositories/TaskRepository';
import { ITask } from '../models/Task';
import { io } from '../server'; // Import our Socket instance

const taskRepository = new TaskRepository();

export class TaskService {
  async createTask(taskData: Partial<ITask>) {
    const newTask = await taskRepository.create(taskData);

    // REAL-TIME: Notify the assignee immediately
    io.to(newTask.assignedToId.toString()).emit('notification', {
      message: `You have been assigned a new task: ${newTask.title}`,
      taskId: newTask._id
    });

    // REAL-TIME: Update the global list for all users
    io.emit('task_created', newTask);

    return newTask;
  }

  async updateTask(id: string, updateData: any, userId: string) {
    const updatedTask = await taskRepository.update(id, updateData);
    if (!updatedTask) throw new Error('Task not found');

    // REAL-TIME: Broadcast update to everyone
    io.emit('task_updated', updatedTask);

    // REAL-TIME: If assignee changed, notify the new person
    if (updateData.assignedToId) {
      io.to(updateData.assignedToId).emit('notification', {
        message: `A task has been reassigned to you: ${updatedTask.title}`,
      });
    }

    return updatedTask;
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
    // Basic filtering logic for Status and Priority
    const query: any = {};
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;

    return await taskRepository.findAll(query);
  }

  async deleteTask(id: string) {
    const deleted = await taskRepository.delete(id);
    if (deleted) {
      io.emit('task_deleted', id);
    }
    return deleted;
  }
}