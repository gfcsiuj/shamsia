import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Instructors from './pages/Instructors';
import About from './pages/About';
import Contact from './pages/Contact';
import Library from './pages/Library';
import CourseRegister from './pages/CourseRegister';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import InstructorsAdmin from './pages/admin/InstructorsAdmin';
import CoursesAdmin from './pages/admin/CoursesAdmin';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/courses/:id/register" element={<CourseRegister />} />
          <Route path="/register" element={<CourseRegister />} />
          <Route path="/library" element={<Library />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/instructors" 
            element={
              <ProtectedRoute>
                <InstructorsAdmin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/courses" 
            element={
              <ProtectedRoute>
                <CoursesAdmin />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </AuthProvider>
  );
};

export default App;