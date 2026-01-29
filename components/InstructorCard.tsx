
import React from 'react';
import { User, Linkedin, Mail } from 'lucide-react';
import { Instructor } from '../types';

interface InstructorCardProps {
  instructor: Instructor;
  onClick: () => void;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ instructor, onClick }) => {
  return (
    <div 
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col items-center cursor-pointer animate-fade-in-up relative"
      onClick={onClick}
    >
      {/* Background decoration on hover */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-50 to-white group-hover:from-primary-50 group-hover:to-white transition-colors duration-300"></div>

      <div className="relative pt-8 pb-6 px-6 flex flex-col items-center text-center w-full">
        {/* Image Wrapper */}
        <div className="relative mb-4">
          <div className="absolute -inset-1 bg-gradient-to-br from-primary-200 to-accent-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
          <img 
            src={instructor.image} 
            alt={instructor.name} 
            className="relative w-28 h-28 rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-primary-700 transition-colors relative z-10">{instructor.name}</h3>
        <p className="text-secondary-600 text-xs font-bold uppercase tracking-wide mb-4 relative z-10 bg-secondary-50 px-2 py-1 rounded-md">
          {instructor.roles && instructor.roles.length > 0 ? instructor.roles[0] : 'مدرب معتمد'}
        </p>
        
        <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed relative z-10 h-[4.5em]">
          {instructor.shortBio || instructor.bio}
        </p>
        
        <div className="mt-auto w-full pt-4 border-t border-slate-50 relative z-10">
           <button 
             className="w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-primary-600 hover:text-white hover:border-primary-600 font-bold text-sm transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
           >
             <User size={16} />
             <span>عرض الملف الشخصي</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorCard;
