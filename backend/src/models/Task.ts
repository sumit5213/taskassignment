import { Schema, model, Document, Types } from 'mongoose';
import { z } from 'zod';

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent'
}

export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  COMPLETED = 'Completed'
}

export interface ITask {
  title: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  creatorId: Types.ObjectId;
  assignedToId: Types.ObjectId;
  lastEditedBy?: Types.ObjectId; 
}

export interface ITaskDocument extends ITask, Document {
  createdAt: Date;
  updatedAt: Date;
}

export const CreateTaskDto = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  priority: z.nativeEnum(TaskPriority),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  assignedToId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid User ID format"),
});

export const UpdateTaskDto = CreateTaskDto.partial().extend({
  lastEditedBy: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid User ID format").optional(),
});

const taskSchema = new Schema<ITaskDocument>({
  title: { 
    type: String, 
    required: true, 
    maxlength: 100,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  dueDate: { 
    type: Date, 
    required: true 
  },
  priority: { 
    type: String, 
    enum: Object.values(TaskPriority), 
    default: TaskPriority.MEDIUM 
  },
  status: { 
    type: String, 
    enum: Object.values(TaskStatus), 
    default: TaskStatus.TODO 
  },
  creatorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  assignedToId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  lastEditedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    default: null
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

taskSchema.index({ creatorId: 1 });
taskSchema.index({ assignedToId: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ dueDate: 1 });

export const Task = model<ITaskDocument>('Task', taskSchema);