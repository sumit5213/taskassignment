import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Max 100 characters"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  // FIX: Remove .default() and .optional(). Keep it a strict Enum.
  status: z.enum(['To Do', 'In Progress', 'Review', 'Completed']),
  assignedToId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a user"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type TaskFormValues = z.infer<typeof taskSchema>;