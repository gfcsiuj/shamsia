import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Save, RefreshCw } from 'lucide-react';

const SiteCustomizer: React.FC = () => {
  const { siteConfig, updateSiteConfig } = useData();
  const [localConfig, setLocalConfig] = useState(siteConfig);

  const handleSave = () => {
    updateSiteConfig(localConfig);
    alert('تم حفظ الإعدادات وتطبيقها على الموقع!');
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
       <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">تخصيص الموقع</h1>
          <p className="text-slate-500">تحكم في ألوان ونصوص الموقع الرئيسية بشكل مباشر</p>
       </div>

       <div className="space-y-8">
          {/* Colors Section */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">ألوان السمة (Theme Colors)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">اللون الأساسي (Primary)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="color" 
                    value={localConfig.primaryColor}
                    onChange={(e) => setLocalConfig({...localConfig, primaryColor: e.target.value})}
                    className="w-16 h-12 rounded cursor-pointer border-0 p-0"
                  />
                  <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded">{localConfig.primaryColor}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">يستخدم للهيدر، الفوتر، والعناوين الرئيسية.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">اللون الثانوي (Secondary)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="color" 
                    value={localConfig.secondaryColor}
                    onChange={(e) => setLocalConfig({...localConfig, secondaryColor: e.target.value})}
                    className="w-16 h-12 rounded cursor-pointer border-0 p-0"
                  />
                  <span className="text-sm font-mono bg-slate-100 px-2 py-1 rounded">{localConfig.secondaryColor}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">يستخدم للأزرار، التمييز، والأيقونات.</p>
              </div>
            </div>
          </section>

          {/* Texts Section */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">نصوص الصفحة الرئيسية</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">العنوان الرئيسي (Hero Title)</label>
                <input 
                  type="text" 
                  value={localConfig.heroTitle} 
                  onChange={(e) => setLocalConfig({...localConfig, heroTitle: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">العنوان الفرعي (Hero Subtitle)</label>
                <textarea 
                  rows={3}
                  value={localConfig.heroSubtitle} 
                  onChange={(e) => setLocalConfig({...localConfig, heroSubtitle: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-primary-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* Contact Section */}
           <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">بيانات التواصل (الفوتر والهيدر)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">رقم الهاتف</label>
                <input 
                  type="text" 
                  value={localConfig.contactPhone} 
                  onChange={(e) => setLocalConfig({...localConfig, contactPhone: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
                <input 
                  type="text" 
                  value={localConfig.contactEmail} 
                  onChange={(e) => setLocalConfig({...localConfig, contactEmail: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-primary-500 outline-none"
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-4">
            <button 
              onClick={handleSave}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg flex items-center gap-3 transform hover:scale-105 transition"
            >
              <Save size={20} />
              حفظ وتطبيق التغييرات
            </button>
          </div>
       </div>
    </div>
  );
};

export default SiteCustomizer;
