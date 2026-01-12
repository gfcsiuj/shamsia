import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Course, Instructor, SiteConfig, Testimonial, Resource } from '../types';
import { COURSES as INITIAL_COURSES, INSTRUCTORS as INITIAL_INSTRUCTORS, TESTIMONIALS, RESOURCES } from '../constants';

interface DataContextType {
  courses: Course[];
  instructors: Instructor[];
  siteConfig: SiteConfig;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updatedCourse: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addInstructor: (instructor: Instructor) => void;
  updateInstructor: (id: string, updatedInstructor: Partial<Instructor>) => void;
  deleteInstructor: (id: string) => void;
  updateSiteConfig: (config: Partial<SiteConfig>) => void;
}

const defaultSiteConfig: SiteConfig = {
  heroTitle: 'طريقك الأمثل لتحقيق الوظيفة الدائمية',
  heroSubtitle: 'منصة شمسية الألكترونية منصة تعمل بأيادٍ عراقية وعربية، هدفها تحقيق مفهوم التنمية المستدامة (SDG).',
  primaryColor: '#047857', // emerald-700
  secondaryColor: '#f59e0b', // amber-500
  contactPhone: '0773 220 0003',
  contactEmail: 'info@shamsia.edu'
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from localStorage if available, otherwise use constants
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('shamsia_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [instructors, setInstructors] = useState<Instructor[]>(() => {
    const saved = localStorage.getItem('shamsia_instructors');
    return saved ? JSON.parse(saved) : INITIAL_INSTRUCTORS;
  });

  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('shamsia_config');
    return saved ? JSON.parse(saved) : defaultSiteConfig;
  });

  // Persist to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('shamsia_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('shamsia_instructors', JSON.stringify(instructors));
  }, [instructors]);

  useEffect(() => {
    localStorage.setItem('shamsia_config', JSON.stringify(siteConfig));
    // Update CSS variables for live color changes
    document.documentElement.style.setProperty('--color-primary', siteConfig.primaryColor);
    document.documentElement.style.setProperty('--color-secondary', siteConfig.secondaryColor);
  }, [siteConfig]);

  // --- Actions ---

  const addCourse = (course: Course) => {
    setCourses([...courses, course]);
  };

  const updateCourse = (id: string, updatedCourse: Partial<Course>) => {
    setCourses(courses.map(c => c.id === id ? { ...c, ...updatedCourse } : c));
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const addInstructor = (instructor: Instructor) => {
    setInstructors([...instructors, instructor]);
  };

  const updateInstructor = (id: string, updatedInstructor: Partial<Instructor>) => {
    setInstructors(instructors.map(i => i.id === id ? { ...i, ...updatedInstructor } : i));
  };

  const deleteInstructor = (id: string) => {
    // Optional: Check if instructor has courses before deleting
    setInstructors(instructors.filter(i => i.id !== id));
  };

  const updateSiteConfig = (config: Partial<SiteConfig>) => {
    setSiteConfig({ ...siteConfig, ...config });
  };

  return (
    <DataContext.Provider value={{
      courses,
      instructors,
      siteConfig,
      addCourse,
      updateCourse,
      deleteCourse,
      addInstructor,
      updateInstructor,
      deleteInstructor,
      updateSiteConfig
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
