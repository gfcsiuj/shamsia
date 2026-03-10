import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NotFound: React.FC = () => {
    const { isDarkMode, t, isEnglish } = useTheme();

    return (
        <div className={`min-h-[80vh] flex flex-col items-center justify-center p-6 text-center ${isEnglish ? 'rtl:flex-row-reverse' : 'ltr:flex-row-reverse'}`}>
            <div className={`w-32 h-32 mb-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <AlertTriangle className={`w-16 h-16 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            </div>

            <h1 className={`text-6xl md:text-8xl font-black mb-4 tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                404
            </h1>

            <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                {t('عذراً، الصفحة غير موجودة!', 'Oops, Page Not Found!')}
            </h2>

            <p className={`text-lg mb-10 max-w-md ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {t('يبدو أنك تبحث عن صفحة تم نقلها أو أنها لم تعد موجودة.', 'It seems you are looking for a page that has been moved or no longer exists.')}
            </p>

            <Link
                to="/"
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-600/20"
            >
                <Home className="w-5 h-5" />
                {t('العودة للرئيسية', 'Back to Home')}
            </Link>
        </div>
    );
};

export default NotFound;
