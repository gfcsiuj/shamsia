import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { CalendarEntry } from '../types';
import { useTheme } from '../context/ThemeContext';
import { getCategoryLabel } from '../constants';
import { Link } from 'react-router-dom';
import {
    Calendar as CalendarIcon, Clock, MapPin, BookOpen,
    Loader2, ChevronLeft, ChevronRight, Users, Tag, Info
} from 'lucide-react';

const STATUS_CONFIG = {
    upcoming: { label: 'قادمة', labelEn: 'Upcoming', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
    ongoing: { label: 'جارية', labelEn: 'Ongoing', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    completed: { label: 'منتهية', labelEn: 'Completed', bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-slate-200', dot: 'bg-slate-400' },
    cancelled: { label: 'ملغاة', labelEn: 'Cancelled', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-500' },
} as const;

const CATEGORY_COLOR: Record<string, string> = {
    'Tech': 'bg-blue-500',
    'Cyber Security': 'bg-red-500',
    'Human Development': 'bg-emerald-500',
    'Admin Skills': 'bg-orange-500',
    'Student Skills': 'bg-purple-500',
};

const CalendarPage: React.FC = () => {
    const { t, isEnglish } = useTheme();
    const [entries, setEntries] = useState<CalendarEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled'>('all');

    useEffect(() => {
        const fetch = async () => {
            try {
                const snap = await db.collection('calendarEntries').get();
                const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as CalendarEntry));
                // Sort: upcoming first, then ongoing, then completed, then cancelled
                const order = ['upcoming', 'ongoing', 'completed', 'cancelled'];
                data.sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));
                setEntries(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const filtered = filter === 'all' ? entries : entries.filter(e => e.status === filter);

    const getStatusCfg = (status: string) =>
        STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.upcoming;

    const counts = {
        all: entries.length,
        upcoming: entries.filter(e => e.status === 'upcoming').length,
        ongoing: entries.filter(e => e.status === 'ongoing').length,
        completed: entries.filter(e => e.status === 'completed').length,
        cancelled: entries.filter(e => e.status === 'cancelled').length,
    };

    const filterTabs = [
        { key: 'all', label: t('الكل', 'All'), count: counts.all },
        { key: 'upcoming', label: t('قادمة', 'Upcoming'), count: counts.upcoming },
        { key: 'ongoing', label: t('جارية', 'Ongoing'), count: counts.ongoing },
        { key: 'completed', label: t('منتهية', 'Completed'), count: counts.completed },
        { key: 'cancelled', label: t('ملغاة', 'Cancelled'), count: counts.cancelled },
    ] as const;

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Hero */}
            <div className="relative pt-20 pb-16 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-[100px] animate-blob" />
                    <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-orange-100/40 rounded-full blur-[80px] animate-blob delay-2000" />
                </div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 italic tracking-tight animate-fade-up">
                        {isEnglish ? <>Course <span className="text-gradient">Schedule</span></> : <>جدول <span className="text-gradient">الدورات</span></>}
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium animate-fade-up delay-100">
                        {t('تصفح مواعيد الدورات القادمة وسجّل في الدورة المناسبة لك', 'Browse upcoming course dates and register for the one that suits you')}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl -mt-4">
                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                    {filterTabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${filter === tab.key
                                    ? 'bg-slate-900 text-white shadow-md scale-105'
                                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400 hover:text-slate-700'
                                }`}
                        >
                            {tab.label}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-black ${filter === tab.key ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-24"><Loader2 className="animate-spin text-primary-600" size={40} /></div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                        <CalendarIcon className="mx-auto mb-4 text-slate-300" size={64} />
                        <p className="text-slate-400 font-bold text-lg">
                            {t('لا توجد دورات في هذه الفئة', 'No courses in this category')}
                        </p>
                    </div>
                ) : (
                    /* Table */
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                                        <th className="text-right px-6 py-5 font-black text-xs uppercase tracking-widest">#</th>
                                        <th className="text-right px-6 py-5 font-black text-xs uppercase tracking-widest">{t('الكورس', 'Course')}</th>
                                        <th className="text-right px-6 py-5 font-black text-xs uppercase tracking-widest">{t('تاريخ البدء', 'Start Date')}</th>
                                        <th className="text-right px-6 py-5 font-black text-xs uppercase tracking-widest">{t('تاريخ الانتهاء', 'End Date')}</th>
                                        <th className="text-right px-6 py-5 font-black text-xs uppercase tracking-widest">{t('المحاضرات', 'Lectures')}</th>
                                        <th className="text-right px-6 py-5 font-black text-xs uppercase tracking-widest">{t('المدة', 'Duration')}</th>
                                        <th className="text-right px-6 py-5 font-black text-xs uppercase tracking-widest">{t('الموقع', 'Location')}</th>
                                        <th className="text-right px-6 py-5 font-black text-xs uppercase tracking-widest">{t('السعر', 'Price')}</th>
                                        <th className="text-right px-6 py-5 font-black text-xs uppercase tracking-widest">{t('الحالة', 'Status')}</th>
                                        <th className="text-right px-6 py-5 font-black text-xs uppercase tracking-widest">{t('تسجيل', 'Register')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((entry, i) => {
                                        const cfg = getStatusCfg(entry.status);
                                        const catColor = CATEGORY_COLOR[entry.category] || 'bg-slate-500';
                                        return (
                                            <tr
                                                key={entry.id}
                                                className={`border-b border-slate-50 hover:bg-slate-50/80 transition-colors animate-fade-up group ${entry.status === 'cancelled' ? 'opacity-60' : ''}`}
                                                style={{ animationDelay: `${i * 50}ms` }}
                                            >
                                                {/* # */}
                                                <td className="px-6 py-5">
                                                    <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 font-black text-xs flex items-center justify-center">{i + 1}</span>
                                                </td>

                                                {/* Course */}
                                                <td className="px-6 py-5 min-w-[200px]">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-1 h-12 rounded-full ${catColor} shrink-0`} />
                                                        <div>
                                                            <div className="font-black text-slate-900 text-sm leading-tight line-clamp-2">{entry.courseTitle}</div>
                                                            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                                <Tag size={11} />{getCategoryLabel(entry.category)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Start Date */}
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5 font-bold text-slate-700">
                                                        <CalendarIcon size={14} className="text-emerald-500 shrink-0" />
                                                        {entry.startDate || <span className="text-slate-300">—</span>}
                                                    </div>
                                                </td>

                                                {/* End Date */}
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5 font-medium text-slate-600">
                                                        <CalendarIcon size={14} className="text-slate-300 shrink-0" />
                                                        {entry.endDate || <span className="text-slate-300">—</span>}
                                                    </div>
                                                </td>

                                                {/* Lectures */}
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    {entry.lecturesCount ? (
                                                        <div className="flex items-center gap-1.5 font-bold text-slate-700">
                                                            <BookOpen size={14} className="text-blue-400 shrink-0" />
                                                            {entry.lecturesCount} {t('محاضرة', 'lec')}
                                                        </div>
                                                    ) : <span className="text-slate-300">—</span>}
                                                </td>

                                                {/* Duration */}
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    {entry.duration ? (
                                                        <div className="flex items-center gap-1.5 font-medium text-slate-600">
                                                            <Clock size={14} className="text-orange-400 shrink-0" />
                                                            {entry.duration}
                                                        </div>
                                                    ) : <span className="text-slate-300">—</span>}
                                                </td>

                                                {/* Location */}
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    {entry.location ? (
                                                        <div className="flex items-center gap-1.5 font-medium text-slate-600">
                                                            <MapPin size={14} className="text-purple-400 shrink-0" />
                                                            {entry.location}
                                                        </div>
                                                    ) : <span className="text-slate-300">—</span>}
                                                </td>

                                                {/* Price */}
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <span className="font-black text-primary-600 text-sm">
                                                        {entry.priceText || (entry.price && entry.price > 0
                                                            ? `${entry.price.toLocaleString()} ${t('د.ع', 'IQD')}`
                                                            : t('مجاناً', 'Free')
                                                        )}
                                                    </span>
                                                </td>

                                                {/* Status */}
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                                        {isEnglish ? cfg.labelEn : cfg.label}
                                                    </span>
                                                </td>

                                                {/* Register link */}
                                                <td className="px-6 py-5 whitespace-nowrap">
                                                    {entry.status !== 'completed' && entry.status !== 'cancelled' ? (
                                                        <Link
                                                            to={`/courses/${entry.courseId}`}
                                                            className="flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition group/link"
                                                        >
                                                            {t('التفاصيل', 'Details')}
                                                            {isEnglish
                                                                ? <ChevronRight size={15} className="group-hover/link:translate-x-1 transition-transform" />
                                                                : <ChevronLeft size={15} className="group-hover/link:-translate-x-1 transition-transform" />
                                                            }
                                                        </Link>
                                                    ) : (
                                                        <span className="text-slate-300 text-sm font-medium">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Notes hint if any */}
                        {filtered.some(e => e.notes) && (
                            <div className="px-6 pb-6 pt-2 border-t border-slate-50">
                                <div className="space-y-2 mt-4">
                                    {filtered.filter(e => e.notes).map((entry, i) => (
                                        <div key={entry.id} className="flex items-start gap-2 text-xs text-slate-500 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                                            <Info size={13} className="text-amber-400 shrink-0 mt-0.5" />
                                            <span><span className="font-bold text-amber-700">{entry.courseTitle}:</span> {entry.notes}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarPage;
