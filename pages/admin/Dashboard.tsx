import React from 'react';
import { auth } from '../../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Users, BookOpen, Settings, LayoutDashboard, ExternalLink, Library } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary-900 text-white hidden md:flex flex-col fixed h-full">
        <div className="p-6 border-b border-primary-800">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="text-secondary-500" />
            <h2 className="text-xl font-bold">لوحة التحكم</h2>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-primary-800 rounded-lg text-white font-medium">
            <LayoutDashboard size={20} />
            الرئيسية
          </Link>
          <Link to="/admin/courses" className="flex items-center gap-3 px-4 py-3 hover:bg-primary-800 rounded-lg text-primary-100 transition">
            <BookOpen size={20} />
            إدارة الدورات
          </Link>
          <Link to="/admin/instructors" className="flex items-center gap-3 px-4 py-3 hover:bg-primary-800 rounded-lg text-primary-100 transition">
            <Users size={20} />
            إدارة المدربين
          </Link>
          <Link to="/admin/library" className="flex items-center gap-3 px-4 py-3 hover:bg-primary-800 rounded-lg text-primary-100 transition">
            <Library size={20} />
            إدارة المكتبة
          </Link>
          <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-primary-800 rounded-lg text-primary-100 transition">
            <Settings size={20} />
            إعدادات الموقع
          </Link>
          <Link to="/" target="_blank" className="flex items-center gap-3 px-4 py-3 hover:bg-primary-800 rounded-lg text-secondary-400 transition font-bold mt-4">
            <ExternalLink size={20} />
            عرض الموقع
          </Link>
        </nav>
        <div className="p-4 border-t border-primary-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition w-full px-4 py-2"
          >
            <LogOut size={20} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:mr-64 p-8">
        <header className="flex justify-between items-center mb-8 md:hidden">
          <h1 className="text-2xl font-bold text-primary-900">لوحة التحكم</h1>
          <button onClick={handleLogout} className="text-red-600"><LogOut /></button>
        </header>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">مرحباً بك، المشرف</h1>
          <p className="text-slate-500">إليك نظرة عامة على المنصة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/admin/courses" className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-secondary-100 p-3 rounded-lg text-secondary-600 group-hover:bg-secondary-500 group-hover:text-white transition">
                <BookOpen size={24} />
              </div>
            </div>
            <div className="text-slate-500 text-sm">إدارة</div>
            <div className="text-xl font-bold text-slate-800">الدورات التدريبية</div>
          </Link>
          
          <Link to="/admin/instructors" className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary-100 p-3 rounded-lg text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition">
                <Users size={24} />
              </div>
            </div>
            <div className="text-slate-500 text-sm">إدارة</div>
            <div className="text-xl font-bold text-slate-800">المدربين</div>
          </Link>

          <Link to="/admin/library" className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
                <Library size={24} />
              </div>
            </div>
            <div className="text-slate-500 text-sm">إدارة</div>
            <div className="text-xl font-bold text-slate-800">المكتبة والمصادر</div>
          </Link>

          <Link to="/admin/settings" className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-slate-100 p-3 rounded-lg text-slate-600 group-hover:bg-primary-600 group-hover:text-white transition">
                <Settings size={24} />
              </div>
            </div>
            <div className="text-slate-500 text-sm">تخصيص</div>
            <div className="text-xl font-bold text-slate-800">إعدادات الموقع</div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;