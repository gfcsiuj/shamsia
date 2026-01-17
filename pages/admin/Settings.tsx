import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { SiteSettings } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Save, Loader2, LayoutTemplate, Palette, Phone, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Settings: React.FC = () => {
  const { settings: initialSettings, loading: initialLoading } = useTheme();
  const [formData, setFormData] = useState<SiteSettings>(initialSettings);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!initialLoading) {
      setFormData(initialSettings);
    }
  }, [initialSettings, initialLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setMessage('');

    try {
      await db.collection('site_settings').doc('general').set(formData);
      setMessage('تم حفظ الإعدادات بنجاح!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage('حدث خطأ أثناء الحفظ.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" size={40} /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">إعدادات الموقع</h1>
          <Link to="/" target="_blank" className="bg-white text-primary-600 border border-primary-200 px-4 py-2 rounded-lg font-bold hover:bg-primary-50 transition flex items-center gap-2">
            <ExternalLink size={18} />
             معاينة الموقع
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* General Information */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
             <div className="flex items-center gap-3 mb-6 border-b pb-4">
                <LayoutTemplate className="text-secondary-500" />
                <h2 className="text-xl font-bold text-slate-800">النصوص والعناوين</h2>
             </div>
             
             <div className="space-y-4">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">عنوان الهيرو (Hero Title)</label>
                   <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary-500 outline-none transition"
                      value={formData.heroTitle}
                      onChange={e => setFormData({...formData, heroTitle: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">وصف الهيرو (Hero Subtitle)</label>
                   <textarea 
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary-500 outline-none transition"
                      value={formData.heroSubtitle}
                      onChange={e => setFormData({...formData, heroSubtitle: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">رابط الشعار (Logo URL)</label>
                   <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary-500 outline-none transition"
                      value={formData.logoUrl}
                      onChange={e => setFormData({...formData, logoUrl: e.target.value})}
                   />
                   {formData.logoUrl && <img src={formData.logoUrl} alt="Logo Preview" className="mt-4 h-12 object-contain bg-slate-100 p-2 rounded" />}
                </div>
             </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
             <div className="flex items-center gap-3 mb-6 border-b pb-4">
                <Phone className="text-secondary-500" />
                <h2 className="text-xl font-bold text-slate-800">معلومات الاتصال</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">رقم الهاتف</label>
                   <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary-500 outline-none transition"
                      value={formData.contactPhone}
                      onChange={e => setFormData({...formData, contactPhone: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
                   <input 
                      type="email" 
                      className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary-500 outline-none transition"
                      value={formData.contactEmail}
                      onChange={e => setFormData({...formData, contactEmail: e.target.value})}
                   />
                </div>
             </div>
          </div>

          {/* Colors */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
             <div className="flex items-center gap-3 mb-6 border-b pb-4">
                <Palette className="text-secondary-500" />
                <h2 className="text-xl font-bold text-slate-800">ألوان الموقع</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">اللون الأساسي (Primary)</label>
                   <div className="flex items-center gap-4">
                      <input 
                         type="color" 
                         className="w-16 h-12 p-1 rounded cursor-pointer border border-slate-200"
                         value={formData.primaryColor}
                         onChange={e => setFormData({...formData, primaryColor: e.target.value})}
                      />
                      <span className="font-mono text-slate-500">{formData.primaryColor}</span>
                   </div>
                   <p className="text-xs text-slate-400 mt-2">يستخدم للأزرار، الروابط، والعناصر الرئيسية.</p>
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">اللون الثانوي (Secondary)</label>
                   <div className="flex items-center gap-4">
                      <input 
                         type="color" 
                         className="w-16 h-12 p-1 rounded cursor-pointer border border-slate-200"
                         value={formData.secondaryColor}
                         onChange={e => setFormData({...formData, secondaryColor: e.target.value})}
                      />
                      <span className="font-mono text-slate-500">{formData.secondaryColor}</span>
                   </div>
                   <p className="text-xs text-slate-400 mt-2">يستخدم للتمييز، الأيقونات، والعناصر الجمالية.</p>
                </div>
             </div>
          </div>

          {message && (
             <div className={`p-4 rounded-lg text-center font-bold ${message.includes('خطأ') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message}
             </div>
          )}

          <div className="flex justify-end">
             <button 
                type="submit" 
                disabled={saveLoading}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary-200 transition flex items-center gap-2 disabled:opacity-70"
             >
                {saveLoading ? <Loader2 className="animate-spin" /> : <Save />}
                حفظ التغييرات
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;