
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, ArrowLeft, BookOpen } from 'lucide-react';
import { Course, Instructor } from '../types';

interface CourseCardProps {
  course: Course;
  instructor?: Instructor; // Optional instructor data passed from parent
}

const CourseCard: React.FC<CourseCardProps> = ({ course, instructor }) => {

  // Handle media (use first image or placeholder)
  const imageUrl = course.media && course.media.length > 0 ? course.media[0].url : 'https://via.placeholder.com/400x300';

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:border-primary-100 transition-all duration-300 flex flex-col h-full relative">
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Category Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-primary-700 shadow-sm border border-white/50 flex items-center gap-1.5">
          <BookOpen size={12} className="text-secondary-500" />
          {course.category}
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm border border-white/50">
          <Star size={14} className="text-amber-400 fill-amber-400" />
          <span className="text-slate-800 font-bold text-xs">{course.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        {/* Level & Instructor */}
        <div className="flex justify-between items-center mb-4">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${course.level === 'مبتدئ' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
              course.level === 'متوسط' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                'bg-purple-50 text-purple-700 border-purple-100'
            }`}>
            {course.level}
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium truncate max-w-[100px]">{instructor?.name || 'نخبة المدربين'}</span>
            <img
              src={instructor?.image || 'https://via.placeholder.com/100'}
              alt=""
              className="w-7 h-7 rounded-full border border-slate-100 object-cover"
            />
          </div>
        </div>

        <Link to={`/courses/${course.id}`} className="block mb-3">
          <h3 className="text-lg font-bold text-slate-800 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
            {course.title}
          </h3>
        </Link>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-slate-400 text-xs mb-6 mt-auto border-t border-slate-50 pt-4">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
            <Clock size={14} />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
            <Users size={14} />
            <span>{course.studentsCount} طالب</span>
          </div>
        </div>

        {/* Footer: Price & Action */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {course.oldPrice && (
              <span className="text-xs text-slate-400 line-through decoration-slate-300">
                {course.oldPrice.toLocaleString()} د.ع
              </span>
            )}
            <span className="text-lg font-extrabold text-primary-600">
              {course.price === 0 ? 'مجاناً' : `${course.price.toLocaleString()} د.ع`}
            </span>
          </div>
          <Link
            to={`/courses/${course.id}`}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-primary-600 hover:bg-primary-600 hover:text-white transition-all duration-300 group-hover:translate-x-1"
          >
            <ArrowLeft size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
