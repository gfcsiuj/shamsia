import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { Link } from 'react-router-dom';
import { ArrowRight, Trash2, CheckCircle, Clock, XCircle, Eye, X, Mail, Phone, User, BookOpen, MessageCircle, Filter, Loader2, Search, UserCheck, Briefcase, Award, Share2, FileText, Download, ExternalLink } from 'lucide-react';

interface Registration {
    id: string;
    name: string;
    email: string;
    phone: string;
    jobTitle?: string;
    paymentMethod?: string;
    courseId?: string;
    courseTitle?: string;
    message?: string;
    // Trainer fields
    experience?: string;
    jobTitles?: string[];
    certifications?: string[];
    socials?: { type: string; value: string }[];
    attachments?: { name: string; url?: string; type: string; size?: number }[];
    type: 'course' | 'contact' | 'trainer';
    status: string;
    createdAt: string;
}

const RegistrationsAdmin: React.FC = () => {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'course' | 'contact' | 'trainer'>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selected, setSelected] = useState<Registration | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loadedFileUrls, setLoadedFileUrls] = useState<Record<string, string>>({});
    const [loadingFile, setLoadingFile] = useState<string | null>(null);

    // Load a file from chunks subcollection and open it
    const openTrainerFile = async (regId: string, fileIndex: number, fileName: string, fileType: string) => {
        const cacheKey = `${regId}_${fileIndex}`;
        // If already loaded, just open it
        if (loadedFileUrls[cacheKey]) {
            window.open(loadedFileUrls[cacheKey], '_blank');
            return;
        }
        setLoadingFile(cacheKey);
        try {
            // Fetch ALL chunks for this registration (no composite index needed)
            const chunksSnap = await db.collection('registrations').doc(regId)
                .collection('fileChunks')
                .get();

            if (chunksSnap.empty) {
                alert('لم يتم العثور على بيانات الملف');
                return;
            }

            // Filter by fileIndex and sort by chunkIndex in JS
            const fileChunks = chunksSnap.docs
                .map(doc => doc.data())
                .filter(d => d.fileIndex === fileIndex)
                .sort((a, b) => a.chunkIndex - b.chunkIndex);

            if (fileChunks.length === 0) {
                alert('لم يتم العثور على بيانات الملف');
                return;
            }

            // Reassemble base64 from chunks
            let base64 = '';
            fileChunks.forEach(chunk => {
                base64 += chunk.data;
            });

            // Convert data URL to blob for browser viewing
            try {
                const parts = base64.split(',');
                const byteString = atob(parts[1]);
                const mimeType = parts[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: mimeType });
                const blobUrl = URL.createObjectURL(blob);

                setLoadedFileUrls(prev => ({ ...prev, [cacheKey]: blobUrl }));
                window.open(blobUrl, '_blank');
            } catch {
                // Fallback: open base64 data URL directly
                window.open(base64, '_blank');
            }
        } catch (error) {
            console.error('Error loading file:', error);
            alert('حدث خطأ أثناء تحميل الملف. تأكد من وجود اتصال بالإنترنت.');
        } finally {
            setLoadingFile(null);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const snap = await db.collection('registrations').orderBy('createdAt', 'desc').get();
            const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration));
            setRegistrations(data);
        } catch (error) {
            console.error('Error fetching registrations:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await db.collection('registrations').doc(id).update({ status });
            setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
            if (selected?.id === id) setSelected({ ...selected!, status });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const deleteRegistration = async (id: string) => {
        if (!window.confirm('هل أنت متأكد من الحذف؟')) return;
        try {
            await db.collection('registrations').doc(id).delete();
            setRegistrations(prev => prev.filter(r => r.id !== id));
            if (selected?.id === id) setSelected(null);
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    const filtered = registrations.filter(r => {
        if (filter !== 'all' && r.type !== filter) return false;
        if (statusFilter !== 'all' && r.status !== statusFilter) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return r.name?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q) || r.phone?.includes(q) || r.courseTitle?.toLowerCase().includes(q);
        }
        return true;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">قيد الانتظار</span>;
            case 'approved': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">مقبول</span>;
            case 'rejected': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">مرفوض</span>;
            case 'new': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">جديد</span>;
            default: return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">{status}</span>;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'course': return <BookOpen className="text-emerald-600" size={20} />;
            case 'contact': return <MessageCircle className="text-blue-600" size={20} />;
            case 'trainer': return <UserCheck className="text-purple-600" size={20} />;
            default: return <BookOpen className="text-slate-600" size={20} />;
        }
    };

    const getTypeBgClass = (type: string) => {
        switch (type) {
            case 'course': return 'bg-emerald-100';
            case 'contact': return 'bg-blue-100';
            case 'trainer': return 'bg-purple-100';
            default: return 'bg-slate-100';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'course': return `دورة: ${selected?.courseTitle || ''}`;
            case 'contact': return selected?.message?.slice(0, 60) || '';
            case 'trainer': return 'طلب انضمام كمدرب';
            default: return '';
        }
    };

    const courseRegs = registrations.filter(r => r.type === 'course').length;
    const contactRegs = registrations.filter(r => r.type === 'contact').length;
    const trainerRegs = registrations.filter(r => r.type === 'trainer').length;
    const pendingCount = registrations.filter(r => r.status === 'pending' || r.status === 'new').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-orange-50/20 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-indigo-600 to-purple-700 p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden mb-8">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDRtLTQgNGg0bS00IDRoNE00MCAxNGg0bS00IDRoNG0tNCA0aDQiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <Link to="/admin/dashboard" className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition text-white">
                                <ArrowRight size={20} />
                            </Link>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-white mb-2 italic tracking-tight">📋 إدارة التسجيلات</h1>
                                <p className="text-indigo-100 text-base md:text-lg font-medium">متابعة طلبات التسجيل ورسائل التواصل وطلبات المدربين</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center"><BookOpen className="text-emerald-600" size={20} /></div>
                            <span className="text-sm font-bold text-slate-500">تسجيلات الدورات</span>
                        </div>
                        <div className="text-3xl font-black text-slate-900">{courseRegs}</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><MessageCircle className="text-blue-600" size={20} /></div>
                            <span className="text-sm font-bold text-slate-500">رسائل التواصل</span>
                        </div>
                        <div className="text-3xl font-black text-slate-900">{contactRegs}</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center"><UserCheck className="text-purple-600" size={20} /></div>
                            <span className="text-sm font-bold text-slate-500">طلبات المدربين</span>
                        </div>
                        <div className="text-3xl font-black text-slate-900">{trainerRegs}</div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center"><Clock className="text-yellow-600" size={20} /></div>
                            <span className="text-sm font-bold text-slate-500">قيد الانتظار</span>
                        </div>
                        <div className="text-3xl font-black text-slate-900">{pendingCount}</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-6 flex flex-wrap gap-3 items-center">
                    <div className="flex gap-2">
                        {(['all', 'course', 'contact', 'trainer'] as const).map(f => (
                            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-bold transition ${filter === f ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                {f === 'all' ? 'الكل' : f === 'course' ? 'تسجيلات' : f === 'contact' ? 'رسائل' : 'طلبات مدربين'}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        {['all', 'pending', 'new', 'approved', 'rejected'].map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${statusFilter === s ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                                {s === 'all' ? 'كل الحالات' : s === 'pending' ? 'انتظار' : s === 'new' ? 'جديد' : s === 'approved' ? 'مقبول' : 'مرفوض'}
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="بحث بالاسم أو الهاتف أو الدورة..." className="w-full pr-10 pl-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* List */}
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 font-bold">لا توجد تسجيلات</div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map(reg => (
                            <div key={reg.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4 cursor-pointer group" onClick={() => setSelected(reg)}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getTypeBgClass(reg.type)}`}>
                                    {getTypeIcon(reg.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-black text-slate-900">{reg.name}</span>
                                        {getStatusBadge(reg.status)}
                                        {reg.type === 'trainer' && <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-bold">مدرب</span>}
                                    </div>
                                    <div className="text-xs text-slate-400 truncate">
                                        {reg.type === 'course' ? `دورة: ${reg.courseTitle}` : reg.type === 'trainer' ? 'طلب انضمام كمدرب' : reg.message?.slice(0, 60)}
                                    </div>
                                </div>
                                <div className="text-xs text-slate-400 hidden md:block">
                                    {new Date(reg.createdAt).toLocaleDateString('ar-IQ')}
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                                    <button onClick={e => { e.stopPropagation(); updateStatus(reg.id, 'approved'); }} className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition" title="قبول"><CheckCircle size={18} /></button>
                                    <button onClick={e => { e.stopPropagation(); updateStatus(reg.id, 'rejected'); }} className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition" title="رفض"><XCircle size={18} /></button>
                                    <button onClick={e => { e.stopPropagation(); deleteRegistration(reg.id); }} className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition" title="حذف"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Detail Modal */}
                {selected && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)}>
                        <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black text-slate-900 italic">
                                    {selected.type === 'trainer' ? 'طلب انضمام مدرب' : 'تفاصيل الطلب'}
                                </h2>
                                <button onClick={() => setSelected(null)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center"><X size={20} /></button>
                            </div>
                            <div className="space-y-4">
                                {/* Common fields */}
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                    <User size={18} className="text-slate-400" /><div><span className="text-xs text-slate-400 block">الاسم</span><span className="font-bold text-slate-800">{selected.name}</span></div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                    <Mail size={18} className="text-slate-400" /><div><span className="text-xs text-slate-400 block">البريد</span><span className="font-bold text-slate-800">{selected.email}</span></div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                    <Phone size={18} className="text-slate-400" /><div><span className="text-xs text-slate-400 block">الهاتف</span><span className="font-bold text-slate-800 ltr">{selected.phone}</span></div>
                                </div>

                                {/* Course-specific */}
                                {selected.type === 'course' && (
                                    <>
                                        <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                                            <BookOpen size={18} className="text-emerald-600" /><div><span className="text-xs text-emerald-500 block">الدورة</span><span className="font-bold text-emerald-800">{selected.courseTitle}</span></div>
                                        </div>
                                        {selected.jobTitle && <div className="p-3 bg-slate-50 rounded-xl"><span className="text-xs text-slate-400 block">الوظيفة</span><span className="font-bold text-slate-800">{selected.jobTitle}</span></div>}
                                        {selected.paymentMethod && <div className="p-3 bg-slate-50 rounded-xl"><span className="text-xs text-slate-400 block">طريقة الدفع</span><span className="font-bold text-slate-800">{selected.paymentMethod === 'zaincash' ? 'زين كاش' : 'نقدي'}</span></div>}
                                    </>
                                )}

                                {/* Contact-specific */}
                                {selected.type === 'contact' && selected.message && (
                                    <div className="p-4 bg-blue-50 rounded-xl"><span className="text-xs text-blue-500 block mb-2">الرسالة</span><p className="text-sm text-slate-700 leading-relaxed">{selected.message}</p></div>
                                )}

                                {/* Trainer-specific */}
                                {selected.type === 'trainer' && (
                                    <>
                                        {/* Experience */}
                                        {selected.experience && (
                                            <div className="p-4 bg-blue-50 rounded-xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Briefcase size={14} className="text-blue-600" />
                                                    <span className="text-xs text-blue-600 font-bold">الخبرات العلمية والعملية</span>
                                                </div>
                                                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{selected.experience}</p>
                                            </div>
                                        )}

                                        {/* Job Titles */}
                                        {selected.jobTitles && selected.jobTitles.length > 0 && (
                                            <div className="p-4 bg-purple-50 rounded-xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Briefcase size={14} className="text-purple-600" />
                                                    <span className="text-xs text-purple-600 font-bold">المسميات الوظيفية</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {selected.jobTitles.map((jt, i) => (
                                                        <span key={i} className="px-3 py-1 bg-white rounded-lg text-xs font-bold text-purple-700 border border-purple-200">{jt}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Certifications */}
                                        {selected.certifications && selected.certifications.length > 0 && (
                                            <div className="p-4 bg-amber-50 rounded-xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Award size={14} className="text-amber-600" />
                                                    <span className="text-xs text-amber-600 font-bold">الشهادات والاعتمادات</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {selected.certifications.map((cert, i) => (
                                                        <span key={i} className="px-3 py-1 bg-white rounded-lg text-xs font-bold text-amber-700 border border-amber-200">{cert}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Social Links */}
                                        {selected.socials && selected.socials.length > 0 && (
                                            <div className="p-4 bg-teal-50 rounded-xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Share2 size={14} className="text-teal-600" />
                                                    <span className="text-xs text-teal-600 font-bold">قنوات التواصل</span>
                                                </div>
                                                <div className="space-y-1.5">
                                                    {selected.socials.map((s, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-sm">
                                                            <span className="px-2 py-0.5 bg-white rounded text-[10px] font-bold text-teal-600 border border-teal-200 uppercase">{s.type}</span>
                                                            <span className="text-slate-700 truncate">{s.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Attachments */}
                                        {selected.attachments && selected.attachments.length > 0 && (
                                            <div className="p-4 bg-rose-50 rounded-xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FileText size={14} className="text-rose-600" />
                                                    <span className="text-xs text-rose-600 font-bold">الملفات المرفقة ({selected.attachments.length})</span>
                                                </div>
                                                <div className="space-y-2">
                                                    {selected.attachments.map((att, i) => {
                                                        const cacheKey = `${selected.id}_${i}`;
                                                        const isLoading = loadingFile === cacheKey;
                                                        return (
                                                            <button
                                                                key={i}
                                                                onClick={() => {
                                                                    if (att.url && att.url.startsWith('http')) {
                                                                        window.open(att.url, '_blank');
                                                                    } else {
                                                                        openTrainerFile(selected.id, i, att.name, att.type);
                                                                    }
                                                                }}
                                                                disabled={isLoading}
                                                                className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-rose-200 hover:border-rose-400 transition group w-full text-right disabled:opacity-50"
                                                            >
                                                                <div className="w-10 h-10 rounded bg-rose-100 flex items-center justify-center flex-shrink-0">
                                                                    {isLoading ? (
                                                                        <Loader2 size={16} className="text-rose-500 animate-spin" />
                                                                    ) : att.type?.startsWith('image/') ? (
                                                                        <Eye size={16} className="text-rose-500" />
                                                                    ) : (
                                                                        <FileText size={16} className="text-rose-500" />
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0 text-start">
                                                                    <span className="text-sm font-bold text-slate-700 truncate block">{att.name}</span>
                                                                    {att.size && <span className="text-[10px] text-slate-400">{(att.size / 1024).toFixed(0)} KB</span>}
                                                                </div>
                                                                <ExternalLink size={14} className="text-slate-400 group-hover:text-rose-500 transition flex-shrink-0" />
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Status & Date — always shown */}
                                <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                                    <span className="text-xs text-slate-400">الحالة</span>{getStatusBadge(selected.status)}
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                                    <span className="text-xs text-slate-400">التاريخ</span><span className="text-sm font-bold text-slate-600">{new Date(selected.createdAt).toLocaleString('ar-IQ')}</span>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button onClick={() => updateStatus(selected.id, 'approved')} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"><CheckCircle size={18} /> قبول</button>
                                <button onClick={() => updateStatus(selected.id, 'rejected')} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition flex items-center justify-center gap-2"><XCircle size={18} /> رفض</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegistrationsAdmin;
