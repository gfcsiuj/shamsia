import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import Settings from './pages/admin/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/courses" element={<PublicLayout><Courses /></PublicLayout>} />
            <Route path="/courses/:id" element={<PublicLayout><CourseDetails /></PublicLayout>} />
            <Route path="/courses/:id/register" element={<PublicLayout><CourseRegister /></PublicLayout>} />
            <Route path="/register" element={<PublicLayout><CourseRegister /></PublicLayout>} />
            <Route path="/library" element={<PublicLayout><Library /></PublicLayout>} />
            <Route path="/instructors" element={<PublicLayout><Instructors /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
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
            <Route 
              path="/admin/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
          </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;