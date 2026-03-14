📚 Smart Library Management System

🚀 A Full-Stack Library Management Platform built for the HCL Hackathon that allows students to browse books, borrow them, and register for courses while enabling administrators to manage books, students, and course data efficiently.

The platform provides a secure role-based system where students interact with library resources and administrators manage the entire system.

👥 Team

Team Name: Xero

Members

Sakshi

Nihar

Sheyash

🧠 Project Overview

Managing library operations manually can be inefficient and difficult to scale. Our system digitizes the entire workflow by providing a centralized platform where:

Students can explore available books and borrow them.

Students can register for academic courses.

Admins can manage books, students, and courses.

Borrow records are automatically maintained.

The system is built using modern full-stack technologies to ensure scalability, security, and maintainability.

⚙️ Tech Stack
Frontend

React

Vite

HTML

CSS

JavaScript

Backend

Node.js

Express.js

Database

MongoDB

Mongoose

Authentication

JSON Web Token (JWT)

Additional Tools

MongoDB Memory Server (for local testing)

REST APIs

🏗️ System Architecture
Frontend (React + Vite)
        │
        │ REST API Requests
        ▼
Backend (Node.js + Express)
        │
        │ Mongoose ODM
        ▼
MongoDB Database

The React frontend communicates with the Node.js backend via REST APIs, and the backend stores and retrieves data from MongoDB using Mongoose.

📂 Project Structure
Backend
backend
│
├── config
│   └── db.js
│
├── controllers
│   ├── authController.js
│   ├── bookController.js
│   ├── borrowController.js
│   ├── courseController.js
│   └── userController.js
│
├── middleware
│   └── authMiddleware.js
│
├── models
│   ├── Book.js
│   ├── BorrowRecord.js
│   ├── Course.js
│   └── User.js
│
├── routes
│   ├── authRoutes.js
│   ├── bookRoutes.js
│   ├── borrowRoutes.js
│   ├── courseRoutes.js
│   └── userRoutes.js
│
├── seed.js
├── server.js
└── package.json
Frontend
frontend
│
├── public
│   ├── favicon.svg
│   └── icons.svg
│
├── src
│   ├── assets
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│
│   ├── components
│   │   └── Layout.jsx
│
│   ├── pages
│   │
│   ├── admin
│   │   ├── BorrowedBooks.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ManageBooks.jsx
│   │   ├── ManageCourses.jsx
│   │   └── ManageStudents.jsx
│   │
│   ├── auth
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   └── student
│       ├── Books.jsx
│       ├── CourseRegistration.jsx
│       └── Dashboard.jsx
│
│   ├── store
│   │   └── AuthContext.jsx
│
│   ├── utils
│   │   └── api.js
│
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
✨ Features
👨‍🎓 Student Features

User registration and login

Browse available books

Borrow books

View borrowed books

Course registration

Student dashboard

👨‍💼 Admin Features

Admin dashboard

Add, update, or delete books

Manage courses

Manage students

Track borrowed books

🔐 Authentication & Security

The system uses JWT (JSON Web Token) based authentication for secure access control.

Authentication Flow

User registers or logs in.

Server validates credentials.

A JWT token is generated and sent to the client.

Client stores the token.

Token is sent in request headers for protected routes.

Example request header:

Authorization: Bearer <JWT_TOKEN>

The authMiddleware verifies the token before allowing access to protected routes.

This ensures:

Secure authentication

Role-based access (Admin / Student)

Protected APIs

🗄️ Database Configuration

The application uses MongoDB as the database.

For development and testing, the project uses MongoDB Memory Server, which automatically creates an in-memory database if no MongoDB URI is provided.

Example (backend/config/db.js):

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI;

        if (!uri || uri.includes('localhost') || uri.includes('127.0.0.1')) {
            console.log('Spinning up in-memory MongoDB instance for local testing...');
            mongoServer = await MongoMemoryServer.create();
            uri = mongoServer.getUri();
        }

        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
🚀 Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/nihar1303/HCL.git
cd HCL
Backend Setup

Navigate to backend directory

cd backend

Install dependencies

npm install

Start backend server

npm start
Frontend Setup

Navigate to frontend directory

cd frontend

Install dependencies

npm install

Run development server

npm run dev

Frontend will run at:

http://localhost:5173
🔗 API Modules

The backend exposes REST APIs for:

Authentication

Books

Borrow Records

Courses

Users

Each module follows a clean MVC architecture.

📈 Future Improvements

Email reminders for book due dates

Book recommendation system

Advanced analytics dashboard

Docker containerization

CI/CD pipeline integration

Cloud deployment

🏆 Hackathon Goal

This project demonstrates:

Full-stack application development

Secure authentication using JWT

REST API architecture

Database integration with MongoDB

Scalable project structure

It aims to simplify library and course management systems for educational institutions.

📜 License

This project is created for educational and hackathon purposes.
