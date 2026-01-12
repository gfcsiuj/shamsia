
import React, { useState, useEffect } from 'react';
import { db, storage } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Course, Instructor, MediaItem } from '../../types';
import { Plus, Pencil, Trash2, X, Upload, Loader2, Save, ArrowRight, Minus, Image as ImageIcon, Video, Link as LinkIcon, Users, Tag, CheckSquare, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const CoursesAdmin: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'syllabus'>('basic');
  
  // Custom states for UI logic
  const [customLevel, setCustomLevel] = useState('');
  const [showCustomLevelInput, setShowCustomLevelInput] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaLinkInput, setMediaLinkInput] = useState('');
  const [mediaTypeInput, setMediaTypeInput] = useState<'image' | 'video'>('image');

  const initialFormState: Course = {
    id: '',
    title: '',
    category: 'Tech',
    level: 'مبتدئ',
    price: 0,
    oldPrice: 0,
    media: [],
    instructorIds: [],
    duration: '',
    rating: 5,
    studentsCount: 0,
    studentsCountMode: 'auto',
    tags: [],
    startDate: '',
    description: '',
    longDescription: '',
    objectives: [''],
    targetAudience: [''],
    syllabus: [{ week: 'الأسبوع 1', topic: '' }],
    certifications: [],
  };

  const [formData, setFormData] = useState<Course>(initialFormState);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesSnap, instructorsSnap] = await Promise.all([
        getDocs(collection(db, 'courses')),
        getDocs(collection(db, 'instructors'))
      ]);

      const coursesData = coursesSnap.docs.map(doc => {
          const data = doc.data() as any;
          // Migration logic for old data
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
      syllabus: course.syllabus?.length ? course.syllabus : [{ week: 'الأسبوع 1', topic: '' }],
      certifications: course.certifications?.length ? course.certifications : [],
      tags: course.tags || []
    });
    setIsEditing(true);
    setMediaFile(null);
    setMediaLinkInput('');
    setActiveTab('basic');
    setShowCustomLevelInput(!['مبتدئ', 'متوسط', 'متقدم', 'دبلوم'].includes(course.level) && course.level !== '');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الدورة؟')) {
      try {
        await deleteDoc(doc(db, 'courses', id));
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
      // If user typed a custom level but didn't switch dropdown, or vice versa logic
      let finalLevel = formData.level;
      if (showCustomLevelInput && customLevel) {
          finalLevel = customLevel;
      }

      const dataToSave = {
        ...formData,
        level: finalLevel,
        price: Number(formData.price),
        oldPrice: Number(formData.oldPrice),
        studentsCount: Number(formData.studentsCount),
        rating: Number(formData.rating),
        objectives: formData.objectives.filter(item => item.trim() !== ''),
        targetAudience: formData.targetAudience.filter(item => item.trim() !== ''),
        certifications: formData.certifications?.filter(item => item.trim() !== '') || [],
        syllabus: formData.syllabus.filter(item => item.topic.trim() !== ''),
        tags: formData.tags
      };

      const { id, ...payload } = dataToSave;

      if (formData.id) {
        await updateDoc(doc(db, 'courses', formData.id), payload);
      } else {
        await addDoc(collection(db, 'courses'), payload);
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

  // Generic Array Handlers
  const handleArrayChange = (field: 'objectives' | 'targetAudience' | 'certifications', index: number, value: string) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'objectives' | 'targetAudience' | 'certifications') => {
    setFormData({ ...formData, [field]: [...(formData[field] || []), ''] });
  };

  const removeArrayItem = (field: 'objectives' | 'targetAudience' | 'certifications', index: number) => {
    const newArray = [...(formData[field] || [])];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  // Instructor Multi-Select
  const toggleInstructor = (instId: string) => {
      const currentIds = formData.instructorIds || [];
      if (currentIds.includes(instId)) {
          setFormData({ ...formData, instructorIds: currentIds.filter(id => id !== instId) });
      } else {
          setFormData({ ...formData, instructorIds: [...currentIds, instId] });
      }
  };

  // Tags Handler
  const addTag = (tag: string) => {
      if (tag && !formData.tags.includes(tag)) {
          setFormData({ ...formData, tags: [...formData.tags, tag] });
      }
  };
  
  const removeTag = (tag: string) => {
      setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  // Syllabus
  const handleSyllabusChange = (index: number, field: 'week' | 'topic', value: string) => {
    const newSyllabus = [...formData.syllabus];
    newSyllabus[index] = { ...newSyllabus[index], [field]: value };
    setFormData({ ...formData, syllabus: newSyllabus });
  };

  const addSyllabusItem = () => {
    setFormData({ ...formData, syllabus: [...formData.syllabus, { week: '', topic: '' }] });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
                <Link to="/admin/dashboard" className="p-2 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition text-slate-500">
                    <ArrowRight size={20} />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">إدارة الدورات</h1>
                  <p className="text-sm text-slate-500">إضافة وتعديل الدورات التدريبية ومحتواها</p>
                </div>
            </div>
            <button 
                onClick={() => { setFormData(initialFormState); setIsEditing(true); setMediaFile(null); setActiveTab('basic'); }}
                className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition shadow-lg shadow-primary-200"
            >
                <Plus size={20} />
                إضافة دورة
            </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition group">
                    <div className="h-40 relative">
                        {course.media && course.media[0] ? (
                             course.media[0].type === 'video' ? (
                                <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white"><Video size={32} /></div>
                             ) : (
                                <img src={course.media[0].url} alt={course.title} className="w-full h-full object-cover" />
                             )
                        ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300"><ImageIcon size={32}/></div>
                        )}
                        <span className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-primary-700 shadow-sm">{course.category}</span>
                    </div>
                    <div className="p-5">
                        <h3 className="font-bold text-slate-800 mb-1 line-clamp-1">{course.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                            <span>{course.price > 0 ? course.price.toLocaleString() : 'مجاناً'}</span>
                            <span>•</span>
                            <span>{course.studentsCount} طالب</span>
                        </div>
                        <div className="flex gap-2 mt-auto">
                            <button onClick={() => handleEdit(course)} className="flex-1 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition font-bold text-sm flex items-center justify-center gap-2"><Pencil size={16} /> تعديل</button>
                            <button onClick={() => handleDelete(course.id)} className="px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"><Trash2 size={16} /></button>
                        </div>
                    </div>
                </div>
            ))}
             {courses.length === 0 && (
                <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                    <Layers size={48} className="mx-auto mb-4 opacity-50" />
                    <p>لا توجد دورات حالياً. ابدأ بإضافة أول دورة.</p>
                </div>
            )}
          </div>
        )}

        {/* Full Screen Form Overlay */}
        {isEditing && (
          <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col animate-fade-in overflow-hidden">
             {/* Form Header */}
             <div className="bg-white px-6 py-4 shadow-sm flex justify-between items-center z-10 border-b border-slate-200">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition"><X /></button>
                    <h2 className="text-xl font-bold text-slate-800">{formData.id ? 'تعديل دورة' : 'إنشاء دورة جديدة'}</h2>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                     {['basic', 'details', 'syllabus'].map((t) => (
                         <button
                            key={t}
                            onClick={() => setActiveTab(t as any)}
                            className={`px-4 py-1.5 rounded-md font-bold text-sm transition ${activeTab === t ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                         >
                             {t === 'basic' ? 'البيانات الأساسية' : t === 'details' ? 'تفاصيل المحتوى' : 'المنهج الدراسي'}
                         </button>
                     ))}
                </div>
                <button 
                    onClick={handleSubmit} 
                    disabled={saveLoading}
                    className="px-6 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-bold transition flex items-center gap-2 shadow-md shadow-primary-200 disabled:opacity-70"
                >
                    {saveLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    حفظ
                </button>
             </div>

             {/* Form Body - Scrollable */}
             <div className="flex-1 overflow-y-auto p-6 md:p-8">
                 <div className="max-w-5xl mx-auto space-y-8">
                     
                     {/* Basic Info Tab */}
                     {activeTab === 'basic' && (
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                             {/* Left Column: Main Info */}
                             <div className="lg:col-span-2 space-y-6">
                                 <div className="card">
                                     <h3 className="section-title">معلومات الدورة</h3>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                         <div className="md:col-span-2">
                                             <label className="label">عنوان الدورة</label>
                                             <input type="text" className="input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="مثال: أساسيات البرمجة بلغة بايثون" />
                                         </div>
                                         <div>
                                             <label className="label">التصنيف</label>
                                             <select className="input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                                 <option value="Tech">التقنية والبرمجة</option>
                                                 <option value="Human Development">التنمية البشرية</option>
                                                 <option value="Cyber Security">الأمن السيبراني</option>
                                                 <option value="Admin Skills">المهارات الإدارية</option>
                                                 <option value="Student Skills">المهارات الطلابية</option>
                                             </select>
                                         </div>
                                         <div>
                                             <label className="label">المستوى</label>
                                             {!showCustomLevelInput ? (
                                                  <select 
                                                    className="input" 
                                                    value={formData.level} 
                                                    onChange={e => {
                                                        if (e.target.value === 'custom') {
                                                            setShowCustomLevelInput(true);
                                                        } else {
                                                            setFormData({...formData, level: e.target.value});
                                                        }
                                                    }}
                                                  >
                                                    <option value="مبتدئ">مبتدئ</option>
                                                    <option value="متوسط">متوسط</option>
                                                    <option value="متقدم">متقدم</option>
                                                    <option value="دبلوم">دبلوم</option>
                                                    <option value="custom" className="font-bold text-primary-600">+ إضافة مستوى جديد</option>
                                                  </select>
                                             ) : (
                                                 <div className="flex gap-2">
                                                     <input type="text" className="input" autoFocus placeholder="اكتب المستوى..." value={customLevel} onChange={e => setCustomLevel(e.target.value)} />
                                                     <button type="button" onClick={() => setShowCustomLevelInput(false)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X/></button>
                                                 </div>
                                             )}
                                         </div>
                                     </div>
                                 </div>

                                 <div className="card border-primary-100 bg-primary-50/50">
                                      <h3 className="section-title text-primary-800 border-primary-100">المدربين</h3>
                                      <div className="flex flex-wrap gap-2 mb-3">
                                          {formData.instructorIds?.map(id => {
                                              const inst = instructors.find(i => i.id === id);
                                              return inst ? (
                                                  <div key={id} className="flex items-center gap-2 bg-white text-primary-700 px-3 py-1.5 rounded-full text-sm font-medium border border-primary-100 shadow-sm">
                                                      <img src={inst.image} className="w-5 h-5 rounded-full object-cover"/>
                                                      {inst.name}
                                                      <button onClick={() => toggleInstructor(id)} className="hover:text-red-500"><X size={14}/></button>
                                                  </div>
                                              ) : null;
                                          })}
                                      </div>
                                      <div className="relative group">
                                          <button type="button" className="input text-start text-slate-500 flex justify-between items-center bg-white">
                                              <span>اختر المدربين...</span>
                                              <Users size={16} />
                                          </button>
                                          <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 shadow-lg rounded-lg mt-1 max-h-48 overflow-y-auto hidden group-hover:block hover:block z-10">
                                              {instructors.map(inst => (
                                                  <div 
                                                    key={inst.id} 
                                                    onClick={() => toggleInstructor(inst.id)}
                                                    className={`p-2 flex items-center gap-3 hover:bg-slate-50 cursor-pointer ${formData.instructorIds?.includes(inst.id) ? 'bg-primary-50' : ''}`}
                                                  >
                                                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${formData.instructorIds?.includes(inst.id) ? 'bg-primary-500 border-primary-500' : 'border-slate-300'}`}>
                                                          {formData.instructorIds?.includes(inst.id) && <CheckSquare size={12} className="text-white"/>}
                                                      </div>
                                                      <img src={inst.image} className="w-8 h-8 rounded-full object-cover"/>
                                                      <span className="text-sm font-medium">{inst.name}</span>
                                                  </div>
                                              ))}
                                          </div>
                                      </div>
                                 </div>

                                 <div className="card border-blue-100 bg-blue-50/30">
                                     <h3 className="section-title text-blue-800 border-blue-100">الوسائط (الغلاف والفيديو)</h3>
                                     
                                     {/* Media List */}
                                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                                         {formData.media.map((item, i) => (
                                             <div key={i} className="relative aspect-video bg-white rounded-lg overflow-hidden group border border-slate-200 shadow-sm">
                                                 {item.type === 'video' ? (
                                                     <div className="w-full h-full flex items-center justify-center text-slate-400"><Video size={24}/></div>
                                                 ) : (
                                                     <img src={item.url} className="w-full h-full object-cover"/>
                                                 )}
                                                 <button onClick={() => removeMedia(i)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"><X size={14}/></button>
                                                 <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded uppercase">{item.type}</span>
                                             </div>
                                         ))}
                                     </div>

                                     {/* Add Media */}
                                     <div className="bg-white p-4 rounded-xl border border-dashed border-blue-200">
                                         <div className="flex gap-4 mb-3">
                                             <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                                 <input type="radio" name="mediaType" checked={mediaTypeInput === 'image'} onChange={() => setMediaTypeInput('image')} className="accent-blue-600"/> صورة
                                             </label>
                                             <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                                 <input type="radio" name="mediaType" checked={mediaTypeInput === 'video'} onChange={() => setMediaTypeInput('video')} className="accent-blue-600"/> فيديو
                                             </label>
                                         </div>
                                         <div className="flex flex-col sm:flex-row gap-3">
                                             <div className="flex-1">
                                                 <div className="relative">
                                                     <input 
                                                        type="text" 
                                                        className="input text-sm" 
                                                        placeholder="رابط مباشر..." 
                                                        value={mediaLinkInput}
                                                        onChange={e => setMediaLinkInput(e.target.value)}
                                                     />
                                                     <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                                                 </div>
                                             </div>
                                             <div className="text-center text-sm text-slate-400 flex items-center">أو</div>
                                             <div>
                                                  <label className="cursor-pointer bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition">
                                                      <Upload size={16}/> {mediaFile ? 'تم اختيار ملف' : 'رفع ملف'}
                                                      <input type="file" className="hidden" accept={mediaTypeInput === 'image' ? "image/*" : "video/*"} onChange={e => e.target.files && setMediaFile(e.target.files[0])} />
                                                  </label>
                                             </div>
                                             <button type="button" onClick={handleAddMedia} disabled={!mediaLinkInput && !mediaFile} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 disabled:opacity-50 transition">إضافة</button>
                                         </div>
                                     </div>
                                 </div>
                             </div>

                             {/* Right Column: Settings */}
                             <div className="space-y-6">
                                 <div className="card border-emerald-100 bg-emerald-50/30">
                                     <h3 className="section-title text-emerald-800 border-emerald-100">التسعير والوقت</h3>
                                     <div className="space-y-4">
                                         <div>
                                             <label className="label">السعر الحالي (د.ع)</label>
                                             <input type="number" className="input" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                                         </div>
                                         <div>
                                             <label className="label">السعر السابق (اختياري)</label>
                                             <input type="number" className="input" value={formData.oldPrice} onChange={e => setFormData({...formData, oldPrice: Number(e.target.value)})} />
                                         </div>
                                         <div>
                                             <label className="label">المدة (مثال: 4 أسابيع)</label>
                                             <input type="text" className="input" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
                                         </div>
                                         <div>
                                             <label className="label">تاريخ/أيام البدء</label>
                                             <input type="text" className="input" placeholder="مثال: كل خميس وجمعة" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                                         </div>
                                     </div>
                                 </div>

                                 <div className="card">
                                     <h3 className="section-title">إعدادات إضافية</h3>
                                     <div className="space-y-4">
                                         <div>
                                             <label className="label">التقييم (من 5)</label>
                                             <input type="number" step="0.1" max="5" className="input" value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} />
                                         </div>
                                         
                                         <div>
                                             <label className="label flex justify-between">
                                                 <span>عدد الطلاب</span>
                                                 <div className="flex bg-slate-100 rounded-md p-0.5">
                                                     <button type="button" onClick={() => setFormData({...formData, studentsCountMode: 'auto'})} className={`px-2 py-0.5 text-xs rounded ${formData.studentsCountMode === 'auto' ? 'bg-white shadow-sm text-primary-700' : 'text-slate-500'}`}>تلقائي</button>
                                                     <button type="button" onClick={() => setFormData({...formData, studentsCountMode: 'manual'})} className={`px-2 py-0.5 text-xs rounded ${formData.studentsCountMode === 'manual' ? 'bg-white shadow-sm text-primary-700' : 'text-slate-500'}`}>يدوي</button>
                                                 </div>
                                             </label>
                                             <input 
                                                type="number" 
                                                className={`input ${formData.studentsCountMode === 'auto' ? 'bg-slate-50 text-slate-400' : ''}`} 
                                                value={formData.studentsCount} 
                                                onChange={e => setFormData({...formData, studentsCount: Number(e.target.value)})} 
                                                readOnly={formData.studentsCountMode === 'auto'}
                                             />
                                         </div>

                                         <div>
                                             <label className="label">علامات مميزة (Tags)</label>
                                             <div className="flex flex-wrap gap-2 mb-2">
                                                 {formData.tags?.map(tag => (
                                                     <span key={tag} className="bg-secondary-50 text-secondary-700 text-xs px-2 py-1 rounded flex items-center gap-1 border border-secondary-100">
                                                         {tag}
                                                         <button onClick={() => removeTag(tag)}><X size={12}/></button>
                                                     </span>
                                                 ))}
                                             </div>
                                             <input 
                                                type="text" 
                                                className="input text-sm" 
                                                placeholder="اكتب واضغط Enter..." 
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addTag(e.currentTarget.value);
                                                        e.currentTarget.value = '';
                                                    }
                                                }} 
                                             />
                                         </div>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     )}

                     {/* Details Tab */}
                     {activeTab === 'details' && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                             <div className="md:col-span-2 card">
                                 <h3 className="section-title">الأوصاف</h3>
                                 <div className="space-y-4">
                                     <div>
                                         <label className="label">وصف مختصر (للكارد)</label>
                                         <textarea className="input" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                                     </div>
                                     <div>
                                         <label className="label">الإعلان التفصيلي</label>
                                         <textarea className="input font-mono text-sm" rows={12} value={formData.longDescription} onChange={e => setFormData({...formData, longDescription: e.target.value})}></textarea>
                                     </div>
                                 </div>
                             </div>

                             <div className="card h-full border-orange-100 bg-orange-50/30">
                                 <div className="flex justify-between items-center mb-4 border-b border-orange-100 pb-2">
                                     <h3 className="section-title mb-0 border-none text-orange-800">ماذا ستتعلم (Objectives)</h3>
                                     <button type="button" onClick={() => addArrayItem('objectives')} className="text-orange-600 hover:bg-orange-100 p-1 rounded transition"><Plus size={18}/></button>
                                 </div>
                                 <div className="space-y-2">
                                     {formData.objectives.map((obj, i) => (
                                         <div key={i} className="flex gap-2">
                                             <input type="text" className="input py-2 text-sm" value={obj} onChange={e => handleArrayChange('objectives', i, e.target.value)} />
                                             <button type="button" onClick={() => removeArrayItem('objectives', i)} className="text-slate-400 hover:text-red-500"><Minus size={18}/></button>
                                         </div>
                                     ))}
                                 </div>
                             </div>

                             <div className="card h-full border-purple-100 bg-purple-50/30">
                                 <div className="flex justify-between items-center mb-4 border-b border-purple-100 pb-2">
                                     <h3 className="section-title mb-0 border-none text-purple-800">الفئة المستهدفة</h3>
                                     <button type="button" onClick={() => addArrayItem('targetAudience')} className="text-purple-600 hover:bg-purple-100 p-1 rounded transition"><Plus size={18}/></button>
                                 </div>
                                 <div className="space-y-2">
                                     {formData.targetAudience.map((aud, i) => (
                                         <div key={i} className="flex gap-2">
                                             <input type="text" className="input py-2 text-sm" value={aud} onChange={e => handleArrayChange('targetAudience', i, e.target.value)} />
                                             <button type="button" onClick={() => removeArrayItem('targetAudience', i)} className="text-slate-400 hover:text-red-500"><Minus size={18}/></button>
                                         </div>
                                     ))}
                                 </div>
                             </div>

                             <div className="card md:col-span-2">
                                 <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-2">
                                     <h3 className="section-title mb-0">الشهادات والاعتمادات</h3>
                                     <button type="button" onClick={() => addArrayItem('certifications')} className="text-primary-600 hover:bg-primary-50 p-1 rounded"><Plus size={18}/></button>
                                 </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     {formData.certifications?.map((cert, i) => (
                                         <div key={i} className="flex gap-2">
                                             <input type="text" className="input py-2 text-sm" value={cert} onChange={e => handleArrayChange('certifications', i, e.target.value)} placeholder="اسم الشهادة..." />
                                             <button type="button" onClick={() => removeArrayItem('certifications', i)} className="text-slate-400 hover:text-red-500"><Minus size={18}/></button>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         </div>
                     )}

                     {/* Syllabus Tab */}
                     {activeTab === 'syllabus' && (
                         <div className="card animate-fade-in border-indigo-100 bg-indigo-50/10">
                             <div className="flex justify-between items-center mb-6 border-b border-indigo-100 pb-4">
                                <h3 className="section-title mb-0 border-none text-indigo-900">المنهج الدراسي</h3>
                                <button type="button" onClick={addSyllabusItem} className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg text-sm font-bold hover:bg-indigo-100 transition flex items-center gap-2">
                                    <Plus size={16}/> إضافة أسبوع/محور
                                </button>
                             </div>
                             
                             <div className="space-y-4">
                                 {formData.syllabus.map((item, i) => (
                                     <div key={i} className="flex flex-col md:flex-row gap-4 items-start bg-white p-4 rounded-xl border border-indigo-100 shadow-sm relative group">
                                         <div className="w-full md:w-1/4">
                                             <input 
                                                type="text" 
                                                placeholder="الأسبوع 1" 
                                                className="input bg-slate-50 border-slate-100 focus:bg-white" 
                                                value={item.week} 
                                                onChange={e => handleSyllabusChange(i, 'week', e.target.value)} 
                                             />
                                         </div>
                                         <div className="w-full md:w-3/4 flex gap-2">
                                             <input 
                                                type="text" 
                                                placeholder="موضوع المحاضرة..." 
                                                className="input bg-slate-50 border-slate-100 focus:bg-white" 
                                                value={item.topic} 
                                                onChange={e => handleSyllabusChange(i, 'topic', e.target.value)} 
                                             />
                                             <button type="button" onClick={() => {
                                                  const newS = [...formData.syllabus];
                                                  newS.splice(i, 1);
                                                  setFormData({...formData, syllabus: newS});
                                             }} className="text-slate-400 hover:text-red-500 p-3 opacity-0 group-hover:opacity-100 transition"><Trash2 size={18}/></button>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>
                     )}
                 </div>
             </div>
          </div>
        )}
      </div>
      <style>{`
        .label { @apply block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2; }
        .input { @apply w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition bg-white text-slate-800; }
        .card { @apply bg-white p-6 rounded-2xl border border-slate-100 shadow-sm; }
        .section-title { @apply text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-50; }
      `}</style>
    </div>
  );
};

export default CoursesAdmin;
