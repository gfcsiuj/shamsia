import React from 'react';
import { useData } from '../../context/DataContext';
import { Users, BookOpen, Star, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { courses, instructors } = useData();

  const totalStudents = courses.reduce((acc, curr) => acc + curr.studentsCount, 0);

  const stats = [
    { label: 'إجمالي الدورات', value: courses.length, icon: BookOpen, color: 'bg-blue-500' },
    { label: 'إجمالي المدربين', value: instructors.length, icon: Users, color: 'bg-green-500' },
    { label: 'إجمالي الطلاب', value: totalStudents, icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'متوسط التقييم', value: '4.9', icon: Star, color: 'bg-amber-500' },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">لوحة القيادة</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-md`}>
              <stat.icon size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
              <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold mb-4">آخر الدورات المضافة</h2>
          <div className="space-y-4">
            {courses.slice(-3).reverse().map(course => (
              <div key={course.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition">
                <img src={course.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{course.title}</h4>
                  <p className="text-xs text-slate-500">{course.startDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold mb-4">نظرة عامة</h2>
          <div className="flex items-center justify-center h-48 bg-slate-50 rounded-lg text-slate-400">
            مخطط بياني (قريباً)
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
