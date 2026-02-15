import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { Certificate, Course } from '../../types';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Trash2, X, Award, Search, Loader2, Eye, Copy, CheckCircle, XCircle, QrCode, GraduationCap, Building2, Users, Image as ImageIcon } from 'lucide-react';

// QR Code via free API
const generateQRDataUrl = (text: string) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;

const generateCertificateNumber = () => {
    const prefix = 'SHAM';
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${year}-${random}`;
};

interface Instructor { id: string; name: string; image?: string; }
interface TrainerCert { id: string; instructorId: string; instructorName: string; title: string; description: string; images: string[]; createdAt: string; }
interface CompanyCert { id: string; name: string; frontImage: string; backImage?: string; createdAt: string; }

const CertificatesAdmin: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'students' | 'trainers' | 'company'>('students');

    // ─── Student Certificates State ───
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [issueModal, setIssueModal] = useState(false);
    const [viewCert, setViewCert] = useState<Certificate | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [saveLoading, setSaveLoading] = useState(false);
    const [copiedId, setCopiedId] = useState('');
    const [studentForm, setStudentForm] = useState({ studentName: '', courseId: '' });

    // ─── Trainer Certificates State ───
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [trainerCerts, setTrainerCerts] = useState<TrainerCert[]>([]);
    const [trainerLoading, setTrainerLoading] = useState(true);
    const [trainerModal, setTrainerModal] = useState(false);
    const [trainerForm, setTrainerForm] = useState({ instructorId: '', title: '', description: '', images: [''] });

    // ─── Company Certificates State ───
    const [companyCerts, setCompanyCerts] = useState<CompanyCert[]>([]);
    const [companyLoading, setCompanyLoading] = useState(true);
    const [companyModal, setCompanyModal] = useState(false);
    const [companyForm, setCompanyForm] = useState({ name: '', frontImage: '', backImage: '' });

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        try {
            setLoading(true); setTrainerLoading(true); setCompanyLoading(true);
            const [certsSnap, coursesSnap, instrSnap, tCertsSnap, cCertsSnap] = await Promise.all([
                db.collection('certificates').orderBy('issueDate', 'desc').get(),
                db.collection('courses').get(),
                db.collection('instructors').get(),
                db.collection('trainerCertificates').orderBy('createdAt', 'desc').get(),
                db.collection('companyCertificates').orderBy('createdAt', 'desc').get(),
            ]);
            setCertificates(certsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Certificate)));
            setCourses(coursesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Course)));
            setInstructors(instrSnap.docs.map(d => ({ id: d.id, name: d.data().name, image: d.data().image } as Instructor)));
            setTrainerCerts(tCertsSnap.docs.map(d => ({ id: d.id, ...d.data() } as TrainerCert)));
            setCompanyCerts(cCertsSnap.docs.map(d => ({ id: d.id, ...d.data() } as CompanyCert)));
        } catch (err) { console.error(err); }
        finally { setLoading(false); setTrainerLoading(false); setCompanyLoading(false); }
    };

    // ─── Student handlers ───
    const handleIssueCertificate = async () => {
        if (!studentForm.studentName || !studentForm.courseId) return alert('يرجى ملء جميع الحقول');
        setSaveLoading(true);
        try {
            const course = courses.find(c => c.id === studentForm.courseId);
            const certNumber = generateCertificateNumber();
            const qrCode = generateQRDataUrl(`${window.location.origin}/verify/${certNumber}`);
            await db.collection('certificates').add({
                studentName: studentForm.studentName, courseId: studentForm.courseId,
                courseTitle: course?.title || '', issueDate: new Date().toISOString(),
                certificateNumber: certNumber, qrCode, status: 'issued',
            });
            setIssueModal(false); setStudentForm({ studentName: '', courseId: '' }); fetchAll();
        } catch (err) { console.error(err); alert('حدث خطأ'); }
        finally { setSaveLoading(false); }
    };

    const handleRevoke = async (id: string) => {
        if (!window.confirm('هل تريد إلغاء هذه الشهادة؟')) return;
        await db.collection('certificates').doc(id).update({ status: 'revoked' });
        setCertificates(prev => prev.map(c => c.id === id ? { ...c, status: 'revoked' } : c));
    };

    const handleDeleteStudent = async (id: string) => {
        if (!window.confirm('حذف الشهادة؟')) return;
        await db.collection('certificates').doc(id).delete();
        setCertificates(prev => prev.filter(c => c.id !== id));
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(''), 2000);
    };

    // ─── Trainer handlers ───
    const handleSaveTrainer = async () => {
        if (!trainerForm.instructorId || !trainerForm.title) return alert('يرجى ملء الحقول المطلوبة');
        setSaveLoading(true);
        try {
            const instr = instructors.find(i => i.id === trainerForm.instructorId);
            await db.collection('trainerCertificates').add({
                ...trainerForm, instructorName: instr?.name || '',
                images: trainerForm.images.filter(i => i.trim()),
                createdAt: new Date().toISOString(),
            });
            setTrainerModal(false); setTrainerForm({ instructorId: '', title: '', description: '', images: [''] }); fetchAll();
        } catch (err) { console.error(err); alert('حدث خطأ'); }
        finally { setSaveLoading(false); }
    };

    const handleDeleteTrainer = async (id: string) => {
        if (!window.confirm('حذف الشهادة؟')) return;
        await db.collection('trainerCertificates').doc(id).delete();
        setTrainerCerts(prev => prev.filter(c => c.id !== id));
    };

    // ─── Company handlers ───
    const handleSaveCompany = async () => {
        if (!companyForm.name || !companyForm.frontImage) return alert('يرجى ملء الاسم وصورة الوجه');
        setSaveLoading(true);
        try {
            await db.collection('companyCertificates').add({ ...companyForm, createdAt: new Date().toISOString() });
            setCompanyModal(false); setCompanyForm({ name: '', frontImage: '', backImage: '' }); fetchAll();
        } catch (err) { console.error(err); alert('حدث خطأ'); }
        finally { setSaveLoading(false); }
    };

    const handleDeleteCompany = async (id: string) => {
        if (!window.confirm('حذف الشهادة؟')) return;
        await db.collection('companyCertificates').doc(id).delete();
        setCompanyCerts(prev => prev.filter(c => c.id !== id));
    };

    const filtered = certificates.filter(c => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return c.studentName.toLowerCase().includes(q) || c.courseTitle.toLowerCase().includes(q) || c.certificateNumber.toLowerCase().includes(q);
    });

    const tabs = [
        { id: 'students' as const, label: 'شهادات المتدربين', icon: GraduationCap, color: 'amber' },
        { id: 'trainers' as const, label: 'شهادات المدربين', icon: Users, color: 'teal' },
        { id: 'company' as const, label: 'شهادات الشركة', icon: Building2, color: 'purple' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-orange-50/20 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden mb-8">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDRtLTQgNGg0bS00IDRoNE00MCAxNGg0bS00IDRoNG0tNCA0aDQiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <Link to="/admin/dashboard" className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition text-white">
                                <ArrowRight size={20} />
                            </Link>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-white mb-2 italic tracking-tight">🏆 إدارة الشهادات</h1>
                                <p className="text-amber-100 text-base md:text-lg font-medium">إصدار وإدارة جميع أنواع الشهادات</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-2 mb-8">
                    <div className="flex gap-1">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            const colors: Record<string, string> = { amber: 'from-amber-500 to-orange-500', teal: 'from-teal-500 to-emerald-600', purple: 'from-purple-500 to-indigo-600' };
                            return (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${isActive ? `bg-gradient-to-r ${colors[tab.color]} text-white shadow-lg` : 'text-slate-500 hover:bg-slate-50'}`}>
                                    <Icon size={18} /> {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ═══════════════════  TAB 1: Student Certificates ═══════════════════ */}
                {activeTab === 'students' && (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-slate-800">شهادات المتدربين</h2>
                            <button onClick={() => setIssueModal(true)} className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition shadow-lg">
                                <Plus size={18} /> إصدار شهادة
                            </button>
                        </div>

                        {/* Search */}
                        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-6">
                            <div className="relative">
                                <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input type="text" placeholder="بحث بالاسم أو رقم الشهادة..." className="w-full pr-12 pl-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-amber-400" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-600" size={40} /></div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-20 text-slate-400 font-bold">لا توجد شهادات</div>
                        ) : (
                            <div className="space-y-3">
                                {filtered.map(cert => (
                                    <div key={cert.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${cert.status === 'issued' ? 'bg-amber-100' : 'bg-red-100'}`}>
                                            <Award className={cert.status === 'issued' ? 'text-amber-600' : 'text-red-600'} size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-black text-slate-900">{cert.studentName}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cert.status === 'issued' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {cert.status === 'issued' ? 'فعالة' : 'ملغاة'}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-400">{cert.courseTitle}</div>
                                        </div>
                                        <div className="hidden md:flex items-center gap-2">
                                            <code className="text-xs bg-slate-50 px-3 py-1.5 rounded-lg font-mono text-slate-600 border">{cert.certificateNumber}</code>
                                            <button onClick={() => copyToClipboard(cert.certificateNumber, cert.id)} className="p-2 hover:bg-slate-50 rounded-lg transition">
                                                {copiedId === cert.id ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} className="text-slate-400" />}
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => setViewCert(cert)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition"><Eye size={18} /></button>
                                            {cert.status === 'issued' && <button onClick={() => handleRevoke(cert.id)} className="p-2 hover:bg-orange-50 rounded-lg text-orange-600 transition"><XCircle size={18} /></button>}
                                            <button onClick={() => handleDeleteStudent(cert.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ═══════════════════  TAB 2: Trainer Certificates ═══════════════════ */}
                {activeTab === 'trainers' && (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-slate-800">شهادات المدربين</h2>
                            <button onClick={() => setTrainerModal(true)} className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition shadow-lg">
                                <Plus size={18} /> إضافة شهادة
                            </button>
                        </div>

                        {trainerLoading ? (
                            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-teal-600" size={40} /></div>
                        ) : trainerCerts.length === 0 ? (
                            <div className="text-center py-20">
                                <Users className="mx-auto mb-4 text-slate-300" size={48} />
                                <p className="text-slate-400 font-bold">لم يتم إضافة شهادات مدربين بعد</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {trainerCerts.map(tc => (
                                    <div key={tc.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all group">
                                        {tc.images.length > 0 && (
                                            <div className="h-48 overflow-hidden bg-slate-50">
                                                <img src={tc.images[0]} alt={tc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            </div>
                                        )}
                                        <div className="p-5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full text-[10px] font-bold">{tc.instructorName}</span>
                                            </div>
                                            <h3 className="font-black text-slate-900 mb-1">{tc.title}</h3>
                                            {tc.description && <p className="text-xs text-slate-400 line-clamp-2 mb-3">{tc.description}</p>}
                                            {tc.images.length > 1 && (
                                                <div className="flex gap-1 mb-3">
                                                    {tc.images.slice(1).map((img, i) => (
                                                        <img key={i} src={img} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex justify-end">
                                                <button onClick={() => handleDeleteTrainer(tc.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ═══════════════════  TAB 3: Company Certificates ═══════════════════ */}
                {activeTab === 'company' && (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-slate-800">شهادات الشركة المعتمدة</h2>
                            <button onClick={() => setCompanyModal(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition shadow-lg">
                                <Plus size={18} /> إضافة شهادة
                            </button>
                        </div>

                        {companyLoading ? (
                            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-purple-600" size={40} /></div>
                        ) : companyCerts.length === 0 ? (
                            <div className="text-center py-20">
                                <Building2 className="mx-auto mb-4 text-slate-300" size={48} />
                                <p className="text-slate-400 font-bold">لم يتم إضافة شهادات شركة بعد</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {companyCerts.map(cc => (
                                    <div key={cc.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-lg transition-all">
                                        <div className="relative">
                                            <div className="h-56 bg-emerald-50 overflow-hidden flex items-center justify-center p-4">
                                                <img src={cc.frontImage} alt={cc.name} className="max-w-full max-h-full object-contain rounded-xl shadow-md group-hover:scale-105 transition-transform duration-500" />
                                            </div>
                                            {cc.backImage && (
                                                <div className="absolute top-3 left-3 w-16 h-20 bg-white rounded-lg shadow-lg overflow-hidden border-2 border-white/80 transform -rotate-6 hover:rotate-0 transition-transform cursor-pointer">
                                                    <img src={cc.backImage} alt="خلفية" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5 flex items-center justify-between">
                                            <h3 className="font-black text-slate-900">{cc.name}</h3>
                                            <button onClick={() => handleDeleteCompany(cc.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ═══════ Issue Student Certificate Modal ═══════ */}
                {issueModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIssueModal(false)}>
                        <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black text-slate-900 italic flex items-center gap-2"><Award className="text-amber-600" size={24} /> إصدار شهادة متدرب</h2>
                                <button onClick={() => setIssueModal(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center"><X size={20} /></button>
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">اسم الطالب</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-amber-400 font-medium" placeholder="أدخل اسم الطالب..." value={studentForm.studentName} onChange={e => setStudentForm({ ...studentForm, studentName: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">الدورة التدريبية</label>
                                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-amber-400 font-medium" value={studentForm.courseId} onChange={e => setStudentForm({ ...studentForm, courseId: e.target.value })}>
                                        <option value="">اختر الدورة...</option>
                                        {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button onClick={handleIssueCertificate} disabled={saveLoading} className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-white font-black py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
                                {saveLoading ? <Loader2 className="animate-spin" size={20} /> : <Award size={20} />}
                                {saveLoading ? 'جاري الإصدار...' : 'إصدار الشهادة'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ═══════ Add Trainer Certificate Modal ═══════ */}
                {trainerModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setTrainerModal(false)}>
                        <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black text-slate-900 italic flex items-center gap-2"><Users className="text-teal-600" size={24} /> إضافة شهادة مدرب</h2>
                                <button onClick={() => setTrainerModal(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center"><X size={20} /></button>
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">المدرب *</label>
                                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-teal-400 font-medium" value={trainerForm.instructorId} onChange={e => setTrainerForm({ ...trainerForm, instructorId: e.target.value })}>
                                        <option value="">اختر المدرب...</option>
                                        {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">عنوان الشهادة *</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-teal-400 font-medium" placeholder="مثال: شهادة مدرب معتمد..." value={trainerForm.title} onChange={e => setTrainerForm({ ...trainerForm, title: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">التفاصيل</label>
                                    <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-teal-400 font-medium resize-none" rows={3} placeholder="وصف الشهادة..." value={trainerForm.description} onChange={e => setTrainerForm({ ...trainerForm, description: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">صور الشهادة</label>
                                    {trainerForm.images.map((img, idx) => (
                                        <div key={idx} className="flex gap-2 mb-2">
                                            <input type="text" className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-teal-400 text-sm ltr" placeholder="رابط الصورة..." value={img}
                                                onChange={e => { const newImgs = [...trainerForm.images]; newImgs[idx] = e.target.value; setTrainerForm({ ...trainerForm, images: newImgs }); }} />
                                            {trainerForm.images.length > 1 && (
                                                <button type="button" onClick={() => setTrainerForm({ ...trainerForm, images: trainerForm.images.filter((_, i) => i !== idx) })} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => setTrainerForm({ ...trainerForm, images: [...trainerForm.images, ''] })} className="text-teal-600 text-sm font-bold hover:text-teal-700 flex items-center gap-1 mt-1">
                                        <Plus size={14} /> إضافة صورة أخرى
                                    </button>
                                </div>
                            </div>
                            <button onClick={handleSaveTrainer} disabled={saveLoading} className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-black py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
                                {saveLoading ? <Loader2 className="animate-spin" size={20} /> : <ImageIcon size={20} />}
                                {saveLoading ? 'جاري الحفظ...' : 'إضافة الشهادة'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ═══════ Add Company Certificate Modal ═══════ */}
                {companyModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setCompanyModal(false)}>
                        <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black text-slate-900 italic flex items-center gap-2"><Building2 className="text-purple-600" size={24} /> إضافة شهادة شركة</h2>
                                <button onClick={() => setCompanyModal(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center"><X size={20} /></button>
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">اسم الشهادة *</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-400 font-medium" placeholder="مثال: شهادة ISO 9001..." value={companyForm.name} onChange={e => setCompanyForm({ ...companyForm, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">صورة وجه الشهادة *</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-400 font-medium ltr" placeholder="https://..." value={companyForm.frontImage} onChange={e => setCompanyForm({ ...companyForm, frontImage: e.target.value })} />
                                    {companyForm.frontImage && <img src={companyForm.frontImage} alt="Preview" className="mt-3 max-h-40 rounded-xl border object-contain" />}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">صورة خلفية الشهادة (اختياري)</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-purple-400 font-medium ltr" placeholder="https://..." value={companyForm.backImage} onChange={e => setCompanyForm({ ...companyForm, backImage: e.target.value })} />
                                    {companyForm.backImage && <img src={companyForm.backImage} alt="Preview" className="mt-3 max-h-40 rounded-xl border object-contain" />}
                                </div>
                            </div>
                            <button onClick={handleSaveCompany} disabled={saveLoading} className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-black py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
                                {saveLoading ? <Loader2 className="animate-spin" size={20} /> : <Building2 size={20} />}
                                {saveLoading ? 'جاري الحفظ...' : 'إضافة الشهادة'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ═══════ View Student Certificate Modal ═══════ */}
                {viewCert && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setViewCert(null)}>
                        <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black text-slate-900 italic">معاينة الشهادة</h2>
                                <button onClick={() => setViewCert(null)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center"><X size={20} /></button>
                            </div>
                            <div className="border-4 border-amber-200 rounded-2xl p-8 bg-gradient-to-br from-amber-50 to-orange-50 relative">
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${viewCert.status === 'issued' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {viewCert.status === 'issued' ? '✅ فعالة' : '❌ ملغاة'}
                                    </span>
                                </div>
                                <div className="text-center">
                                    <Award className="mx-auto mb-4 text-amber-600" size={48} />
                                    <h3 className="text-2xl font-black text-slate-900 italic mb-2">شهادة إتمام دورة</h3>
                                    <p className="text-sm text-slate-500 mb-1">هذه الشهادة تمنح إلى</p>
                                    <h4 className="text-3xl font-black text-amber-700 mb-6 italic">{viewCert.studentName}</h4>
                                    <p className="text-sm text-slate-500 mb-1">لإتمامه بنجاح دورة</p>
                                    <h5 className="text-xl font-black text-slate-800 mb-6">{viewCert.courseTitle}</h5>
                                    <div className="flex items-center justify-center gap-8 mt-6">
                                        {viewCert.qrCode && (
                                            <div className="text-center">
                                                <img src={viewCert.qrCode} alt="QR" className="w-24 h-24 mx-auto rounded-lg shadow-sm" />
                                                <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 justify-center"><QrCode size={10} /> رمز التحقق</p>
                                            </div>
                                        )}
                                        <div className="text-right space-y-2">
                                            <div><span className="text-xs text-slate-400">رقم الشهادة:</span><br /><code className="text-sm font-mono font-bold text-slate-700">{viewCert.certificateNumber}</code></div>
                                            <div><span className="text-xs text-slate-400">تاريخ الإصدار:</span><br /><span className="text-sm font-bold text-slate-700">{new Date(viewCert.issueDate).toLocaleDateString('ar-IQ')}</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => copyToClipboard(`${window.location.origin}/verify/${viewCert.certificateNumber}`, 'verify')} className="w-full mt-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition flex items-center justify-center gap-2">
                                {copiedId === 'verify' ? <><CheckCircle size={18} className="text-green-500" /> تم النسخ!</> : <><Copy size={18} /> نسخ رابط التحقق</>}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CertificatesAdmin;
