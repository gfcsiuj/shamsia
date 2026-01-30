import React, { useState, useEffect } from 'react';
import { Filter, Search, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import CourseCard from '../components/CourseCard';
import { Course } from '../types';

const Courses: React.FC = () => {
  const categories = ['All', 'Tech', 'Human Development', 'Cyber Security', 'Admin Skills', 'Student Skills'];
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 py-20 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-72 h-72 bg-secondary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-500/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 animate-fade-in-down">دوراتنا التدريبية</h1>
          <p className="text-primary-100/90 text-lg md:text-xl max-w-2xl mx-auto animate-fade-in-up delay-100 font-light">
            تصفح مكتبتنا الواسعة من الدورات التدريبية المصممة لرفع كفاءتك المهنية والشخصية
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/50 p-6 mb-10 animate-scale-in delay-200 border border-slate-100">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
              <Filter className="text-primary-500 flex-shrink-0" size={22} />
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${selectedCategory === cat
                    ? 'bg-gradient-to-l from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30 transform scale-105'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-primary-600'
                    }`}
                >
                  {cat === 'All' ? 'الكل' : cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-500" size={20} />
              <input
                type="text"
                placeholder="ابحث عن دورة..."
                className="w-full pl-4 pr-12 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all duration-300 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary-600" size={40} />
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, index) => (
              <div key={course.id} className={`animate-fade-in-up delay-${(index % 5) * 100 + 300}`}>
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={40} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700">لا توجد نتائج</h3>
            <p className="text-slate-500">جرب البحث بكلمات مختلفة أو تغيير التصنيف</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;