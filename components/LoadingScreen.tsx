import React from 'react';
import { useTheme } from '../context/ThemeContext';

const LoadingScreen: React.FC = () => {
    const { settings } = useTheme();

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
            {/* Subtle Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-white"></div>

            {/* Simple Floating Circles */}
            <div className="absolute top-[20%] right-[15%] w-32 h-32 bg-emerald-100/50 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[20%] left-[15%] w-40 h-40 bg-orange-100/40 rounded-full blur-3xl"></div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Logo with Float Animation */}
                <div className="relative mb-6 animate-float-gentle">
                    <div className="w-20 h-20 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center p-3">
                        <img
                            src={settings.logoUrl || 'https://k.top4top.io/p_3662fca071.png'}
                            alt="شمسية"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* Brand Name */}
                <h1 className="text-3xl font-black text-slate-800 mb-2 tracking-tight italic">
                    SHAMSIYA
                </h1>

                {/* Tagline */}
                <p className="text-slate-400 text-sm font-medium mb-8">
                    منصة تعليمية رائدة
                </p>

                {/* Bouncing Dots Loading Bar */}
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.6s' }}></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '100ms', animationDuration: '0.6s' }}></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-300 animate-bounce" style={{ animationDelay: '200ms', animationDuration: '0.6s' }}></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms', animationDuration: '0.6s' }}></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '400ms', animationDuration: '0.6s' }}></div>
                </div>
            </div>

            {/* Float Animation Style */}
            <style>{`
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-gentle {
          animation: float-gentle 2.5s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
};

export default LoadingScreen;
