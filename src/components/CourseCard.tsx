import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, ArrowLeft } from 'lucide-react';
import { Course } from '../types';
import { useData } from '../context/DataContext';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { instructors } = useData();
  const instructor = instructors.find(i => i.id === course.instructorId);

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-700 shadow-sm">
          {course.category}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
             <div className="flex items-center gap-1 text-secondary-400">
                <Star size={16} fill="currentColor" />
                <span className="text-white font-bold text-sm">{course.rating}</span>
                <span className="text-white/80 text-xs">({course.studentsCount})</span>
             </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Level & Instructor */}
        <div className="flex justify-between items-start mb-3">
          <span className={`text-xs px-2 py-1 rounded-md ${
            course.level === 'مبتدئ' ? 'bg-green-100 text-green-700' :
            course.level === 'متوسط' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {course.level}
          </span>
          <div className="text-xs text-slate-500 flex items-center gap-1">
             <span className="truncate max-w-[100px]">{instructor?.name}</span>
             {instructor?.image && <img src={instructor.image} alt="" className="w-6 h-6 rounded-full border border-slate-200" />}
          </div>
        </div>

        <Link to={`/courses/${course.id}`}>
          <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 hover:text-primary-600 transition">
            {course.title}
          </h3>
        </Link>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-slate-500 text-sm mb-4">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
             <Users size={16} />
             <span>{course.studentsCount} طالب</span>
          </div>
        </div>

        {/* Footer: Price & Action */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            {course.oldPrice && (
              <span className="text-xs text-slate-400 line-through">
                {course.oldPrice.toLocaleString()} د.ع
              </span>
            )}
            <span className="text-xl font-bold text-primary-700">
              {course.price === 0 ? 'مجاناً' : `${course.price.toLocaleString()} د.ع`}
            </span>
          </div>
          <Link 
            to={`/courses/${course.id}`} 
            className="flex items-center gap-2 bg-slate-50 hover:bg-primary-50 text-primary-700 px-4 py-2 rounded-lg transition text-sm font-semibold group-hover:bg-primary-600 group-hover:text-white"
          >
            تفاصيل
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
