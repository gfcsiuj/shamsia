import React, { useState, useEffect } from 'react';
import { db, storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Course, Instructor, MediaItem } from '../../types';
import { Plus, Pencil, Trash2, X, Upload, Loader2, Save, ArrowRight, Minus, Image as ImageIcon, Video, Link as LinkIcon, Users, Tag, CheckSquare, Layers, Award, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './CoursesAdmin.css';

const CoursesAdmin: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'syllabus'>('basic');
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q');
        if (q) setSearchQuery(q);
    }, [location.search]);

    // Custom states for UI logic
    const [customLevel, setCustomLevel] = useState('');
    const [showCustomLevelInput, setShowCustomLevelInput] = useState(false);
    const [customCategory, setCustomCategory] = useState('');
    const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaLinkInput, setMediaLinkInput] = useState('');
    const [mediaTypeInput, setMediaTypeInput] = useState<'image' | 'video'>('image');

    const initialFormState: Course = {
        id: '',
        title: '',
        category: 'Tech',
        level: 'مبتدئ',
        price: 0,
        hidePrice: false,
        oldPrice: 0,
        media: [],
        instructorIds: [],
        instructorText: '',
        duration: '',
        rating: 5,
        studentsCount: 0,
        studentsCountMode: 'auto',
        tags: [],
        startDate: '',
        endDate: '',
        lecturesCount: 0,
        description: '',
        longDescription: '',
        objectives: [''],
        targetAudience: [''],
        syllabus: [{ title: '', week: '', topic: '', points: [] }],
        certifications: [],
        graduateIds: [],
        notes: [],
    };

    const [formData, setFormData] = useState<Course>(initialFormState);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [coursesSnap, instructorsSnap] = await Promise.all([
                db.collection('courses').get(),
                db.collection('instructors').get()
            ]);

            const coursesData = coursesSnap.docs.map(doc => {
                const data = doc.data() as any;
                return {
                    id: doc.id,
                    ...data,
                    instructorIds: data.instructorIds || (data.instructorId ? [data.instructorId] : []),
                    media: data.media || (data.image ? [{ url: data.image, type: 'image' }] : []),
                    tags: data.tags || [],
                    studentsCountMode: data.studentsCountMode || 'auto'
                } as Course;
            });
            const instructorsData = instructorsSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) } as Instructor));

            setCourses(coursesData);
            setInstructors(instructorsData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (course: Course) => {
        setFormData({
            ...course,
            objectives: course.objectives?.length ? course.objectives : [''],
            targetAudience: course.targetAudience?.length ? course.targetAudience : [''],
            syllabus: course.syllabus?.length ? course.syllabus.map(s => ({ title: s.title || '', week: s.week || '', topic: s.topic || '', points: s.points || [] })) : [{ title: '', week: '', topic: '', points: [] }],
            certifications: course.certifications?.length ? course.certifications : [],
            tags: course.tags || [],
            notes: course.notes?.length ? course.notes : [],
        });
        setIsEditing(true);
        setMediaFile(null);
        setMediaLinkInput('');
        setActiveTab('basic');
        setShowCustomLevelInput(!['مبتدئ', 'متوسط', 'متقدم', 'دبلوم'].includes(course.level) && course.level !== '');
        setShowCustomCategoryInput(!['Tech', 'Human Development', 'Cyber Security', 'Admin Skills', 'Student Skills'].includes(course.category) && course.category !== '');
        if (!['Tech', 'Human Development', 'Cyber Security', 'Admin Skills', 'Student Skills'].includes(course.category)) {
            setCustomCategory(course.category);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذه الدورة؟')) {
            try {
                await db.collection('courses').doc(id).delete();
                fetchData();
            } catch (error) {
                console.error("Error deleting course: ", error);
            }
        }
    };

    const handleMediaUpload = async (file: File): Promise<string> => {
        const storageRef = ref(storage, `courses/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    };

    const handleAddMedia = async () => {
        let url = mediaLinkInput;
        if (mediaFile) {
            url = await handleMediaUpload(mediaFile);
        }

        if (url) {
            setFormData({
                ...formData,
                media: [...formData.media, { url, type: mediaTypeInput }]
            });
            setMediaFile(null);
            setMediaLinkInput('');
        }
    };

    const removeMedia = (index: number) => {
        const newMedia = [...formData.media];
        newMedia.splice(index, 1);
        setFormData({ ...formData, media: newMedia });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveLoading(true);

        try {
            let finalLevel = formData.level;
            if (showCustomLevelInput && customLevel) {
                finalLevel = customLevel;
            }

            let finalCategory = formData.category;
            if (showCustomCategoryInput && customCategory) {
                finalCategory = customCategory;
            }

            const dataToSave = {
                ...formData,
                level: finalLevel,
                category: finalCategory,
                price: Number(formData.price),
                hidePrice: Boolean(formData.hidePrice),
                oldPrice: Number(formData.oldPrice),
                studentsCount: Number(formData.studentsCount),
                rating: Number(formData.rating),
                objectives: formData.objectives.filter(item => item.trim() !== ''),
                targetAudience: formData.targetAudience.filter(item => item.trim() !== ''),
                certifications: formData.certifications?.filter(item => item.trim() !== '') || [],
                notes: formData.notes?.filter(item => item.trim() !== '') || [],
                syllabus: formData.syllabus.filter(item => item.title.trim() !== '' || item.topic.trim() !== '').map(item => ({ ...item, points: item.points?.filter(p => p.trim() !== '') || [] })),
                tags: formData.tags,
                instructorText: formData.instructorText || ''
            };

            const { id, ...payload } = dataToSave;

            if (formData.id) {
                await db.collection('courses').doc(formData.id).update(payload);
            } else {
                await db.collection('courses').add(payload);
            }

            setIsEditing(false);
            setFormData(initialFormState);
            fetchData();
        } catch (error) {
            console.error("Error saving course: ", error);
            alert('حدث خطأ أثناء حفظ الدورة');
        } finally {
            setSaveLoading(false);
        }
    };

    // Helper functions...
    const handleArrayChange = (field: 'objectives' | 'targetAudience' | 'certifications' | 'notes', index: number, value: string) => {
        const newArray = [...(formData[field] || [])];
        newArray[index] = value;
        setFormData({ ...formData, [field]: newArray });
    };

    const addArrayItem = (field: 'objectives' | 'targetAudience' | 'certifications' | 'notes') => {
        setFormData({ ...formData, [field]: [...(formData[field] || []), ''] });
    };

    const removeArrayItem = (field: 'objectives' | 'targetAudience' | 'certifications' | 'notes', index: number) => {
        const newArray = [...(formData[field] || [])];
        newArray.splice(index, 1);
        setFormData({ ...formData, [field]: newArray });
    };

    const toggleInstructor = (instId: string) => {
        const currentIds = formData.instructorIds || [];
        if (currentIds.includes(instId)) {
            setFormData({ ...formData, instructorIds: currentIds.filter(id => id !== instId) });
        } else {
            setFormData({ ...formData, instructorIds: [...currentIds, instId] });
        }
    };

    const addTag = (tag: string) => {
        if (tag && !formData.tags.includes(tag)) {
            setFormData({ ...formData, tags: [...formData.tags, tag] });
        }
    };

    const removeTag = (tag: string) => {
        setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
    };

    const handleSyllabusChange = (index: number, field: 'title' | 'week' | 'topic', value: string) => {
        const newSyllabus = [...formData.syllabus];
        newSyllabus[index] = { ...newSyllabus[index], [field]: value };
        setFormData({ ...formData, syllabus: newSyllabus });
    };

    const handleSyllabusPointChange = (syllabusIndex: number, pointIndex: number, value: string) => {
        const newSyllabus = [...formData.syllabus];
        const points = [...(newSyllabus[syllabusIndex].points || [])];
        points[pointIndex] = value;
        newSyllabus[syllabusIndex] = { ...newSyllabus[syllabusIndex], points };
        setFormData({ ...formData, syllabus: newSyllabus });
    };

    const addSyllabusPoint = (syllabusIndex: number) => {
        const newSyllabus = [...formData.syllabus];
        const points = [...(newSyllabus[syllabusIndex].points || []), ''];
        newSyllabus[syllabusIndex] = { ...newSyllabus[syllabusIndex], points };
        setFormData({ ...formData, syllabus: newSyllabus });
    };

    const removeSyllabusPoint = (syllabusIndex: number, pointIndex: number) => {
        const newSyllabus = [...formData.syllabus];
        const points = [...(newSyllabus[syllabusIndex].points || [])];
        points.splice(pointIndex, 1);
        newSyllabus[syllabusIndex] = { ...newSyllabus[syllabusIndex], points };
        setFormData({ ...formData, syllabus: newSyllabus });
    };

    const addSyllabusItem = () => {
        setFormData({ ...formData, syllabus: [...formData.syllabus, { title: '', week: '', topic: '', points: [] }] });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-orange-50/20 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Enhanced Header with Gradient */}
                {/* Enhanced Header with Gradient */}
                {/* Enhanced Header with Gradient */}
                <div className="relative bg-gradient-to-r from-orange-500 to-orange-700 p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden mb-8">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMTRoNG0tNCA0aDRtLTQgNGg0TTQwIDE0aDRtLTQgNGg0bS00IDRoNCIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <Link to="/admin/dashboard" className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition text-white">
                                <ArrowRight size={20} />
                            </Link>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-white mb-2 italic tracking-tight">📖 إدارة الدورات</h1>
                                <p className="text-orange-100 text-base md:text-lg font-medium">إضافة وتعديل الدورات التدريبية ومحتواها</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative hidden md:block">
                                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-100" size={20} />
                                <input
                                    type="text"
                                    placeholder="بحث عن دورة..."
                                    className="pl-4 pr-10 py-2.5 rounded-xl border-0 bg-white/10 text-white placeholder-orange-100/70 focus:bg-white/20 transition w-64 backdrop-blur-md outline-none font-medium"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => { setFormData(initialFormState); setIsEditing(true); setMediaFile(null); setActiveTab('basic'); }}
                                className="bg-white text-orange-700 px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <Plus size={20} />
                                إضافة دورة
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" size={40} /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.category.toLowerCase().includes(searchQuery.toLowerCase())).map((course) => (
                            <div key={course.id} className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-3 group">
                                <div className="h-52 lg:h-56 relative">
                                    {course.media && course.media[0] ? (
                                        course.media[0].type === 'video' ? (
                                            <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white"><Video size={32} /></div>
                                        ) : (
                                            <img src={course.media[0].url} alt={course.title} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" />
                                        )
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300"><ImageIcon size={32} /></div>
                                    )}
                                    <span className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-primary-700 shadow-sm">{course.category}</span>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300"></div>
                                </div>
                                <div className="p-7">
                                    <h3 className="font-black text-slate-900 mb-3 line-clamp-2 text-xl leading-tight italic tracking-tight">{course.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-5 bg-slate-50 p-3 rounded-xl">
                                        <span className="font-semibold text-primary-600">{course.priceText || (course.price > 0 ? course.price.toLocaleString() + ' د.ع' : 'مجاناً')}</span>
                                        <span className="w-px h-3 bg-slate-300"></span>
                                        <span>{course.studentsCount} طالب</span>
                                        <span className="w-px h-3 bg-slate-300"></span>
                                        <span>{course.level}</span>
                                    </div>
                                    <div className="flex gap-3 mt-auto">
                                        <button onClick={() => handleEdit(course)} className="flex-1 py-3 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-[1.5rem] transition-all duration-300 font-black text-sm flex items-center justify-center gap-2 border border-blue-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5"><Pencil size={18} /> تعديل</button>
                                        <button onClick={() => handleDelete(course.id)} className="px-5 py-3 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-[1.5rem] transition-all duration-300 border border-red-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5"><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- High End Floating Modal --- */}
                {isEditing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 ca-modal-overlay">
                        <div className="ca-modal-content w-full max-w-7xl max-h-[95vh] rounded-2xl flex flex-col overflow-hidden">

                            {/* Header */}
                            <div className="bg-white px-8 py-5 border-b border-slate-100 flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.id ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                                        {formData.id ? <Pencil size={20} /> : <Plus size={24} />}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800">{formData.id ? 'تعديل الدورة الحالية' : 'إضافة دورة جديدة'}</h2>
                                        <p className="text-xs text-slate-500">{formData.id ? 'قم بتعديل بيانات ومحتوى الدورة' : 'أدخل البيانات الأساسية لإنشاء دورة جديدة'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* Tabs */}
                                    <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
                                        {['basic', 'details', 'syllabus'].map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setActiveTab(t as any)}
                                                className={`px-5 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${activeTab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                {t === 'basic' ? 'البيانات الأساسية' : t === 'details' ? 'التفاصيل والمحتوى' : 'المنهج الدراسي'}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={() => setIsEditing(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition"><X size={24} /></button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto p-6 ca-scrollable bg-slate-50/50">
                                <div className="max-w-6xl mx-auto space-y-4">

                                    {/* Basic Info Tab */}
                                    {activeTab === 'basic' && (
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in">
                                            {/* Left Column */}
                                            <div className="lg:col-span-2 space-y-4">
                                                <div className="ca-card">
                                                    <h3 className="ca-section-title">المعلومات الأساسية</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="md:col-span-2">
                                                            <label className="ca-label">عنوان الدورة</label>
                                                            <input type="text" className="ca-input text-lg font-semibold" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="أدخل عنواناً مميزاً..." />
                                                        </div>
                                                        <div>
                                                            <label className="ca-label">التصنيف</label>
                                                            {!showCustomCategoryInput ? (
                                                                <select
                                                                    className="ca-input"
                                                                    value={formData.category}
                                                                    onChange={e => {
                                                                        if (e.target.value === 'custom') {
                                                                            setShowCustomCategoryInput(true);
                                                                        } else {
                                                                            setFormData({ ...formData, category: e.target.value });
                                                                        }
                                                                    }}
                                                                >
                                                                    <option value="Tech">التقنية والبرمجة</option>
                                                                    <option value="Human Development">التنمية البشرية</option>
                                                                    <option value="Cyber Security">الأمن السيبراني</option>
                                                                    <option value="Admin Skills">المهارات الإدارية</option>
                                                                    <option value="Solar Energy">الطاقة الشمسية</option>
                                                                    <option value="Electricity">الكهرباء</option>
                                                                    <option value="Generators">المولدات الكهربائية</option>
                                                                    <option value="Mechanics">الميكانيك</option>
                                                                    <option value="Barbering">الحلاقة</option>
                                                                    <option value="Languages">لغات</option>
                                                                    <option value="Electrical Installations">تأسيسات كهربائية</option>
                                                                    <option value="custom" className="font-bold text-primary-600">+ تصنيف مخصص</option>
                                                                </select>
                                                            ) : (
                                                                <div className="flex gap-2">
                                                                    <input type="text" className="ca-input" autoFocus placeholder="اكتب التصنيف..." value={customCategory} onChange={e => setCustomCategory(e.target.value)} />
                                                                    <button type="button" onClick={() => { setShowCustomCategoryInput(false); setCustomCategory(''); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X /></button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label className="ca-label">المستوى الدراسي</label>
                                                            {!showCustomLevelInput ? (
                                                                <select
                                                                    className="ca-input"
                                                                    value={formData.level}
                                                                    onChange={e => {
                                                                        if (e.target.value === 'custom') {
                                                                            setShowCustomLevelInput(true);
                                                                        } else {
                                                                            setFormData({ ...formData, level: e.target.value });
                                                                        }
                                                                    }}
                                                                >
                                                                    <option value="مبتدئ">مبتدئ</option>
                                                                    <option value="متوسط">متوسط</option>
                                                                    <option value="متقدم">متقدم</option>
                                                                    <option value="دبلوم">دبلوم</option>
                                                                    <option value="custom" className="font-bold text-primary-600">+ مستوى مخصص</option>
                                                                </select>
                                                            ) : (
                                                                <div className="flex gap-2">
                                                                    <input type="text" className="ca-input" autoFocus placeholder="اكتب المستوى..." value={customLevel} onChange={e => setCustomLevel(e.target.value)} />
                                                                    <button type="button" onClick={() => setShowCustomLevelInput(false)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X /></button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="ca-card ca-card-primary">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="ca-section-title text-primary-800 border-primary-100 mb-0 border-none">فريق التدريب</h3>
                                                        <label className="flex items-center gap-2 cursor-pointer select-none">
                                                            <span className="text-xs font-bold text-slate-400">{formData.instructorText ? 'نص مخصص' : 'اختيار مدربين'}</span>
                                                            <div
                                                                onClick={() => {
                                                                    if (formData.instructorText) {
                                                                        setFormData({ ...formData, instructorText: '' });
                                                                    } else {
                                                                        setFormData({ ...formData, instructorText: 'كادر المركز المتخصص' });
                                                                    }
                                                                }}
                                                                className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${formData.instructorText ? 'bg-primary-500' : 'bg-slate-200'}`}
                                                            >
                                                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${formData.instructorText ? 'left-5' : 'left-0.5'}`}></div>
                                                            </div>
                                                        </label>
                                                    </div>

                                                    {formData.instructorText ? (
                                                        <div>
                                                            <label className="ca-label">نص المدربين</label>
                                                            <input
                                                                type="text"
                                                                className="ca-input text-base font-bold text-primary-700"
                                                                placeholder="مثال: كادر المركز الكندي العراقي المتخصص"
                                                                value={formData.instructorText}
                                                                onChange={e => setFormData({ ...formData, instructorText: e.target.value })}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="flex flex-wrap gap-2 mb-4">
                                                                {formData.instructorIds?.map(id => {
                                                                    const inst = instructors.find(i => i.id === id);
                                                                    return inst ? (
                                                                        <div key={id} className="flex items-center gap-2 bg-white text-primary-700 px-4 py-2 rounded-full text-sm font-bold border border-primary-200 shadow-sm animate-pop-in">
                                                                            <img src={inst.image} className="w-6 h-6 rounded-full object-cover" />
                                                                            {inst.name}
                                                                            <button onClick={() => toggleInstructor(id)} className="hover:text-red-500 bg-primary-50 rounded-full p-0.5"><X size={14} /></button>
                                                                        </div>
                                                                    ) : null;
                                                                })}
                                                            </div>
                                                            <div className="relative group">
                                                                <button type="button" className="ca-input text-start text-slate-400 flex justify-between items-center bg-white hover:border-primary-300">
                                                                    <span>ابحث عن مدرب...</span>
                                                                    <Users size={18} className="text-slate-400" />
                                                                </button>
                                                                <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 shadow-xl rounded-xl mt-2 max-h-60 overflow-y-auto hidden group-hover:block hover:block z-20">
                                                                    {instructors.map(inst => (
                                                                        <div
                                                                            key={inst.id}
                                                                            onClick={() => toggleInstructor(inst.id)}
                                                                            className={`p-3 flex items-center gap-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 ${formData.instructorIds?.includes(inst.id) ? 'bg-primary-50' : ''}`}
                                                                        >
                                                                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${formData.instructorIds?.includes(inst.id) ? 'bg-primary-500 border-primary-500' : 'border-slate-300'}`}>
                                                                                {formData.instructorIds?.includes(inst.id) && <CheckSquare size={14} className="text-white" />}
                                                                            </div>
                                                                            <img src={inst.image} className="w-8 h-8 rounded-full object-cover" />
                                                                            <span className="text-sm font-bold text-slate-700">{inst.name}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Graduates Section - Select from Instructors */}
                                                <div className="ca-card ca-card-orange">
                                                    <h3 className="ca-section-title text-orange-800 border-orange-100">خريجين / مشاركين الدورة</h3>
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {formData.graduateIds?.map(id => {
                                                            const inst = instructors.find(i => i.id === id);
                                                            return inst ? (
                                                                <div key={id} className="flex items-center gap-2 bg-white text-orange-700 px-4 py-2 rounded-full text-sm font-bold border border-orange-200 shadow-sm animate-pop-in">
                                                                    <img src={inst.image} className="w-6 h-6 rounded-full object-cover" />
                                                                    {inst.name}
                                                                    <button onClick={() => {
                                                                        const currentIds = formData.graduateIds || [];
                                                                        setFormData({ ...formData, graduateIds: currentIds.filter(gid => gid !== id) });
                                                                    }} className="hover:text-red-500 bg-orange-50 rounded-full p-0.5"><X size={14} /></button>
                                                                </div>
                                                            ) : null;
                                                        })}
                                                    </div>
                                                    <div className="relative group">
                                                        <button type="button" className="ca-input text-start text-slate-400 flex justify-between items-center bg-white hover:border-orange-300">
                                                            <span>اختر خريج من المدربين...</span>
                                                            <Award size={18} className="text-slate-400" />
                                                        </button>
                                                        <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 shadow-xl rounded-xl mt-2 max-h-60 overflow-y-auto hidden group-hover:block hover:block z-20">
                                                            {instructors.map(inst => {
                                                                const isSelected = formData.graduateIds?.includes(inst.id);
                                                                return (
                                                                    <div
                                                                        key={inst.id}
                                                                        onClick={() => {
                                                                            const currentIds = formData.graduateIds || [];
                                                                            if (isSelected) {
                                                                                setFormData({ ...formData, graduateIds: currentIds.filter(gid => gid !== inst.id) });
                                                                            } else {
                                                                                setFormData({ ...formData, graduateIds: [...currentIds, inst.id] });
                                                                            }
                                                                        }}
                                                                        className={`p-3 flex items-center gap-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 ${isSelected ? 'bg-orange-50' : ''}`}
                                                                    >
                                                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isSelected ? 'bg-orange-500 border-orange-500' : 'border-slate-300'}`}>
                                                                            {isSelected && <CheckSquare size={14} className="text-white" />}
                                                                        </div>
                                                                        <img src={inst.image} className="w-8 h-8 rounded-full object-cover" />
                                                                        <span className="text-sm font-bold text-slate-700">{inst.name}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="ca-card ca-card-blue">
                                                    <h3 className="ca-section-title text-blue-800 border-blue-100">وسائط الدورة</h3>

                                                    {/* Media List */}
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                                                        {formData.media.map((item, i) => (
                                                            <div key={i} className="relative aspect-video bg-white rounded-xl overflow-hidden group border border-slate-200 shadow-sm">
                                                                {item.type === 'video' ? (
                                                                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-900"><Video size={32} /></div>
                                                                ) : (
                                                                    <img src={item.url} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500" />
                                                                )}
                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                    <button onClick={() => removeMedia(i)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition transform hover:scale-110"><Trash2 size={18} /></button>
                                                                </div>
                                                                <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded-md uppercase font-bold tracking-wider">{item.type}</span>
                                                            </div>
                                                        ))}

                                                        {/* New Media Card style for selection */}
                                                        <div className="bg-white p-4 rounded-xl border border-dashed border-blue-200 flex flex-col gap-3 justify-center items-center">
                                                            <div className="flex gap-2 w-full">
                                                                <div
                                                                    onClick={() => setMediaTypeInput('image')}
                                                                    className={`ca-media-option flex-1 text-xs ${mediaTypeInput === 'image' ? 'active' : ''}`}
                                                                >
                                                                    <ImageIcon size={14} /> صورة
                                                                </div>
                                                                <div
                                                                    onClick={() => setMediaTypeInput('video')}
                                                                    className={`ca-media-option flex-1 text-xs ${mediaTypeInput === 'video' ? 'active' : ''}`}
                                                                >
                                                                    <Video size={14} /> فيديو
                                                                </div>
                                                            </div>

                                                            {mediaFile ? (
                                                                <div className="text-center w-full bg-blue-50 py-2 rounded-lg text-blue-600 text-xs font-bold truncate px-2">
                                                                    {mediaFile.name}
                                                                </div>
                                                            ) : (
                                                                <div className="w-full relative">
                                                                    <input
                                                                        type="text"
                                                                        className="ca-input text-xs py-2 pr-7"
                                                                        placeholder="رابط مباشر..."
                                                                        value={mediaLinkInput}
                                                                        onChange={e => setMediaLinkInput(e.target.value)}
                                                                    />
                                                                    <LinkIcon size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
                                                                </div>
                                                            )}

                                                            <div className="flex gap-2 w-full mt-1">
                                                                <label className="flex-1 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition">
                                                                    <Upload size={14} /> رفع
                                                                    <input type="file" className="hidden" accept={mediaTypeInput === 'image' ? "image/*" : "video/*"} onChange={e => e.target.files && setMediaFile(e.target.files[0])} />
                                                                </label>
                                                                <button
                                                                    type="button"
                                                                    onClick={handleAddMedia}
                                                                    disabled={!mediaLinkInput && !mediaFile}
                                                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold text-xs hover:bg-blue-700 disabled:opacity-50 transition"
                                                                >
                                                                    إضافة
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column: Settings */}
                                            <div className="space-y-8">
                                                <div className="ca-card ca-card-orange">
                                                    <h3 className="ca-section-title text-orange-800 border-orange-100">التسعير والوقت</h3>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <div className="flex items-center justify-between mb-2">
                                                                <label className="ca-label mb-0">السعر</label>
                                                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                                                    <span className="text-xs font-bold text-slate-400">{formData.priceText !== undefined && formData.priceText !== '' ? 'نص بديل' : 'سعر رقمي'}</span>
                                                                    <div
                                                                        onClick={() => {
                                                                            if (formData.priceText !== undefined && formData.priceText !== '') {
                                                                                setFormData({ ...formData, priceText: '' });
                                                                            } else {
                                                                                setFormData({ ...formData, priceText: 'تواصل معنا' });
                                                                            }
                                                                        }}
                                                                        className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${formData.priceText ? 'bg-orange-500' : 'bg-slate-200'}`}
                                                                    >
                                                                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${formData.priceText ? 'left-5' : 'left-0.5'}`}></div>
                                                                    </div>
                                                                </label>
                                                            </div>
                                                            {formData.priceText ? (
                                                                <input type="text" className="ca-input text-lg font-bold text-orange-700" placeholder="مثال: تواصل معنا، يحدد لاحقاً" value={formData.priceText} onChange={e => setFormData({ ...formData, priceText: e.target.value })} />
                                                            ) : (
                                                                <input type="number" className="ca-input text-lg font-bold text-slate-800" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} />
                                                            )}
                                                        </div>
                                                        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-slate-700">إخفاء السعر</span>
                                                                <span className="text-xs text-slate-500">عند تفعيل هذا الخيار لن يظهر أي سعر للدورة</span>
                                                            </div>
                                                            <div
                                                                onClick={() => setFormData({ ...formData, hidePrice: !formData.hidePrice })}
                                                                className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${formData.hidePrice ? 'bg-orange-500' : 'bg-slate-300'}`}
                                                            >
                                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${formData.hidePrice ? 'left-7' : 'left-1'}`}></div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="ca-label">السعر السابق (اختياري)</label>
                                                            <input type="number" className="ca-input text-slate-500" value={formData.oldPrice} onChange={e => setFormData({ ...formData, oldPrice: Number(e.target.value) })} />
                                                        </div>
                                                        <div>
                                                            <label className="ca-label">المدة (مثال: 4 أسابيع)</label>
                                                            <input type="text" className="ca-input" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                                                        </div>
                                                        <div>
                                                            <label className="ca-label">تاريخ/أيام البدء</label>
                                                            <input type="text" className="ca-input" placeholder="مثال: كل خميس وجمعة" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                                                        </div>
                                                        <div>
                                                            <label className="ca-label">تاريخ الانتهاء</label>
                                                            <input type="text" className="ca-input" placeholder="مثال: 2026/03/15" value={formData.endDate || ''} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                                                        </div>
                                                        <div>
                                                            <label className="ca-label">عدد المحاضرات</label>
                                                            <input type="number" className="ca-input" placeholder="0" value={formData.lecturesCount || 0} onChange={e => setFormData({ ...formData, lecturesCount: Number(e.target.value) })} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="ca-card">
                                                    <h3 className="ca-section-title">إعدادات إضافية</h3>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="ca-label">التقييم (من 5)</label>
                                                            <input type="number" step="0.1" max="5" className="ca-input" value={formData.rating} onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })} />
                                                        </div>

                                                        <div>
                                                            <label className="ca-label">
                                                                <span>عدد الطلاب</span>
                                                                <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                                                                    <button type="button" onClick={() => setFormData({ ...formData, studentsCountMode: 'auto' })} className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition ${formData.studentsCountMode === 'auto' ? 'bg-white shadow-sm text-primary-700' : 'text-slate-500'}`}>تلقائي</button>
                                                                    <button type="button" onClick={() => setFormData({ ...formData, studentsCountMode: 'manual' })} className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition ${formData.studentsCountMode === 'manual' ? 'bg-white shadow-sm text-primary-700' : 'text-slate-500'}`}>يدوي</button>
                                                                </div>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                className={`ca-input ${formData.studentsCountMode === 'auto' ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : ''}`}
                                                                value={formData.studentsCount}
                                                                onChange={e => setFormData({ ...formData, studentsCount: Number(e.target.value) })}
                                                                readOnly={formData.studentsCountMode === 'auto'}
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="ca-label">علامات مميزة (Tags)</label>
                                                            <div className="flex flex-wrap gap-2 mb-3">
                                                                {formData.tags?.map(tag => (
                                                                    <span key={tag} className="bg-slate-800 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                                                                        {tag}
                                                                        <button onClick={() => removeTag(tag)} className="hover:text-red-300"><X size={12} /></button>
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    className="ca-input text-sm"
                                                                    placeholder="اكتب واضغط Enter أو الصق نصاً..."
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') {
                                                                            e.preventDefault();
                                                                            addTag(e.currentTarget.value.trim());
                                                                            e.currentTarget.value = '';
                                                                        }
                                                                    }}
                                                                    onPaste={(e) => {
                                                                        e.preventDefault();
                                                                        const paste = e.clipboardData.getData('text');
                                                                        if (paste) {
                                                                            // Split by space, English comma, Arabic comma, newline, or tab
                                                                            const splitTags = paste.split(/[ \n\t،,]+/).map(t => t.trim()).filter(Boolean);
                                                                            if (splitTags.length > 0) {
                                                                                const newTags = [...formData.tags];
                                                                                splitTags.forEach(tag => {
                                                                                    if (!newTags.includes(tag)) newTags.push(tag);
                                                                                });
                                                                                setFormData({ ...formData, tags: newTags });
                                                                            }
                                                                        }
                                                                    }}
                                                                />
                                                                <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Details Tab */}
                                    {activeTab === 'details' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                                            <div className="md:col-span-2 ca-card">
                                                <h3 className="ca-section-title">الأوصاف النصية</h3>
                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="ca-label">وصف مختصر (للكارد)</label>
                                                        <textarea className="ca-input" rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="وصف يظهر في صفحة الكورسات..."></textarea>
                                                    </div>
                                                    <div>
                                                        <label className="ca-label">الإعلان التفصيلي (صفحة الدورة)</label>
                                                        <textarea className="ca-input font-mono text-sm leading-relaxed" rows={12} value={formData.longDescription} onChange={e => setFormData({ ...formData, longDescription: e.target.value })} placeholder="تفاصيل الدورة الكاملة..."></textarea>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="ca-card h-full ca-card-purple">
                                                <div className="flex justify-between items-center mb-6 border-b border-purple-200 pb-3">
                                                    <h3 className="ca-section-title mb-0 border-none text-purple-900">ماذا ستتعلم (Objectives)</h3>
                                                    <button type="button" onClick={() => addArrayItem('objectives')} className="text-purple-600 bg-white border border-purple-200 hover:bg-purple-50 p-2 rounded-lg transition shadow-sm"><Plus size={18} /></button>
                                                </div>
                                                <div className="space-y-3">
                                                    {formData.objectives.map((obj, i) => (
                                                        <div key={i} className="flex gap-2 group">
                                                            <div className="flex-1 relative">
                                                                <input type="text" className="ca-input py-2.5 text-sm pr-8" value={obj} onChange={e => handleArrayChange('objectives', i, e.target.value)} />
                                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 font-bold text-xs">{i + 1}.</span>
                                                            </div>
                                                            <button type="button" onClick={() => removeArrayItem('objectives', i)} className="text-slate-300 hover:text-red-500 transition px-1"><Minus size={18} /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="ca-card h-full ca-card-indigo">
                                                <div className="flex justify-between items-center mb-6 border-b border-indigo-200 pb-3">
                                                    <h3 className="ca-section-title mb-0 border-none text-indigo-900">الفئة المستهدفة</h3>
                                                    <button type="button" onClick={() => addArrayItem('targetAudience')} className="text-indigo-600 bg-white border border-indigo-200 hover:bg-indigo-50 p-2 rounded-lg transition shadow-sm"><Plus size={18} /></button>
                                                </div>
                                                <div className="space-y-3">
                                                    {formData.targetAudience.map((aud, i) => (
                                                        <div key={i} className="flex gap-2">
                                                            <input type="text" className="ca-input py-2.5 text-sm" value={aud} onChange={e => handleArrayChange('targetAudience', i, e.target.value)} />
                                                            <button type="button" onClick={() => removeArrayItem('targetAudience', i)} className="text-slate-300 hover:text-red-500 transition px-1"><Minus size={18} /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="ca-card md:col-span-2">
                                                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
                                                    <h3 className="ca-section-title mb-0 border-none">الشهادات والاعتمادات</h3>
                                                    <button type="button" onClick={() => addArrayItem('certifications')} className="text-primary-600 bg-primary-50 hover:bg-primary-100 p-2 rounded-lg transition"><Plus size={18} /></button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {formData.certifications?.map((cert, i) => (
                                                        <div key={i} className="flex gap-2 items-center">
                                                            <Award size={20} className="text-slate-300" />
                                                            <input type="text" className="ca-input py-2.5 text-sm" value={cert} onChange={e => handleArrayChange('certifications', i, e.target.value)} placeholder="اسم الشهادة..." />
                                                            <button type="button" onClick={() => removeArrayItem('certifications', i)} className="text-slate-300 hover:text-red-500 transition"><Minus size={18} /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Notes Section */}
                                            <div className="ca-card md:col-span-2 ca-card-orange">
                                                <div className="flex justify-between items-center mb-6 border-b border-orange-200 pb-3">
                                                    <h3 className="ca-section-title mb-0 border-none text-orange-900">📝 ملاحظات الدورة</h3>
                                                    <button type="button" onClick={() => addArrayItem('notes')} className="text-orange-600 bg-white border border-orange-200 hover:bg-orange-50 p-2 rounded-lg transition shadow-sm"><Plus size={18} /></button>
                                                </div>
                                                <div className="space-y-3">
                                                    {formData.notes?.map((note, i) => (
                                                        <div key={i} className="flex gap-2 group">
                                                            <div className="flex-1 relative">
                                                                <input type="text" className="ca-input py-2.5 text-sm pr-8" value={note} onChange={e => handleArrayChange('notes', i, e.target.value)} placeholder="أدخل ملاحظة..." />
                                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 font-bold text-xs">{i + 1}.</span>
                                                            </div>
                                                            <button type="button" onClick={() => removeArrayItem('notes', i)} className="text-slate-300 hover:text-red-500 transition px-1"><Minus size={18} /></button>
                                                        </div>
                                                    ))}
                                                    {(!formData.notes || formData.notes.length === 0) && (
                                                        <p className="text-sm text-slate-400 text-center py-4">لا توجد ملاحظات. اضغط + لإضافة ملاحظة.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Syllabus Tab */}
                                    {activeTab === 'syllabus' && (
                                        <div className="ca-card animate-fade-in ca-card-blue border-l-4 border-l-blue-500">
                                            <div className="flex justify-between items-center mb-8 border-b border-blue-100 pb-4">
                                                <div>
                                                    <h3 className="ca-section-title mb-1 border-none text-blue-900">المنهج الدراسي</h3>
                                                    <p className="text-sm text-blue-500">قم ببناء هيكل الدورة وتقسيم المحاضرات</p>
                                                </div>
                                                <button type="button" onClick={addSyllabusItem} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition flex items-center gap-2 transform hover:scale-105">
                                                    <Plus size={18} /> إضافة محور
                                                </button>
                                            </div>

                                            <div className="space-y-6">
                                                {formData.syllabus.map((item, i) => (
                                                    <div key={i} className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm relative group hover:border-blue-300 transition-all">
                                                        <div className="absolute -right-3 top-6 w-8 h-8 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center font-bold text-blue-600 text-xs shadow-sm z-10">
                                                            {i + 1}
                                                        </div>

                                                        {/* Title (المحور) */}
                                                        <div className="mb-4">
                                                            <label className="text-xs font-bold text-blue-600 mb-1 block">المحور</label>
                                                            <input
                                                                type="text"
                                                                placeholder="مثال: أساسيات الكهرباء والتوليد"
                                                                className="ca-input bg-blue-50/50 border-blue-200 focus:bg-white font-bold text-slate-800"
                                                                value={item.title || ''}
                                                                onChange={e => handleSyllabusChange(i, 'title', e.target.value)}
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                            {/* Subtitle (العنوان الفرعي) */}
                                                            <div>
                                                                <label className="text-xs font-bold text-slate-400 mb-1 block">العنوان الفرعي</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="مثال: الأيام 1-2 (المفاهيم النظرية)"
                                                                    className="ca-input bg-slate-50 border-slate-200 focus:bg-white font-bold text-slate-700"
                                                                    value={item.week}
                                                                    onChange={e => handleSyllabusChange(i, 'week', e.target.value)}
                                                                />
                                                            </div>

                                                            {/* Topic (موضوع المحاضرة) */}
                                                            <div>
                                                                <label className="text-xs font-bold text-slate-400 mb-1 block">موضوع المحاضرة</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="موضوع المحاضرة..."
                                                                    className="ca-input bg-slate-50 border-slate-200 focus:bg-white"
                                                                    value={item.topic}
                                                                    onChange={e => handleSyllabusChange(i, 'topic', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Points (نقاط الموضوع) */}
                                                        <div className="mt-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                            <div className="flex justify-between items-center mb-3">
                                                                <label className="text-xs font-bold text-emerald-600">نقاط الموضوع</label>
                                                                <button type="button" onClick={() => addSyllabusPoint(i)} className="text-emerald-600 bg-white border border-emerald-200 hover:bg-emerald-50 p-1.5 rounded-lg transition"><Plus size={14} /></button>
                                                            </div>
                                                            <div className="space-y-2">
                                                                {item.points?.map((point, pi) => (
                                                                    <div key={pi} className="flex gap-2 items-center">
                                                                        <span className="text-emerald-500 text-sm font-bold">•</span>
                                                                        <input
                                                                            type="text"
                                                                            className="ca-input py-2 text-sm flex-1 bg-white"
                                                                            value={point}
                                                                            onChange={e => handleSyllabusPointChange(i, pi, e.target.value)}
                                                                            placeholder="أدخل نقطة..."
                                                                        />
                                                                        <button type="button" onClick={() => removeSyllabusPoint(i, pi)} className="text-slate-300 hover:text-red-500 transition p-1"><Minus size={14} /></button>
                                                                    </div>
                                                                ))}
                                                                {(!item.points || item.points.length === 0) && (
                                                                    <p className="text-xs text-slate-400 text-center py-2">لا توجد نقاط. اضغط + لإضافة نقطة.</p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Delete button */}
                                                        <button type="button" onClick={() => {
                                                            const newS = [...formData.syllabus];
                                                            newS.splice(i, 1);
                                                            setFormData({ ...formData, syllabus: newS });
                                                        }} className="absolute top-4 left-4 text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition"><Trash2 size={18} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="bg-white border-t border-slate-100 p-6 flex justify-end gap-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-8 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={saveLoading}
                                    className="px-10 py-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 font-bold transition flex items-center gap-2 shadow-lg shadow-primary-200 disabled:opacity-70 transform hover:-translate-y-1"
                                >
                                    {saveLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                    حفظ التغييرات
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoursesAdmin;