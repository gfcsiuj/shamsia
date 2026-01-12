import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Course } from '../../types';
import { Plus, Edit, Trash2, X, Save, Eye } from 'lucide-react';

const CoursesManager: React.FC = () => {
  const { courses, instructors, addCourse, updateCourse, deleteCourse } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState: Course = {
    id: '',
    title: '',
    category: 'Tech',
    level: 'مبتدئ',
    price: 0,
    image: '',
    instructorId: '',
    duration: '',
    rating: 5,
    studentsCount: 0,
    description: '',
    longDescription: '',
    objectives: [],
    targetAudience: [],
    syllabus: [],
    startDate: '',
    certifications: []
  };

  const [formData, setFormData] = useState<Course>(initialFormState);

  const handleOpenModal = (course?: Course) => {
    if (course) {
      setEditingId(course.id);
      setFormData(course);
    } else {
      setEditingId(null);
      setFormData({ ...initialFormState, id: `course-${Date.now()}` });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCourse(editingId, formData);
    } else {
      addCourse(formData);
    }
    setIsModalOpen(false);
  };

  // Helper to handle array inputs (objectives, etc)
  const handleArrayInput = (value: string, field: keyof Course) => {
    const arr = value.split('\n').filter(item => item.trim() !== '');
    setFormData({ ...formData, [field]: arr });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة الدورات التدريبية</h1>
          <p className="text-slate-500">تحكم كامل في محتوى الدورات والمنهج الدراسي</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition"
        >
          <Plus size={20} />
          <span>إضافة دورة</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-bold">عنوان الدورة</th>
                <th className="px-6 py-4 font-bold">المدرب</th>
                <th className="px-6 py-4 font-bold">السعر</th>
                <th className="px-6 py-4 font-bold">الحالة</th>
                <th className="px-6 py-4 font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map((course) => {
                const instructor = instructors.find(i => i.id === course.instructorId);
                return (
                  <tr key={course.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={course.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <div className="font-bold text-slate-800">{course.title}</div>
                          <div className="text-xs text-slate-500">{course.category} | {course.level}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{instructor?.name || 'غير محدد'}</td>
                    <td className="px-6 py-4 font-bold text-primary-700">{course.price.toLocaleString()} د.ع</td>
                    <td className="px-6 py-4">
                       <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">نشط</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleOpenModal(course)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={18} /></button>
                        <button onClick={() => { if(window.confirm('حذف الدورة؟')) deleteCourse(course.id) }} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Modal - Simplified for brevity but functional */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-800">{editingId ? 'تعديل الدورة' : 'إضافة دورة جديدة'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="label-strong">عنوان الدورة</label>
                    <input type="text" required className="input-std" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                 </div>
                 <div>
                    <label className="label-strong">المدرب</label>
                    <select className="input-std" value={formData.instructorId} onChange={e => setFormData({...formData, instructorId: e.target.value})}>
                      <option value="">اختر مدرب...</option>
                      {instructors.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="label-strong">السعر (د.ع)</label>
                    <input type="number" className="input-std" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                 </div>
                 <div>
                    <label className="label-strong">رابط الصورة</label>
                    <input type="text" className="input-std" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                 </div>
                 <div>
                    <label className="label-strong">التصنيف</label>
                    <select className="input-std" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                       <option value="Tech">Tech</option>
                       <option value="Cyber Security">Cyber Security</option>
                       <option value="Human Development">Human Development</option>
                    </select>
                 </div>
                 <div>
                    <label className="label-strong">المستوى</label>
                    <select className="input-std" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value as any})}>
                       <option value="مبتدئ">مبتدئ</option>
                       <option value="متوسط">متوسط</option>
                       <option value="متقدم">متقدم</option>
                       <option value="دبلوم">دبلوم</option>
                    </select>
                 </div>
               </div>

               <div>
                 <label className="label-strong">وصف مختصر</label>
                 <textarea rows={3} className="input-std" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
               </div>

               <div>
                 <label className="label-strong">وصف تفصيلي (الإعلان الكامل)</label>
                 <textarea rows={8} className="input-std font-mono text-sm" value={formData.longDescription} onChange={e => setFormData({...formData, longDescription: e.target.value})} placeholder="يمكنك وضع النص الكامل للإعلان هنا..."></textarea>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="label-strong">أهداف الدورة (كل هدف في سطر)</label>
                    <textarea rows={5} className="input-std" value={formData.objectives.join('\n')} onChange={e => handleArrayInput(e.target.value, 'objectives')}></textarea>
                 </div>
                 <div>
                    <label className="label-strong">الفئة المستهدفة (كل فئة في سطر)</label>
                    <textarea rows={5} className="input-std" value={formData.targetAudience.join('\n')} onChange={e => handleArrayInput(e.target.value, 'targetAudience')}></textarea>
                 </div>
               </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">إلغاء</button>
                  <button type="submit" className="btn-primary">حفظ الدورة</button>
                </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .label-strong { display: block; font-size: 0.875rem; font-weight: 700; color: #334155; margin-bottom: 0.5rem; }
        .input-std { width: 100%; padding: 0.5rem 1rem; border-radius: 0.5rem; border: 1px solid #cbd5e1; outline: none; transition: all 0.2s; }
        .input-std:focus { border-color: #10b981; box-shadow: 0 0 0 2px #a7f3d0; }
        .btn-primary { background-color: #059669; color: white; padding: 0.5rem 1.5rem; border-radius: 0.5rem; font-weight: bold; }
        .btn-secondary { background-color: #f1f5f9; color: #475569; padding: 0.5rem 1.5rem; border-radius: 0.5rem; font-weight: bold; }
      `}</style>
    </div>
  );
};

export default CoursesManager;
