import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Users, BookOpen } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-900">لوحة التحكم</h1>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-lg border border-red-100 hover:bg-red-50 transition font-bold"
          >
            <LogOut size={18} />
            تسجيل الخروج
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary-100 p-3 rounded-lg text-primary-600">
                <Users size={24} />
              </div>
              <div>
                <div className="text-sm text-slate-500">الطلاب المسجلين</div>
                <div className="text-2xl font-bold text-slate-800">1,234</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-secondary-100 p-3 rounded-lg text-secondary-600">
                <BookOpen size={24} />
              </div>
              <div>
                <div className="text-sm text-slate-500">الدورات النشطة</div>
                <div className="text-2xl font-bold text-slate-800">12</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white p-8 rounded-xl border border-slate-100 text-center text-slate-500">
          مرحباً بك في لوحة تحكم شمسية. (هذه صفحة تجريبية محمية)
        </div>
      </div>
    </div>
  );
};

export default Dashboard;