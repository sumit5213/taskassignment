import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';

export class TaskController {
  private taskService = new TaskService();

  createTask = async (req: any, res: Response) => {
    try {
      // Use req.user.id from protect middleware for creatorId
      const taskData = { ...req.body, creatorId: req.user.id };
      const task = await this.taskService.createTask(taskData);
      res.status(201).json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  getDashboard = async (req: any, res: Response) => {
    try {
      const userId = req.user.id;
      const tasks = await this.taskService.getAllTasks();

      const dashboard = {
        // Tasks specifically assigned to the user
        assigned: tasks.filter(t => t.assignedToId?._id.toString() === userId),
        // Tasks specifically created by the user
        created: tasks.filter(t => t.creatorId?.toString() === userId),
        // Tasks where dueDate is in the past and status isn't Completed
        overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Completed')
      };

      res.json(dashboard);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  updateTask = async (req: Request, res: Response) => {
    try {
      const task = await this.taskService.updateTask(req.params.id, req.body);
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}