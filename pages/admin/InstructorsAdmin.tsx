import React, { useState, useEffect } from 'react';
import { db, storage } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Instructor, Course, SocialLink } from '../../types';
import { Plus, Pencil, Trash2, X, Upload, Loader2, Save, ArrowRight, Minus, Link as LinkIcon, Facebook, Instagram, Linkedin, Twitter, Globe, Mail, Phone, Youtube, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const InstructorsAdmin: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const initialFormState: Instructor = {
    id: '',
    name: '',
    roles: [''],
    image: '',
    shortBio: '',
    bio: '',
    certifications: [],
    socials: [],
  };

  const [formData, setFormData] = useState<Instructor>(initialFormState);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [instSnap, coursesSnap] = await Promise.all([
        getDocs(collection(db, 'instructors')),
        getDocs(collection(db, 'courses'))
      ]);

      const instData = instSnap.docs.map(doc => {
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
          } as Instructor;
      });

      const coursesData = coursesSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) } as Course));
      
      setInstructors(instData);
      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (instructor: Instructor) => {
    setFormData({
        ...instructor,
        roles: instructor.roles && instructor.roles.length > 0 ? instructor.roles : [''],
        socials: instructor.socials || [],
        certifications: instructor.certifications || []
    });
    setIsEditing(true);
    setImageFile(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المدرب؟')) {
      try {
        await deleteDoc(doc(db, 'instructors', id));
        fetchData();
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `instructors/${Date.now()}_${file.name}`);
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
        // Update
        await updateDoc(doc(db, 'instructors', formData.id), dataToSave);
      } else {
        // Create
        await addDoc(collection(db, 'instructors'), dataToSave);
      }

      setIsEditing(false);
      setFormData(initialFormState);
      fetchData();
    } catch (error) {
      console.error("Error saving instructor: ", error);
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setSaveLoading(false);
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

  const getCourseCount = (instructorId: string) => {
      return courses.filter(c => c.instructorId === instructorId).length;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <Link to="/admin/dashboard" className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition text-slate-500">
                    <ArrowRight size={20} />
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">إدارة المدربين</h1>
            </div>
          <button 
            onClick={() => { setFormData(initialFormState); setIsEditing(true); setImageFile(null); }}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition"
          >
            <Plus size={20} />
            إضافة مدرب
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" size={40} /></div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">الصورة</th>
                    <th className="p-4">الاسم</th>
                    <th className="p-4">المسمى الوظيفي</th>
                    <th className="p-4">عدد الدورات</th>
                    <th className="p-4">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {instructors.map((instructor) => (
                    <tr key={instructor.id} className="hover:bg-slate-50 transition">
                      <td className="p-4">
                        <img src={instructor.image} alt={instructor.name} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                      </td>
                      <td className="p-4 font-bold text-slate-800">{instructor.name}</td>
                      <td className="p-4 text-slate-600">
                          <div className="flex flex-wrap gap-1">
                              {instructor.roles.slice(0, 2).map((r, i) => (
                                  <span key={i} className="text-xs bg-slate-100 px-2 py-1 rounded">{r}</span>
                              ))}
                              {instructor.roles.length > 2 && <span className="text-xs text-slate-400">+{instructor.roles.length - 2}</span>}
                          </div>
                      </td>
                      <td className="p-4 text-slate-600 font-bold">{getCourseCount(instructor.id)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEdit(instructor)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Pencil size={18} /></button>
                          <button onClick={() => handleDelete(instructor.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {instructors.length === 0 && (
                      <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-500">لا يوجد مدربين حالياً.</td>
                      </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal / Form Overlay */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-slate-800">{formData.id ? 'تعديل بيانات مدرب' : 'إضافة مدرب جديد'}</h2>
                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-8">
                {/* 1. Name & Image */}
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex flex-col items-center gap-4 w-full md:w-auto">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-md group">
                            {imageFile ? (
                                <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                            ) : formData.image ? (
                                <img src={formData.image} alt="Current" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400"><Upload size={32}/></div>
                            )}
                        </div>
                        <label className="cursor-pointer bg-primary-50 text-primary-700 px-4 py-2 rounded-lg font-bold hover:bg-primary-100 transition text-sm flex items-center gap-2">
                            <Upload size={16} />
                            رفع صورة
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && setImageFile(e.target.files[0])} />
                        </label>
                    </div>

                    <div className="flex-1 w-full space-y-4">
                        <div>
                            <label className="label">اسم المدرب</label>
                            <input 
                                type="text" 
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="input"
                                placeholder="د. محمد علي"
                            />
                        </div>
                        <div>
                            <label className="label">رابط الصورة (اختياري)</label>
                            <div className="relative">
                                <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    value={formData.image}
                                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                                    className="input pr-10"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Roles */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="label mb-0">المسمى الوظيفي (يمكن إضافة أكثر من واحد)</label>
                        <button type="button" onClick={() => addArrayItem('roles')} className="text-primary-600 hover:bg-primary-50 p-1 rounded"><Plus size={18}/></button>
                    </div>
                    <div className="space-y-2">
                        {formData.roles.map((role, i) => (
                            <div key={i} className="flex gap-2">
                                <input 
                                    type="text" 
                                    className="input py-2" 
                                    value={role} 
                                    onChange={e => handleArrayChange(i, e.target.value, 'roles')}
                                    placeholder="مثال: مطور برمجيات أول"
                                />
                                {formData.roles.length > 1 && (
                                    <button type="button" onClick={() => removeArrayItem(i, 'roles')} className="text-red-500 hover:bg-red-50 p-2 rounded"><Minus size={18}/></button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Bios */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="label">نبذة سريعة (للبطاقة)</label>
                        <textarea 
                            rows={3}
                            value={formData.shortBio}
                            onChange={(e) => setFormData({...formData, shortBio: e.target.value})}
                            className="input resize-none"
                            placeholder="نبذة مختصرة تظهر في قائمة المدربين..."
                        ></textarea>
                    </div>
                    <div>
                        <label className="label">نبذة تفصيلية (للملف الشخصي)</label>
                        <textarea 
                            rows={3}
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            className="input resize-none"
                            placeholder="التفاصيل الكاملة، الخبرات، والمهارات..."
                        ></textarea>
                    </div>
                </div>

                {/* 6. Certifications */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="label mb-0">الشهادات والاعتمادات</label>
                        <button type="button" onClick={() => addArrayItem('certifications')} className="text-primary-600 hover:bg-primary-50 p-1 rounded"><Plus size={18}/></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {formData.certifications.map((cert, i) => (
                            <div key={i} className="flex gap-2">
                                <input 
                                    type="text" 
                                    className="input py-2" 
                                    value={cert} 
                                    onChange={e => handleArrayChange(i, e.target.value, 'certifications')}
                                    placeholder="مثال: PMP Certified"
                                />
                                <button type="button" onClick={() => removeArrayItem(i, 'certifications')} className="text-red-500 hover:bg-red-50 p-2 rounded"><Minus size={18}/></button>
                            </div>
                        ))}
                        {formData.certifications.length === 0 && (
                            <div className="text-sm text-slate-400 italic p-2 border border-dashed rounded-lg text-center col-span-2">أضف شهادات المدرب هنا</div>
                        )}
                    </div>
                </div>

                {/* 7. Social Links */}
                <div>
                     <div className="flex justify-between items-center mb-2">
                        <label className="label mb-0">روابط التواصل</label>
                        <button type="button" onClick={addSocial} className="text-primary-600 hover:bg-primary-50 p-1 rounded"><Plus size={18}/></button>
                    </div>
                    <div className="space-y-3">
                        {formData.socials.map((social, i) => (
                            <div key={i} className="flex flex-col sm:flex-row gap-2">
                                <select 
                                    value={social.type} 
                                    onChange={e => handleSocialChange(i, 'type', e.target.value)}
                                    className="input sm:w-1/3"
                                >
                                    <option value="facebook">فيسبوك</option>
                                    <option value="instagram">انستغرام</option>
                                    <option value="linkedin">لينكد إن</option>
                                    <option value="twitter">تويتر (X)</option>
                                    <option value="telegram">تيليجرام</option>
                                    <option value="youtube">يوتيوب</option>
                                    <option value="website">موقع شخصي</option>
                                    <option value="email">بريد إلكتروني</option>
                                    <option value="phone">رقم هاتف</option>
                                </select>
                                <div className="flex-1 relative">
                                    <input 
                                        type="text" 
                                        className="input pr-2" 
                                        value={social.value}
                                        onChange={e => handleSocialChange(i, 'value', e.target.value)}
                                        placeholder={social.type === 'phone' ? '07700000000' : 'https://...'}
                                    />
                                </div>
                                <button type="button" onClick={() => removeSocial(i)} className="text-red-500 hover:bg-red-50 p-2 rounded self-end sm:self-auto"><Trash2 size={18}/></button>
                            </div>
                        ))}
                        {formData.socials.length === 0 && (
                            <div className="text-sm text-slate-400 italic p-2 border border-dashed rounded-lg text-center">أضف روابط التواصل الاجتماعي</div>
                        )}
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white pb-2">
                    <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition">إلغاء</button>
                    <button 
                        type="submit" 
                        disabled={saveLoading}
                        className="px-6 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-bold transition flex items-center gap-2 disabled:opacity-70"
                    >
                        {saveLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        حفظ البيانات
                    </button>
                </div>
              </form>
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

export default InstructorsAdmin;