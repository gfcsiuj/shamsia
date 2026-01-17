import React, { useState, useEffect } from 'react';
import { db, storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Course, Instructor, MediaItem } from '../../types';
import { Plus, Pencil, Trash2, X, Upload, Loader2, Save, ArrowRight, Minus, Image as ImageIcon, Video, Link as LinkIcon, Users, Tag, CheckSquare, Layers, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import './CoursesAdmin.css';

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
                    <div className="h-44 relative">
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
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300"></div>
                    </div>
                    <div className="p-5">
                        <h3 className="font-bold text-slate-800 mb-2 line-clamp-1 text-lg">{course.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 bg-slate-50 p-2 rounded-lg">
                            <span className="font-semibold text-primary-600">{course.price > 0 ? course.price.toLocaleString() + ' د.ع' : 'مجاناً'}</span>
                            <span className="w-px h-3 bg-slate-300"></span>
                            <span>{course.studentsCount} طالب</span>
                            <span className="w-px h-3 bg-slate-300"></span>
                            <span>{course.level}</span>
                        </div>
                        <div className="flex gap-2 mt-auto">
                            <button onClick={() => handleEdit(course)} className="flex-1 py-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition font-bold text-sm flex items-center justify-center gap-2 border border-blue-100"><Pencil size={16} /> تعديل</button>
                            <button onClick={() => handleDelete(course.id)} className="px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition border border-red-100"><Trash2 size={16} /></button>
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
                        <button onClick={() => setIsEditing(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition"><X size={24}/></button>
                    </div>
                 </div>

                 {/* Body */}
                 <div className="flex-1 overflow-y-auto p-8 ca-scrollable bg-slate-50/50">
                     <div className="max-w-6xl mx-auto space-y-8">
                         
                         {/* Basic Info Tab */}
                         {activeTab === 'basic' && (
                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                                 {/* Left Column */}
                                 <div className="lg:col-span-2 space-y-8">
                                     <div className="ca-card">
                                         <h3 className="ca-section-title">المعلومات الأساسية</h3>
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                             <div className="md:col-span-2">
                                                 <label className="ca-label">عنوان الدورة</label>
                                                 <input type="text" className="ca-input text-lg font-semibold" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="أدخل عنواناً مميزاً..." />
                                             </div>
                                             <div>
                                                 <label className="ca-label">التصنيف</label>
                                                 <select className="ca-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                                     <option value="Tech">التقنية والبرمجة</option>
                                                     <option value="Human Development">التنمية البشرية</option>
                                                     <option value="Cyber Security">الأمن السيبراني</option>
                                                     <option value="Admin Skills">المهارات الإدارية</option>
                                                     <option value="Student Skills">المهارات الطلابية</option>
                                                 </select>
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
                                                                setFormData({...formData, level: e.target.value});
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
                                                         <button type="button" onClick={() => setShowCustomLevelInput(false)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X/></button>
                                                     </div>
                                                 )}
                                             </div>
                                         </div>
                                     </div>

                                     <div className="ca-card ca-card-primary">
                                          <h3 className="ca-section-title text-primary-800 border-primary-100">فريق التدريب</h3>
                                          <div className="flex flex-wrap gap-2 mb-4">
                                              {formData.instructorIds?.map(id => {
                                                  const inst = instructors.find(i => i.id === id);
                                                  return inst ? (
                                                      <div key={id} className="flex items-center gap-2 bg-white text-primary-700 px-4 py-2 rounded-full text-sm font-bold border border-primary-200 shadow-sm animate-pop-in">
                                                          <img src={inst.image} className="w-6 h-6 rounded-full object-cover"/>
                                                          {inst.name}
                                                          <button onClick={() => toggleInstructor(id)} className="hover:text-red-500 bg-primary-50 rounded-full p-0.5"><X size={14}/></button>
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
                                                              {formData.instructorIds?.includes(inst.id) && <CheckSquare size={14} className="text-white"/>}
                                                          </div>
                                                          <img src={inst.image} className="w-8 h-8 rounded-full object-cover"/>
                                                          <span className="text-sm font-bold text-slate-700">{inst.name}</span>
                                                      </div>
                                                  ))}
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
                                                         <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-900"><Video size={32}/></div>
                                                     ) : (
                                                         <img src={item.url} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"/>
                                                     )}
                                                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                         <button onClick={() => removeMedia(i)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition transform hover:scale-110"><Trash2 size={18}/></button>
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
                                                        <ImageIcon size={14}/> صورة
                                                    </div>
                                                    <div 
                                                        onClick={() => setMediaTypeInput('video')} 
                                                        className={`ca-media-option flex-1 text-xs ${mediaTypeInput === 'video' ? 'active' : ''}`}
                                                    >
                                                        <Video size={14}/> فيديو
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
                                                         <LinkIcon size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"/>
                                                     </div>
                                                 )}
                                                 
                                                 <div className="flex gap-2 w-full mt-1">
                                                     <label className="flex-1 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition">
                                                         <Upload size={14}/> رفع
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
                                                 <label className="ca-label">السعر الحالي (د.ع)</label>
                                                 <input type="number" className="ca-input text-lg font-bold text-slate-800" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                                             </div>
                                             <div>
                                                 <label className="ca-label">السعر السابق (اختياري)</label>
                                                 <input type="number" className="ca-input text-slate-500" value={formData.oldPrice} onChange={e => setFormData({...formData, oldPrice: Number(e.target.value)})} />
                                             </div>
                                             <div>
                                                 <label className="ca-label">المدة (مثال: 4 أسابيع)</label>
                                                 <input type="text" className="ca-input" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
                                             </div>
                                             <div>
                                                 <label className="ca-label">تاريخ/أيام البدء</label>
                                                 <input type="text" className="ca-input" placeholder="مثال: كل خميس وجمعة" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                                             </div>
                                         </div>
                                     </div>

                                     <div className="ca-card">
                                         <h3 className="ca-section-title">إعدادات إضافية</h3>
                                         <div className="space-y-4">
                                             <div>
                                                 <label className="ca-label">التقييم (من 5)</label>
                                                 <input type="number" step="0.1" max="5" className="ca-input" value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} />
                                             </div>
                                             
                                             <div>
                                                 <label className="ca-label">
                                                     <span>عدد الطلاب</span>
                                                     <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                                                         <button type="button" onClick={() => setFormData({...formData, studentsCountMode: 'auto'})} className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition ${formData.studentsCountMode === 'auto' ? 'bg-white shadow-sm text-primary-700' : 'text-slate-500'}`}>تلقائي</button>
                                                         <button type="button" onClick={() => setFormData({...formData, studentsCountMode: 'manual'})} className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition ${formData.studentsCountMode === 'manual' ? 'bg-white shadow-sm text-primary-700' : 'text-slate-500'}`}>يدوي</button>
                                                     </div>
                                                 </label>
                                                 <input 
                                                    type="number" 
                                                    className={`ca-input ${formData.studentsCountMode === 'auto' ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : ''}`} 
                                                    value={formData.studentsCount} 
                                                    onChange={e => setFormData({...formData, studentsCount: Number(e.target.value)})} 
                                                    readOnly={formData.studentsCountMode === 'auto'}
                                                 />
                                             </div>

                                             <div>
                                                 <label className="ca-label">علامات مميزة (Tags)</label>
                                                 <div className="flex flex-wrap gap-2 mb-3">
                                                     {formData.tags?.map(tag => (
                                                         <span key={tag} className="bg-slate-800 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                                                             {tag}
                                                             <button onClick={() => removeTag(tag)} className="hover:text-red-300"><X size={12}/></button>
                                                         </span>
                                                     ))}
                                                 </div>
                                                 <div className="relative">
                                                     <input 
                                                        type="text" 
                                                        className="ca-input text-sm" 
                                                        placeholder="اكتب واضغط Enter..." 
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                addTag(e.currentTarget.value);
                                                                e.currentTarget.value = '';
                                                            }
                                                        }} 
                                                     />
                                                     <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
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
                                             <textarea className="ca-input" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="وصف يظهر في صفحة الكورسات..."></textarea>
                                         </div>
                                         <div>
                                             <label className="ca-label">الإعلان التفصيلي (صفحة الدورة)</label>
                                             <textarea className="ca-input font-mono text-sm leading-relaxed" rows={12} value={formData.longDescription} onChange={e => setFormData({...formData, longDescription: e.target.value})} placeholder="تفاصيل الدورة الكاملة..."></textarea>
                                         </div>
                                     </div>
                                 </div>

                                 <div className="ca-card h-full ca-card-purple">
                                     <div className="flex justify-between items-center mb-6 border-b border-purple-200 pb-3">
                                         <h3 className="ca-section-title mb-0 border-none text-purple-900">ماذا ستتعلم (Objectives)</h3>
                                         <button type="button" onClick={() => addArrayItem('objectives')} className="text-purple-600 bg-white border border-purple-200 hover:bg-purple-50 p-2 rounded-lg transition shadow-sm"><Plus size={18}/></button>
                                     </div>
                                     <div className="space-y-3">
                                         {formData.objectives.map((obj, i) => (
                                             <div key={i} className="flex gap-2 group">
                                                 <div className="flex-1 relative">
                                                     <input type="text" className="ca-input py-2.5 text-sm pr-8" value={obj} onChange={e => handleArrayChange('objectives', i, e.target.value)} />
                                                     <span className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 font-bold text-xs">{i+1}.</span>
                                                 </div>
                                                 <button type="button" onClick={() => removeArrayItem('objectives', i)} className="text-slate-300 hover:text-red-500 transition px-1"><Minus size={18}/></button>
                                             </div>
                                         ))}
                                     </div>
                                 </div>

                                 <div className="ca-card h-full ca-card-indigo">
                                     <div className="flex justify-between items-center mb-6 border-b border-indigo-200 pb-3">
                                         <h3 className="ca-section-title mb-0 border-none text-indigo-900">الفئة المستهدفة</h3>
                                         <button type="button" onClick={() => addArrayItem('targetAudience')} className="text-indigo-600 bg-white border border-indigo-200 hover:bg-indigo-50 p-2 rounded-lg transition shadow-sm"><Plus size={18}/></button>
                                     </div>
                                     <div className="space-y-3">
                                         {formData.targetAudience.map((aud, i) => (
                                             <div key={i} className="flex gap-2">
                                                 <input type="text" className="ca-input py-2.5 text-sm" value={aud} onChange={e => handleArrayChange('targetAudience', i, e.target.value)} />
                                                 <button type="button" onClick={() => removeArrayItem('targetAudience', i)} className="text-slate-300 hover:text-red-500 transition px-1"><Minus size={18}/></button>
                                             </div>
                                         ))}
                                     </div>
                                 </div>

                                 <div className="ca-card md:col-span-2">
                                     <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
                                         <h3 className="ca-section-title mb-0 border-none">الشهادات والاعتمادات</h3>
                                         <button type="button" onClick={() => addArrayItem('certifications')} className="text-primary-600 bg-primary-50 hover:bg-primary-100 p-2 rounded-lg transition"><Plus size={18}/></button>
                                     </div>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                         {formData.certifications?.map((cert, i) => (
                                             <div key={i} className="flex gap-2 items-center">
                                                 <Award size={20} className="text-slate-300"/>
                                                 <input type="text" className="ca-input py-2.5 text-sm" value={cert} onChange={e => handleArrayChange('certifications', i, e.target.value)} placeholder="اسم الشهادة..." />
                                                 <button type="button" onClick={() => removeArrayItem('certifications', i)} className="text-slate-300 hover:text-red-500 transition"><Minus size={18}/></button>
                                             </div>
                                         ))}
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
                                        <Plus size={18}/> إضافة أسبوع/محور
                                    </button>
                                 </div>
                                 
                                 <div className="space-y-4">
                                     {formData.syllabus.map((item, i) => (
                                         <div key={i} className="flex flex-col md:flex-row gap-4 items-start bg-white p-5 rounded-2xl border border-blue-100 shadow-sm relative group hover:border-blue-300 transition-all">
                                             <div className="absolute -right-3 top-6 w-8 h-8 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center font-bold text-blue-600 text-xs shadow-sm z-10">
                                                 {i+1}
                                             </div>
                                             <div className="w-full md:w-1/4 pt-1">
                                                 <label className="text-xs font-bold text-slate-400 mb-1 block">العنوان الفرعي</label>
                                                 <input 
                                                    type="text" 
                                                    placeholder="الأسبوع 1" 
                                                    className="ca-input bg-slate-50 border-slate-200 focus:bg-white font-bold text-slate-700" 
                                                    value={item.week} 
                                                    onChange={e => handleSyllabusChange(i, 'week', e.target.value)} 
                                                 />
                                             </div>
                                             <div className="w-full md:w-3/4 flex gap-3 pt-1">
                                                 <div className="flex-1">
                                                    <label className="text-xs font-bold text-slate-400 mb-1 block">موضوع المحاضرة</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="موضوع المحاضرة..." 
                                                        className="ca-input bg-slate-50 border-slate-200 focus:bg-white" 
                                                        value={item.topic} 
                                                        onChange={e => handleSyllabusChange(i, 'topic', e.target.value)} 
                                                    />
                                                 </div>
                                                 <button type="button" onClick={() => {
                                                      const newS = [...formData.syllabus];
                                                      newS.splice(i, 1);
                                                      setFormData({...formData, syllabus: newS});
                                                 }} className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-3 rounded-xl mt-6 transition"><Trash2 size={20}/></button>
                                             </div>
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