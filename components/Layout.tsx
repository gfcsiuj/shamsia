import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Facebook, Instagram, MessageCircle, MapPin, Phone, Mail, Search, Send, ChevronLeft, Moon, Sun, Globe, BookOpen } from 'lucide-react';
import MobileBottomNav from './MobileBottomNav';
import { useTheme } from '../context/ThemeContext';
import { db } from '../lib/firebase';
import { Course, Instructor } from '../types';
import { getCategoryLabel } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const location = useLocation();

  const navigate = useNavigate();
  const [headerSearch, setHeaderSearch] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [searchResults, setSearchResults] = useState<{ courses: Course[], instructors: Instructor[] }>({ courses: [], instructors: [] });
  const [showResults, setShowResults] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [isFetchingSearch, setIsFetchingSearch] = useState(false);

  // Use global theme context
  const { settings, isDarkMode, setIsDarkMode, isEnglish, setIsEnglish, t } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch data for search only when user focuses input
  const fetchSearchData = async () => {
    if (hasFetched || isFetchingSearch) return;
    setIsFetchingSearch(true);
    try {
      const [coursesSnap, instructorsSnap] = await Promise.all([
        db.collection('courses').get(),
        db.collection('instructors').get()
      ]);

      const coursesData = coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
      const instructorsData = instructorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Instructor));

      setCourses(coursesData);
      setInstructors(instructorsData);
      setHasFetched(true);
    } catch (error) {
      console.error("Error fetching search data:", error);
    } finally {
      setIsFetchingSearch(false);
    }
  };

  const handleSearch = (query: string) => {
    setHeaderSearch(query);
    if (!query.trim()) {
      setSearchResults({ courses: [], instructors: [] });
      setShowResults(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filteredCourses = courses.filter(c =>
      c.title.toLowerCase().includes(lowerQuery) ||
      c.category.toLowerCase().includes(lowerQuery) ||
      c.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
    const filteredInstructors = instructors.filter(i =>
      i.name.toLowerCase().includes(lowerQuery)
    );

    setSearchResults({ courses: filteredCourses, instructors: filteredInstructors });
    setShowResults(true);
  };

  const isActive = (path: string) => location.pathname === path;

  // Navigation links with translation
  const navLinks = [
    { name: t('الرئيسية', 'Home'), path: '/' },
    { name: t('الدورات', 'Courses'), path: '/courses' },
    { name: t('التقويم', 'Calendar'), path: '/calendar' },
    { name: t('الشهادات', 'Certificates'), path: '/certificates' },
    { name: t('أعضاؤنا', 'Instructors & Graduates'), path: '/instructors' },
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
    <div className="flex flex-col min-h-screen font-sans bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header - Premium Glassmorphism Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 top-0 ${isScrolled
          ? 'bg-white/80 dark:bg-slate-900/80 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.04)] shadow-emerald-500/5 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/80'
          : 'py-4 lg:py-6 bg-transparent'
          }`}
      >
        {/* Animated Gradient Border */}
        <div className={`absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 dark:via-emerald-400/30 to-transparent transition-all duration-1000 ${isScrolled ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></div>
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl flex justify-between items-center">
          <div className="flex items-center justify-between w-full">
            {/* Right Side: Logo & Main Nav */}
            <div className="flex items-center gap-6 lg:gap-10">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 group shrink-0">
                <img
                  src="https://k.top4top.io/p_3662fca071.png"
                  alt="شمسية"
                  className="w-9 h-9 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl object-contain shadow-lg group-hover:rotate-[15deg] transition-all duration-500 shadow-emerald-200 dark:shadow-emerald-900/20 bg-white"
                />
                <span className="text-lg lg:text-3xl font-black tracking-tighter italic text-slate-900 dark:text-white">
                  {settings.siteName || 'شمسية'}
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-4 xl:gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm xl:text-base font-bold transition-colors relative group py-2 whitespace-nowrap ${isActive(link.path) ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                      }`}
                  >
                    {link.name}
                    <span className={`absolute bottom-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 transition-all duration-300 ${isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}></span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Left Side: Search, Theme, Lang, Buttons */}
            <div className="flex items-center gap-3 lg:gap-4 justify-end">
              {/* Search Bar */}
              <div className="hidden lg:block relative group">
                <div className="flex items-center rounded-xl px-3 py-2 border focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 dark:focus-within:ring-emerald-900/30 transition-all duration-300 w-32 xl:w-48 focus-within:w-64 xl:focus-within:w-64 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 relative z-[100]">
                  <Search className="w-4 h-4 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 ml-2 text-slate-400 dark:text-slate-500 shrink-0" />
                  <input
                    type="text"
                    value={headerSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => {
                      fetchSearchData();
                      if (headerSearch) setShowResults(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && headerSearch.trim()) {
                        navigate(`/courses?q=${encodeURIComponent(headerSearch.trim())}`);
                        setShowResults(false);
                      }
                    }}
                    placeholder={t("بحث...", "Search...")}
                    className="bg-transparent border-none outline-none text-sm w-full font-medium dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Invisible Overlay to handle Click Outside */}
                {showResults && (
                  <div
                    className="fixed inset-0 z-[100]"
                    onClick={() => setShowResults(false)}
                  ></div>
                )}

                {/* Live Search Results Dropdown */}
                {showResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden z-[101] animate-fade-in border border-slate-100 dark:border-slate-700 max-h-96 overflow-y-auto w-64 -translate-x-8 lg:-translate-x-0">
                    {headerSearch.trim() && searchResults.courses.length === 0 && searchResults.instructors.length === 0 ? (
                      <div className="p-4 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                        {t('لم يتم العثور على نتائج مطابقة', 'No results found')}
                      </div>
                    ) : (
                      <>
                        {searchResults.courses.length > 0 && (
                          <div className="p-2">
                            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 px-3 py-2 uppercase tracking-wider">{t('الدورات', 'Courses')}</h3>
                            {searchResults.courses.slice(0, 3).map(course => (
                              <div
                                key={course.id}
                                onClick={() => navigate(`/courses?q=${course.title}`)}
                                className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl cursor-pointer transition group"
                              >
                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-900/50 overflow-hidden shrink-0 relative">
                                  {course.media && course.media[0] && course.media[0].type === 'image' ? (
                                    <img src={course.media[0].url} className="w-full h-full object-cover" alt="" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500"><BookOpen size={16} /></div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{course.title}</h4>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{getCategoryLabel(course.category)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {searchResults.courses.length > 0 && searchResults.instructors.length > 0 && <div className="h-px bg-slate-100 dark:bg-slate-700 mx-4"></div>}

                        {searchResults.instructors.length > 0 && (
                          <div className="p-2">
                            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 px-3 py-2 uppercase tracking-wider">{t('المدربون والخريجون', 'Instructors & Graduates')}</h3>
                            {searchResults.instructors.slice(0, 3).map(inst => (
                              <div
                                key={inst.id}
                                onClick={() => navigate(`/instructors?q=${inst.name}`)}
                                className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl cursor-pointer transition group"
                              >
                                <img src={inst.image} className="w-8 h-8 rounded-full object-cover border border-slate-100 dark:border-slate-700" alt="" />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{inst.name}</h4>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{inst.specialization || t('مدرب', 'Instructor')}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2.5 rounded-xl transition-all duration-300 ${isDarkMode
                  ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700'
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
                  ? 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
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
                className="hidden sm:block px-4 lg:px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-[0_8px_20px_-6px_rgba(16,185,129,0.5)] hover:shadow-[0_12px_25px_-4px_rgba(16,185,129,0.6)] hover:-translate-y-0.5 transition-all active:scale-95 border border-emerald-500/50 relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <span className="relative z-10">{t('سجل الآن', 'Register')}</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-1.5 rounded-lg transition hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div
          className={`lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`p-3 rounded-xl font-bold ${isActive(link.path) ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/register"
              className="mt-2 w-full text-center px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('تسجيل جديد', 'Register Now')}
            </Link>
          </nav>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pb-20 lg:pb-0 animate-fade-up" style={{ animationDuration: '0.5s' }}>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Floating WhatsApp Chat Button */}
      <a
        href="https://wa.me/9647832200003"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 lg:bottom-10 left-4 lg:left-10 w-12 h-12 lg:w-16 lg:h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(5,150,105,0.4)] z-[99] transition-all hover:scale-110 active:scale-95 group overflow-hidden border-2 border-white/20"
      >
        <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full"></div>
        <MessageCircle className="w-6 h-6 lg:w-8 lg:h-8 fill-current relative z-10" />
      </a>


      {/* Footer - Modern Design */}
      <footer className="pt-12 lg:pt-20 pb-28 lg:pb-10 border-t border-slate-100 dark:border-slate-800 px-4 lg:px-6 text-center lg:text-right bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-16 mb-8 lg:mb-16">
            {/* Brand Column */}
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center justify-center lg:justify-start gap-2 lg:gap-3 mb-3 lg:mb-6 group cursor-pointer">
                <img
                  src="https://k.top4top.io/p_3662fca071.png"
                  alt="شمسية"
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl object-contain shadow-lg group-hover:shadow-emerald-200 dark:group-hover:shadow-emerald-900/30 transition-all duration-500 bg-white"
                />
                <span className="text-base lg:text-2xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">Shamsiya</span>
              </div>
              <p className="text-xs lg:text-base leading-relaxed mb-3 lg:mb-8 font-medium text-slate-600 dark:text-slate-400 text-center lg:text-right">
                {t(
                  settings.siteDescription || 'نقود الثورة التعليمية الرقمية في العراق من خلال تمكين الطاقات الشابة بأدوات العصر.',
                  'Leading the digital educational revolution in Iraq by empowering youth with modern tools.'
                )}
              </p>
              <div className="flex justify-center lg:justify-start gap-2">
                <a href="https://www.facebook.com/profile.php?id=61554748052998" target="_blank" rel="noopener noreferrer" className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 dark:hover:bg-emerald-600 dark:hover:text-white transition-all duration-300">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/shamsia.iq/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 dark:hover:bg-emerald-600 dark:hover:text-white transition-all duration-300">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://wa.me/9647832200003" target="_blank" rel="noopener noreferrer" className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 dark:hover:bg-emerald-600 dark:hover:text-white transition-all duration-300">
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="font-black mb-3 lg:mb-6 text-xs lg:text-sm uppercase tracking-widest opacity-60 text-slate-900 dark:text-white">
                {t('روابط سريعة', 'Quick Links')}
              </h4>
              <ul className="grid grid-cols-2 lg:grid-cols-2 gap-x-4 gap-y-3 lg:gap-y-4 text-xs lg:text-sm font-bold">
                {navLinks.map((link) => {
                  // Arabic tatweel padding for equal visual width in footer
                  const footerNames: Record<string, string> = {
                    '/': t('الرئيسيـــــة', 'Home'),
                    '/courses': t('الــــــــــدورات', 'Courses'),
                    '/calendar': t('التـقـويــــــــم', 'Calendar'),
                    '/certificates': t('الشـهادات', 'Certificates'),
                    '/instructors': t('أعـضــــــاؤنـا', 'Members'),
                    '/about': t('مــــن نـحــــن', 'About Us'),
                    '/contact': t('اتصــــل بنـا', 'Contact'),
                  };
                  return (
                    <li key={link.path}>
                      <Link to={link.path} className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all flex items-center gap-1 group lg:justify-start">
                        {footerNames[link.path] || link.name} <ChevronLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <h4 className="font-black mb-3 lg:mb-6 text-xs lg:text-sm uppercase tracking-widest opacity-60 text-slate-900 dark:text-white">
                {t('تواصل معنا', 'Contact Us')}
              </h4>
              <ul className="space-y-3 lg:space-y-4 text-xs lg:text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2 lg:gap-3 lg:justify-start">
                  <MapPin className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" size={16} />
                  <span>{settings.contactAddress || t('العراق، بغداد', 'Iraq, Baghdad')}</span>
                </li>
                <li className="flex items-center gap-2 lg:gap-3 lg:justify-start">
                  <Phone className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" size={16} />
                  <span className="ltr">{settings.contactPhone}</span>
                </li>
                <li className="flex items-center gap-2 lg:gap-3 lg:justify-start">
                  <Mail className="text-emerald-500 dark:text-emerald-400 flex-shrink-0" size={16} />
                  <span className="break-all">{settings.contactEmail}</span>
                </li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="col-span-2 lg:col-span-1 bg-emerald-50/80 dark:bg-emerald-900/10 p-4 lg:p-8 rounded-xl lg:rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
              <h4 className="text-emerald-950 dark:text-emerald-100 font-black mb-2 lg:mb-3 text-base lg:text-lg tracking-tight">
                {t('النشرة البريدية', 'Newsletter')}
              </h4>
              <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70 mb-4 lg:mb-6 font-bold uppercase tracking-wide">
                {t('صُنِعَ بفخر في العراق 🇮🇶', 'Made with pride in Iraq 🇮🇶')}
              </p>
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('بريدك الإلكتروني', 'Your email')}
                  className="w-full bg-white dark:bg-slate-900 border border-emerald-200/60 dark:border-emerald-800/50 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-emerald-500/10 dark:focus:ring-emerald-900/20 transition-all font-bold text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                <button type="submit" className="absolute left-1.5 top-1.5 bottom-1.5 w-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-emerald-700 active:scale-90 transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-4 lg:pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-3 lg:gap-4">
            <p className="text-xs font-bold uppercase tracking-wide opacity-50 text-slate-600 dark:text-slate-400">
              {settings.footerText || `© ${new Date().getFullYear()} SHAMSIYA PLATFORM`}
            </p>
            <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-wide opacity-30 text-slate-600 dark:text-slate-400">
              <span className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-default">{t('جودة', 'Quality')}</span>
              <span className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-default">{t('ثقة', 'Trust')}</span>
              <span className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-default">{t('تأثير', 'Impact')}</span>
            </div>
          </div>
        </div>
      </footer >
    </div >
  );
};

export default Layout;