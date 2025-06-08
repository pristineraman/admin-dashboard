# React Admin Dashboard

A full-stack admin dashboard built with React, Vite, Express, and MongoDB. Features a modern UI, authentication, and various admin tools including analytics, task management, and user administration.

## ⚡️ Quick Start Guide

When someone shares this project with you, follow these steps in order:

1. **Install Required Software**

   ```powershell
   # Check if Node.js is installed
   node --version  # Should be v14 or higher

   # Install MongoDB Community Edition from:
   # https://www.mongodb.com/try/download/community
   ```

2. **Set Up MongoDB**

   - Start MongoDB service on your computer
   - For Windows:
     ```powershell
     # Start MongoDB (if not running as a service)
     "C:\Program Files\MongoDB\Server\{version}\bin\mongod.exe"
     ```
   - For MongoDB Compass (Optional but recommended):
     - Download and install [MongoDB Compass](https://www.mongodb.com/try/download/compass)
     - Connect to: `mongodb://localhost:27017`

3. **Project Setup**

   ```powershell
   # 1. Install frontend dependencies
   npm install

   # 2. Setup backend
   cd server
   npm install

   # 3. Create .env file
   $envContent = @"
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/admin-dashboard
   JWT_SECRET=your-secret-key-change-this
   "@
   Set-Content .env $envContent
   ```

4. **Start the Application**

   ```powershell
   # Terminal 1: Start backend server
   cd server
   node index.js

   # Terminal 2: Start frontend
   cd ..  # Go back to project root
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 🚨 Common Setup Issues

1. **"npm run dev" fails**

   - Solution: Make sure you've run `npm install` in the root directory
   - Check if Vite is installed: `npm install -g vite`

2. **Backend won't start**

   - Run `npm install` in the server directory
   - Check if .env file exists in server directory
   - Ensure MongoDB is running
   - Try: `netstat -ano | findstr "5000"` to check if port 5000 is free

3. **MongoDB Issues**

   - Ensure MongoDB service is running
   - Check MongoDB Compass can connect
   - Default connection should work: `mongodb://localhost:27017`

4. **"Token/JWT issues"**
   - Clear browser data/localStorage
   - Check .env has JWT_SECRET set
   - Try registering a new user

## Features

- 🔐 Authentication & Authorization

  - JWT-based authentication
  - Role-based access control (Admin/User)
  - Secure password handling with bcrypt

- 📊 Dashboard & Analytics

  - Data visualization with charts
  - Real-time analytics
  - Activity logging

- 📅 Task Management

  - Kanban board
  - File attachments
  - Task assignments and status tracking

- 👥 User Management

  - User CRUD operations
  - Role management
  - Activity monitoring

- 📆 Calendar

  - Event scheduling
  - Recurring events
  - Event management

- 🎨 UI Features
  - Modern, responsive design
  - Theme customization
  - Interactive data tables

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community)
- Git

## Installation & Setup

1. **Clone the repository**

   ```powershell
   git clone <your-repo-url>
   cd react-admin-vite
   ```

2. **Install Frontend Dependencies**

   ```powershell
   npm install
   ```

3. **Install Backend Dependencies**

   ```powershell
   cd server
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the server directory:

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/admin-dashboard
   JWT_SECRET=your-secret-key
   ```

5. **Start MongoDB**

   - Ensure MongoDB service is running on your system
   - Default URL should be: `mongodb://localhost:27017`

6. **Start the Backend Server**

   ```powershell
   cd server
   node index.js
   ```

   The server will start on http://localhost:5000

7. **Start the Frontend Development Server**
   ```powershell
   # Open a new terminal in the project root
   npm run dev
   ```
   The frontend will start on http://localhost:5173

## Initial Login

After starting the application:

1. Navigate to http://localhost:5173
2. Click "Create Account" to register
3. Create an admin account with:
   - Username: admin
   - Password: (your choice, minimum 6 characters)
   - Role: Admin

## Project Structure

```
react-admin-vite/
├── src/                  # Frontend source code
│   ├── components/       # Reusable components
│   ├── pages/           # Page components
│   ├── utils/           # Utility functions
│   └── theme.js         # Theme configuration
├── server/              # Backend source code
│   ├── index.js         # Express server setup
│   └── uploads/         # File upload directory
└── public/              # Static assets
```

## API Endpoints

- **Auth**

  - POST /api/auth/register
  - POST /api/auth/login

- **Users**

  - GET /api/users
  - POST /api/users
  - PUT /api/users/:id
  - DELETE /api/users/:id

- **Tasks**

  - GET /api/tasks
  - POST /api/tasks
  - PUT /api/tasks/:id
  - POST /api/tasks/:id/attachments

- **Events**
  - GET /api/events
  - POST /api/events

## Common Issues & Solutions

1. **MongoDB Connection Error**

   - Ensure MongoDB is running
   - Check MONGO_URI in .env file
   - Verify network connectivity

2. **JWT Token Issues**

   - Check JWT_SECRET in .env
   - Clear browser localStorage
   - Re-login to the application

3. **File Upload Issues**
   - Ensure uploads directory exists in server/
   - Check file size (limit: 10MB)
   - Verify proper file permissions

## 💾 Required Dependencies

**Frontend (package.json):**

```json
{
  "dependencies": {
    "axios": "^1.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x"
  }
}
```

**Backend (server/package.json):**

```json
{
  "dependencies": {
    "express": "^4.x",
    "mongoose": "^7.x",
    "cors": "^2.x",
    "bcryptjs": "^2.x",
    "jsonwebtoken": "^9.x",
    "dotenv": "^16.x",
    "multer": "^1.x"
  }
}
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
