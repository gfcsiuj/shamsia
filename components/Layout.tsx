import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Facebook, Instagram, MessageCircle, MapPin, Phone, Mail, Search, Send, ChevronLeft, Moon, Sun, Globe } from 'lucide-react';
import MobileBottomNav from './MobileBottomNav';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const location = useLocation();

  // Use global theme context
  const { settings, isDarkMode, setIsDarkMode, isEnglish, setIsEnglish, t } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  // Navigation links with translation
  const navLinks = [
    { name: t('الرئيسية', 'Home'), path: '/' },
    { name: t('الدورات', 'Courses'), path: '/courses' },
    { name: t('المكتبة', 'Library'), path: '/library' },
    { name: t('المدربون', 'Instructors'), path: '/instructors' },
    { name: t('من نحن', 'About'), path: '/about' },
    { name: t('اتصل بنا', 'Contact'), path: '/contact' },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(t(`شكراً لاشتراكك! تم إرسال رسالة تأكيد إلى ${email}`, `Thank you! A confirmation has been sent to ${email}`));
      setEmail('');
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Header - Glassmorphism Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${isScrolled
          ? 'glass-nav py-3 shadow-md backdrop-blur-xl border-b'
          : 'py-4 lg:py-6 backdrop-blur-sm shadow-sm'
          }`}
      >
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl flex justify-between items-center">
          <div className="flex items-center gap-6 lg:gap-12">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src="https://k.top4top.io/p_3662fca071.png"
                alt="شمسية"
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl object-contain shadow-lg group-hover:rotate-[15deg] transition-all duration-500 shadow-emerald-200"
              />
              <span className="text-xl lg:text-2xl font-black tracking-tighter italic">
                {settings.siteName || 'شمسية'}
              </span>
            </Link>

            {/* Desktop Navigation - All tabs */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm xl:text-base font-bold transition-colors relative group py-2 ${isActive(link.path) ? 'text-emerald-600' : 'hover:text-emerald-600'
                    }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 right-0 h-0.5 bg-emerald-600 transition-all duration-300 ${isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            {/* Search Bar */}
            <div className="hidden md:flex items-center rounded-xl px-3 py-2.5 border focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all group w-40 lg:w-48 bg-slate-50 border-slate-200">
              <Search className="w-4 h-4 group-focus-within:text-emerald-600 ml-2 text-slate-400" />
              <input
                type="text"
                placeholder={t("بحث...", "Search...")}
                className="bg-transparent border-none outline-none text-sm w-full font-medium placeholder:text-slate-400"
              />
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-xl transition-all duration-300 ${isDarkMode
                ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              aria-label="Toggle Theme"
              title={t("تغيير المظهر", "Toggle Theme")}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Language Toggle Button */}
            <button
              onClick={() => setIsEnglish(!isEnglish)}
              className={`p-2.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 ${isDarkMode
                ? 'bg-slate-700 text-emerald-400 hover:bg-slate-600'
                : 'bg-slate-100 text-emerald-600 hover:bg-slate-200'
                }`}
              aria-label="Toggle Language"
              title={t("تغيير اللغة", "Change Language")}
            >
              <Globe size={16} />
              <span className="text-xs font-black">{isEnglish ? 'AR' : 'EN'}</span>
            </button>

            {/* CTA Button */}
            <Link
              to="/register"
              className="hidden sm:block px-4 lg:px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:shadow-emerald-200/50 transition-all active:scale-95"
            >
              {t('سجل الآن', 'Register')}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-1.5 rounded-lg transition hover:bg-slate-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div
          className={`lg:hidden border-t border-slate-100 overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`p-3 rounded-xl font-bold ${isActive(link.path) ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-50'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/register"
              className="mt-2 w-full text-center px-4 py-3 bg-emerald-600 text-white font-bold rounded-xl"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('تسجيل جديد', 'Register Now')}
            </Link>
          </nav>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pb-20 lg:pb-0 pt-16 lg:pt-20">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Footer - Modern Design */}
      <footer className="pt-20 pb-28 lg:pb-10 border-t border-slate-100 px-4 lg:px-6 text-center lg:text-right">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
            {/* Brand Column */}
            <div className="col-span-1">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6 group cursor-pointer">
                <img
                  src="https://k.top4top.io/p_3662fca071.png"
                  alt="شمسية"
                  className="w-10 h-10 rounded-xl object-contain shadow-lg group-hover:shadow-emerald-200 transition-all duration-500"
                />
                <span className="text-2xl font-black tracking-tighter uppercase italic">Shamsiya</span>
              </div>
              <p className="text-base leading-relaxed mb-8 font-medium">
                {t(
                  settings.siteDescription || 'نقود الثورة التعليمية الرقمية في العراق من خلال تمكين الطاقات الشابة بأدوات العصر.',
                  'Leading the digital educational revolution in Iraq by empowering youth with modern tools.'
                )}
              </p>
              <div className="flex justify-center lg:justify-start gap-2">
                <a href="https://www.facebook.com/profile.php?id=61554748052998" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/shamsia.iq/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://wa.me/9647732200003" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300">
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="font-black mb-6 text-sm uppercase tracking-widest opacity-60">
                {t('روابط سريعة', 'Quick Links')}
              </h4>
              <ul className="space-y-3 text-sm font-bold">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="hover:text-emerald-600 transition-all flex items-center gap-2 group justify-center lg:justify-start">
                      {link.name} <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-black mb-6 text-sm uppercase tracking-widest opacity-60">
                {t('تواصل معنا', 'Contact Us')}
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3 justify-center lg:justify-start">
                  <MapPin className="text-emerald-500 flex-shrink-0" size={16} />
                  <span>{settings.contactAddress || t('العراق، بغداد', 'Iraq, Baghdad')}</span>
                </li>
                <li className="flex items-center gap-3 justify-center lg:justify-start">
                  <Phone className="text-emerald-500 flex-shrink-0" size={16} />
                  <span className="ltr">{settings.contactPhone}</span>
                </li>
                <li className="flex items-center gap-3 justify-center lg:justify-start">
                  <Mail className="text-emerald-500 flex-shrink-0" size={16} />
                  <span className="break-all">{settings.contactEmail}</span>
                </li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="bg-emerald-50/80 p-6 lg:p-8 rounded-2xl border border-emerald-100">
              <h4 className="text-emerald-950 font-black mb-3 text-lg tracking-tight">
                {t('النشرة البريدية', 'Newsletter')}
              </h4>
              <p className="text-xs text-emerald-700/70 mb-6 font-bold uppercase tracking-wide">
                {t('صُنِعَ بفخر في العراق 🇮🇶', 'Made with pride in Iraq 🇮🇶')}
              </p>
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('بريدك الإلكتروني', 'Your email')}
                  className="w-full bg-white border border-emerald-200/60 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-sm placeholder:text-slate-400"
                />
                <button type="submit" className="absolute left-1.5 top-1.5 bottom-1.5 w-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-emerald-700 active:scale-90 transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-bold uppercase tracking-wide opacity-50">
              {settings.footerText || `© ${new Date().getFullYear()} SHAMSIYA PLATFORM`}
            </p>
            <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wide opacity-30">
              <span className="hover:text-emerald-600 transition-colors cursor-default">{t('جودة', 'Quality')}</span>
              <span className="hover:text-emerald-600 transition-colors cursor-default">{t('ثقة', 'Trust')}</span>
              <span className="hover:text-emerald-600 transition-colors cursor-default">{t('تأثير', 'Impact')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;