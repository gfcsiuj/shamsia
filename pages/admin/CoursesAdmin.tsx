import React, { useState, useEffect } from 'react';
import { db, storage } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Course, Instructor } from '../../types';
import { Plus, Pencil, Trash2, X, Upload, Loader2, Save, ArrowRight, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const CoursesAdmin: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'syllabus'>('basic');

  const initialFormState: Course = {
    id: '',
    title: '',
    category: 'Tech',
    level: 'مبتدئ',
    price: 0,
    oldPrice: 0,
    image: '',
    instructorId: '',
    duration: '',
    rating: 5,
    studentsCount: 0,
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

      const coursesData = coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
      const instructorsData = instructorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Instructor));

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
      syllabus: course.syllabus?.length ? course.syllabus : [{ week: 'الأسبوع 1', topic: '' }]
    });
    setIsEditing(true);
    setImageFile(null);
    setActiveTab('basic');
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

  const handleImageUpload = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `courses/${Date.now()}_${file.name}`);
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
        ...formData,
        image: imageUrl || 'https://via.placeholder.com/300x200',
        price: Number(formData.price),
        oldPrice: Number(formData.oldPrice),
        studentsCount: Number(formData.studentsCount),
        rating: Number(formData.rating),
        // Clean up empty array items
        objectives: formData.objectives.filter(item => item.trim() !== ''),
        targetAudience: formData.targetAudience.filter(item => item.trim() !== ''),
        syllabus: formData.syllabus.filter(item => item.topic.trim() !== ''),
      };

      // Remove id from payload if it exists (it's part of doc ref, not data)
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

  // Helper functions for dynamic arrays
  const handleArrayChange = (field: 'objectives' | 'targetAudience', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'objectives' | 'targetAudience') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field: 'objectives' | 'targetAudience', index: number) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSyllabusChange = (index: number, field: 'week' | 'topic', value: string) => {
    const newSyllabus = [...formData.syllabus];
    newSyllabus[index] = { ...newSyllabus[index], [field]: value };
    setFormData({ ...formData, syllabus: newSyllabus });
  };

  const addSyllabusItem = () => {
    setFormData({ ...formData, syllabus: [...formData.syllabus, { week: '', topic: '' }] });
  };

  const removeSyllabusItem = (index: number) => {
    const newSyllabus = [...formData.syllabus];
    newSyllabus.splice(index, 1);
    setFormData({ ...formData, syllabus: newSyllabus });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <Link to="/admin/dashboard" className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition text-slate-500">
                    <ArrowRight size={20} />
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">إدارة الدورات التدريبية</h1>
            </div>
          <button 
            onClick={() => { setFormData(initialFormState); setIsEditing(true); setImageFile(null); setActiveTab('basic'); }}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition"
          >
            <Plus size={20} />
            إضافة دورة
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" size={40} /></div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
             {/* Simple Table View */}
             <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4 w-20">صورة</th>
                    <th className="p-4">عنوان الدورة</th>
                    <th className="p-4">الفئة</th>
                    <th className="p-4">السعر</th>
                    <th className="p-4">الطلاب</th>
                    <th className="p-4">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-slate-50 transition">
                      <td className="p-4">
                        <img src={course.image} alt={course.title} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                      </td>
                      <td className="p-4 font-bold text-slate-800">{course.title}</td>
                      <td className="p-4 text-slate-600 text-sm">
                          <span className="bg-slate-100 px-2 py-1 rounded text-xs">{course.category}</span>
                      </td>
                      <td className="p-4 font-bold text-primary-700">{course.price.toLocaleString()}</td>
                      <td className="p-4 text-slate-600">{course.studentsCount}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEdit(course)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Pencil size={18} /></button>
                          <button onClick={() => handleDelete(course.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {courses.length === 0 && (
                      <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-500">لا توجد دورات حالياً.</td>
                      </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Full Screen Form Overlay */}
        {isEditing && (
          <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col animate-fade-in overflow-hidden">
             {/* Form Header */}
             <div className="bg-white px-6 py-4 shadow-sm flex justify-between items-center z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><X /></button>
                    <h2 className="text-xl font-bold text-slate-800">{formData.id ? 'تعديل دورة' : 'إنشاء دورة جديدة'}</h2>
                </div>
                <button 
                    onClick={handleSubmit} 
                    disabled={saveLoading}
                    className="px-6 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-bold transition flex items-center gap-2 shadow-md shadow-primary-200 disabled:opacity-70"
                >
                    {saveLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    حفظ التغييرات
                </button>
             </div>

             {/* Form Body - Scrollable */}
             <div className="flex-1 overflow-y-auto p-6 md:p-8">
                 <div className="max-w-4xl mx-auto space-y-8">
                     
                     {/* Tabs */}
                     <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200 w-fit mx-auto sticky top-0 z-10">
                         {['basic', 'details', 'syllabus'].map((t) => (
                             <button
                                key={t}
                                onClick={() => setActiveTab(t as any)}
                                className={`px-6 py-2 rounded-md font-bold text-sm transition ${activeTab === t ? 'bg-primary-100 text-primary-700' : 'text-slate-500 hover:bg-slate-50'}`}
                             >
                                 {t === 'basic' ? 'معلومات أساسية' : t === 'details' ? 'تفاصيل ومحتوى' : 'المنهج الدراسي'}
                             </button>
                         ))}
                     </div>

                     {/* Basic Info Tab */}
                     {activeTab === 'basic' && (
                         <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8 animate-fade-in">
                             <h3 className="text-lg font-bold text-slate-800 mb-6 border-b pb-2">المعلومات الأساسية</h3>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                 <div className="md:col-span-2">
                                     <label className="label">عنوان الدورة</label>
                                     <input type="text" className="input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                                 </div>
                                 
                                 <div>
                                     <label className="label">التصنيف</label>
                                     <select className="input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                                         <option value="Tech">Tech</option>
                                         <option value="Human Development">Human Development</option>
                                         <option value="Cyber Security">Cyber Security</option>
                                         <option value="Admin Skills">Admin Skills</option>
                                         <option value="Student Skills">Student Skills</option>
                                     </select>
                                 </div>

                                 <div>
                                     <label className="label">المستوى</label>
                                     <select className="input" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value as any})}>
                                         <option value="مبتدئ">مبتدئ</option>
                                         <option value="متوسط">متوسط</option>
                                         <option value="متقدم">متقدم</option>
                                         <option value="دبلوم">دبلوم</option>
                                     </select>
                                 </div>

                                 <div>
                                     <label className="label">المدرب</label>
                                     <select className="input" value={formData.instructorId} onChange={e => setFormData({...formData, instructorId: e.target.value})}>
                                         <option value="">-- اختر المدرب --</option>
                                         {instructors.map(inst => (
                                             <option key={inst.id} value={inst.id}>{inst.name}</option>
                                         ))}
                                     </select>
                                 </div>

                                 <div>
                                     <label className="label">صورة الغلاف</label>
                                     <div className="flex items-center gap-4">
                                         <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                            {imageFile ? <img src={URL.createObjectURL(imageFile)} className="w-full h-full object-cover"/> : formData.image && <img src={formData.image} className="w-full h-full object-cover"/>}
                                         </div>
                                         <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg text-sm font-bold transition">
                                             رفع صورة
                                             <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files && setImageFile(e.target.files[0])} />
                                         </label>
                                     </div>
                                 </div>

                                 <div>
                                     <label className="label">السعر (د.ع)</label>
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
                                     <label className="label">تاريخ البدء (نصي)</label>
                                     <input type="text" className="input" placeholder="الخميس والجمعة" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                                 </div>
                             </div>
                         </div>
                     )}

                     {/* Details Tab */}
                     {activeTab === 'details' && (
                         <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8 animate-fade-in space-y-6">
                             <div>
                                 <label className="label">وصف مختصر (يظهر في الكارد)</label>
                                 <textarea className="input" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                             </div>

                             <div>
                                 <label className="label">الإعلان التفصيلي (Long Description)</label>
                                 <textarea className="input font-mono text-sm" rows={10} value={formData.longDescription} onChange={e => setFormData({...formData, longDescription: e.target.value})}></textarea>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 {/* Objectives */}
                                 <div>
                                     <div className="flex justify-between items-center mb-2">
                                        <label className="label mb-0">ماذا ستتعلم (Objectives)</label>
                                        <button type="button" onClick={() => addArrayItem('objectives')} className="text-primary-600 hover:bg-primary-50 p-1 rounded"><Plus size={18}/></button>
                                     </div>
                                     <div className="space-y-2">
                                         {formData.objectives.map((obj, i) => (
                                             <div key={i} className="flex gap-2">
                                                 <input type="text" className="input py-1" value={obj} onChange={e => handleArrayChange('objectives', i, e.target.value)} />
                                                 <button type="button" onClick={() => removeArrayItem('objectives', i)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Minus size={16}/></button>
                                             </div>
                                         ))}
                                     </div>
                                 </div>

                                 {/* Target Audience */}
                                 <div>
                                     <div className="flex justify-between items-center mb-2">
                                        <label className="label mb-0">الفئة المستهدفة</label>
                                        <button type="button" onClick={() => addArrayItem('targetAudience')} className="text-primary-600 hover:bg-primary-50 p-1 rounded"><Plus size={18}/></button>
                                     </div>
                                     <div className="space-y-2">
                                         {formData.targetAudience.map((aud, i) => (
                                             <div key={i} className="flex gap-2">
                                                 <input type="text" className="input py-1" value={aud} onChange={e => handleArrayChange('targetAudience', i, e.target.value)} />
                                                 <button type="button" onClick={() => removeArrayItem('targetAudience', i)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Minus size={16}/></button>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             </div>
                         </div>
                     )}

                     {/* Syllabus Tab */}
                     {activeTab === 'syllabus' && (
                         <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8 animate-fade-in">
                             <div className="flex justify-between items-center mb-6 border-b pb-4">
                                <h3 className="text-lg font-bold text-slate-800">المنهج الدراسي</h3>
                                <button type="button" onClick={addSyllabusItem} className="bg-primary-50 text-primary-700 px-3 py-2 rounded-lg text-sm font-bold hover:bg-primary-100 transition flex items-center gap-2">
                                    <Plus size={16}/> إضافة أسبوع/محور
                                </button>
                             </div>
                             
                             <div className="space-y-4">
                                 {formData.syllabus.map((item, i) => (
                                     <div key={i} className="flex flex-col md:flex-row gap-4 items-start bg-slate-50 p-4 rounded-lg border border-slate-200">
                                         <div className="w-full md:w-1/4">
                                             <input 
                                                type="text" 
                                                placeholder="الأسبوع 1" 
                                                className="input bg-white" 
                                                value={item.week} 
                                                onChange={e => handleSyllabusChange(i, 'week', e.target.value)} 
                                             />
                                         </div>
                                         <div className="w-full md:w-3/4 flex gap-2">
                                             <input 
                                                type="text" 
                                                placeholder="موضوع المحاضرة..." 
                                                className="input bg-white" 
                                                value={item.topic} 
                                                onChange={e => handleSyllabusChange(i, 'topic', e.target.value)} 
                                             />
                                             <button type="button" onClick={() => removeSyllabusItem(i)} className="text-red-500 hover:bg-white p-3 rounded-lg border border-transparent hover:border-red-100 transition"><Trash2 size={18}/></button>
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
        .label { @apply block text-sm font-bold text-slate-700 mb-2; }
        .input { @apply w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition; }
      `}</style>
    </div>
  );
};

export default CoursesAdmin;