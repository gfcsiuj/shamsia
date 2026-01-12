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

// Admin Imports
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import InstructorsManager from './pages/admin/InstructorsManager';
import CoursesManager from './pages/admin/CoursesManager';
import SiteCustomizer from './pages/admin/SiteCustomizer';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <AdminLayout>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="instructors" element={<InstructorsManager />} />
              <Route path="courses" element={<CoursesManager />} />
              <Route path="settings" element={<SiteCustomizer />} />
            </Routes>
          </AdminLayout>
        } />

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id/register" element={<CourseRegister />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/register" element={<CourseRegister />} />
        <Route path="/library" element={<Library />} />
        <Route path="/instructors" element={<Instructors />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Layout>
  );
};

export default App;