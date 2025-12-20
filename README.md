TaskManage App
A robust, real-time task management system featuring a modern dark-themed UI, collaborative workspace, and automated overdue tracking. TaskSync AI provides a seamless experience for teams to assign, track, and manage tasks with instant live updates.

✨ Features
Full Task CRUD - Create, Read, Update, and Delete tasks with a comprehensive set of attributes including Priority, Status, and Due Date.

Real-Time Collaboration - Powered by Socket.io, users see status updates, priority shifts, and new task creations instantly without refreshing.

Smart Dashboard - Dedicated views for tasks assigned to you, tasks created by you, and a specialized column for tracking overdue items.

Instant Notifications - Receive persistent in-app alerts the moment a task is assigned to your account.

Modern UI - A high-contrast, dark-orange themed interface built with Tailwind CSS and DaisyUI components.

🏗️ Architecture
TaskSync AI is built on a modern MERN-like stack with TypeScript for end-to-end type safety:

Frontend (React + Vite)
Vite for lightning-fast development and optimized builds.

TanStack Query for efficient server-state management and automatic UI cache invalidation.

Socket.io Client for handling real-time event listeners and private notification rooms.

Backend (Node.js + Express)
Express.js API with TypeScript for scalable routing.

MongoDB & Mongoose for flexible data modeling and relationship population.

Socket.io Server integrated to handle global broadcasts and targeted user room notifications.

Zod for strict runtime schema validation of task and user data.

🚀 Getting Started
Prerequisites
Node.js 18+

MongoDB instance (Local or Atlas)

Docker and Docker Compose (Optional for containerized setup)

🐳 Docker Initialization (Recommended)
The easiest way to get the full stack running (including MongoDB) is using Docker:

Build and start the containers:

Bash

docker-compose up --build
Access the services:

Frontend: http://localhost:5173

Backend API: http://localhost:5000

MongoDB: mongodb://localhost:27017

Manual Installation
Clone the repository:

Bash

git clone https://github.com/sumit5213/taskassignment.git
cd task-sync-ai
Set up the Backend:

Bash

cd backend
npm install
Create a .env file in the backend folder:

Code snippet

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Set up the Frontend:

Bash

cd ../frontend
npm install
Create a .env file in the frontend folder:

Code snippet

VITE_API_URL=http://localhost:5000/api
🔍 Core Functionality
Task Creation: Users fill out a modal including Title, Description, Due Date, Priority, and Assignee.

Real-Time Pipeline: When a task is saved, the backend emits a task_created event, and the assignee receives a targeted notification.

Dashboard Logic: The dashboard separates tasks into three distinct streams based on the authenticated user's ID: Assigned, Created, and Overdue.

🤝 Contributing
Fork the Project.

Create your Feature Branch (git checkout -b feature/AmazingFeature).

Commit your Changes (git commit -m 'Add some AmazingFeature').

Push to the Branch (git push origin feature/AmazingFeature).

Open a Pull Request.
