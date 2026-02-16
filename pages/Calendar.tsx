import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { Course } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronRight, ChevronLeft, BookOpen, Users, Loader2 } from 'lucide-react';

const Calendar: React.FC = () => {
    const { t, isEnglish } = useTheme();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const snap = await db.collection('courses').get();
                const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Tech': return 'bg-blue-500';
            case 'Cyber Security': return 'bg-red-500';
            case 'Human Development': return 'bg-emerald-500';
            case 'Admin Skills': return 'bg-orange-500';
            case 'Student Skills': return 'bg-purple-500';
            default: return 'bg-slate-500';
        }
    };

    const getCategoryColorLight = (category: string) => {
        switch (category) {
            case 'Tech': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Cyber Security': return 'bg-red-50 text-red-700 border-red-200';
            case 'Human Development': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Admin Skills': return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'Student Skills': return 'bg-purple-50 text-purple-700 border-purple-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Hero */}
            <div className="relative pt-20 pb-16 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-[100px] animate-blob"></div>
                    <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-orange-100/40 rounded-full blur-[80px] animate-blob delay-2000"></div>
                </div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 italic tracking-tight animate-fade-up">
                        {isEnglish ? (
                            <>Course <span className="text-gradient">Calendar</span></>
                        ) : (
                            <>تقويم <span className="text-gradient">الدورات</span></>
                        )}
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium animate-fade-up delay-100">
                        {t('تصفح مواعيد الدورات القادمة وسجّل في الدورة المناسبة لك', 'Browse upcoming course dates and register for the one that suits you')}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl -mt-4">
                {/* View Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-xl p-1 shadow-sm border border-slate-100 flex gap-1">
                        <button onClick={() => setViewMode('list')} className={`px-6 py-2.5 rounded-lg font-bold text-sm transition ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
                            {t('عرض قائمة', 'List View')}
                        </button>
                        <button onClick={() => setViewMode('grid')} className={`px-6 py-2.5 rounded-lg font-bold text-sm transition ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
                            {t('عرض شبكي', 'Grid View')}
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" size={40} /></div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-20">
                        <CalendarIcon className="mx-auto mb-4 text-slate-300" size={64} />
                        <p className="text-slate-400 font-bold text-lg">{t('لا توجد دورات مجدولة حالياً', 'No courses scheduled at the moment')}</p>
                    </div>
                ) : viewMode === 'list' ? (
                    /* Timeline List View */
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute right-8 md:right-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-200 via-emerald-400 to-emerald-200 hidden md:block"></div>

                        <div className="space-y-8">
                            {courses.map((course, index) => (
                                <div key={course.id} className={`relative flex flex-col md:flex-row items-start gap-6 animate-fade-up`} style={{ animationDelay: `${index * 100}ms` }}>
                                    {/* Timeline Dot */}
                                    <div className="hidden md:flex absolute right-1/2 transform translate-x-1/2 -translate-y-0">
                                        <div className={`w-4 h-4 rounded-full ${getCategoryColor(course.category)} ring-4 ring-white shadow-lg`}></div>
                                    </div>

                                    {/* Content Card */}
                                    <div className={`w-full md:w-[calc(50%-2rem)] ${index % 2 === 0 ? 'md:mr-auto md:pl-8' : 'md:ml-auto md:pr-8'}`}>
                                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-500 group hover:-translate-y-1">
                                            {/* Color Accent */}
                                            <div className={`h-1.5 ${getCategoryColor(course.category)}`}></div>

                                            <div className="p-6">
                                                {/* Category & Date Row */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColorLight(course.category)}`}>
                                                        {course.category}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                        <CalendarIcon size={14} />
                                                        <span>{course.startDate || t('يحدد لاحقاً', 'TBD')}</span>
                                                    </div>
                                                </div>

                                                {/* Title */}
                                                <h3 className="text-lg font-black text-slate-900 mb-3 italic tracking-tight group-hover:text-primary-700 transition">
                                                    {course.title}
                                                </h3>

                                                {/* Description */}
                                                {course.description && (
                                                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">{course.description}</p>
                                                )}

                                                {/* Meta Row */}
                                                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-4">
                                                    {course.duration && (
                                                        <div className="flex items-center gap-1"><Clock size={14} /> {course.duration}</div>
                                                    )}
                                                    {course.lecturesCount && course.lecturesCount > 0 && (
                                                        <div className="flex items-center gap-1"><BookOpen size={14} /> {course.lecturesCount} {t('محاضرة', 'lectures')}</div>
                                                    )}
                                                    <div className="flex items-center gap-1"><Users size={14} /> {course.studentsCount} {t('طالب', 'students')}</div>
                                                </div>

                                                {/* Footer */}
                                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                                    <span className="text-lg font-black text-primary-600">
                                                        {course.priceText || (course.price > 0 ? `${course.price.toLocaleString()} ${t('د.ع', 'IQD')}` : t('مجاناً', 'Free'))}
                                                    </span>
                                                    <Link to={`/courses/${course.id}`} className="flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition group/link">
                                                        {t('التفاصيل', 'Details')}
                                                        {isEnglish ? <ChevronRight size={16} className="group-hover/link:translate-x-1 transition-transform" /> : <ChevronLeft size={16} className="group-hover/link:-translate-x-1 transition-transform" />}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Grid View */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course, index) => (
                            <div key={course.id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-500 group hover:-translate-y-1 animate-fade-up" style={{ animationDelay: `${index * 80}ms` }}>
                                {/* Course Image or Color Block */}
                                <div className="h-40 relative overflow-hidden">
                                    {course.media && course.media[0] ? (
                                        <img src={course.media[0].url} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className={`w-full h-full ${getCategoryColor(course.category)} opacity-20`}></div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                    <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold border ${getCategoryColorLight(course.category)} bg-white/90`}>
                                        {course.category}
                                    </span>
                                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                        <span className="text-white text-xs font-bold flex items-center gap-1"><CalendarIcon size={12} /> {course.startDate || t('يحدد لاحقاً', 'TBD')}</span>
                                        {course.duration && <span className="text-white text-xs font-bold flex items-center gap-1"><Clock size={12} /> {course.duration}</span>}
                                    </div>
                                </div>

                                <div className="p-5">
                                    <h3 className="font-black text-slate-900 mb-2 italic tracking-tight group-hover:text-primary-700 transition line-clamp-2">{course.title}</h3>
                                    {course.description && <p className="text-xs text-slate-400 line-clamp-2 mb-4">{course.description}</p>}
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                        <span className="font-black text-primary-600">
                                            {course.priceText || (course.price > 0 ? `${course.price.toLocaleString()} ${t('د.ع', 'IQD')}` : t('مجاناً', 'Free'))}
                                        </span>
                                        <Link to={`/courses/${course.id}`} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition flex items-center gap-1">
                                            {t('سجّل الآن', 'Register Now')}
                                            {isEnglish ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Calendar;
