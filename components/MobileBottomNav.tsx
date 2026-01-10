import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Library, Users, Info, Phone } from 'lucide-react';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: 'الرئيسية', path: '/', icon: Home },
    { name: 'الدورات', path: '/courses', icon: BookOpen },
    { name: 'المكتبة', path: '/library', icon: Library },
    { name: 'المدربون', path: '/instructors', icon: Users },
    { name: 'من نحن', path: '/about', icon: Info },
    { name: 'اتصل بنا', path: '/contact', icon: Phone },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] z-50 lg:hidden pb-safe animate-fade-in-up">
      <div className="flex justify-between items-center h-16 px-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 active:scale-95 ${
              isActive(item.path) 
                ? 'text-primary-600' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive(item.path) ? 'bg-primary-50 -translate-y-1 shadow-sm' : ''}`}>
               <item.icon size={isActive(item.path) ? 20 : 18} strokeWidth={isActive(item.path) ? 2.5 : 2} />
            </div>
            <span className={`text-[9px] sm:text-[10px] mt-0.5 whitespace-nowrap ${isActive(item.path) ? 'font-bold' : 'font-medium'}`}>
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileBottomNav;