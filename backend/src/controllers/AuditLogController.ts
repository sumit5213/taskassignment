import { Request, Response } from 'express';
import { AuditLog } from '../models/AuditLog';

export class AuditLogController {
  async getTaskLogs(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      
      const logs = await AuditLog.find({ taskId })
        .populate('userId', 'name email') 
        .sort({ timestamp: -1 }); 

      res.status(200).json(logs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}