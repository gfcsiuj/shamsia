import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Award, Users, Info, Phone } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { isDarkMode, t } = useTheme();
  const isActive = (path: string) => location.pathname === path;

  // Navigation items with translation support
  const navItems = [
    { id: 'home', icon: Home, label: t('الرئيسية', 'Home'), path: '/' },
    { id: 'courses', icon: BookOpen, label: t('الدورات', 'Courses'), path: '/courses' },
    { id: 'certificates', icon: Award, label: t('الشهادات', 'Certificates'), path: '/certificates' },
    { id: 'instructors', icon: Users, label: t('المدربين/الخريجين', 'Instructors/Graduates'), path: '/instructors' },
    { id: 'about', icon: Info, label: t('من نحن', 'About'), path: '/about' },
    { id: 'contact', icon: Phone, label: t('اتصل بنا', 'Contact'), path: '/contact' },
  ];

  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t px-2 py-2 flex justify-around items-center z-[100] shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] ${isDarkMode
        ? 'bg-slate-900/95 border-slate-700'
        : 'bg-white/95 border-slate-100'
        }`}
      style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}
    >
      {navItems.map((item) => {
        const active = isActive(item.path);
        return (
          <Link
            key={item.id}
            to={item.path}
            className={`flex flex-col items-center justify-center py-1 px-1.5 transition-all duration-300 relative ${active
              ? 'text-emerald-500'
              : isDarkMode ? 'text-slate-400' : 'text-slate-400'
              }`}
          >
            {active && (
              <span className="absolute -top-2 w-6 h-0.5 bg-emerald-500 rounded-full"></span>
            )}
            <item.icon className={`w-5 h-5 ${active ? 'fill-emerald-100' : ''}`} strokeWidth={active ? 2.5 : 2} />
            <span className={`text-[9px] mt-0.5 whitespace-nowrap ${active ? 'font-black' : 'font-medium'}`}>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default MobileBottomNav;