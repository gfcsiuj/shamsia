import React, { useState, useEffect } from 'react';
import { db, storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Instructor, Course } from '../../types';
import { Plus, Pencil, Trash2, X, Upload, Loader2, Save, ArrowRight, Minus, Link as LinkIcon, Briefcase, User, Award, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import './InstructorsAdmin.css';

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
        db.collection('instructors').get(),
        db.collection('courses').get()
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

      const coursesData = coursesSnap.docs.map(doc => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          ...data,
          instructorIds: data.instructorIds || (data.instructorId ? [data.instructorId] : [])
        } as Course
      });

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
        await db.collection('instructors').doc(id).delete();
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
        await db.collection('instructors').doc(formData.id).update(dataToSave);
      } else {
        await db.collection('instructors').add(dataToSave);
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
    // Adjusted for new instructorIds array in courses
    return courses.filter(c => c.instructorIds?.includes(instructorId)).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-orange-50/20 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header with Gradient */}
        <div className="relative bg-gradient-to-r from-green-600 to-green-700 p-10 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden mb-8">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDRtLTQgNGg0bS00IDRoNE00MCAxNGg0bS00IDRoNG0tNCA0aDQiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <Link to="/admin/dashboard" className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition text-white">
                <ArrowRight size={20} />
              </Link>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-2 italic tracking-tight">👥 إدارة المدربين</h1>
                <p className="text-green-100 text-base md:text-lg font-medium">إدارة ملفات المدربين والبيانات الخاصة بهم</p>
              </div>
            </div>
            <button
              onClick={() => { setFormData(initialFormState); setIsEditing(true); setImageFile(null); }}
              className="bg-white text-primary-700 px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              إضافة مدرب
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor) => (
              <div key={instructor.id} className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-8 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-3 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
                <div className="flex justify-between items-start mb-6">
                  <img src={instructor.image} alt={instructor.name} className="w-20 h-20 rounded-[2rem] object-cover border-4 border-slate-100 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={() => handleEdit(instructor)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="تعديل"><Pencil size={18} /></button>
                    <button onClick={() => handleDelete(instructor.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="حذف"><Trash2 size={18} /></button>
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-2 italic tracking-tight">{instructor.name}</h3>
                <p className="text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-xl inline-block mb-4 font-bold">
                  {instructor.roles[0] || 'غير محدد'}
                </p>

                <div className="flex items-center gap-6 text-sm text-slate-500 border-t border-slate-100 pt-4 mt-4">
                  <div className="flex items-center gap-1">
                    <Briefcase size={14} />
                    <span>{getCourseCount(instructor.id)} دورات</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award size={14} />
                    <span>{instructor.certifications?.length || 0} شهادات</span>
                  </div>
                </div>
              </div>
            ))}

            {instructors.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                <User size={48} className="mx-auto mb-4 opacity-50" />
                <p>لا يوجد مدربين حالياً. ابدأ بإضافة أول مدرب.</p>
              </div>
            )}
          </div>
        )}

        {/* High End Floating Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 ia-modal-overlay">
            <div className="ia-modal-content w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col overflow-hidden">

              {/* Header */}
              <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.id ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                    {formData.id ? <Pencil size={20} /> : <Plus size={24} />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      {formData.id ? 'تعديل بيانات مدرب' : 'إضافة مدرب جديد'}
                    </h2>
                    <p className="text-xs text-slate-500">قم بإدارة الملف الشخصي والمهني للمدرب</p>
                  </div>
                </div>
                <button onClick={() => setIsEditing(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition"><X size={24} /></button>
              </div>

              <div className="overflow-y-auto p-8 bg-slate-50/50 flex-1">
                <form id="instructorForm" onSubmit={handleSubmit} className="space-y-8">
                  {/* Section 1: Basic Info */}
                  <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 border-b border-slate-50 pb-2 flex items-center gap-2">
                      <User size={18} /> المعلومات الشخصية
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
                              className="w-full pr-7 pl-2 py-2 text-xs rounded-lg border border-slate-200 focus:border-primary-500 outline-none text-center bg-slate-50 focus:bg-white transition"
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 space-y-5">
                        <div>
                          <label className="ia-label">الاسم الكامل</label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="ia-input text-lg font-semibold"
                            placeholder="د. محمد علي"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-5">
                          <div>
                            <label className="ia-label">نبذة مختصرة (للبطاقة التعريفية)</label>
                            <textarea
                              rows={2}
                              value={formData.shortBio}
                              onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
                              className="ia-input resize-none"
                              placeholder="نبذة مختصرة جداً تظهر في بطاقة المدرب..."
                            ></textarea>
                          </div>
                          <div>
                            <label className="ia-label">السيرة الذاتية المفصلة</label>
                            <textarea
                              rows={5}
                              value={formData.bio}
                              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                              className="ia-input resize-none leading-relaxed"
                              placeholder="التفاصيل الكاملة، الخبرات، الشهادات، والمهارات..."
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Roles & Certs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full">
                      <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-2">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                          <Briefcase size={18} /> المسميات الوظيفية
                        </h3>
                        <button type="button" onClick={() => addArrayItem('roles')} className="text-primary-600 bg-primary-50 hover:bg-primary-100 p-2 rounded-lg transition"><Plus size={16} /></button>
                      </div>
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {formData.roles.map((role, i) => (
                          <div key={i} className="flex gap-2">
                            <input
                              type="text"
                              className="ia-input py-2.5 text-sm"
                              value={role}
                              onChange={e => handleArrayChange(i, e.target.value, 'roles')}
                              placeholder="مثال: خبير أمن سيبراني"
                            />
                            <button type="button" onClick={() => removeArrayItem(i, 'roles')} className="text-slate-300 hover:text-red-500 p-2 transition"><Minus size={18} /></button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full">
                      <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-2">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                          <Award size={18} /> الشهادات والاعتمادات
                        </h3>
                        <button type="button" onClick={() => addArrayItem('certifications')} className="text-primary-600 bg-primary-50 hover:bg-primary-100 p-2 rounded-lg transition"><Plus size={16} /></button>
                      </div>
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {formData.certifications.map((cert, i) => (
                          <div key={i} className="flex gap-2">
                            <input
                              type="text"
                              className="ia-input py-2.5 text-sm"
                              value={cert}
                              onChange={e => handleArrayChange(i, e.target.value, 'certifications')}
                              placeholder="مثال: PMP, CISSP"
                            />
                            <button type="button" onClick={() => removeArrayItem(i, 'certifications')} className="text-slate-300 hover:text-red-500 p-2 transition"><Minus size={18} /></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Socials */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-2">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Share2 size={18} /> قنوات التواصل
                      </h3>
                      <button type="button" onClick={addSocial} className="text-primary-600 bg-primary-50 hover:bg-primary-100 p-2 rounded-lg transition"><Plus size={16} /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.socials.map((social, i) => (
                        <div key={i} className="ia-social-row">
                          <select
                            value={social.type}
                            onChange={e => handleSocialChange(i, 'type', e.target.value)}
                            className="ia-social-select"
                          >
                            <option value="facebook">فيسبوك</option>
                            <option value="instagram">انستغرام</option>
                            <option value="linkedin">لينكد إن</option>
                            <option value="twitter">X</option>
                            <option value="telegram">تيليجرام</option>
                            <option value="website">موقع</option>
                            <option value="email">ايميل</option>
                            <option value="phone">هاتف</option>
                          </select>
                          <div className="w-px h-6 bg-slate-200 mx-2"></div>
                          <input
                            type="text"
                            className="ia-social-input"
                            value={social.value}
                            onChange={e => handleSocialChange(i, 'value', e.target.value)}
                            placeholder="اسم المستخدم أو الرابط..."
                          />
                          <button type="button" onClick={() => removeSocial(i)} className="text-slate-300 hover:text-red-500 p-1.5 transition"><X size={16} /></button>
                        </div>
                      ))}
                      {formData.socials.length === 0 && (
                        <div className="col-span-2 text-center py-8 text-slate-400 text-sm italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          أضف طرق تواصل لتمكين الطلاب من متابعة المدرب
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-end gap-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition">إلغاء</button>
                <button
                  type="submit"
                  form="instructorForm"
                  disabled={saveLoading}
                  className="px-10 py-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 font-bold transition flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-primary-200 transform hover:-translate-y-1"
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

export default InstructorsAdmin;