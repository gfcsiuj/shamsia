import React from 'react';
import { User } from 'lucide-react';
import { Instructor } from '../types';
import { useTheme } from '../context/ThemeContext';

interface InstructorCardProps {
  instructor: Instructor;
  onClick: () => void;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ instructor, onClick }) => {
  const { t } = useTheme();

  return (
    <div
      className="group bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 overflow-hidden flex flex-col items-center cursor-pointer relative hover:-translate-y-2"
      onClick={onClick}
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-b from-emerald-50/50 to-white group-hover:from-emerald-100/50 transition-colors duration-500"></div>

      <div className="relative pt-10 pb-8 px-6 flex flex-col items-center text-center w-full">
        {/* Image Wrapper */}
        <div className="relative mb-5">
          <div className="absolute -inset-2 bg-gradient-to-br from-emerald-200 to-orange-100 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
          <img
            src={instructor.image}
            alt={instructor.name}
            className="relative w-28 h-28 rounded-[1.2rem] object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <h3 className="text-lg font-black text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors relative z-10 italic">
          {instructor.name}
        </h3>
        <p className="text-emerald-600 text-xs font-black uppercase tracking-wide mb-4 relative z-10 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
          {instructor.roles && instructor.roles.length > 0 ? instructor.roles[0] : t('مدرب معتمد', 'Certified Instructor')}
        </p>

        <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed relative z-10 h-[4.5em]">
          {instructor.shortBio || instructor.bio}
        </p>

        <div className="mt-auto w-full pt-4 border-t border-slate-50 relative z-10">
          <button
            className="w-full py-3 px-4 bg-white border-2 border-slate-200 text-slate-600 rounded-xl hover:bg-emerald-600 hover:text-white hover:border-emerald-600 font-black text-sm transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
          >
            <User size={16} />
            <span>{t('عرض الملف الشخصي', 'View Profile')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorCard;
