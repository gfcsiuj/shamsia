
import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { SiteSettings } from '../../types';
import { useTheme, ThemeContext, ThemeProvider as OriginalThemeProvider } from '../../context/ThemeContext'; // Import ThemeContext
import { Save, Loader2, LayoutTemplate, Palette, Phone, ExternalLink, Globe, Monitor, Type, Share2, MapPin, Power, MessageSquare, Sliders, AlertTriangle, MousePointer2, Smartphone, Monitor as MonitorIcon, RotateCcw, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Home from '../Home'; // Import Home for preview

const Settings: React.FC = () => {
  const { settings: initialSettings, loading: initialLoading } = useTheme();
  const [formData, setFormData] = useState<SiteSettings>(initialSettings);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'free' | 'contact' | 'system'>('general');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

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

  const handleResetColors = () => {
    if (window.confirm('هل أنت متأكد من استعادة الألوان الافتراضية للموقع؟')) {
        setFormData(prev => ({
            ...prev,
            primaryColor: '#10b981', // Emerald 500
            secondaryColor: '#f59e0b', // Amber 500
            accentColor: '#1efff5', // Default Cyan
            footerBgColor: '#064e3b', // primary-900 equivalent
        }));
    }
  };

  const tabs = [
    { id: 'general', label: 'عام', icon: LayoutTemplate },
    { id: 'free', label: 'تخصيص حر', icon: MousePointer2 }, // New Tab
    { id: 'contact', label: 'التواصل', icon: Phone },
    { id: 'system', label: 'النظام والصيانة', icon: Power },
  ];

  if (initialLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" size={40} /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className={activeTab === 'free' ? "max-w-full" : "max-w-6xl mx-auto"}>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">إعدادات المنصة</h1>
            <p className="text-slate-500 text-sm mt-1">تحكم كامل في الهوية، المظهر، وخصائص النظام</p>
          </div>
          <div className="flex gap-3">
             {activeTab === 'free' && (
                 <div className="bg-white border border-slate-200 rounded-lg p-1 flex items-center shadow-sm">
                     <button onClick={() => setPreviewMode('desktop')} className={`p-2 rounded-md transition ${previewMode === 'desktop' ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:text-slate-600'}`} title="Desktop View"><MonitorIcon size={20}/></button>
                     <button onClick={() => setPreviewMode('mobile')} className={`p-2 rounded-md transition ${previewMode === 'mobile' ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:text-slate-600'}`} title="Mobile View"><Smartphone size={20}/></button>
                 </div>
             )}
             <Link to="/" target="_blank" className="bg-white text-primary-600 border border-primary-200 px-5 py-2.5 rounded-xl font-bold hover:bg-primary-50 transition flex items-center gap-2 shadow-sm w-fit">
                <ExternalLink size={18} />
                معاينة الموقع
             </Link>
          </div>
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

          {/* ================= Free Customization Tab (Visual + Preview) ================= */}
          {activeTab === 'free' && (
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
              
              {/* Left Col: Controls (Scrollable) */}
              <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
                 <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                    <Sliders size={20} className="text-primary-600" />
                    <h2 className="font-bold text-slate-800">أدوات التخصيص</h2>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Header Section */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <Type size={14}/> ترويسة الموقع (Hero)
                        </h3>
                        
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-3">
                            <label className="block text-xs font-bold text-slate-700">العنوان الرئيسي</label>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:border-primary-500 outline-none"
                                value={formData.heroTitle}
                                onChange={e => setFormData({...formData, heroTitle: e.target.value})}
                            />
                            <div className="flex gap-2 items-center">
                                <input 
                                    type="color" 
                                    className="w-8 h-8 rounded cursor-pointer border border-slate-300 p-0.5" 
                                    value={formData.heroTitleColor || '#ffffff'}
                                    onChange={e => setFormData({...formData, heroTitleColor: e.target.value})}
                                />
                                <div className="flex-1">
                                    <input 
                                        type="range" 
                                        min="20" 
                                        max="100" 
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                        value={formData.heroTitleSize || 48}
                                        onChange={e => setFormData({...formData, heroTitleSize: Number(e.target.value)})}
                                    />
                                </div>
                                <span className="text-xs font-mono text-slate-500 w-8">{formData.heroTitleSize}px</span>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-3">
                            <label className="block text-xs font-bold text-slate-700">العنوان الفرعي</label>
                            <textarea 
                                rows={2}
                                className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:border-primary-500 outline-none resize-none"
                                value={formData.heroSubtitle}
                                onChange={e => setFormData({...formData, heroSubtitle: e.target.value})}
                            />
                            <div className="flex gap-2 items-center">
                                <input 
                                    type="color" 
                                    className="w-8 h-8 rounded cursor-pointer border border-slate-300 p-0.5" 
                                    value={formData.heroSubtitleColor || '#f1f5f9'}
                                    onChange={e => setFormData({...formData, heroSubtitleColor: e.target.value})}
                                />
                                <div className="flex-1">
                                    <input 
                                        type="range" 
                                        min="12" 
                                        max="40" 
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                        value={formData.heroSubtitleSize || 18}
                                        onChange={e => setFormData({...formData, heroSubtitleSize: Number(e.target.value)})}
                                    />
                                </div>
                                <span className="text-xs font-mono text-slate-500 w-8">{formData.heroSubtitleSize}px</span>
                            </div>
                        </div>
                    </div>

                    {/* Colors Section */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Palette size={14}/> ألوان الهوية
                            </h3>
                            <button 
                                type="button" 
                                onClick={handleResetColors}
                                className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px] font-bold transition"
                                title="استعادة الألوان الافتراضية"
                            >
                                <RotateCcw size={10} />
                                استعادة الأصلي
                            </button>
                        </div>
                        
                        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <span className="text-sm font-medium text-slate-700">اللون الأساسي</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-slate-400">{formData.primaryColor}</span>
                                <input 
                                    type="color" 
                                    className="w-8 h-8 rounded cursor-pointer border border-slate-300 p-0.5"
                                    value={formData.primaryColor}
                                    onChange={e => setFormData({...formData, primaryColor: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <span className="text-sm font-medium text-slate-700">اللون الثانوي</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-slate-400">{formData.secondaryColor}</span>
                                <input 
                                    type="color" 
                                    className="w-8 h-8 rounded cursor-pointer border border-slate-300 p-0.5"
                                    value={formData.secondaryColor}
                                    onChange={e => setFormData({...formData, secondaryColor: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <span className="text-sm font-medium text-slate-700">لون التمييز (Accent)</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-slate-400">{formData.accentColor || '#1efff5'}</span>
                                <input 
                                    type="color" 
                                    className="w-8 h-8 rounded cursor-pointer border border-slate-300 p-0.5"
                                    value={formData.accentColor || '#1efff5'}
                                    onChange={e => setFormData({...formData, accentColor: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <LayoutTemplate size={14}/> تذييل الموقع (Footer)
                        </h3>
                        
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-3">
                            <label className="block text-xs font-bold text-slate-700">نص الحقوق</label>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 rounded-md border border-slate-200 text-sm focus:border-primary-500 outline-none"
                                value={formData.footerText || ''}
                                onChange={e => setFormData({...formData, footerText: e.target.value})}
                            />
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs font-medium text-slate-600">لون الخلفية</span>
                                <input 
                                    type="color" 
                                    className="w-8 h-8 rounded cursor-pointer border border-slate-300 p-0.5" 
                                    value={formData.footerBgColor || '#064e3b'}
                                    onChange={e => setFormData({...formData, footerBgColor: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                 </div>
              </div>

              {/* Right Col: Live Preview */}
              <div className="w-full lg:w-2/3 bg-slate-200 rounded-xl border border-slate-300 overflow-hidden flex flex-col relative shadow-inner">
                 <div className="bg-slate-800 text-white px-4 py-2 text-xs font-mono flex justify-between items-center shrink-0">
                    <span>Live Preview: Home Page</span>
                    <span className="opacity-50">{previewMode === 'mobile' ? '375x667' : '100%'}</span>
                 </div>
                 
                 <div className={`flex-1 overflow-y-auto overflow-x-hidden w-full relative bg-slate-50 transition-all duration-300 mx-auto ${previewMode === 'mobile' ? 'max-w-[375px] my-4 border-4 border-slate-800 rounded-3xl shadow-2xl h-[667px]' : 'h-full'}`}>
                    {/* Wrap Home in ThemeProvider with formData to reflect changes immediately */}
                    <div className={previewMode === 'mobile' ? 'pointer-events-none select-none scale-[0.85] origin-top h-[120%]' : 'pointer-events-none select-none'}>
                        <ThemeContext.Provider value={{ settings: formData, loading: false }}>
                            <Home />
                        </ThemeContext.Provider>
                    </div>
                 </div>
                 
                 {/* Overlay to prevent interaction inside preview but allow scrolling container */}
                 <div className="absolute inset-0 pointer-events-none border-4 border-transparent"></div>
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

          {/* ================= Free Customization Tab (Launcher) ================= */}
          {activeTab === 'free' && (
            <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                
                <div className="relative z-10 max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-slate-50 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-sm border border-slate-100">
                        <MousePointer2 size={40} className="text-primary-600 animate-bounce-slow" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">وضع التخصيص الحر</h2>
                    <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                        استمتع بتجربة تحرير مرئية حية! اضغط على أي نص أو صورة أو كائن في الموقع لتعديل ألوانه، نصوصه، وأبعاده مباشرة.
                    </p>
                    
                    <button 
                        type="button"
                        onClick={() => {
                            // Redirect to home with edit flag
                            window.location.href = '/?visualEdit=true';
                        }}
                        className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary-200 transition transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-3 mx-auto"
                    >
                        <ExternalLink size={24} />
                        دخول وضع التخصيص الحر
                    </button>
                    
                    <div className="mt-8 flex justify-center gap-6 text-sm text-slate-400">
                        <span className="flex items-center gap-1"><Check size={16} className="text-green-500"/> تعديل النصوص</span>
                        <span className="flex items-center gap-1"><Check size={16} className="text-green-500"/> تغيير الألوان</span>
                        <span className="flex items-center gap-1"><Check size={16} className="text-green-500"/> التحكم بالأبعاد</span>
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
