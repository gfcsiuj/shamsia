import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Instructor } from '../../types';
import { Plus, Edit, Trash2, X, Save, Image as ImageIcon } from 'lucide-react';

const InstructorsManager: React.FC = () => {
  const { instructors, addInstructor, updateInstructor, deleteInstructor } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState: Instructor = {
    id: '',
    name: '',
    role: '',
    image: '',
    bio: '',
    socials: { twitter: '', linkedin: '', email: '', phone: '' }
  };

  const [formData, setFormData] = useState<Instructor>(initialFormState);

  const handleOpenModal = (instructor?: Instructor) => {
    if (instructor) {
      setEditingId(instructor.id);
      setFormData(instructor);
    } else {
      setEditingId(null);
      setFormData({ ...initialFormState, id: `inst-${Date.now()}` });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateInstructor(editingId, formData);
    } else {
      addInstructor(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المدرب؟')) {
      deleteInstructor(id);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة المدربين</h1>
          <p className="text-slate-500">إضافة وتعديل وحذف بيانات المدربين</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition"
        >
          <Plus size={20} />
          <span>إضافة مدرب</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructors.map((instructor) => (
          <div key={instructor.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col relative group">
            <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button 
                onClick={() => handleOpenModal(instructor)}
                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={() => handleDelete(instructor.id)}
                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={instructor.image} 
                alt={instructor.name} 
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-100"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150'; }}
              />
              <div>
                <h3 className="font-bold text-slate-800">{instructor.name}</h3>
                <p className="text-sm text-slate-500">{instructor.role}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-grow">{instructor.bio}</p>
            
            <div className="pt-4 border-t border-slate-50 text-xs text-slate-400">
              ID: {instructor.id}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-800">{editingId ? 'تعديل مدرب' : 'إضافة مدرب جديد'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">الاسم</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-primary-500 outline-none"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">المسمى الوظيفي</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-primary-500 outline-none"
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">رابط الصورة</label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <ImageIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      required
                      className="w-full pr-10 pl-4 py-2 rounded-lg border border-slate-300 focus:border-primary-500 outline-none"
                      value={formData.image}
                      onChange={e => setFormData({...formData, image: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                  {formData.image && (
                     <img src={formData.image} alt="Preview" className="w-10 h-10 rounded-full object-cover border" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">النبذة التعريفية</label>
                <textarea 
                  rows={4}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-primary-500 outline-none resize-none"
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                ></textarea>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h3 className="font-bold text-slate-800 mb-4">معلومات التواصل</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="رقم الهاتف"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-primary-500 outline-none"
                    value={formData.socials?.phone || ''}
                    onChange={e => setFormData({...formData, socials: {...formData.socials, phone: e.target.value}})}
                  />
                   <input 
                    type="text" 
                    placeholder="البريد الإلكتروني"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-primary-500 outline-none"
                    value={formData.socials?.email || ''}
                    onChange={e => setFormData({...formData, socials: {...formData.socials, email: e.target.value}})}
                  />
                  <input 
                    type="text" 
                    placeholder="LinkedIn URL"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-primary-500 outline-none"
                    value={formData.socials?.linkedin || ''}
                    onChange={e => setFormData({...formData, socials: {...formData.socials, linkedin: e.target.value}})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-bold"
                >
                  إلغاء
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-bold flex items-center gap-2"
                >
                  <Save size={18} />
                  حفظ التغييرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorsManager;
