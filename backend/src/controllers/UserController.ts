import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { RegisterUserDto, LoginUserDto } from '../models/User';

const userService = new UserService();

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const validatedData = RegisterUserDto.parse(req.body);
      const user = await userService.register(validatedData);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Validation failed' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const validatedData = LoginUserDto.parse(req.body);
      const data = await userService.login(validatedData.email, validatedData.password);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}