import React from 'react';
import { Linkedin, Twitter } from 'lucide-react';
import { Instructor } from '../types';

interface InstructorCardProps {
  instructor: Instructor;
  onClick?: () => void;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ instructor, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 overflow-hidden text-center p-6 flex flex-col items-center"
      onClick={onClick}
    >
      <div className="relative mb-4 group cursor-pointer">
        <div className="absolute inset-0 bg-secondary-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        <img 
          src={instructor.image} 
          alt={instructor.name} 
          className="w-32 h-32 rounded-full object-cover border-4 border-slate-50 shadow-md"
        />
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-1">{instructor.name}</h3>
      <p className="text-secondary-600 text-sm font-medium mb-3">{instructor.role}</p>
      
      <p className="text-slate-500 text-sm mb-6 line-clamp-3">
        {instructor.bio}
      </p>
      
      <div className="mt-auto flex gap-4">
        <button className="text-slate-400 hover:text-[#0077b5] transition">
          <Linkedin size={20} />
        </button>
        <button className="text-slate-400 hover:text-[#1DA1F2] transition">
          <Twitter size={20} />
        </button>
      </div>
    </div>
  );
};

export default InstructorCard;
