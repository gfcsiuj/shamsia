import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { SiteSettings } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Save, Loader2, LayoutTemplate, Palette, Phone, ExternalLink, Globe, Monitor, Type, Share2, MapPin, Power, MessageSquare, Sliders, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Settings: React.FC = () => {
  const { settings: initialSettings, loading: initialLoading } = useTheme();
  const [formData, setFormData] = useState<SiteSettings>(initialSettings);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'visual' | 'contact' | 'system'>('general');

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

  const tabs = [
    { id: 'general', label: 'عام', icon: LayoutTemplate },
    { id: 'visual', label: 'تخصيص بصري', icon: Palette },
    { id: 'contact', label: 'التواصل', icon: Phone },
    { id: 'system', label: 'النظام والصيانة', icon: Power },
  ];

  if (initialLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" size={40} /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">إعدادات المنصة</h1>
            <p className="text-slate-500 text-sm mt-1">تحكم كامل في الهوية، المظهر، وخصائص النظام</p>
          </div>
          <Link to="/" target="_blank" className="bg-white text-primary-600 border border-primary-200 px-5 py-2.5 rounded-xl font-bold hover:bg-primary-50 transition flex items-center gap-2 shadow-sm w-fit">
            <ExternalLink size={18} />
             معاينة الموقع
          </Link>
        </div>

        {/* Tabs Navigation */}
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-100 p-1.5 mb-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm whitespace-nowrap transition-all duration-200 flex-1 justify-center ${
                  activeTab === tab.id 
                    ? 'bg-primary-50 text-primary-700 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          
          {/* ================= General Tab ================= */}
          {activeTab === 'general' && (
            <div className="grid gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
                 <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Globe size={20} /></div>
                    <h2 className="text-lg font-bold text-slate-800">بيانات الموقع الرئيسية</h2>
                 </div>
                 
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                       <label className="block text-sm font-bold text-slate-700 mb-2">اسم الموقع (Site Name)</label>
                       <input 
                          type="text" 
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary-500 outline-none transition"
                          value={formData.siteName || ''}
                          onChange={e => setFormData({...formData, siteName: e.target.value})}
                          placeholder="شمسية"
                       />
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-sm font-bold text-slate-700 mb-2">وصف الموقع (Meta Description)</label>
                       <textarea 
                          rows={2}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary-500 outline-none transition resize-none"
                          value={formData.siteDescription || ''}
                          onChange={e => setFormData({...formData, siteDescription: e.target.value})}
                          placeholder="منصة تعليمية رائدة..."
                       />
                       <p className="text-xs text-slate-400 mt-2">يظهر هذا الوصف في نتائج محركات البحث.</p>
                    </div>
                 </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
                 <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Monitor size={20} /></div>
                    <h2 className="text-lg font-bold text-slate-800">الشعار (Logo)</h2>
                 </div>
                 
                 <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-1 w-full">
                       <label className="block text-sm font-bold text-slate-700 mb-2">رابط الشعار</label>
                       <input 
                          type="text" 
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary-500 outline-none transition text-sm ltr text-left"
                          value={formData.logoUrl}
                          onChange={e => setFormData({...formData, logoUrl: e.target.value})}
                          placeholder="https://example.com/logo.png"
                       />
                       <p className="text-xs text-slate-400 mt-2">يفضل استخدام صورة بخلفية شفافة (PNG).</p>
                    </div>
                    <div className="w-full md:w-40 h-40 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center p-4">
                        {formData.logoUrl ? (
                            <img src={formData.logoUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                        ) : (
                            <span className="text-xs text-slate-400 font-bold">لا يوجد شعار</span>
                        )}
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* ================= Visual Customization Tab ================= */}
          {activeTab === 'visual' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Col: Colors */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
                 <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Palette size={20} /></div>
                    <h2 className="text-lg font-bold text-slate-800">الألوان الرئيسية</h2>
                 </div>
                 
                 <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">اللون الأساسي (Primary)</label>
                        <div className="flex gap-3">
                            <input type="color" className="h-10 w-14 p-1 rounded cursor-pointer border" value={formData.primaryColor} onChange={e => setFormData({...formData, primaryColor: e.target.value})} />
                            <input type="text" className="flex-1 px-3 py-2 bg-slate-50 border rounded-lg text-sm font-mono uppercase" value={formData.primaryColor} onChange={e => setFormData({...formData, primaryColor: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">اللون الثانوي (Accent)</label>
                        <div className="flex gap-3">
                            <input type="color" className="h-10 w-14 p-1 rounded cursor-pointer border" value={formData.secondaryColor} onChange={e => setFormData({...formData, secondaryColor: e.target.value})} />
                            <input type="text" className="flex-1 px-3 py-2 bg-slate-50 border rounded-lg text-sm font-mono uppercase" value={formData.secondaryColor} onChange={e => setFormData({...formData, secondaryColor: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">خلفية التذييل (Footer)</label>
                        <div className="flex gap-3">
                            <input type="color" className="h-10 w-14 p-1 rounded cursor-pointer border" value={formData.footerBgColor || '#064e3b'} onChange={e => setFormData({...formData, footerBgColor: e.target.value})} />
                            <input type="text" className="flex-1 px-3 py-2 bg-slate-50 border rounded-lg text-sm font-mono uppercase" value={formData.footerBgColor || ''} onChange={e => setFormData({...formData, footerBgColor: e.target.value})} />
                        </div>
                    </div>
                 </div>
              </div>

              {/* Right Col: Typography & Hero Config */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-6">
                 <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Sliders size={20} /></div>
                    <h2 className="text-lg font-bold text-slate-800">تخصيص الواجهة والنصوص</h2>
                 </div>

                 <div className="space-y-6">
                    {/* Hero Title Settings */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-3">عنوان الهيرو (Hero Title)</h3>
                        <div className="space-y-3">
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm mb-2"
                                value={formData.heroTitle}
                                onChange={e => setFormData({...formData, heroTitle: e.target.value})}
                                placeholder="النص الرئيسي..."
                            />
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-xs text-slate-500 block mb-1">الحجم (px)</label>
                                    <input type="number" className="w-full px-2 py-1 text-sm border rounded" value={formData.heroTitleSize || 48} onChange={e => setFormData({...formData, heroTitleSize: Number(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 block mb-1">اللون</label>
                                    <input type="color" className="h-8 w-12 border rounded cursor-pointer" value={formData.heroTitleColor || '#ffffff'} onChange={e => setFormData({...formData, heroTitleColor: e.target.value})} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Subtitle Settings */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-3">وصف الهيرو (Subtitle)</h3>
                        <div className="space-y-3">
                            <textarea 
                                rows={2}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm mb-2"
                                value={formData.heroSubtitle}
                                onChange={e => setFormData({...formData, heroSubtitle: e.target.value})}
                                placeholder="الوصف الثانوي..."
                            />
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-xs text-slate-500 block mb-1">الحجم (px)</label>
                                    <input type="number" className="w-full px-2 py-1 text-sm border rounded" value={formData.heroSubtitleSize || 18} onChange={e => setFormData({...formData, heroSubtitleSize: Number(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 block mb-1">اللون</label>
                                    <input type="color" className="h-8 w-12 border rounded cursor-pointer" value={formData.heroSubtitleColor || '#f1f5f9'} onChange={e => setFormData({...formData, heroSubtitleColor: e.target.value})} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Text */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">نص حقوق الملكية (Footer)</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-primary-500 outline-none transition text-sm"
                            value={formData.footerText || ''}
                            onChange={e => setFormData({...formData, footerText: e.target.value})}
                        />
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* ================= Contact Tab ================= */}
          {activeTab === 'contact' && (
            <div className="grid gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
                 <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Phone size={20} /></div>
                    <h2 className="text-lg font-bold text-slate-800">معلومات الاتصال المباشر</h2>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">رقم الهاتف</label>
                       <input 
                          type="text" 
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary-500 outline-none transition"
                          value={formData.contactPhone}
                          onChange={e => setFormData({...formData, contactPhone: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
                       <input 
                          type="email" 
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary-500 outline-none transition"
                          value={formData.contactEmail}
                          onChange={e => setFormData({...formData, contactEmail: e.target.value})}
                       />
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-sm font-bold text-slate-700 mb-2">العنوان الفعلي</label>
                       <div className="relative">
                           <input 
                              type="text" 
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary-500 outline-none transition pl-10"
                              value={formData.contactAddress || ''}
                              onChange={e => setFormData({...formData, contactAddress: e.target.value})}
                              placeholder="العراق، بغداد..."
                           />
                           <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
                 <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Share2 size={20} /></div>
                    <h2 className="text-lg font-bold text-slate-800">شبكات التواصل الاجتماعي</h2>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { label: 'Facebook', key: 'facebookUrl', placeholder: 'رابط صفحة الفيسبوك' },
                        { label: 'Instagram', key: 'instagramUrl', placeholder: 'رابط حساب الانستغرام' },
                        { label: 'LinkedIn', key: 'linkedinUrl', placeholder: 'رابط حساب لينكد إن' },
                        { label: 'Twitter (X)', key: 'twitterUrl', placeholder: 'رابط حساب تويتر' },
                        { label: 'YouTube', key: 'youtubeUrl', placeholder: 'رابط قناة اليوتيوب' },
                    ].map((social) => (
                        <div key={social.key}>
                            <label className="text-xs font-bold text-slate-500 mb-1 block">{social.label}</label>
                            <input 
                                type="text"
                                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary-500 outline-none transition text-sm ltr text-left"
                                value={(formData as any)[social.key] || ''}
                                onChange={e => setFormData({...formData, [social.key]: e.target.value})}
                                placeholder={social.placeholder}
                            />
                        </div>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {/* ================= System Tab ================= */}
          {activeTab === 'system' && (
            <div className="grid gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
                 <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg"><Power size={20} /></div>
                    <h2 className="text-lg font-bold text-slate-800">حالة النظام والصيانة</h2>
                 </div>
                 
                 <div className="space-y-6">
                    {/* Maintenance Mode */}
                    <div className={`flex items-start justify-between p-5 rounded-xl border-2 transition-all duration-300 ${formData.maintenanceMode ? 'bg-red-50 border-red-200' : 'bg-white border-slate-100'}`}>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className={`font-bold text-lg ${formData.maintenanceMode ? 'text-red-700' : 'text-slate-800'}`}>وضع الصيانة</h3>
                                {formData.maintenanceMode && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><AlertTriangle size={10}/> مفعل</span>}
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed mb-4">
                                عند تفعيل هذا الوضع، سيتم إغلاق الموقع أمام جميع الزوار (باستثناء المسؤولين). سيظهر لهم صفحة الصيانة فقط.
                            </p>
                            
                            <label className="block text-sm font-bold text-slate-700 mb-2">رسالة الصيانة</label>
                            <textarea 
                                rows={2}
                                className="w-full px-4 py-2 rounded-lg bg-white border border-slate-300 focus:border-primary-500 outline-none transition text-sm"
                                value={formData.maintenanceMessage || ''}
                                onChange={e => setFormData({...formData, maintenanceMessage: e.target.value})}
                                disabled={!formData.maintenanceMode}
                                placeholder="نحن نعمل حالياً على تحسين الموقع..."
                            />
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer mr-6 mt-2">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={formData.maintenanceMode || false}
                                onChange={e => setFormData({...formData, maintenanceMode: e.target.checked})}
                            />
                            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500"></div>
                        </label>
                    </div>

                    {/* Registration Toggle */}
                    <div className="flex items-center justify-between p-5 bg-white rounded-xl border border-slate-200">
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg mb-1">التسجيل الجديد</h3>
                            <p className="text-sm text-slate-500">السماح للطلاب بإنشاء حسابات جديدة أو التسجيل في الدورات.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={formData.enableRegistration !== false} // Default true
                                onChange={e => setFormData({...formData, enableRegistration: e.target.checked})}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {message && (
             <div className={`p-4 rounded-xl text-center font-bold animate-pop-in ${message.includes('خطأ') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message}
             </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-200 mt-8">
             <button 
                type="submit" 
                disabled={saveLoading}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary-200 transition flex items-center gap-2 disabled:opacity-70 transform hover:-translate-y-1"
             >
                {saveLoading ? <Loader2 className="animate-spin" /> : <Save />}
                حفظ كافة التغييرات
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;