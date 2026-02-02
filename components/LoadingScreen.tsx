import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const LoadingScreen: React.FC = () => {
    const { settings } = useTheme();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) return 100;
                return prev + Math.random() * 15;
            });
        }, 200);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950">
                {/* Animated Grid Pattern */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                        animation: 'grid-move 20s linear infinite'
                    }}>
                </div>

                {/* Floating Orbs */}
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] animate-blob"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-400/15 rounded-full blur-[100px] animate-blob" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[80px] animate-blob" style={{ animationDelay: '4s' }}></div>

                {/* Sparkles */}
                <div className="absolute top-[20%] right-[30%] w-2 h-2 bg-white rounded-full animate-pulse opacity-60"></div>
                <div className="absolute top-[60%] right-[20%] w-1 h-1 bg-emerald-300 rounded-full animate-pulse opacity-80" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-[40%] left-[15%] w-1.5 h-1.5 bg-white rounded-full animate-pulse opacity-50" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-[30%] left-[40%] w-1 h-1 bg-emerald-200 rounded-full animate-pulse opacity-70" style={{ animationDelay: '1.5s' }}></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center px-6">

                {/* Logo Container with Glow */}
                <div className="relative mb-10">
                    {/* Outer Glow Ring */}
                    <div className="absolute -inset-8 bg-emerald-500/20 rounded-full blur-2xl animate-pulse"></div>

                    {/* Rotating Ring */}
                    <div className="absolute -inset-4 border-2 border-dashed border-emerald-500/30 rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>

                    {/* Inner Ring */}
                    <div className="absolute -inset-2 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-3xl"></div>

                    {/* Logo */}
                    <div className="relative w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-center overflow-hidden">
                        <img
                            src={settings.logoUrl || 'https://k.top4top.io/p_3662fca071.png'}
                            alt="شمسية"
                            className="w-20 h-20 object-contain drop-shadow-lg"
                        />
                    </div>
                </div>

                {/* Brand Name with Glow */}
                <div className="relative mb-2">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-500">
                        SHAMSIYA
                    </h1>
                    <div className="absolute inset-0 text-5xl md:text-6xl font-black tracking-tight italic text-emerald-400/30 blur-xl -z-10">
                        SHAMSIYA
                    </div>
                </div>

                {/* Arabic Tagline */}
                <p className="text-emerald-300/80 text-lg font-medium mb-12 tracking-wider">
                    منصة تعليمية رائدة
                </p>

                {/* Progress Container */}
                <div className="w-64 md:w-80">
                    {/* Progress Bar */}
                    <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm mb-4">
                        <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        >
                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                        </div>
                    </div>

                    {/* Loading Text */}
                    <div className="flex items-center justify-center gap-2 text-emerald-400/60 text-sm font-medium">
                        <span>جاري التحميل</span>
                        <span className="flex gap-1">
                            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </span>
                    </div>
                </div>

                {/* Bottom Decorative Line */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 text-white/20 text-xs font-medium tracking-widest uppercase">
                    <div className="w-12 h-px bg-gradient-to-r from-transparent to-white/30"></div>
                    <span>Iraq</span>
                    <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
                    <span>2024</span>
                    <div className="w-12 h-px bg-gradient-to-l from-transparent to-white/30"></div>
                </div>
            </div>

            {/* CSS for shimmer animation */}
            <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
        </div>
    );
};

export default LoadingScreen;
