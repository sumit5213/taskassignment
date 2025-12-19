import express, { Application, Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

// Import Routes
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';

dotenv.config();
connectDB(); 

const app: Application = express();
const server = http.createServer(app);

// Socket.io Setup
export const io = new Server(server, {
  cors: {
    origin: "*", // In production, replace with your Vercel/Netlify URL
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes Integration
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Socket.io Connection & Room Logic
io.on('connection', (socket) => {
  console.log('📡 User connected:', socket.id);

  // Users can join a "room" named after their User ID for targeted notifications
  socket.on('join', (userId: string) => {
    socket.join(userId);
    console.log(`👤 User ${userId} joined their notification room`);
  });

  socket.on('disconnect', () => {
    console.log('👋 User disconnected');
  });
});

// Global 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
}); 