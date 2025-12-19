import { Response } from 'express';
import { TaskService } from '../services/TaskService';
import { CreateTaskDto, UpdateTaskDto } from '../models/Task';
import { AuthRequest } from '../middleware/authMiddleware';

const taskService = new TaskService();

export class TaskController {
  async createTask(req: AuthRequest, res: Response) {
    try {
      const validatedData = CreateTaskDto.parse(req.body);
      const task = await taskService.createTask({
        ...validatedData,
        creatorId: req.user?.id as any,
        dueDate: new Date(validatedData.dueDate)
      });
      res.status(201).json(task);
    } catch (error: any) { 
      res.status(400).json({ message: error.message });
    }
  }

  async getTasks(req: AuthRequest, res: Response) {
    try {
      const tasks = await taskService.getAllTasks(req.query);
      res.status(200).json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getDashboard(req: AuthRequest, res: Response) {
    try {
      const data = await taskService.getDashboardData(req.user?.id!);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateTask(req: AuthRequest, res: Response) {
    try {
      const validatedData = UpdateTaskDto.parse(req.body);
      const task = await taskService.updateTask(req.params.id, validatedData, req.user?.id!);
      res.status(200).json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteTask(req: AuthRequest, res: Response) {
    try {
      await taskService.deleteTask(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}