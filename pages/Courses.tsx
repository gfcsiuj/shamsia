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
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header - New Emerald Design */}
      <div className="relative pt-36 pb-20 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-orange-100/40 rounded-full blur-[80px] animate-blob delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 italic tracking-tight animate-fade-up">
            {isEnglish ? (
              <>Our <span className="text-gradient">Training Courses</span></>
            ) : (
              <>دوراتنا <span className="text-gradient">التدريبية</span></>
            )}
          </h1>
          <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto font-medium animate-fade-up delay-100">
            {t(
              'تصفح مكتبتنا الواسعة من الدورات التدريبية المصممة لرفع كفاءتك المهنية والشخصية',
              'Browse our extensive library of training courses designed to boost your professional and personal skills'
            )}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6 relative z-20">
        {/* Filter Bar - New Design */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-6 mb-12 border border-slate-100">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Categories */}
            <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
              <Filter className="text-emerald-500 flex-shrink-0" size={22} />
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-6 py-3 rounded-2xl text-sm font-black whitespace-nowrap transition-all duration-300 ${selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xl'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-emerald-600'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className={`absolute ${isEnglish ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={20} />
              <input
                type="text"
                placeholder={t('ابحث عن دورة...', 'Search for a course...')}
                className={`w-full ${isEnglish ? 'pl-12 pr-4' : 'pl-4 pr-12'} py-4 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-300 font-bold`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {filteredCourses.map((course, index) => (
              <div key={course.id} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-2xl font-black text-slate-700 italic mb-2">
              {t('لا توجد نتائج', 'No Results Found')}
            </h3>
            <p className="text-slate-500 font-medium">
              {t('جرب البحث بكلمات مختلفة أو تغيير التصنيف', 'Try searching with different keywords or change the category')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;