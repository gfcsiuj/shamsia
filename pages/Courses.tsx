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
      <div className="bg-primary-900 py-16 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in-down">دوراتنا التدريبية</h1>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto animate-fade-in-up delay-100">
            تصفح مكتبتنا الواسعة من الدورات التدريبية المصممة لرفع كفاءتك المهنية والشخصية
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-scale-in delay-200">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
              <Filter className="text-slate-400 flex-shrink-0" size={20} />
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === cat 
                      ? 'bg-primary-600 text-white shadow-md transform scale-105' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'All' ? 'الكل' : cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="ابحث عن دورة..." 
                className="w-full pl-4 pr-10 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition duration-300"
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