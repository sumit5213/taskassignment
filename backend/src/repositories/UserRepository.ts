import { IUser, User, IUserDocument } from '../models/User';

export class UserRepository {
  // Find a user by email (useful for Login)
  async findByEmail(email: string): Promise<IUserDocument | null> {
    return await User.findOne({ email });
  }

  // Find a user by ID
  async findById(id: string): Promise<IUserDocument | null> {
    return await User.findById(id).select('-password'); // Exclude password for security
  }

  // Create a new user
  async create(userData: IUser): Promise<IUserDocument> {
    const user = new User(userData);
    return await user.save();
  }

  // Get all users (to populate the "Assign To" dropdown in Frontend)
  async findAll(): Promise<IUserDocument[]> {
    return await User.find().select('name email avatar');
  }

  // Update user profile
  async update(id: string, updateData: Partial<IUser>): Promise<IUserDocument | null> {
    return await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
  }
}