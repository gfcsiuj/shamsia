import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { Lock, Mail, AlertCircle, ArrowLeft, Zap } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-100/60 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-[100px] animate-blob delay-2000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Back to Home */}
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold mb-8 transition-colors">
          <ArrowLeft size={18} />
          العودة للرئيسية
        </Link>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden animate-fade-up border border-slate-100">
          {/* Header */}
          <div className="bg-emerald-600 p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-700/20">
                <Zap className="text-emerald-600" size={32} fill="currentColor" />
              </div>
              <h1 className="text-2xl font-black text-white mb-2 italic">لوحة التحكم</h1>
              <p className="text-emerald-100 text-sm font-medium">تسجيل الدخول للمسؤولين</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="p-8">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm mb-6 flex items-start gap-3 border border-red-100">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pr-12 pl-4 py-4 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all font-medium"
                    placeholder="admin@shamsia.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-12 pl-4 py-4 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  جاري التحقق...
                </div>
              ) : (
                <>
                  تسجيل الدخول
                  <ArrowLeft size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-400 text-sm mt-6 font-medium">
          منصة شمسية التعليمية © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default Login;