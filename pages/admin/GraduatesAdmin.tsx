import React, { useState, useEffect } from 'react';
import { db, storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Graduate, Course, Instructor } from '../../types';
import { Plus, Pencil, Trash2, X, Upload, Loader2, Save, ArrowRight, Minus, Link as LinkIcon, Briefcase, User, Award, Share2, ArrowLeftRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './InstructorsAdmin.css'; // Reusing the same CSS

const GraduatesAdmin: React.FC = () => {
    const [graduates, setGraduates] = useState<Graduate[]>([]);
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [saveLoading, setSaveLoading] = useState(false);

    // Transfer modal state
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [selectedInstructorIdToTransfer, setSelectedInstructorIdToTransfer] = useState('');
    const [transferLoading, setTransferLoading] = useState(false);

    const initialFormState: Graduate = {
        id: '',
        name: '',
        roles: [''],
        image: '',
        shortBio: '',
        bio: '',
        certifications: [],
        socials: [],
    };

    const [formData, setFormData] = useState<Graduate>(initialFormState);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [gradSnap, instSnap, coursesSnap] = await Promise.all([
                db.collection('graduates').get(),
                db.collection('instructors').get(),
                db.collection('courses').get()
            ]);

            const gradData = gradSnap.docs.map(doc => {
                const data = doc.data() as any;
                return {
                    id: doc.id,
                    name: data.name || '',
                    roles: data.roles || (data.role ? [data.role] : ['']),
                    image: data.image || '',
                    shortBio: data.shortBio || '',
                    bio: data.bio || '',
                    certifications: data.certifications || [],
                    socials: data.socials || []
                } as Graduate;
            });

            const instData = instSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Instructor));

            const coursesData = coursesSnap.docs.map(doc => {
                const data = doc.data() as any;
                return {
                    id: doc.id,
                    ...data,
                    instructorIds: data.instructorIds || (data.instructorId ? [data.instructorId] : [])
                } as Course
            });

            setGraduates(gradData);
            setInstructors(instData);
            setCourses(coursesData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (graduate: Graduate) => {
        setFormData({
            ...graduate,
            roles: graduate.roles && graduate.roles.length > 0 ? graduate.roles : [''],
            socials: graduate.socials || [],
            certifications: graduate.certifications || []
        });
        setIsEditing(true);
        setImageFile(null);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الخريج؟')) {
            try {
                await db.collection('graduates').doc(id).delete();
                fetchData();
            } catch (error) {
                console.error("Error deleting document: ", error);
            }
        }
    };

    const handleImageUpload = async (file: File): Promise<string> => {
        const storageRef = ref(storage, `graduates/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveLoading(true);

        try {
            let imageUrl = formData.image;
            if (imageFile) {
                imageUrl = await handleImageUpload(imageFile);
            }

            const dataToSave = {
                name: formData.name,
                roles: formData.roles.filter(r => r.trim() !== ''),
                shortBio: formData.shortBio,
                bio: formData.bio,
                image: imageUrl || 'https://via.placeholder.com/150',
                certifications: formData.certifications.filter(c => c.trim() !== ''),
                socials: formData.socials.filter(s => s.value.trim() !== ''),
            };

            if (formData.id) {
                await db.collection('graduates').doc(formData.id).update(dataToSave);
            } else {
                await db.collection('graduates').add(dataToSave);
            }

            setIsEditing(false);
            setFormData(initialFormState);
            fetchData();
        } catch (error) {
            console.error("Error saving graduate: ", error);
            alert('حدث خطأ أثناء الحفظ');
        } finally {
            setSaveLoading(false);
        }
    };

    const handleTransfer = async () => {
        if (!selectedInstructorIdToTransfer) {
            alert('الرجاء اختيار مدرب للنقل');
            return;
        }
        setTransferLoading(true);
        try {
            // 1. Get the instructor data
            const instDoc = await db.collection('instructors').doc(selectedInstructorIdToTransfer).get();
            if (!instDoc.exists) {
                throw new Error('Instructor not found');
            }
            const instData = instDoc.data();

            // 2. Add to graduates collection
            await db.collection('graduates').add(instData!);

            // 3. Delete from instructors collection
            await db.collection('instructors').doc(selectedInstructorIdToTransfer).delete();

            setIsTransferModalOpen(false);
            setSelectedInstructorIdToTransfer('');
            fetchData();
            alert('تم نقل المدرب بنجاح إلى قائمة الخريجين');
        } catch (error) {
            console.error("Error transferring instructor:", error);
            alert('حدث خطأ أثناء النقل');
        } finally {
            setTransferLoading(false);
        }
    };

    // Helper arrays functions
    const handleArrayChange = (index: number, value: string, field: 'roles' | 'certifications') => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData({ ...formData, [field]: newArray });
    };

    const addArrayItem = (field: 'roles' | 'certifications') => {
        setFormData({ ...formData, [field]: [...formData[field], ''] });
    };

    const removeArrayItem = (index: number, field: 'roles' | 'certifications') => {
        const newArray = [...formData[field]];
        newArray.splice(index, 1);
        setFormData({ ...formData, [field]: newArray });
    };

    // Socials helpers
    const handleSocialChange = (index: number, field: 'type' | 'value', value: string) => {
        const newSocials = [...formData.socials];
        newSocials[index] = { ...newSocials[index], [field]: value };
        setFormData({ ...formData, socials: newSocials });
    };

    const addSocial = () => {
        setFormData({ ...formData, socials: [...formData.socials, { type: 'website', value: '' }] });
    };

    const removeSocial = (index: number) => {
        const newSocials = [...formData.socials];
        newSocials.splice(index, 1);
        setFormData({ ...formData, socials: newSocials });
    };

    const getCourseCount = (graduateId: string) => {
        // For graduates, they might not be actively teaching, but we can still check
        return courses.filter(c => c.instructorIds?.includes(graduateId)).length;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-red-50/20 p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Enhanced Header with Gradient */}
                <div className="relative bg-gradient-to-r from-orange-600 to-orange-700 p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden mb-8">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDRtLTQgNGg0bS00IDRoNE00MCAxNGg0bS00IDRoNG0tNCA0aDQiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
                    <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-4">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <Link to="/admin/dashboard" className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition text-white">
                                <ArrowRight size={20} />
                            </Link>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-white mb-2 italic tracking-tight">🎓 إدارة الخريجين</h1>
                                <p className="text-orange-100 text-base md:text-lg font-medium">إدارة ملفات الخريجين والبيانات الخاصة بهم</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={() => setIsTransferModalOpen(true)}
                                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold transition flex-1 md:flex-none"
                            >
                                <ArrowLeftRight size={20} />
                                نقل من المدربين
                            </button>
                            <button
                                onClick={() => { setFormData(initialFormState); setIsEditing(true); setImageFile(null); }}
                                className="bg-white text-orange-700 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex-1 md:flex-none"
                            >
                                <Plus size={20} />
                                إضافة خريج
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-600" size={40} /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {graduates.map((graduate) => (
                            <div key={graduate.id} className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-8 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-3 group relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
                                <div className="flex justify-between items-start mb-6">
                                    <img src={graduate.image} alt={graduate.name} className="w-20 h-20 rounded-[2rem] object-cover border-4 border-slate-100 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button onClick={() => handleEdit(graduate)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="تعديل"><Pencil size={18} /></button>
                                        <button onClick={() => handleDelete(graduate.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="حذف"><Trash2 size={18} /></button>
                                    </div>
                                </div>

                                <h3 className="text-xl font-black text-slate-900 mb-2 italic tracking-tight">{graduate.name}</h3>
                                <p className="text-xs text-orange-600 bg-orange-50 px-3 py-1.5 rounded-xl inline-block mb-4 font-bold">
                                    {graduate.roles[0] || 'غير محدد'}
                                </p>

                                <div className="flex items-center gap-6 text-sm text-slate-500 border-t border-slate-100 pt-4 mt-4">
                                    <div className="flex items-center gap-1">
                                        <Award size={14} className="text-orange-500" />
                                        <span>خريج من شمسية</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {graduates.length === 0 && (
                            <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                                <User size={48} className="mx-auto mb-4 opacity-50" />
                                <p>لا يوجد خريجين حالياً. ابدأ بإضافة أول خريج أو انقل من المدربين.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Transfer Modal */}
                {isTransferModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
                            <button
                                onClick={() => setIsTransferModalOpen(false)}
                                className="absolute top-4 left-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-6 flex items-center justify-center">
                                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 mb-2">
                                    <ArrowLeftRight size={32} />
                                </div>
                            </div>

                            <h2 className="text-xl font-black text-center text-slate-800 mb-2">نقل مدرب إلى الخريجين</h2>
                            <p className="text-sm text-center text-slate-500 mb-6">سيتم نقل جميع بيانات المدرب المحدد وحذفه من قائمة المدربين الحالية.</p>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-700 mb-2">اختر المدرب</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition bg-slate-50"
                                    value={selectedInstructorIdToTransfer}
                                    onChange={(e) => setSelectedInstructorIdToTransfer(e.target.value)}
                                >
                                    <option value="">-- اختر من القائمة --</option>
                                    {instructors.map(inst => (
                                        <option key={inst.id} value={inst.id}>{inst.name} - {inst.roles[0]}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsTransferModalOpen(false)}
                                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleTransfer}
                                    disabled={transferLoading || !selectedInstructorIdToTransfer}
                                    className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition disabled:opacity-50"
                                >
                                    {transferLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowLeftRight size={18} />}
                                    نقل الآن
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* High End Floating Edit Modal */}
                {isEditing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 ia-modal-overlay">
                        <div className="ia-modal-content w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col overflow-hidden">

                            {/* Header */}
                            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.id ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {formData.id ? <Pencil size={20} /> : <Plus size={24} />}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800">
                                            {formData.id ? 'تعديل بيانات خريج' : 'إضافة خريج جديد'}
                                        </h2>
                                        <p className="text-xs text-slate-500">قم بإدارة الملف الشخصي للخريج</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsEditing(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition"><X size={24} /></button>
                            </div>

                            <div className="overflow-y-auto p-8 bg-slate-50/50 flex-1">
                                <form id="graduateForm" onSubmit={handleSubmit} className="space-y-8">
                                    {/* Section 1: Basic Info */}
                                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 border-b border-slate-50 pb-2 flex items-center gap-2">
                                            <User size={18} /> بيانات الخريج
                                        </h3>
                                        <div className="flex flex-col md:flex-row gap-10">
                                            <div className="flex flex-col items-center gap-6">
                                                <div className="ia-avatar-wrapper group" onClick={() => document.getElementById('file-upload')?.click()}>
                                                    {imageFile ? (
                                                        <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : formData.image ? (
                                                        <img src={formData.image} alt="Current" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300 flex-col gap-2">
                                                            <Upload size={32} />
                                                            <span className="text-[10px] font-bold">رفع صورة</span>
                                                        </div>
                                                    )}
                                                    <div className="ia-avatar-overlay">
                                                        <Pencil className="text-white" size={24} />
                                                    </div>
                                                </div>
                                                <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && setImageFile(e.target.files[0])} />

                                                <div className="w-full max-w-[200px]">
                                                    <label className="text-xs font-bold text-slate-400 mb-1 block text-center">أو رابط خارجي للصورة</label>
                                                    <div className="relative">
                                                        <LinkIcon className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                                        <input
                                                            type="text"
                                                            value={formData.image}
                                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                            className="w-full pr-7 pl-2 py-2 text-xs rounded-lg border border-slate-200 focus:border-orange-500 outline-none text-center bg-slate-50 focus:bg-white transition"
                                                            placeholder="https://example.com/image.jpg"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-5">
                                                <div>
                                                    <label className="ia-label">اسم الخريج</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="ia-input text-lg font-semibold"
                                                        placeholder="مثال: أحمد عبد الله"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="ia-label">اسم الكورس الذي تخرج منه (يضاف كنص)</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.roles[0] || ''}
                                                        onChange={(e) => handleArrayChange(0, e.target.value, 'roles')}
                                                        className="ia-input text-lg"
                                                        placeholder="مثال: دورة صيانة الشاشات"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Footer */}
                            <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-end gap-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                                <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition">إلغاء</button>
                                <button
                                    type="submit"
                                    form="graduateForm"
                                    disabled={saveLoading}
                                    className="px-10 py-3 rounded-xl bg-orange-600 text-white hover:bg-orange-700 font-bold transition flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-orange-200 transform hover:-translate-y-1"
                                >
                                    {saveLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    حفظ البيانات
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GraduatesAdmin;
