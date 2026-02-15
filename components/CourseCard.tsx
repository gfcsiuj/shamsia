import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, ChevronLeft, ChevronRight, BookOpen, User, PlayCircle } from 'lucide-react';
import { Course, Instructor } from '../types';
import { useTheme } from '../context/ThemeContext';
import { db } from '../lib/firebase';

interface CourseCardProps {
  course: Course;
  instructor?: Instructor;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, instructor: propInstructor }) => {
  const { t, isEnglish, isDarkMode } = useTheme();
  const [instructorName, setInstructorName] = useState<string>('');

  // Fetch instructor name if not provided as prop
  useEffect(() => {
    if (propInstructor) {
      setInstructorName(propInstructor.name);
      return;
    }
    const instId = course.instructorIds?.[0];
    if (instId) {
      db.collection('instructors').doc(instId).get().then(doc => {
        if (doc.exists) {
          setInstructorName((doc.data() as any).name || '');
        }
      }).catch(() => { });
    }
  }, [course.instructorIds, propInstructor]);

  // Handle media (use first image or placeholder)
  const imageUrl = course.media && course.media.length > 0 ? course.media[0].url : 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600';

  // Get tag color based on level
  const getTagStyle = () => {
    const level = course.level?.toLowerCase() || '';
    if (level.includes('مبتدئ') || level.includes('beginner')) {
      return { text: 'text-emerald-700 bg-emerald-50 border-emerald-100', label: t('مسار مبتدئ', 'Beginner Path') };
    }
    if (level.includes('متوسط') || level.includes('intermediate')) {
      return { text: 'text-orange-700 bg-orange-50 border-orange-100', label: t('المستوى المتوسط', 'Intermediate Level') };
    }
    if (level.includes('متقدم') || level.includes('advanced')) {
      return { text: 'text-blue-700 bg-blue-50 border-blue-100', label: t('مسار احترافي', 'Professional Path') };
    }
    return { text: 'text-emerald-700 bg-emerald-50 border-emerald-100', label: t('مسار تعليمي', 'Learning Path') };
  };

  const tagStyle = getTagStyle();
  const ChevronIcon = isEnglish ? ChevronRight : ChevronLeft;

  return (
    <div className={`group rounded-[3rem] border shadow-sm overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-3 cursor-pointer ${isDarkMode
      ? 'bg-slate-800 border-slate-700'
      : 'bg-white border-slate-100'
      }`}>
      {/* Image Area */}
      <div className="relative h-64 lg:h-72 overflow-hidden">
        <img
          src={imageUrl}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

        {/* Tag Badge */}
        <div className={`absolute top-6 ${isEnglish ? 'left-6' : 'right-6'} px-4 py-2 backdrop-blur-md rounded-2xl text-[10px] lg:text-xs font-black shadow-lg border italic ${tagStyle.text}`}>
          {tagStyle.label}
        </div>

        {/* Duration Badge */}
        <div className={`absolute bottom-6 ${isEnglish ? 'right-6' : 'left-6'} bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-xl text-white text-[10px] lg:text-xs font-bold flex items-center gap-2 border border-white/10`}>
          <Clock className="w-3.5 h-3.5" /> {course.duration}
        </div>

        {/* Lectures Count Badge */}
        {course.lecturesCount && course.lecturesCount > 0 && (
          <div className={`absolute bottom-6 ${isEnglish ? 'left-6' : 'right-6'} bg-emerald-600/80 backdrop-blur-md px-4 py-2 rounded-xl text-white text-[10px] lg:text-xs font-bold flex items-center gap-2 border border-white/10`}>
            <PlayCircle className="w-3.5 h-3.5" /> {course.lecturesCount} {t('محاضرة', 'Lectures')}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className={`p-8 lg:p-10 ${isEnglish ? 'text-left' : 'text-right'}`}>
        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <span className={`flex items-center gap-2 text-[10px] lg:text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'
            }`}>
            <Users className="w-4 h-4 opacity-50" /> {course.studentsCount || 0} {t('طالب', 'Students')}
          </span>
          <span className="flex items-center gap-2 text-[10px] lg:text-xs font-black text-amber-500 uppercase tracking-widest">
            <Star className="w-4 h-4 fill-current" /> {(course.rating || 0).toFixed(1)}
          </span>
          {instructorName && (
            <span className={`flex items-center gap-2 text-[10px] lg:text-xs font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              <User className="w-3.5 h-3.5" /> {instructorName}
            </span>
          )}
        </div>

        {/* Title */}
        <Link to={`/courses/${course.id}`}>
          <h4 className={`text-xl lg:text-2xl font-black mb-3 group-hover:text-emerald-500 transition-colors leading-snug italic tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
            {course.title}
          </h4>
        </Link>

        {/* Description */}
        <p className={`text-sm leading-relaxed mb-6 line-clamp-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {course.description}
        </p>

        {/* Footer: Price & Action */}
        <div className={`flex items-center justify-between pt-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-50'
          }`}>
          <div className="flex flex-col">
            <span className={`text-[10px] font-black uppercase tracking-widest mb-1 italic ${isDarkMode ? 'text-slate-500' : 'text-slate-400'
              }`}>
              {t('سعر الكورس', 'Course Price')}
            </span>
            {Number(course.oldPrice) > 0 && (
              <span className={`text-xs line-through ${isDarkMode ? 'text-slate-500 decoration-slate-600' : 'text-slate-400 decoration-slate-300'
                }`}>
                {course.oldPrice.toLocaleString()} {t('د.ع', 'IQD')}
              </span>
            )}
            <span className={`text-2xl lg:text-3xl font-black tracking-tighter italic ${isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
              {course.price === 0 ? t('مجاناً', 'Free') : `${course.price.toLocaleString()} ${t('د.ع', 'IQD')}`}
            </span>
          </div>
          <Link
            to={`/courses/${course.id}`}
            className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-xl group-hover:rotate-6 active:scale-90 ${isDarkMode
              ? 'bg-slate-700 text-slate-300'
              : 'bg-slate-100 text-slate-900'
              }`}
          >
            <ChevronIcon className="w-6 h-6 lg:w-7 lg:h-7" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
