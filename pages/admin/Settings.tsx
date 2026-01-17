import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { SiteSettings } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Save, Loader2, LayoutTemplate, Palette, Phone, ExternalLink, Globe, Monitor, Type, Share2, MapPin, Power, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Settings: React.FC = () => {
  const { settings: initialSettings, loading: initialLoading } = useTheme();
  const [formData, setFormData] = useState<SiteSettings>(initialSettings);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'contact' | 'advanced'>('general');

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
    { id: 'appearance', label: 'المظهر', icon: Palette },
    { id: 'contact', label: 'التواصل', icon: Phone },
    { id: 'advanced', label: 'متقدم', icon: Monitor },
  ];

  if (initialLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" size={40} /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">تخصيص الموقع</h1>
            <p className="text-slate-500 text-sm mt-1">تحكم في هوية ومظهر ومعلومات المنصة بالكامل</p>
          </div>
          <Link to="/" target="_blank" className="bg-white text-primary-600 border border-primary-200 px-5 py-2.5 rounded-xl font-bold hover:bg-primary-50 transition flex items-center gap-2 shadow-sm w-fit">
            <ExternalLink size={18} />
             معاينة حية
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
          
          {/* Tab Content: General */}
          {activeTab === 'general' && (
            <div className="grid gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
                 <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Globe size={20} /></div>
                    <h2 className="text-lg font-bold text-slate-800">المعلومات الأساسية</h2>
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
                       <label className="block text-sm font-bold text-slate-700 mb-2">وصف الموقع (لتحسين محركات البحث)</label>
                       <textarea 
                          rows={2}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary-500 outline-none transition resize-none"
                          value={formData.siteDescription || ''}
                          onChange={e => setFormData({...formData, siteDescription: e.target.value})}
                          placeholder="منصة تعليمية رائدة..."
                       />
                    </div>
                 </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
                 <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Type size={20} /></div>
                    <h2 className="text-lg font-bold text-slate-800">واجهة الاستقبال (Hero Section)</h2>
                 </div>
                 
                 <div className="space-y-6">
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">العنوان الرئيسي</label>
                       <input 
                          type="text" 
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary-500 outline-none transition text-lg font-bold text-slate-800"
                          value={formData.heroTitle}
                          onChange={e => setFormData({...formData, heroTitle: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">العنوان الفرعي</label>
                       <textarea 
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary-500 outline-none transition leading-relaxed"
                          value={formData.heroSubtitle}
                          onChange={e => setFormData({...formData, heroSubtitle: e.target.value})}
                       />
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* Tab Content: Appearance */}
          {activeTab === 'appearance' && (
            <div className="grid gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
                 <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Palette size={20} /></div>
                    <h2 className="text-lg font-bold text-slate-800">الألوان والهوية البصرية</h2>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-700">اللون الأساسي (Primary)</label>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <input 
                                type="color" 
                                className="w-14 h-14 p-1 rounded-lg cursor-pointer border border-slate-300 shadow-sm"
                                value={formData.primaryColor}
                                onChange={e => setFormData({...formData, primaryColor: e.target.value})}
                            />
                            <div>
                                <span className="font-mono text-slate-600 block mb-1 uppercase bg-white px-2 py-1 rounded border border-slate-200 text-xs">{formData.primaryColor}</span>
                                <p className="text-xs text-slate-400">للعناوين، الأزرار الرئيسية، والروابط</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-700">اللون الثانوي (Secondary)</label>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <input 
                                type="color" 
                                className="w-14 h-14 p-1 rounded-lg cursor-pointer border border-slate-300 shadow-sm"
                                value={formData.secondaryColor}
                                onChange={e => setFormData({...formData, secondaryColor: e.target.value})}
                            />
                            <div>
                                <span className="font-mono text-slate-600 block mb-1 uppercase bg-white px-2 py-1 rounded border border-slate-200 text-xs">{formData.secondaryColor}</span>
                                <p className="text-xs text-slate-400">للتمييز، أيقونات، وعناصر جمالية</p>
                            </div>
                        </div>
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
                       <p className="text-xs text-slate-400 mt-2">يفضل استخدام صورة بخلفية شفافة (PNG) بحجم مناسب.</p>
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

          {/* Tab Content: Contact */}
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

          {/* Tab Content: Advanced */}
          {activeTab === 'advanced' && (
            <div className="grid gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
                 <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg"><Power size={20} /></div>
                    <h2 className="text-lg font-bold text-slate-800">التحكم في النظام</h2>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div>
                            <h3 className="font-bold text-slate-800">تفعيل التسجيل الجديد</h3>
                            <p className="text-xs text-slate-500">السماح للطلاب بإنشاء حسابات جديدة أو التسجيل في الدورات</p>
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

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div>
                            <h3 className="font-bold text-slate-800">وضع الصيانة</h3>
                            <p className="text-xs text-slate-500">إغلاق الموقع مؤقتاً أمام الزوار وعرض صفحة الصيانة</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={formData.maintenanceMode || false}
                                onChange={e => setFormData({...formData, maintenanceMode: e.target.checked})}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                        </label>
                    </div>
                 </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 md:p-8">
                 <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                    <div className="p-2 bg-gray-50 text-gray-600 rounded-lg"><MessageSquare size={20} /></div>
                    <h2 className="text-lg font-bold text-slate-800">تذييل الموقع (Footer)</h2>
                 </div>
                 
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">نص الحقوق</label>
                    <input 
                        type="text" 
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary-500 outline-none transition"
                        value={formData.footerText || ''}
                        onChange={e => setFormData({...formData, footerText: e.target.value})}
                        placeholder="جميع الحقوق محفوظة © منصة شمسية"
                    />
                 </div>
              </div>
            </div>
          )}

          {message && (
             <div className={`p-4 rounded-xl text-center font-bold animate-pop-in ${message.includes('خطأ') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message}
             </div>
          )}

          <div className="flex justify-end pt-4">
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