import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await auth.signInWithEmailAndPassword(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error(err);
      setError('فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
        <div className="bg-primary-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-white mb-2">لوحة التحكم</h1>
            <p className="text-primary-200 text-sm">تسجيل الدخول للمسؤولين</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 flex items-start gap-2">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                  placeholder="admin@shamsia.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-secondary-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              'جاري التحقق...'
            ) : (
              <>
                تسجيل الدخول
                <ArrowLeft size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;