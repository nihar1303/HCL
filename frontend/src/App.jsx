import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Layout from './components/Layout';

// Student Portal Pages
import StudentDashboard from './pages/student/Dashboard';
import Books from './pages/student/Books';
import CourseRegistration from './pages/student/CourseRegistration';

// Admin Portal Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageBooks from './pages/admin/ManageBooks';
import ManageCourses from './pages/admin/ManageCourses';
import ManageStudents from './pages/admin/ManageStudents';
import BorrowedBooks from './pages/admin/BorrowedBooks';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Student Portal Routes */}
        <Route path="/student" element={<Layout allowedRole="student" />}>
          <Route index element={<StudentDashboard />} />
          <Route path="books" element={<Books />} />
          <Route path="courses" element={<CourseRegistration />} />
        </Route>

        {/* Administrator Portal Routes */}
        <Route path="/admin" element={<Layout allowedRole="administrator" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="books" element={<ManageBooks />} />
          <Route path="courses" element={<ManageCourses />} />
          <Route path="students" element={<ManageStudents />} />
          <Route path="borrows" element={<BorrowedBooks />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
