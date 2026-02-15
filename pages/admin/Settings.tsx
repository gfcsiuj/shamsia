
import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { SiteSettings } from '../../types';
import { useTheme, ThemeContext } from '../../context/ThemeContext';
import {
    Save, Loader2, LayoutTemplate, Palette, Phone, ExternalLink, Globe, Monitor, Type, Share2, MapPin, Power,
    AlertTriangle, RotateCcw, BookOpen, Shield, Settings2, DollarSign, Users, Image, FileText, Plus, Trash2, Handshake
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Partner { id: string; name: string; logoUrl?: string; }

const Settings: React.FC = () => {
    const { settings: initialSettings, loading: initialLoading } = useTheme();
    const [formData, setFormData] = useState<SiteSettings>(initialSettings);
    const [saveLoading, setSaveLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'contact' | 'courses' | 'system'>('general');

    // Partners state
    const [partners, setPartners] = useState<Partner[]>([]);
    const [partnersLoading, setPartnersLoading] = useState(true);
    const [newPartnerName, setNewPartnerName] = useState('');
    const [newPartnerLogo, setNewPartnerLogo] = useState('');
    const [addingPartner, setAddingPartner] = useState(false);

    useEffect(() => {
        if (!initialLoading) {
            setFormData(initialSettings);
        }
    }, [initialSettings, initialLoading]);

    // Fetch partners
    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const snap = await db.collection('partners').get();
                setPartners(snap.docs.map(d => ({ id: d.id, ...d.data() } as Partner)));
            } catch (err) { console.error(err); }
            finally { setPartnersLoading(false); }
        };
        fetchPartners();
    }, []);

    const handleAddPartner = async () => {
        if (!newPartnerName.trim()) return;
        setAddingPartner(true);
        try {
            const docRef = await db.collection('partners').add({ name: newPartnerName.trim(), logoUrl: newPartnerLogo.trim() || '' });
            setPartners(prev => [...prev, { id: docRef.id, name: newPartnerName.trim(), logoUrl: newPartnerLogo.trim() || undefined }]);
            setNewPartnerName(''); setNewPartnerLogo('');
        } catch (err) { console.error(err); }
        finally { setAddingPartner(false); }
    };

    const handleDeletePartner = async (id: string) => {
        if (!window.confirm('حذف هذا الشريك؟')) return;
        await db.collection('partners').doc(id).delete();
        setPartners(prev => prev.filter(p => p.id !== id));
    };

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
                primaryColor: '#10b981',
                secondaryColor: '#f59e0b',
                accentColor: '#1efff5',
                footerBgColor: '#064e3b',
            }));
        }
    };

    const tabs = [
        { id: 'general', label: 'عام', icon: Settings2, color: 'blue' },
        { id: 'appearance', label: 'المظهر', icon: Palette, color: 'purple' },
        { id: 'contact', label: 'التواصل', icon: Phone, color: 'green' },
        { id: 'courses', label: 'الدورات', icon: BookOpen, color: 'orange' },
        { id: 'system', label: 'النظام', icon: Shield, color: 'red' },
    ];

    const tabColors: { [key: string]: string } = {
        blue: 'from-blue-500 to-blue-600',
        purple: 'from-purple-500 to-purple-600',
        green: 'from-green-500 to-green-600',
        orange: 'from-orange-500 to-orange-600',
        pink: 'from-pink-500 to-pink-600',
        red: 'from-red-500 to-red-600',
        cyan: 'from-cyan-500 to-cyan-600',
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-orange-50/20 flex justify-center items-center">
                <div className="text-center">
                    <Loader2 className="animate-spin mx-auto mb-4 text-primary-600" size={48} />
                    <p className="text-slate-500 font-medium">جاري تحميل الإعدادات...</p>
                </div>
            </div>
        );
    }

    const currentTab = tabs.find(t => t.id === activeTab);
    const currentColor = currentTab ? tabColors[currentTab.color] : tabColors.blue;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/20 to-orange-50/20 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">

                {/* Enhanced Header */}
                <div className={`relative bg-gradient-to-r ${currentColor} p-6 md:p-8 rounded-3xl shadow-2xl overflow-hidden mb-8`}>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDRtLTQgNGg0bS00IDRoNE00MCAxNGg0bS00IDRoNG0tNCA0aDQiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 flex items-center gap-3">
                                <Settings2 size={28} />
                                إعدادات المنصة
                            </h1>
                            <p className="text-white/80 text-sm">تحكم كامل في جميع جوانب الموقع</p>
                        </div>
                        <Link to="/" target="_blank" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-lg w-fit border border-white/20">
                            <ExternalLink size={18} />
                            معاينة الموقع
                        </Link>
                    </div>
                </div>

                {/* Tabs Navigation - Scrollable on mobile */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-2 mb-8 overflow-x-auto">
                    <div className="flex gap-1 min-w-max">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-300 ${isActive
                                        ? `bg-gradient-to-r ${tabColors[tab.color]} text-white shadow-lg transform scale-105`
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    <Icon size={18} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* ================= General Tab ================= */}
                    {activeTab === 'general' && (
                        <div className="grid gap-6 animate-fade-in">
                            {/* Site Basic Info */}
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                        <Globe size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">بيانات الموقع الأساسية</h2>
                                        <p className="text-sm text-slate-500">المعلومات العامة للموقع</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">اسم الموقع</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                            value={formData.siteName || ''}
                                            onChange={e => setFormData({ ...formData, siteName: e.target.value })}
                                            placeholder="شمسية"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">اللغة الافتراضية</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition"
                                            value={formData.defaultLanguage || 'ar'}
                                            onChange={e => setFormData({ ...formData, defaultLanguage: e.target.value as 'ar' | 'en' })}
                                        >
                                            <option value="ar">العربية</option>
                                            <option value="en">English</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">وصف الموقع (Meta Description)</label>
                                        <textarea
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 outline-none transition resize-none"
                                            value={formData.siteDescription || ''}
                                            onChange={e => setFormData({ ...formData, siteDescription: e.target.value })}
                                            placeholder="منصة تعليمية رائدة في العراق..."
                                        />
                                        <p className="text-xs text-slate-400 mt-2">يظهر في نتائج محركات البحث</p>
                                    </div>
                                </div>
                            </div>

                            {/* Logo & Favicon */}
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                    <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                                        <Image size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">الشعار والأيقونة</h2>
                                        <p className="text-sm text-slate-500">هوية الموقع البصرية</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">رابط الشعار (Logo)</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-orange-500 outline-none transition text-sm ltr text-left"
                                            value={formData.logoUrl || ''}
                                            onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
                                            placeholder="https://example.com/logo.png"
                                        />
                                        {formData.logoUrl && (
                                            <div className="mt-3 p-3 bg-slate-100 rounded-xl">
                                                <img src={formData.logoUrl} alt="Logo Preview" className="max-h-16 object-contain" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">رابط الأيقونة (Favicon)</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-orange-500 outline-none transition text-sm ltr text-left"
                                            value={formData.faviconUrl || ''}
                                            onChange={e => setFormData({ ...formData, faviconUrl: e.target.value })}
                                            placeholder="https://example.com/favicon.ico"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Success Partners */}
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                    <div className="p-3 bg-teal-100 text-teal-600 rounded-xl">
                                        <Handshake size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">شركاء النجاح</h2>
                                        <p className="text-sm text-slate-500">إدارة الشركاء المعروضين في صفحة من نحن</p>
                                    </div>
                                </div>

                                {/* Add Partner Form */}
                                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 mb-6">
                                    <h3 className="text-sm font-bold text-slate-700 mb-4">إضافة شريك جديد</h3>
                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">اسم الشريك *</label>
                                            <input type="text" className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-teal-500 outline-none transition text-sm" placeholder="مثال: جامعة بغداد" value={newPartnerName} onChange={e => setNewPartnerName(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 mb-1">رابط الشعار (اختياري)</label>
                                            <input type="text" className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-teal-500 outline-none transition text-sm ltr text-left" placeholder="https://..." value={newPartnerLogo} onChange={e => setNewPartnerLogo(e.target.value)} />
                                        </div>
                                    </div>
                                    <button type="button" onClick={handleAddPartner} disabled={addingPartner || !newPartnerName.trim()} className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 disabled:opacity-50">
                                        {addingPartner ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                                        إضافة شريك
                                    </button>
                                </div>

                                {/* Partners List */}
                                {partnersLoading ? (
                                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-teal-500" size={28} /></div>
                                ) : partners.length === 0 ? (
                                    <div className="text-center py-8 text-slate-400 text-sm">لم يتم إضافة شركاء بعد</div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {partners.map(partner => (
                                            <div key={partner.id} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100 group hover:border-teal-200 transition">
                                                {partner.logoUrl ? (
                                                    <img src={partner.logoUrl} alt={partner.name} className="w-10 h-10 rounded-lg object-contain border border-slate-200 bg-white p-1" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600 font-black text-sm">{partner.name.charAt(0)}</div>
                                                )}
                                                <span className="flex-1 font-bold text-sm text-slate-700 truncate">{partner.name}</span>
                                                <button type="button" onClick={() => handleDeletePartner(partner.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 opacity-0 group-hover:opacity-100 transition">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ================= Appearance Tab ================= */}
                    {activeTab === 'appearance' && (
                        <div className="grid gap-6 animate-fade-in">
                            {/* Colors Section */}
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
                                <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                                            <Palette size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-800">ألوان الهوية</h2>
                                            <p className="text-sm text-slate-500">تخصيص الألوان الرئيسية</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleResetColors}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition"
                                    >
                                        <RotateCcw size={16} />
                                        استعادة الافتراضي
                                    </button>
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    {[
                                        { key: 'primaryColor', label: 'اللون الأساسي', defaultVal: '#10b981' },
                                        { key: 'secondaryColor', label: 'اللون الثانوي', defaultVal: '#f59e0b' },
                                        { key: 'accentColor', label: 'لون التمييز', defaultVal: '#1efff5' },
                                    ].map((color) => (
                                        <div key={color.key} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <label className="block text-sm font-bold text-slate-700 mb-3">{color.label}</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    className="w-14 h-14 rounded-xl cursor-pointer border-2 border-slate-200 p-1"
                                                    value={(formData as any)[color.key] || color.defaultVal}
                                                    onChange={e => setFormData({ ...formData, [color.key]: e.target.value })}
                                                />
                                                <input
                                                    type="text"
                                                    className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm font-mono text-center"
                                                    value={(formData as any)[color.key] || color.defaultVal}
                                                    onChange={e => setFormData({ ...formData, [color.key]: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Hero Section */}
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                                        <Type size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">ترويسة الموقع (Hero)</h2>
                                        <p className="text-sm text-slate-500">تخصيص القسم الرئيسي</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">العنوان الرئيسي</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none transition"
                                            value={formData.heroTitle || ''}
                                            onChange={e => setFormData({ ...formData, heroTitle: e.target.value })}
                                            placeholder="ابنِ مسارك المهني بذكاء"
                                        />
                                        <div className="flex gap-3 mt-3">
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs text-slate-500">اللون:</label>
                                                <input
                                                    type="color"
                                                    className="w-8 h-8 rounded cursor-pointer border border-slate-200"
                                                    value={formData.heroTitleColor || '#1e293b'}
                                                    onChange={e => setFormData({ ...formData, heroTitleColor: e.target.value })}
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 flex-1">
                                                <label className="text-xs text-slate-500">الحجم:</label>
                                                <input
                                                    type="range"
                                                    min="24"
                                                    max="80"
                                                    className="flex-1"
                                                    value={formData.heroTitleSize || 48}
                                                    onChange={e => setFormData({ ...formData, heroTitleSize: Number(e.target.value) })}
                                                />
                                                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">{formData.heroTitleSize || 48}px</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">العنوان الفرعي</label>
                                        <textarea
                                            rows={2}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 outline-none transition resize-none"
                                            value={formData.heroSubtitle || ''}
                                            onChange={e => setFormData({ ...formData, heroSubtitle: e.target.value })}
                                        />
                                        <div className="flex gap-3 mt-3">
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs text-slate-500">اللون:</label>
                                                <input
                                                    type="color"
                                                    className="w-8 h-8 rounded cursor-pointer border border-slate-200"
                                                    value={formData.heroSubtitleColor || '#64748b'}
                                                    onChange={e => setFormData({ ...formData, heroSubtitleColor: e.target.value })}
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 flex-1">
                                                <label className="text-xs text-slate-500">الحجم:</label>
                                                <input
                                                    type="range"
                                                    min="12"
                                                    max="32"
                                                    className="flex-1"
                                                    value={formData.heroSubtitleSize || 18}
                                                    onChange={e => setFormData({ ...formData, heroSubtitleSize: Number(e.target.value) })}
                                                />
                                                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">{formData.heroSubtitleSize || 18}px</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Section */}
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                    <div className="p-3 bg-slate-700 text-white rounded-xl">
                                        <LayoutTemplate size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">تذييل الموقع (Footer)</h2>
                                        <p className="text-sm text-slate-500">إعدادات الجزء السفلي</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">نص الحقوق</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-slate-500 outline-none transition"
                                            value={formData.footerText || ''}
                                            onChange={e => setFormData({ ...formData, footerText: e.target.value })}
                                            placeholder="© 2026 شمسية. جميع الحقوق محفوظة."
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-bold text-slate-700 mb-2">لون الخلفية</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    className="w-12 h-12 rounded-xl cursor-pointer border border-slate-200"
                                                    value={formData.footerBgColor || '#064e3b'}
                                                    onChange={e => setFormData({ ...formData, footerBgColor: e.target.value })}
                                                />
                                                <input
                                                    type="text"
                                                    className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm font-mono"
                                                    value={formData.footerBgColor || '#064e3b'}
                                                    onChange={e => setFormData({ ...formData, footerBgColor: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ================= Contact Tab ================= */}
                    {activeTab === 'contact' && (
                        <div className="grid gap-6 animate-fade-in">
                            {/* Direct Contact */}
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                    <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">معلومات الاتصال</h2>
                                        <p className="text-sm text-slate-500">بيانات التواصل المباشر</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">رقم الهاتف</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-green-500 outline-none transition"
                                            value={formData.contactPhone || ''}
                                            onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                                            placeholder="+964 XXX XXX XXXX"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-green-500 outline-none transition"
                                            value={formData.contactEmail || ''}
                                            onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                                            placeholder="info@example.com"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">العنوان الفعلي</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-green-500 outline-none transition pl-12"
                                                value={formData.contactAddress || ''}
                                                onChange={e => setFormData({ ...formData, contactAddress: e.target.value })}
                                                placeholder="العراق، بغداد..."
                                            />
                                            <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                        <Share2 size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">شبكات التواصل الاجتماعي</h2>
                                        <p className="text-sm text-slate-500">روابط الحسابات الرسمية</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        { label: 'Facebook', key: 'facebookUrl', icon: '📘', placeholder: 'facebook.com/...' },
                                        { label: 'Instagram', key: 'instagramUrl', icon: '📸', placeholder: 'instagram.com/...' },
                                        { label: 'LinkedIn', key: 'linkedinUrl', icon: '💼', placeholder: 'linkedin.com/...' },
                                        { label: 'Twitter (X)', key: 'twitterUrl', icon: '🐦', placeholder: 'x.com/...' },
                                        { label: 'YouTube', key: 'youtubeUrl', icon: '🎬', placeholder: 'youtube.com/...' },
                                        { label: 'Telegram', key: 'telegramUrl', icon: '✈️', placeholder: 't.me/...' },
                                    ].map((social) => (
                                        <div key={social.key} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                                <span>{social.icon}</span>
                                                {social.label}
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2.5 rounded-lg bg-white border border-slate-200 focus:border-blue-500 outline-none transition text-sm ltr text-left mt-2"
                                                value={(formData as any)[social.key] || ''}
                                                onChange={e => setFormData({ ...formData, [social.key]: e.target.value })}
                                                placeholder={social.placeholder}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ================= Courses Tab ================= */}
                    {activeTab === 'courses' && (
                        <div className="grid gap-6 animate-fade-in">
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                    <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                                        <BookOpen size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">إعدادات عرض الدورات</h2>
                                        <p className="text-sm text-slate-500">التحكم في طريقة عرض الدورات</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Show Prices Toggle */}
                                    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <DollarSign size={24} className="text-green-600" />
                                            <div>
                                                <h3 className="font-bold text-slate-800">عرض الأسعار</h3>
                                                <p className="text-sm text-slate-500">إظهار أسعار الدورات للزوار</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={formData.showPrices !== false}
                                                onChange={e => setFormData({ ...formData, showPrices: e.target.checked })}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-green-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                        </label>
                                    </div>

                                    {/* Show Student Count Toggle */}
                                    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <Users size={24} className="text-blue-600" />
                                            <div>
                                                <h3 className="font-bold text-slate-800">عدد الطلاب</h3>
                                                <p className="text-sm text-slate-500">إظهار عدد المسجلين</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={formData.showStudentCount !== false}
                                                onChange={e => setFormData({ ...formData, showStudentCount: e.target.checked })}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                                        </label>
                                    </div>

                                    {/* Enable Course Registration Toggle */}
                                    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <FileText size={24} className="text-purple-600" />
                                            <div>
                                                <h3 className="font-bold text-slate-800">التسجيل في الدورات</h3>
                                                <p className="text-sm text-slate-500">السماح بالتسجيل في الدورات</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={formData.enableCourseRegistration !== false}
                                                onChange={e => setFormData({ ...formData, enableCourseRegistration: e.target.checked })}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                                        </label>
                                    </div>

                                    {/* Course Card Style */}
                                    <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                                        <label className="block text-sm font-bold text-slate-700 mb-3">نمط كروت الدورات</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:border-orange-500 outline-none transition"
                                            value={formData.courseCardStyle || 'default'}
                                            onChange={e => setFormData({ ...formData, courseCardStyle: e.target.value as 'default' | 'minimal' | 'detailed' })}
                                        >
                                            <option value="default">افتراضي</option>
                                            <option value="minimal">بسيط</option>
                                            <option value="detailed">تفصيلي</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* ================= System Tab ================= */}
                    {activeTab === 'system' && (
                        <div className="grid gap-6 animate-fade-in">
                            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                    <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                                        <Shield size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">النظام والصيانة</h2>
                                        <p className="text-sm text-slate-500">إعدادات متقدمة للنظام</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Maintenance Mode */}
                                    <div className={`p-6 rounded-xl border-2 transition-all ${formData.maintenanceMode ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className={`p-3 rounded-xl ${formData.maintenanceMode ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                                                    <Power size={24} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className={`font-bold text-lg ${formData.maintenanceMode ? 'text-red-700' : 'text-slate-800'}`}>وضع الصيانة</h3>
                                                        {formData.maintenanceMode && (
                                                            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                                                <AlertTriangle size={10} /> مفعل
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-500 mb-4">
                                                        عند تفعيل الصيانة، سيتم إغلاق الموقع أمام الزوار.
                                                    </p>
                                                    <div>
                                                        <label className="block text-sm font-bold text-slate-700 mb-2">رسالة الصيانة</label>
                                                        <textarea
                                                            rows={2}
                                                            className="w-full px-4 py-2 rounded-lg bg-white border border-slate-300 focus:border-red-500 outline-none transition text-sm"
                                                            value={formData.maintenanceMessage || ''}
                                                            onChange={e => setFormData({ ...formData, maintenanceMessage: e.target.value })}
                                                            disabled={!formData.maintenanceMode}
                                                            placeholder="نحن نعمل على تحسين الموقع..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only peer"
                                                    checked={formData.maintenanceMode || false}
                                                    onChange={e => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                                                />
                                                <div className="w-14 h-8 bg-gray-200 peer-focus:ring-4 peer-focus:ring-red-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500"></div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Registration Toggle */}
                                    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <Users size={24} className="text-green-600" />
                                            <div>
                                                <h3 className="font-bold text-slate-800">التسجيل الجديد</h3>
                                                <p className="text-sm text-slate-500">السماح بإنشاء حسابات جديدة</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={formData.enableRegistration !== false}
                                                onChange={e => setFormData({ ...formData, enableRegistration: e.target.checked })}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-green-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}



                    {/* Save Message */}
                    {message && (
                        <div className={`p-4 rounded-xl text-center font-bold animate-pop-in ${message.includes('خطأ') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {message}
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="flex justify-end pt-4 border-t border-slate-200 mt-8">
                        <button
                            type="submit"
                            disabled={saveLoading}
                            className={`bg-gradient-to-r ${currentColor} text-white px-8 py-4 rounded-xl font-bold shadow-lg transition flex items-center gap-2 disabled:opacity-70 transform hover:-translate-y-1 hover:shadow-xl`}
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
