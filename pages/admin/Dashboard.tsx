import React from 'react';
import { auth } from '../../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Users, BookOpen, Settings, LayoutDashboard, ExternalLink, Library, Sparkles } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

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
        <header className="flex justify-between items-center mb-8 md:hidden bg-white p-4 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-primary-900">لوحة التحكم</h1>
          <button onClick={handleLogout} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition">
            <LogOut />
          </button>
        </header>

        {/* Welcome Section */}
        <div className="mb-10">
          <div className="relative bg-gradient-to-r from-primary-600 to-secondary-500 p-8 rounded-3xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDRtLTQgNGg0bS00IDRoNE00MCAxNGg0bS00IDRoNG0tNCA0aDQiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">مرحباً بك، المشرف 👋</h1>
              <p className="text-primary-100 text-lg">إليك نظرة عامة على المنصة التعليمية</p>
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/admin/courses"
            className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-secondary-200 transform hover:-translate-y-2 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-secondary-400 to-secondary-600 p-4 rounded-2xl text-white shadow-lg shadow-secondary-200 group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <BookOpen size={28} />
                </div>
              </div>
              <div className="text-slate-500 text-sm font-medium mb-1">إدارة</div>
              <div className="text-xl font-bold text-slate-800 group-hover:text-secondary-600 transition-colors">الدورات التدريبية</div>
            </div>
          </Link>

          <Link
            to="/admin/instructors"
            className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-primary-200 transform hover:-translate-y-2 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-4 rounded-2xl text-white shadow-lg shadow-primary-200 group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <Users size={28} />
                </div>
              </div>
              <div className="text-slate-500 text-sm font-medium mb-1">إدارة</div>
              <div className="text-xl font-bold text-slate-800 group-hover:text-primary-600 transition-colors">المدربين</div>
            </div>
          </Link>

          <Link
            to="/admin/library"
            className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-purple-200 transform hover:-translate-y-2 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-4 rounded-2xl text-white shadow-lg shadow-purple-200 group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <Library size={28} />
                </div>
              </div>
              <div className="text-slate-500 text-sm font-medium mb-1">إدارة</div>
              <div className="text-xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors">المكتبة والمصادر</div>
            </div>
          </Link>

          <Link
            to="/admin/settings"
            className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-100 hover:border-slate-300 transform hover:-translate-y-2 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-slate-500 to-slate-700 p-4 rounded-2xl text-white shadow-lg shadow-slate-200 group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <Settings size={28} />
                </div>
              </div>
              <div className="text-slate-500 text-sm font-medium mb-1">تخصيص</div>
              <div className="text-xl font-bold text-slate-800 group-hover:text-slate-600 transition-colors">إعدادات الموقع</div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;