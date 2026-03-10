import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Filter, Search, BookOpen } from 'lucide-react';
import { db } from '../lib/firebase';
import CourseCard from '../components/CourseCard';
import { Course } from '../types';
import { useTheme } from '../context/ThemeContext';

const Courses: React.FC = () => {
  const { t, isEnglish } = useTheme();

  const categories = [
    { id: 'All', label: t('الكل', 'All') },
    { id: 'Tech', label: t('تقنية', 'Tech') },
    { id: 'Human Development', label: t('تنمية بشرية', 'Human Development') },
    { id: 'Cyber Security', label: t('أمن سيبراني', 'Cyber Security') },
    { id: 'Admin Skills', label: t('مهارات إدارية', 'Admin Skills') },
    { id: 'Student Skills', label: t('مهارات طلابية', 'Student Skills') },
    { id: 'Solar Energy', label: t('الطاقة الشمسية', 'Solar Energy') },
    { id: 'Electricity', label: t('الكهرباء', 'Electricity') },
    { id: 'Generators', label: t('المولدات الكهربائية', 'Generators') },
    { id: 'Mechanics', label: t('الميكانيك', 'Mechanics') },
    { id: 'Barbering', label: t('الحلاقة', 'Barbering') },
    { id: 'Languages', label: t('لغات', 'Languages') },
    { id: 'Electrical Installations', label: t('تأسيسات كهربائية', 'Electrical Installations') },
  ];

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) setSearchQuery(q);
  }, [location.search]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await db.collection('courses').get();
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) } as Course));
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = (course.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (course.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-24 transition-colors duration-300">
      {/* Header - New Emerald Design */}
      <div className="relative pt-36 pb-20 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-orange-100/40 dark:bg-orange-900/20 rounded-full blur-[80px] animate-blob delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white mb-4 lg:mb-6 italic tracking-tight animate-fade-up">
            {isEnglish ? (
              <>Our <span className="text-gradient">Training Courses</span></>
            ) : (
              <>دوراتنا <span className="text-gradient">التدريبية</span></>
            )}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-lg lg:text-xl max-w-2xl mx-auto font-medium animate-fade-up delay-100">
            {t(
              'تصفح مكتبتنا الواسعة من الدورات التدريبية المصممة لرفع كفاءتك المهنية والشخصية',
              'Browse our extensive library of training courses designed to boost your professional and personal skills'
            )}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6 relative z-20">
        {/* Filter Bar - Compact Design */}
        <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-sm dark:shadow-none p-3 lg:p-4 mb-6 lg:mb-10 border border-slate-100 dark:border-slate-700 max-w-4xl mx-auto">
          <div className="flex flex-col gap-3">
            {/* Top Row: Categories & Filter Icon */}
            <div className="flex items-center gap-3 w-full">
              <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 no-scrollbar justify-start md:justify-center">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl text-xs lg:text-sm font-bold whitespace-nowrap transition-all duration-300 border border-transparent ${selectedCategory === cat.id
                      ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-emerald-600 dark:border-slate-700'
                      }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <Filter className="text-emerald-500 flex-shrink-0 mr-1" size={20} />
            </div>

            {/* Bottom Row: Search */}
            <div className="relative w-full">
              <Search className={`absolute ${isEnglish ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
              <input
                type="text"
                placeholder={t('ابحث عن دورة...', 'Search for a course...')}
                className={`w-full ${isEnglish ? 'pl-11 pr-4' : 'pl-4 pr-11'} py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all duration-300 text-sm font-bold`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-200 dark:border-emerald-900/50 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-10">
            {filteredCourses.map((course, index) => (
              <div key={course.id} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-700">
            <BookOpen size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-2xl font-black text-slate-700 dark:text-slate-200 italic mb-2">
              {t('لا توجد نتائج', 'No Results Found')}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {t('جرب البحث بكلمات مختلفة أو تغيير التصنيف', 'Try searching with different keywords or change the category')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;