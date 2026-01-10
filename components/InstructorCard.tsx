import React from 'react';
import { Linkedin, Twitter, User } from 'lucide-react';
import { Instructor } from '../types';

interface InstructorCardProps {
  instructor: Instructor;
  onClick: () => void;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ instructor, onClick }) => {
  return (
    <div 
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden text-center p-6 flex flex-col items-center cursor-pointer animate-fade-in-up"
      onClick={onClick}
    >
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-secondary-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300 scale-125"></div>
        <img 
          src={instructor.image} 
          alt={instructor.name} 
          className="w-32 h-32 rounded-full object-cover border-4 border-slate-50 shadow-md group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-primary-600 transition-colors">{instructor.name}</h3>
      <p className="text-secondary-600 text-sm font-medium mb-4">{instructor.role}</p>
      
      <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
        {instructor.bio}
      </p>
      
      <div className="mt-auto w-full">
         <button 
           className="w-full py-2 px-4 bg-slate-50 text-slate-600 rounded-lg hover:bg-primary-50 hover:text-primary-600 font-bold text-sm transition flex items-center justify-center gap-2 group-hover:shadow-sm border border-slate-100 group-hover:border-primary-100"
         >
           <User size={16} />
           عرض الملف الشخصي
         </button>
      </div>
    </div>
  );
};

export default InstructorCard;