import { Task, ITaskDocument, ITask } from '../models/Task';

export class TaskRepository {
  // Create a task
  async create(taskData: Partial<ITask>): Promise<ITaskDocument> {
    const task = new Task(taskData);
    return await (await task.save()).populate('creatorId assignedToId', 'name email avatar');
  }

  // Get a single task by ID
  async findById(id: string): Promise<ITaskDocument | null> {
    return await Task.findById(id).populate('creatorId assignedToId', 'name email avatar');
  }

  // Get all tasks with optional filters (Status, Priority)
  async findAll(filters: any = {}, sort: any = { dueDate: 1 }): Promise<ITaskDocument[]> {
    return await Task.find(filters)
      .populate('creatorId assignedToId', 'name email avatar')
      .sort(sort);
  }

  // Dashboard Logic: Get tasks assigned to a specific user
  async findByAssignee(userId: string): Promise<ITaskDocument[]> {
    return await Task.find({ assignedToId: userId })
      .populate('creatorId assignedToId', 'name email avatar')
      .sort({ dueDate: 1 });
  }

  // Dashboard Logic: Get tasks created by a specific user
  async findByCreator(userId: string): Promise<ITaskDocument[]> {
    return await Task.find({ creatorId: userId })
      .populate('creatorId assignedToId', 'name email avatar')
      .sort({ createdAt: -1 });
  }

  // Dashboard Logic: Get overdue tasks
  async findOverdue(userId: string): Promise<ITaskDocument[]> {
    return await Task.find({
      assignedToId: userId,
      dueDate: { $lt: new Date() },
      status: { $ne: 'Completed' }
    }).populate('creatorId assignedToId', 'name email avatar');
  }

  // Update task
  async update(id: string, updateData: any): Promise<ITaskDocument | null> {
    return await Task.findByIdAndUpdate(id, updateData, { new: true })
      .populate('creatorId assignedToId', 'name email avatar');
  }

  // Delete task
  async delete(id: string): Promise<ITaskDocument | null> {
    return await Task.findByIdAndDelete(id);
  }
}