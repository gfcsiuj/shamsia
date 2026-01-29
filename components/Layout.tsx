import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Facebook, Instagram, Linkedin, MapPin, Phone, Mail, GraduationCap } from 'lucide-react';
import MobileBottomNav from './MobileBottomNav';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { settings } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'الدورات', path: '/courses' },
    { name: 'المكتبة', path: '/library' },
    { name: 'المدربون', path: '/instructors' },
    { name: 'من نحن', path: '/about' },
    { name: 'اتصل بنا', path: '/contact' },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Top Bar - Hidden on Mobile */}
      <div className="bg-primary-900 text-white py-2 text-sm hidden lg:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><Phone size={14} /> {settings.contactPhone}</span>
            <span className="flex items-center gap-2"><Mail size={14} /> {settings.contactEmail}</span>
          </div>
          <div className="flex gap-4">
             {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-secondary-500 transition"><Facebook size={14} /></a>}
             {settings.instagramUrl && <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-secondary-500 transition"><Instagram size={14} /></a>}
             {settings.linkedinUrl && <a href={settings.linkedinUrl} className="hover:text-secondary-500 transition"><Linkedin size={14} /></a>}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 md:gap-3">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Shamsia Logo" className="h-10 md:h-12 w-auto" />
              ) : (
                <img src="https://k.top4top.io/p_3662fca071.png" alt="Shamsia Logo" className="h-10 md:h-12 w-auto" />
              )}
              <span className="text-xl md:text-2xl font-bold text-primary-800">شمسية</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium transition-colors duration-200 text-base ${
                    isActive(link.path)
                      ? 'text-primary-600 font-bold'
                      : 'text-slate-600 hover:text-primary-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* CTA & Mobile Menu Button */}
            <div className="flex items-center gap-3 md:gap-4">
              <Link to="/register" className="hidden sm:inline-block px-4 md:px-6 py-2 bg-secondary-500 hover:bg-secondary-600 text-white font-bold rounded-lg transition shadow-md shadow-secondary-500/20 text-sm md:text-base">
                سجل الآن
              </Link>
              <button
                className="lg:hidden text-slate-700 p-1 hover:bg-slate-100 rounded-md transition"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div 
          className={`lg:hidden bg-white border-t border-slate-100 overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`p-3 rounded-lg font-medium ${
                  isActive(link.path) ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/register"
              className="mt-2 w-full text-center px-4 py-3 bg-secondary-500 text-white font-bold rounded-lg sm:hidden"
              onClick={() => setIsMenuOpen(false)}
            >
              تسجيل جديد
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pb-16 lg:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Footer */}
      <footer 
        className="text-white pt-12 md:pt-16 pb-24 lg:pb-8 transition-colors duration-300"
        style={{ backgroundColor: settings.footerBgColor || 'rgb(var(--color-primary-900))', color: settings.footerTextColor || '#ffffff' }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            {/* Column 1: About */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                 <GraduationCap className="text-secondary-500" size={32} />
                 <h3 className="text-2xl font-bold">شمسية</h3>
              </div>
              <p className="text-primary-100 text-sm leading-relaxed" style={{ color: settings.footerTextColor ? `${settings.footerTextColor}cc` : undefined }}>
                {settings.siteDescription || 'منصة شمسية الألكترونية منصة تعمل بأيادٍ عراقية وعربية، هدفها تحقيق مفهوم التنمية المستدامة (SDG).'}
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-6 border-r-4 border-secondary-500 pr-3">روابط سريعة</h4>
              <ul className="space-y-2 text-primary-100" style={{ color: settings.footerTextColor ? `${settings.footerTextColor}cc` : undefined }}>
                <li><Link to="/courses" className="hover:text-secondary-400 transition">جميع الدورات</Link></li>
                <li><Link to="/library" className="hover:text-secondary-400 transition">المكتبة</Link></li>
                <li><Link to="/instructors" className="hover:text-secondary-400 transition">فريق المدربين</Link></li>
                <li><Link to="/about" className="hover:text-secondary-400 transition">الاعتمادات</Link></li>
              </ul>
            </div>

             {/* Column 3: Categories */}
             <div>
              <h4 className="text-lg font-bold mb-6 border-r-4 border-secondary-500 pr-3">التصنيفات</h4>
              <ul className="space-y-2 text-primary-100" style={{ color: settings.footerTextColor ? `${settings.footerTextColor}cc` : undefined }}>
                <li><Link to="/courses" className="hover:text-secondary-400 transition">التقنية والبرمجة</Link></li>
                <li><Link to="/courses" className="hover:text-secondary-400 transition">الأمن السيبراني</Link></li>
                <li><Link to="/courses" className="hover:text-secondary-400 transition">الإدارة والقيادة</Link></li>
                <li><Link to="/courses" className="hover:text-secondary-400 transition">تطوير الذات</Link></li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h4 className="text-lg font-bold mb-6 border-r-4 border-secondary-500 pr-3">تواصل معنا</h4>
              <ul className="space-y-4 text-primary-100" style={{ color: settings.footerTextColor ? `${settings.footerTextColor}cc` : undefined }}>
                <li className="flex items-start gap-3">
                  <MapPin className="text-secondary-500 mt-1 flex-shrink-0" size={18} />
                  <span>{settings.contactAddress || 'العراق، بغداد'}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-secondary-500 flex-shrink-0" size={18} />
                  <span className="ltr">{settings.contactPhone}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="text-secondary-500 flex-shrink-0" size={18} />
                  <span className="break-all">{settings.contactEmail}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-800/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-200" style={{ color: settings.footerTextColor ? `${settings.footerTextColor}99` : undefined }}>
            <p className="text-center md:text-right">{settings.footerText || `جميع الحقوق محفوظة © منصة شمسية ${new Date().getFullYear()}`}</p>
            <div className="flex gap-4">
              {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-secondary-500 hover:text-white transition"><Facebook size={18}/></a>}
              {settings.instagramUrl && <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-secondary-500 hover:text-white transition"><Instagram size={18}/></a>}
              {settings.linkedinUrl && <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2 rounded-full hover:bg-secondary-500 hover:text-white transition"><Linkedin size={18}/></a>}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;