import React, { useState, useEffect } from 'react';
import { db, storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Resource } from '../../types';
import { Plus, Pencil, Trash2, X, Upload, Loader2, Save, ArrowRight, FileText, PlayCircle, Book, ExternalLink, Link as LinkIcon, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import './LibraryAdmin.css';

const LibraryAdmin: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const initialFormState: Resource = {
    id: '',
    title: '',
    type: 'article',
    category: 'General',
    date: new Date().toISOString().split('T')[0],
    url: '',
    description: '',
  };

  const [formData, setFormData] = useState<Resource>(initialFormState);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const querySnapshot = await db.collection('resources').get();
      const data = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
      } as Resource));
      setResources(data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (resource: Resource) => {
    setFormData(resource);
    setUploadFile(null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المصدر؟')) {
      try {
        await db.collection('resources').doc(id).delete();
        fetchData();
      } catch (error) {
        console.error("Error deleting resource: ", error);
      }
    }
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `library/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      let resourceUrl = formData.url;
      
      // If user uploaded a file and it's a PDF type (or we allow uploads for others)
      if (uploadFile) {
          resourceUrl = await handleFileUpload(uploadFile);
      }

      const dataToSave = {
        title: formData.title,
        type: formData.type,
        category: formData.category,
        date: formData.date,
        url: resourceUrl,
        description: formData.description,
      };

      if (formData.id) {
        await db.collection('resources').doc(formData.id).update(dataToSave);
      } else {
        await db.collection('resources').add(dataToSave);
      }

      setIsEditing(false);
      setFormData(initialFormState);
      fetchData();
    } catch (error) {
      console.error("Error saving resource: ", error);
      alert('حدث خطأ أثناء حفظ المصدر');
    } finally {
      setSaveLoading(false);
    }
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'pdf': return <Book size={20} />;
          case 'video': return <PlayCircle size={20} />;
          case 'article': return <FileText size={20} />;
          default: return <FileText size={20} />;
      }
  };

  const getIconClass = (type: string) => {
      switch(type) {
          case 'pdf': return 'la-icon-pdf';
          case 'video': return 'la-icon-video';
          case 'article': return 'la-icon-article';
          default: return 'la-icon-article';
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
                <Link to="/admin/dashboard" className="p-2 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition text-slate-500">
                    <ArrowRight size={20} />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">إدارة المكتبة</h1>
                  <p className="text-sm text-slate-500">إضافة وتعديل المصادر التعليمية والمقالات</p>
                </div>
            </div>
            <button 
                onClick={() => { setFormData(initialFormState); setIsEditing(true); setUploadFile(null); }}
                className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition shadow-lg shadow-primary-200"
            >
                <Plus size={20} />
                إضافة مصدر
            </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary-600" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
                <div key={resource.id} className="la-resource-card group p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`la-icon-wrapper ${getIconClass(resource.type)}`}>
                            {getIcon(resource.type)}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(resource)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"><Pencil size={16} /></button>
                            <button onClick={() => handleDelete(resource.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={16} /></button>
                        </div>
                    </div>
                    
                    <span className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">{resource.category}</span>
                    <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">{resource.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-grow">{resource.description}</p>
                    
                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                        <span className="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded">{resource.date}</span>
                        <a href={resource.url} target="_blank" rel="noreferrer" className="text-primary-600 hover:text-primary-700 text-sm font-bold flex items-center gap-1">
                            عرض <ExternalLink size={14}/>
                        </a>
                    </div>
                </div>
            ))}
            
            {resources.length === 0 && (
                <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                    <Book size={48} className="mx-auto mb-4 opacity-50" />
                    <p>المكتبة فارغة حالياً. ابدأ بإضافة مصادر مفيدة.</p>
                </div>
            )}
          </div>
        )}

        {/* High End Modal */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 la-modal-overlay">
            <div className="la-modal-content w-full max-w-3xl max-h-[90vh] rounded-2xl flex flex-col overflow-hidden">
              
              {/* Header */}
              <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.id ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                        {formData.id ? <Pencil size={20} /> : <Plus size={24} />}
                    </div>
                    <div>
                         <h2 className="text-xl font-bold text-slate-800">
                            {formData.id ? 'تعديل المصدر' : 'إضافة مصدر جديد'}
                        </h2>
                        <p className="text-xs text-slate-500">أدخل تفاصيل الكتاب، المقال، أو الفيديو</p>
                    </div>
                </div>
                <button onClick={() => setIsEditing(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition"><X size={24}/></button>
              </div>
              
              <div className="overflow-y-auto p-8 bg-slate-50/50 flex-1 la-scrollable">
                  <form id="libraryForm" onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Type Selection */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <label className="la-label mb-4">نوع المصدر</label>
                        <div className="grid grid-cols-3 gap-4">
                            <div 
                                onClick={() => setFormData({...formData, type: 'article'})}
                                className={`la-type-card ${formData.type === 'article' ? 'active' : ''}`}
                            >
                                <FileText size={24} />
                                <span className="font-bold text-sm">مقال</span>
                            </div>
                            <div 
                                onClick={() => setFormData({...formData, type: 'pdf'})}
                                className={`la-type-card ${formData.type === 'pdf' ? 'active' : ''}`}
                            >
                                <Book size={24} />
                                <span className="font-bold text-sm">كتاب (PDF)</span>
                            </div>
                            <div 
                                onClick={() => setFormData({...formData, type: 'video'})}
                                className={`la-type-card ${formData.type === 'video' ? 'active' : ''}`}
                            >
                                <PlayCircle size={24} />
                                <span className="font-bold text-sm">فيديو</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Main Info */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 h-full">
                            <div>
                                <label className="la-label">عنوان المصدر</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="la-input font-bold"
                                    placeholder="مثال: مقدمة في الذكاء الاصطناعي"
                                />
                            </div>
                            <div>
                                <label className="la-label">التصنيف</label>
                                <select 
                                    className="la-input"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                >
                                    <option value="General">عام</option>
                                    <option value="Tech">التقنية والبرمجة</option>
                                    <option value="Cyber Security">الأمن السيبراني</option>
                                    <option value="Human Development">التنمية البشرية</option>
                                    <option value="Admin Skills">المهارات الإدارية</option>
                                </select>
                            </div>
                            <div>
                                <label className="la-label">تاريخ النشر</label>
                                <div className="relative">
                                    <input 
                                        type="date" 
                                        className="la-input pl-10"
                                        value={formData.date}
                                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                                    />
                                    <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                                </div>
                            </div>
                        </div>

                        {/* File/Link & Description */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 h-full">
                            <div>
                                <label className="la-label">
                                    {formData.type === 'pdf' ? 'ملف الكتاب (أو رابط)' : formData.type === 'video' ? 'رابط الفيديو (YouTube/Vimeo)' : 'رابط المقال'}
                                </label>
                                
                                <div className="flex flex-col gap-3">
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            className="la-input pl-10 text-sm"
                                            value={formData.url}
                                            onChange={(e) => setFormData({...formData, url: e.target.value})}
                                            placeholder="https://..."
                                            disabled={!!uploadFile}
                                        />
                                        <LinkIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                                    </div>
                                    
                                    {formData.type === 'pdf' && (
                                        <div className="text-center">
                                            <span className="text-xs text-slate-400 mb-2 block">- أو -</span>
                                            <label className="cursor-pointer bg-slate-50 border-2 border-dashed border-slate-200 hover:border-primary-400 hover:bg-primary-50 rounded-xl p-4 flex flex-col items-center justify-center transition group">
                                                <Upload size={24} className="text-slate-400 group-hover:text-primary-500 mb-2"/>
                                                <span className="text-xs font-bold text-slate-500 group-hover:text-primary-700">
                                                    {uploadFile ? uploadFile.name : 'اضغط لرفع ملف PDF'}
                                                </span>
                                                <input type="file" accept="application/pdf" className="hidden" onChange={(e) => e.target.files && setUploadFile(e.target.files[0])} />
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="la-label">وصف مختصر</label>
                                <textarea 
                                    className="la-input" 
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="نبذة عن المحتوى..."
                                ></textarea>
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
                        form="libraryForm"
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

export default LibraryAdmin;