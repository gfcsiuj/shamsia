import React from 'react';
import { Settings, Clock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Maintenance: React.FC = () => {
  const { settings } = useTheme();

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4 text-center relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary-500 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-lg">
        <div className="mb-8 flex justify-center">
            <div className="relative">
                <div className="absolute inset-0 bg-secondary-500 blur-xl opacity-50 rounded-full"></div>
                <Settings size={80} className="text-white animate-spin-slow relative z-10" />
            </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6">الموقع تحت الصيانة</h1>
        
        <p className="text-xl text-slate-300 mb-8 leading-relaxed">
          {settings.maintenanceMessage || 'نحن نعمل حالياً على تحسين تجربتكم. سنعود قريباً بشكل أفضل!'}
        </p>

        <div className="flex items-center justify-center gap-2 text-secondary-400 bg-white/5 py-3 px-6 rounded-full border border-white/10 w-fit mx-auto">
            <Clock size={20} />
            <span className="font-bold">يرجى المحاولة لاحقاً</span>
        </div>

        {settings.contactEmail && (
            <div className="mt-12 text-slate-500 text-sm">
                للتواصل معنا: <a href={`mailto:${settings.contactEmail}`} className="text-primary-400 hover:underline">{settings.contactEmail}</a>
            </div>
        )}
      </div>
    </div>
  );
};

export default Maintenance;