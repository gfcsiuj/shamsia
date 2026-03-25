import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { Testimonial } from '../../types';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Trash2, X, Star, Search, Loader2, Eye, EyeOff, Edit2, MessageSquare } from 'lucide-react';

const TestimonialsAdmin: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [editModal, setEditModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saveLoading, setSaveLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        role: '',
        image: '',
        text: '',
        rating: 5,
        isVisible: true,
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const snap = await db.collection('testimonials').orderBy('createdAt', 'desc').get();
            setTestimonials(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial)));
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const openAdd = () => {
        setEditingId(null);
        setFormData({ name: '', role: '', image: '', text: '', rating: 5, isVisible: true });
        setEditModal(true);
    };

    const openEdit = (t: Testimonial) => {
        setEditingId(t.id);
        setFormData({ name: t.name, role: t.role, image: t.image, text: t.text, rating: t.rating, isVisible: t.isVisible });
        setEditModal(true);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.text) {
            alert('يرجى ملء الحقول المطلوبة');
            return;
        }
        setSaveLoading(true);
        try {
            if (editingId) {
                await db.collection('testimonials').doc(editingId).update({
                    ...formData,
                });
            } else {
                await db.collection('testimonials').add({
                    ...formData,
                    createdAt: new Date().toISOString(),
                });
            }
            setEditModal(false);
            fetchTestimonials();
        } catch (error) {
            console.error('Error saving:', error);
            alert('حدث خطأ أثناء الحفظ');
        } finally {
            setSaveLoading(false);
        }
    };

    const toggleVisibility = async (id: string, current: boolean) => {
        try {
            await db.collection('testimonials').doc(id).update({ isVisible: !current });
            setTestimonials(prev => prev.map(t => t.id === id ? { ...t, isVisible: !current } : t));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا الرأي؟')) return;
        try {
            await db.collection('testimonials').doc(id).delete();
            setTestimonials(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const filtered = testimonials.filter(t => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return t.name.toLowerCase().includes(q) || t.text.toLowerCase().includes(q);
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-orange-50/20 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-teal-600 to-emerald-700 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden mb-6 md:mb-8">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDRtLTQgNGg0bS00IDRoNE00MCAxNGg0bS00IDRoNG0tNCA0aDQiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between relative z-10 gap-4">
                        <div className="flex items-center gap-4">
                            <Link to="/admin/dashboard" className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition text-white">
                                <ArrowRight size={20} />
                            </Link>
                            <div>
                                <h1 className="text-2xl md:text-4xl font-black text-white mb-1 md:mb-2 italic tracking-tight">💬 آراء المتدربين</h1>
                                <p className="text-teal-100 text-sm md:text-lg font-medium">إدارة تقييمات وآراء المتدربين</p>
                            </div>
                        </div>
                        <button onClick={openAdd} className="bg-white text-teal-700 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto">
                            <Plus size={20} /> إضافة رأي
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center"><MessageSquare className="text-teal-600" size={20} /></div>
                            <span className="text-sm font-bold text-slate-500">إجمالي الآراء</span>
                        </div>
                        <div className="text-3xl font-black text-slate-900">{testimonials.length}</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center"><Eye className="text-green-600" size={20} /></div>
                            <span className="text-sm font-bold text-slate-500">ظاهرة</span>
                        </div>
                        <div className="text-3xl font-black text-slate-900">{testimonials.filter(t => t.isVisible).length}</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center"><Star className="text-yellow-600" size={20} /></div>
                            <span className="text-sm font-bold text-slate-500">متوسط التقييم</span>
                        </div>
                        <div className="text-3xl font-black text-slate-900">
                            {testimonials.length > 0 ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1) : '—'}
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-6">
                    <div className="relative">
                        <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="بحث بالاسم أو المحتوى..." className="w-full pr-12 pl-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-teal-400" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    </div>
                </div>

                {/* List */}
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-teal-600" size={40} /></div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 font-bold">لا توجد آراء</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filtered.map(t => (
                            <div key={t.id} className={`bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all ${t.isVisible ? 'border-slate-100' : 'border-dashed border-slate-300 opacity-60'}`}>
                                <div className="flex items-start gap-4">
                                    {t.image ? (
                                        <img src={t.image} alt={t.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                                    ) : (
                                        <div className="w-14 h-14 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0 text-teal-600 font-black text-xl">
                                            {t.name?.charAt(0)}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-black text-slate-900">{t.name}</span>
                                            {!t.isVisible && <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-bold">مخفي</span>}
                                        </div>
                                        <p className="text-xs text-slate-400 mb-2">{t.role}</p>
                                        <div className="flex gap-0.5 mb-3">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star key={s} size={14} className={s <= t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'} />
                                            ))}
                                        </div>
                                        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">"{t.text}"</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t border-slate-100">
                                    <button onClick={() => openEdit(t)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition" title="تعديل"><Edit2 size={16} /></button>
                                    <button onClick={() => toggleVisibility(t.id, t.isVisible)} className="p-2 hover:bg-slate-50 rounded-lg transition" title={t.isVisible ? 'إخفاء' : 'إظهار'}>
                                        {t.isVisible ? <EyeOff size={16} className="text-slate-400" /> : <Eye size={16} className="text-green-600" />}
                                    </button>
                                    <button onClick={() => handleDelete(t.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition" title="حذف"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add/Edit Modal */}
                {editModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setEditModal(false)}>
                        <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black text-slate-900 italic">{editingId ? 'تعديل الرأي' : 'إضافة رأي جديد'}</h2>
                                <button onClick={() => setEditModal(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center"><X size={20} /></button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">الاسم *</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-teal-400 font-medium" placeholder="اسم المتدرب..." value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">الوظيفة/الدور</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-teal-400 font-medium" placeholder="مثال: طالب هندسة..." value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">رابط الصورة</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-teal-400 font-medium ltr" placeholder="https://..." value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">النص *</label>
                                    <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-teal-400 font-medium resize-none" rows={4} placeholder="رأي المتدرب..." value={formData.text} onChange={e => setFormData({ ...formData, text: e.target.value })}></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">التقييم</label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <button key={s} type="button" onClick={() => setFormData({ ...formData, rating: s })} className="p-1">
                                                <Star size={28} className={s <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={formData.isVisible} onChange={e => setFormData({ ...formData, isVisible: e.target.checked })} className="w-5 h-5 accent-teal-600 rounded" />
                                    <span className="font-bold text-sm text-slate-700">ظاهر في الموقع</span>
                                </label>
                            </div>
                            <button onClick={handleSave} disabled={saveLoading} className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-black py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
                                {saveLoading ? <Loader2 className="animate-spin" size={20} /> : null}
                                {saveLoading ? 'جاري الحفظ...' : editingId ? 'تحديث' : 'إضافة'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestimonialsAdmin;
