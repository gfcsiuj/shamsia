import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { CalendarEntry, Course } from '../../types';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import {
    LogOut, LayoutDashboard, BookOpen, Users, Settings, ClipboardList, Award,
    MessageSquare, GraduationCap, ExternalLink, Sparkles, Calendar,
    Plus, Pencil, Trash2, X, Save, Loader2, CheckCircle, AlertCircle, ChevronDown
} from 'lucide-react';
import { getCategoryLabel } from '../../constants';

const STATUS_OPTIONS = [
    { value: 'upcoming', label: 'قادمة', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'ongoing', label: 'جارية', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { value: 'completed', label: 'منتهية', color: 'bg-slate-100 text-slate-600 border-slate-200' },
    { value: 'cancelled', label: 'ملغاة', color: 'bg-red-100 text-red-600 border-red-200' },
] as const;

const EMPTY_FORM: Omit<CalendarEntry, 'id'> = {
    courseId: '',
    courseTitle: '',
    category: '',
    startDate: '',
    endDate: '',
    lecturesCount: undefined,
    duration: '',
    instructor: '',
    location: '',
    status: 'upcoming',
    notes: '',
    price: undefined,
    priceText: '',
    createdAt: '',
};

const CalendarAdmin: React.FC = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState<CalendarEntry[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEntry, setEditingEntry] = useState<CalendarEntry | null>(null);
    const [form, setForm] = useState<Omit<CalendarEntry, 'id'>>(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const showToast = (type: 'success' | 'error', msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3500);
    };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [entriesSnap, coursesSnap] = await Promise.all([
                    db.collection('calendarEntries').orderBy('createdAt', 'desc').get().catch(() =>
                        db.collection('calendarEntries').get()
                    ),
                    db.collection('courses').get(),
                ]);
                setEntries(entriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as CalendarEntry)));
                setCourses(coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course)));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const openAdd = () => {
        setEditingEntry(null);
        setForm(EMPTY_FORM);
        setShowModal(true);
    };

    const openEdit = (entry: CalendarEntry) => {
        setEditingEntry(entry);
        setForm({ ...entry });
        setShowModal(true);
    };

    const handleCourseSelect = (courseId: string) => {
        const course = courses.find(c => c.id === courseId);
        if (course) {
            setForm(f => ({
                ...f,
                courseId: course.id,
                courseTitle: course.title,
                category: course.category,
                duration: course.duration || f.duration,
                lecturesCount: course.lecturesCount || f.lecturesCount,
                price: course.price ?? f.price,
                priceText: course.priceText || f.priceText,
                startDate: course.startDate || f.startDate,
                endDate: course.endDate || f.endDate,
            }));
        } else {
            setForm(f => ({ ...f, courseId: '' }));
        }
    };

    const handleSave = async () => {
        if (!form.courseId || !form.startDate) {
            showToast('error', 'يرجى اختيار الكورس وتاريخ البدء');
            return;
        }
        setSaving(true);
        try {
            const payload = { ...form, createdAt: editingEntry?.createdAt || new Date().toISOString() };
            if (editingEntry) {
                await db.collection('calendarEntries').doc(editingEntry.id).set(payload);
                setEntries(prev => prev.map(e => e.id === editingEntry.id ? { ...payload, id: editingEntry.id } : e));
                showToast('success', 'تم تحديث الإدخال بنجاح');
            } else {
                const ref = await db.collection('calendarEntries').add(payload);
                setEntries(prev => [{ ...payload, id: ref.id }, ...prev]);
                showToast('success', 'تم إضافة الإدخال بنجاح');
            }
            setShowModal(false);
        } catch (e) {
            console.error(e);
            showToast('error', 'حدث خطأ أثناء الحفظ');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await db.collection('calendarEntries').doc(id).delete();
            setEntries(prev => prev.filter(e => e.id !== id));
            showToast('success', 'تم حذف الإدخال');
        } catch {
            showToast('error', 'فشل الحذف');
        } finally {
            setDeleteId(null);
        }
    };

    const handleLogout = async () => {
        await auth.signOut();
        navigate('/admin/login');
    };

    const getStatusStyle = (status: string) =>
        STATUS_OPTIONS.find(s => s.value === status)?.color || 'bg-slate-100 text-slate-600 border-slate-200';
    const getStatusLabel = (status: string) =>
        STATUS_OPTIONS.find(s => s.value === status)?.label || status;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-orange-50/20 flex" dir="rtl">
            {/* Sidebar */}
            <aside className="w-72 bg-gradient-to-b from-primary-900 via-primary-800 to-primary-900 text-white hidden md:flex flex-col fixed h-full shadow-2xl z-40">
                <div className="p-6 border-b border-primary-700/50 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary-500/10 to-transparent" />
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center shadow-lg">
                            <LayoutDashboard className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">لوحة التحكم</h2>
                            <p className="text-xs text-primary-200">منصة شمسية</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {[
                        { to: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'الرئيسية' },
                        { to: '/admin/courses', icon: <BookOpen size={20} />, label: 'إدارة الدورات' },
                        { to: '/admin/instructors', icon: <Users size={20} />, label: 'إدارة المدربين' },
                        { to: '/admin/graduates', icon: <GraduationCap size={20} />, label: 'إدارة الخريجين' },
                        { to: '/admin/registrations', icon: <ClipboardList size={20} />, label: 'إدارة التسجيلات' },
                        { to: '/admin/certificates', icon: <Award size={20} />, label: 'الشهادات' },
                        { to: '/admin/testimonials', icon: <MessageSquare size={20} />, label: 'آراء المتدربين' },
                        { to: '/admin/settings', icon: <Settings size={20} />, label: 'إعدادات الموقع' },
                    ].map(item => (
                        <Link key={item.to} to={item.to} className="group flex items-center gap-3 px-4 py-3.5 hover:bg-primary-800/60 rounded-xl text-primary-100 transition-all duration-300 hover:translate-x-1">
                            <div className="w-10 h-10 rounded-lg bg-white/5 group-hover:bg-white/20 flex items-center justify-center transition-all">{item.icon}</div>
                            <span className="font-medium group-hover:text-white">{item.label}</span>
                        </Link>
                    ))}
                    <Link to="/admin/calendar" className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-primary-700 to-primary-800 rounded-xl text-white font-semibold shadow-lg">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/30 flex items-center justify-center"><Calendar size={20} /></div>
                        <span>إدارة التقويم</span>
                    </Link>
                    <div className="pt-4 mt-4 border-t border-primary-700/50">
                        <Link to="/" target="_blank" className="group flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-secondary-600/20 to-secondary-500/20 hover:from-secondary-600 hover:to-secondary-500 rounded-xl text-secondary-300 hover:text-white transition-all duration-300 font-bold">
                            <ExternalLink size={20} /><span>عرض الموقع</span>
                            <Sparkles size={16} className="mr-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>
                </nav>
                <div className="p-4 border-t border-primary-700/50">
                    <button onClick={handleLogout} className="flex items-center gap-3 text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all w-full px-4 py-3 rounded-xl font-medium">
                        <LogOut size={20} /><span>تسجيل الخروج</span>
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 md:mr-72 p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 italic">إدارة التقويم</h1>
                        <p className="text-slate-500 mt-1">إضافة وتعديل مواعيد الدورات في التقويم</p>
                    </div>
                    <button onClick={openAdd} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5 transition-all">
                        <Plus size={20} /> إضافة إدخال جديد
                    </button>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="flex justify-center py-24"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>
                ) : entries.length === 0 ? (
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center py-24 gap-4">
                        <Calendar size={56} className="text-slate-300" />
                        <p className="text-slate-400 font-bold text-lg">لا توجد إدخالات بعد</p>
                        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition">
                            <Plus size={16} /> أضف أول إدخال
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="text-right px-5 py-4 font-black text-slate-600 text-xs uppercase tracking-wider">#</th>
                                        <th className="text-right px-5 py-4 font-black text-slate-600 text-xs uppercase tracking-wider">الكورس</th>
                                        <th className="text-right px-5 py-4 font-black text-slate-600 text-xs uppercase tracking-wider">تاريخ البدء</th>
                                        <th className="text-right px-5 py-4 font-black text-slate-600 text-xs uppercase tracking-wider">تاريخ الانتهاء</th>
                                        <th className="text-right px-5 py-4 font-black text-slate-600 text-xs uppercase tracking-wider">المحاضرات</th>
                                        <th className="text-right px-5 py-4 font-black text-slate-600 text-xs uppercase tracking-wider">المدة</th>
                                        <th className="text-right px-5 py-4 font-black text-slate-600 text-xs uppercase tracking-wider">الموقع</th>
                                        <th className="text-right px-5 py-4 font-black text-slate-600 text-xs uppercase tracking-wider">الحالة</th>
                                        <th className="text-right px-5 py-4 font-black text-slate-600 text-xs uppercase tracking-wider">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {entries.map((entry, i) => (
                                        <tr key={entry.id} className="hover:bg-slate-50/70 transition group">
                                            <td className="px-5 py-4 text-slate-400 font-bold">{i + 1}</td>
                                            <td className="px-5 py-4">
                                                <div className="font-bold text-slate-800 line-clamp-1">{entry.courseTitle}</div>
                                                <div className="text-xs text-slate-400 mt-0.5">{getCategoryLabel(entry.category)}</div>
                                            </td>
                                            <td className="px-5 py-4 font-medium text-slate-700">{entry.startDate || '—'}</td>
                                            <td className="px-5 py-4 font-medium text-slate-700">{entry.endDate || '—'}</td>
                                            <td className="px-5 py-4 text-slate-700">{entry.lecturesCount ? `${entry.lecturesCount} محاضرة` : '—'}</td>
                                            <td className="px-5 py-4 text-slate-700">{entry.duration || '—'}</td>
                                            <td className="px-5 py-4 text-slate-700">{entry.location || '—'}</td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(entry.status)}`}>
                                                    {getStatusLabel(entry.status)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                                                    <button onClick={() => openEdit(entry)} className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition" title="تعديل">
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button onClick={() => setDeleteId(entry.id)} className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition" title="حذف">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir="rtl">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <h2 className="text-xl font-black text-slate-900">{editingEntry ? 'تعديل الإدخال' : 'إضافة إدخال جديد'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-slate-100 transition text-slate-500">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Course Select */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">الكورس <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <select
                                        value={form.courseId}
                                        onChange={e => handleCourseSelect(e.target.value)}
                                        className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white pr-10"
                                    >
                                        <option value="">— اختر كورساً —</option>
                                        {courses.map(c => (
                                            <option key={c.id} value={c.id}>{c.title}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Dates Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">تاريخ البدء <span className="text-red-500">*</span></label>
                                    <input type="text" placeholder="مثال: 2026/03/01" value={form.startDate}
                                        onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">تاريخ الانتهاء</label>
                                    <input type="text" placeholder="مثال: 2026/03/30" value={form.endDate || ''}
                                        onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                                </div>
                            </div>

                            {/* Lectures & Duration Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">عدد المحاضرات</label>
                                    <input type="number" placeholder="0" value={form.lecturesCount ?? ''}
                                        onChange={e => setForm(f => ({ ...f, lecturesCount: e.target.value ? Number(e.target.value) : undefined }))}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">المدة</label>
                                    <input type="text" placeholder="مثال: 4 أسابيع" value={form.duration || ''}
                                        onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                                </div>
                            </div>

                            {/* Instructor & Location Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">المدرب</label>
                                    <input type="text" placeholder="اسم المدرب" value={form.instructor || ''}
                                        onChange={e => setForm(f => ({ ...f, instructor: e.target.value }))}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">الموقع</label>
                                    <input type="text" placeholder="مثال: أونلاين / حضوري" value={form.location || ''}
                                        onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">الحالة</label>
                                <div className="flex gap-2 flex-wrap">
                                    {STATUS_OPTIONS.map(opt => (
                                        <button key={opt.value} onClick={() => setForm(f => ({ ...f, status: opt.value as CalendarEntry['status'] }))}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${form.status === opt.value ? opt.color + ' ring-2 ring-offset-1 ring-current' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}>
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">السعر (د.ع)</label>
                                    <input type="number" placeholder="0" value={form.price ?? ''}
                                        onChange={e => setForm(f => ({ ...f, price: e.target.value ? Number(e.target.value) : undefined }))}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">نص السعر (اختياري)</label>
                                    <input type="text" placeholder="مثال: مجاناً / حسب الطلب" value={form.priceText || ''}
                                        onChange={e => setForm(f => ({ ...f, priceText: e.target.value }))}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">ملاحظات</label>
                                <textarea rows={3} placeholder="أي ملاحظات إضافية..." value={form.notes || ''}
                                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none" />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
                            <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition">إلغاء</button>
                            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition disabled:opacity-50">
                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {editingEntry ? 'حفظ التعديلات' : 'إضافة الإدخال'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir="rtl">
                    <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-sm w-full text-center">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={28} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">تأكيد الحذف</h3>
                        <p className="text-slate-500 mb-6">هل أنت متأكد من حذف هذا الإدخال؟ لا يمكن التراجع.</p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition">إلغاء</button>
                            <button onClick={() => handleDelete(deleteId)} className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition">حذف</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-6 left-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl font-bold text-white transition-all animate-fade-up ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
                    {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {toast.msg}
                </div>
            )}
        </div>
    );
};

export default CalendarAdmin;
