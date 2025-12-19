import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { IUser } from '../models/User';

const userRepository = new UserRepository();

export class UserService {
  async register(userData: IUser) {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) throw new Error('User already exists');

    // Hash password (Security Requirement)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password!, salt);

    return await userRepository.create({
      ...userData,
      password: hashedPassword,
    });
  }

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    // Compare Hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    // Generate JWT (Session Management Requirement)
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '1d' }
    );

    return { user, token };
  }

  async getUserProfile(id: string) {
    return await userRepository.findById(id);
  }

  async getAllUsers() {
    return await userRepository.findAll();
  }
}