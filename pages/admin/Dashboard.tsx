import React, { useState, useEffect } from 'react';
import { auth, db } from '../../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Users, BookOpen, Settings, LayoutDashboard, ExternalLink, Library, Sparkles, ClipboardList, Award, MessageSquare, Search } from 'lucide-react';
import { Course, Instructor } from '../../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ courses: Course[], instructors: Instructor[] }>({ courses: [], instructors: [] });
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesSnap, instructorsSnap] = await Promise.all([
          db.collection('courses').get(),
          db.collection('instructors').get()
        ]);

        const coursesData = coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
        const instructorsData = instructorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Instructor));

        setCourses(coursesData);
        setInstructors(instructorsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-orange-50/20 flex">
      {/* Enhanced Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-primary-900 via-primary-800 to-primary-900 text-white hidden md:flex flex-col fixed h-full shadow-2xl">
        {/* Header with gradient accent */}
        <div className="p-6 border-b border-primary-700/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-500/10 to-transparent"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center shadow-lg shadow-secondary-900/50 transform hover:scale-105 transition-transform">
              <LayoutDashboard className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">لوحة التحكم</h2>
              <p className="text-xs text-primary-200">منصة شمسية</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-primary-700 to-primary-800 rounded-xl text-white font-semibold shadow-lg shadow-primary-900/30 transform hover:scale-[1.02] transition-all"
          >
            <LayoutDashboard size={20} />
            <span>الرئيسية</span>
          </Link>

          <Link
            to="/admin/courses"
            className="group flex items-center gap-3 px-4 py-3.5 hover:bg-primary-800/60 rounded-xl text-primary-100 transition-all duration-300 hover:translate-x-1 hover:shadow-lg"
          >
            <div className="w-10 h-10 rounded-lg bg-secondary-500/20 group-hover:bg-secondary-500 flex items-center justify-center transition-all">
              <BookOpen size={20} className="group-hover:text-white transition-colors" />
            </div>
            <span className="font-medium group-hover:text-white">إدارة الدورات</span>
          </Link>

          <Link
            to="/admin/instructors"
            className="group flex items-center gap-3 px-4 py-3.5 hover:bg-primary-800/60 rounded-xl text-primary-100 transition-all duration-300 hover:translate-x-1 hover:shadow-lg"
          >
            <div className="w-10 h-10 rounded-lg bg-green-500/20 group-hover:bg-green-500 flex items-center justify-center transition-all">
              <Users size={20} className="group-hover:text-white transition-colors" />
            </div>
            <span className="font-medium group-hover:text-white">إدارة المدربين</span>
          </Link>

          <Link
            to="/admin/library"
            className="group flex items-center gap-3 px-4 py-3.5 hover:bg-primary-800/60 rounded-xl text-primary-100 transition-all duration-300 hover:translate-x-1 hover:shadow-lg"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 group-hover:bg-purple-500 flex items-center justify-center transition-all">
              <Library size={20} className="group-hover:text-white transition-colors" />
            </div>
            <span className="font-medium group-hover:text-white">إدارة المكتبة</span>
          </Link>

          <Link
            to="/admin/registrations"
            className="group flex items-center gap-3 px-4 py-3.5 hover:bg-primary-800/60 rounded-xl text-primary-100 transition-all duration-300 hover:translate-x-1 hover:shadow-lg"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 group-hover:bg-indigo-500 flex items-center justify-center transition-all">
              <ClipboardList size={20} className="group-hover:text-white transition-colors" />
            </div>
            <span className="font-medium group-hover:text-white">إدارة التسجيلات</span>
          </Link>

          <Link
            to="/admin/certificates"
            className="group flex items-center gap-3 px-4 py-3.5 hover:bg-primary-800/60 rounded-xl text-primary-100 transition-all duration-300 hover:translate-x-1 hover:shadow-lg"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 group-hover:bg-amber-500 flex items-center justify-center transition-all">
              <Award size={20} className="group-hover:text-white transition-colors" />
            </div>
            <span className="font-medium group-hover:text-white">الشهادات</span>
          </Link>

          <Link
            to="/admin/testimonials"
            className="group flex items-center gap-3 px-4 py-3.5 hover:bg-primary-800/60 rounded-xl text-primary-100 transition-all duration-300 hover:translate-x-1 hover:shadow-lg"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-500/20 group-hover:bg-teal-500 flex items-center justify-center transition-all">
              <MessageSquare size={20} className="group-hover:text-white transition-colors" />
            </div>
            <span className="font-medium group-hover:text-white">آراء المتدربين</span>
          </Link>

          <Link
            to="/admin/settings"
            className="group flex items-center gap-3 px-4 py-3.5 hover:bg-primary-800/60 rounded-xl text-primary-100 transition-all duration-300 hover:translate-x-1 hover:shadow-lg"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-500/20 group-hover:bg-slate-600 flex items-center justify-center transition-all">
              <Settings size={20} className="group-hover:text-white transition-colors" />
            </div>
            <span className="font-medium group-hover:text-white">إعدادات الموقع</span>
          </Link>

          <div className="pt-4 mt-4 border-t border-primary-700/50">
            <Link
              to="/"
              target="_blank"
              className="group flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-secondary-600/20 to-secondary-500/20 hover:from-secondary-600 hover:to-secondary-500 rounded-xl text-secondary-300 hover:text-white transition-all duration-300 font-bold shadow-lg hover:shadow-secondary-500/30"
            >
              <ExternalLink size={20} />
              <span>عرض الموقع</span>
              <Sparkles size={16} className="mr-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-primary-700/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all w-full px-4 py-3 rounded-xl font-medium group"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:mr-72 p-8">
        {/* Mobile Header */}
        <header className="flex justify-between items-center mb-8 md:hidden bg-white p-4 rounded-[2rem] shadow-lg">
          <h1 className="text-2xl font-bold text-primary-900">لوحة التحكم</h1>
          <button onClick={handleLogout} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition">
            <LogOut />
          </button>
        </header>

        {/* Welcome Section */}
        <div className="mb-10">
          <div className="relative bg-gradient-to-r from-emerald-600 to-emerald-700 p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)]">
            {/* Background Elements - Isolated for clipping */}
            <div className="absolute inset-0 rounded-[3rem] overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDRtLTQgNGg0bS00IDRoNE00MCAxNGg0bS00IDRoNG0tNCA0aDQiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>

            <div className="relative z-50 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-3 italic tracking-tight">مرحباً بك، المشرف 👋</h1>
                <p className="text-emerald-100 text-lg md:text-xl font-medium">إليك نظرة عامة على المنصة التعليمية</p>
              </div>
              <div className="w-full md:w-96">
                <div className="relative">
                  <div className="relative z-[100]">
                    <input
                      type="text"
                      placeholder="ابحث عن كورس أو مدرب..."
                      className="w-full pl-4 pr-12 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-emerald-100/70 focus:bg-white/20 transition backdrop-blur-md outline-none font-bold shadow-lg"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      onFocus={() => { if (searchQuery) setShowResults(true); }}
                      onBlur={() => setTimeout(() => setShowResults(false), 200)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          navigate(`/admin/courses?q=${searchQuery}`);
                          setShowResults(false);
                        }
                      }}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 p-2 rounded-xl text-white hover:bg-white hover:text-emerald-700 transition shadow-sm"
                      onClick={() => navigate(`/admin/courses?q=${searchQuery}`)}
                    >
                      <Search size={20} />
                    </button>
                  </div>

                  {/* Live Search Results Dropdown */}
                  {showResults && (searchResults.courses.length > 0 || searchResults.instructors.length > 0) && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl overflow-hidden z-[101] animate-fade-in border border-slate-100 max-h-96 overflow-y-auto">
                      {searchResults.courses.length > 0 && (
                        <div className="p-2">
                          <h3 className="text-xs font-bold text-slate-400 px-3 py-2 uppercase tracking-wider">الدورات التدريبية</h3>
                          {searchResults.courses.slice(0, 3).map(course => (
                            <div
                              key={course.id}
                              onClick={() => navigate(`/admin/courses?q=${course.title}`)}
                              className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition group"
                            >
                              <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 relative">
                                {course.media && course.media[0] && course.media[0].type === 'image' ? (
                                  <img src={course.media[0].url} className="w-full h-full object-cover" alt="" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-400"><BookOpen size={20} /></div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-800 text-sm truncate group-hover:text-primary-600 transition-colors">{course.title}</h4>
                                <p className="text-xs text-slate-500 truncate">{course.category} • {course.level}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {searchResults.courses.length > 0 && searchResults.instructors.length > 0 && <div className="h-px bg-slate-100 mx-4"></div>}

                      {searchResults.instructors.length > 0 && (
                        <div className="p-2">
                          <h3 className="text-xs font-bold text-slate-400 px-3 py-2 uppercase tracking-wider">المدربون</h3>
                          {searchResults.instructors.slice(0, 3).map(inst => (
                            <div
                              key={inst.id}
                              onClick={() => navigate(`/admin/instructors?q=${inst.name}`)} // Assuming instructors admin will have search too
                              className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition group"
                            >
                              <img src={inst.image} className="w-10 h-10 rounded-full object-cover border border-slate-100" alt="" />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-800 text-sm truncate group-hover:text-primary-600 transition-colors">{inst.name}</h4>
                                <p className="text-xs text-slate-500 truncate">{inst.specialization || 'مدرب'}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link
            to="/admin/courses"
            className="group bg-white p-8 rounded-[3rem] shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 border border-slate-100 hover:border-secondary-200 transform hover:-translate-y-3 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-secondary-100 to-transparent rounded-full -mr-20 -mt-20 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div class="bg-gradient-to-br from-orange-500 to-orange-800 p-5 rounded-[2rem] text-white shadow-lg shadow-orange-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <BookOpen size={32} />
                </div>
              </div>
              <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2 italic">إدارة</div>
              <div className="text-2xl font-black text-slate-900 group-hover:text-secondary-600 transition-colors italic tracking-tight">الدورات التدريبية</div>
            </div>
          </Link>

          <Link
            to="/admin/instructors"
            className="group bg-white p-8 rounded-[3rem] shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 border border-slate-100 hover:border-green-200 transform hover:-translate-y-3 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-100 to-transparent rounded-full -mr-20 -mt-20 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gradient-to-br from-green-500 to-green-700 p-5 rounded-[2rem] text-white shadow-lg shadow-green-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Users size={32} />
                </div>
              </div>
              <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2 italic">إدارة</div>
              <div className="text-2xl font-black text-slate-900 group-hover:text-green-600 transition-colors italic tracking-tight">المدربين</div>
            </div>
          </Link>

          <Link
            to="/admin/library"
            className="group bg-white p-8 rounded-[3rem] shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 border border-slate-100 hover:border-purple-200 transform hover:-translate-y-3 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100 to-transparent rounded-full -mr-20 -mt-20 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-5 rounded-[2rem] text-white shadow-lg shadow-purple-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Library size={32} />
                </div>
              </div>
              <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2 italic">إدارة</div>
              <div className="text-2xl font-black text-slate-900 group-hover:text-purple-600 transition-colors italic tracking-tight">المكتبة والمصادر</div>
            </div>
          </Link>

          <Link
            to="/admin/registrations"
            className="group bg-white p-8 rounded-[3rem] shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 border border-slate-100 hover:border-indigo-200 transform hover:-translate-y-3 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-100 to-transparent rounded-full -mr-20 -mt-20 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-5 rounded-[2rem] text-white shadow-lg shadow-indigo-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <ClipboardList size={32} />
                </div>
              </div>
              <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2 italic">إدارة</div>
              <div className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors italic tracking-tight">إدارة التسجيلات</div>
            </div>
          </Link>

          <Link
            to="/admin/certificates"
            className="group bg-white p-8 rounded-[3rem] shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 border border-slate-100 hover:border-amber-200 transform hover:-translate-y-3 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-100 to-transparent rounded-full -mr-20 -mt-20 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-5 rounded-[2rem] text-white shadow-lg shadow-amber-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Award size={32} />
                </div>
              </div>
              <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2 italic">إدارة</div>
              <div className="text-2xl font-black text-slate-900 group-hover:text-amber-600 transition-colors italic tracking-tight">الشهادات</div>
            </div>
          </Link>

          <Link
            to="/admin/testimonials"
            className="group bg-white p-8 rounded-[3rem] shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 border border-slate-100 hover:border-teal-200 transform hover:-translate-y-3 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-teal-100 to-transparent rounded-full -mr-20 -mt-20 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gradient-to-br from-teal-500 to-teal-700 p-5 rounded-[2rem] text-white shadow-lg shadow-teal-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <MessageSquare size={32} />
                </div>
              </div>
              <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2 italic">إدارة</div>
              <div className="text-2xl font-black text-slate-900 group-hover:text-teal-600 transition-colors italic tracking-tight">آراء المتدربين</div>
            </div>
          </Link>

          <Link
            to="/admin/settings"
            className="group bg-white p-8 rounded-[3rem] shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 border border-slate-100 hover:border-slate-300 transform hover:-translate-y-3 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-slate-100 to-transparent rounded-full -mr-20 -mt-20 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-gradient-to-br from-slate-500 to-slate-700 p-5 rounded-[2rem] text-white shadow-lg shadow-slate-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Settings size={32} />
                </div>
              </div>
              <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2 italic">تخصيص</div>
              <div className="text-2xl font-black text-slate-900 group-hover:text-slate-600 transition-colors italic tracking-tight">إعدادات الموقع</div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;