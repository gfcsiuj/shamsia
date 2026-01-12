import React, { useState, useEffect } from 'react';
import { db, storage } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Instructor } from '../../types';
import { Plus, Pencil, Trash2, X, Upload, Loader2, Save, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const InstructorsAdmin: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const initialFormState: Instructor = {
    id: '',
    name: '',
    role: '',
    image: '',
    bio: '',
  };

  const [formData, setFormData] = useState<Instructor>(initialFormState);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'instructors'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Instructor));
      setInstructors(data);
    } catch (error) {
      console.error("Error fetching instructors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (instructor: Instructor) => {
    setFormData(instructor);
    setIsEditing(true);
    setImageFile(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المدرب؟')) {
      try {
        await deleteDoc(doc(db, 'instructors', id));
        fetchInstructors();
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
        role: formData.role,
        bio: formData.bio,
        image: imageUrl || 'https://via.placeholder.com/150',
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
      fetchInstructors();
    } catch (error) {
      console.error("Error saving instructor: ", error);
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setSaveLoading(false);
    }
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
                      <td className="p-4 text-slate-600">{instructor.role}</td>
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
                          <td colSpan={4} className="p-8 text-center text-slate-500">لا يوجد مدربين حالياً.</td>
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
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-slate-800">{formData.id ? 'تعديل بيانات مدرب' : 'إضافة مدرب جديد'}</h2>
                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="flex flex-col items-center mb-6">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-100 mb-4 border-4 border-white shadow-md">
                        {imageFile ? (
                             <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                        ) : formData.image ? (
                            <img src={formData.image} alt="Current" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400"><Upload size={32}/></div>
                        )}
                    </div>
                    <label className="cursor-pointer bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-slate-200 transition text-sm flex items-center gap-2">
                        <Upload size={16} />
                        تغيير الصورة
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && setImageFile(e.target.files[0])} />
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">الاسم الكامل</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">المسمى الوظيفي</label>
                    <input 
                      type="text" 
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">نبذة شخصية (Bio)</label>
                  <textarea 
                    rows={4}
                    required
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary-500 outline-none"
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
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
    </div>
  );
};

export default InstructorsAdmin;