import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
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
import LibraryAdmin from './pages/admin/LibraryAdmin';
import Settings from './pages/admin/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import Maintenance from './components/Maintenance';
import LoadingScreen from './components/LoadingScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { VisualEditProvider } from './context/VisualEditContext'; // Import
import VisualEditor from './components/VisualEditor'; // Import

// Component to handle maintenance logic
const MaintenanceGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, loading: themeLoading } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();

  // Show loading screen while fetching settings
  if (themeLoading || authLoading) {
    return <LoadingScreen />;
  }

  const isAdminRoute = location.pathname.startsWith('/admin');

  // If maintenance mode is ON, and user is NOT logged in, and NOT trying to access admin login
  // Note: We allow /admin routes so admins can login and turn it off
  if (settings.maintenanceMode && !user && !isAdminRoute) {
    return <Maintenance />;
  }

  // Wrap content with entrance animation
  return (
    <div className="animate-fade-up" style={{ animationDuration: '0.6s' }}>
      {children}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <VisualEditProvider> {/* Wrap App */}
          <MaintenanceGuard>
            <VisualEditor /> {/* Render Overlay */}
            <Routes>
              {/* Public Routes - Wrapped in Layout */}
              <Route element={<Layout><Outlet /></Layout>}>
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetails />} />
                <Route path="/courses/:id/register" element={<CourseRegister />} />
                <Route path="/register" element={<CourseRegister />} />
                <Route path="/library" element={<Library />} />
                <Route path="/instructors" element={<Instructors />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Route>

              {/* Admin Routes - Standalone (No Public Layout) */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

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
                path="/admin/library"
                element={
                  <ProtectedRoute>
                    <LibraryAdmin />
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

              {/* 404 Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MaintenanceGuard>
        </VisualEditProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
