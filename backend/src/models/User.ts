import { Schema, model, Document } from 'mongoose';
import { z } from 'zod';

export interface IUser {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
}

export const RegisterUserDto = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  avatar: z.string().url().optional(),
});

export const LoginUserDto = z.object({
  email: z.string().email(),
  password: z.string(),
});


const userSchema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' }
}, { timestamps: true });

export const User = model<IUserDocument>('User', userSchema);