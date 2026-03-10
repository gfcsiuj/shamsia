import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Loader2, User, Briefcase, Award, Share2, Upload, Plus, Trash2, FileText, Image, X } from 'lucide-react';
import { db } from '../lib/firebase';
import { useTheme } from '../context/ThemeContext';

interface SocialEntry {
    type: string;
    value: string;
}

interface FileAttachment {
    file: File;
    preview?: string;
}

const SOCIAL_TYPES = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'Twitter / X' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'website', label: 'موقع إلكتروني' },
    { value: 'email', label: 'بريد إلكتروني' },
    { value: 'phone', label: 'هاتف' },
];

const TrainerRegister: React.FC = () => {
    const { t, isEnglish } = useTheme();

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [experience, setExperience] = useState('');
    const [jobTitles, setJobTitles] = useState<string[]>(['']);
    const [certifications, setCertifications] = useState<string[]>(['']);
    const [socials, setSocials] = useState<SocialEntry[]>([{ type: 'phone', value: '' }]);
    const [attachments, setAttachments] = useState<FileAttachment[]>([]);

    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Dynamic list helpers
    const addJobTitle = () => setJobTitles([...jobTitles, '']);
    const removeJobTitle = (i: number) => setJobTitles(jobTitles.filter((_, idx) => idx !== i));
    const updateJobTitle = (i: number, val: string) => setJobTitles(jobTitles.map((t, idx) => idx === i ? val : t));

    const addCertification = () => setCertifications([...certifications, '']);
    const removeCertification = (i: number) => setCertifications(certifications.filter((_, idx) => idx !== i));
    const updateCertification = (i: number, val: string) => setCertifications(certifications.map((c, idx) => idx === i ? val : c));

    const addSocial = () => setSocials([...socials, { type: 'facebook', value: '' }]);
    const removeSocial = (i: number) => setSocials(socials.filter((_, idx) => idx !== i));
    const updateSocial = (i: number, field: 'type' | 'value', val: string) =>
        setSocials(socials.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

    // Convert file to Base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });
    };

    // File handling
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB per file
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (!fileList) return;
        const newAttachments: FileAttachment[] = [];
        for (let i = 0; i < fileList.length; i++) {
            const f = fileList[i];
            if (f.size > MAX_FILE_SIZE) {
                alert(t(`الملف "${f.name}" حجمه كبير جداً. الحد الأقصى 20 ميجابايت لكل ملف.`, `File "${f.name}" is too large. Max 20MB per file.`));
                continue;
            }
            newAttachments.push({
                file: f,
                preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined
            });
        }
        setAttachments(prev => [...prev, ...newAttachments]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeAttachment = (i: number) => {
        const att = attachments[i];
        if (att.preview) URL.revokeObjectURL(att.preview);
        setAttachments(attachments.filter((_, idx) => idx !== i));
    };

    const getFileIcon = (file: File) => {
        if (file.type.startsWith('image/')) return <Image size={20} className="text-blue-500" />;
        return <FileText size={20} className="text-red-500" />;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    // Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim()) {
            alert(t('يرجى ملء الحقول المطلوبة (الاسم والهاتف)', 'Please fill required fields (name and phone)'));
            return;
        }

        setSubmitLoading(true);
        try {
            // Build attachment metadata (without file data)
            const attachmentsMeta: { name: string; type: string; size: number }[] = attachments.map(att => ({
                name: att.file.name, type: att.file.type, size: att.file.size
            }));

            // Save main registration doc first
            const docRef = await db.collection('registrations').add({
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                experience: experience.trim(),
                jobTitles: jobTitles.filter(j => j.trim()),
                certifications: certifications.filter(c => c.trim()),
                socials: socials.filter(s => s.value.trim()),
                attachments: attachmentsMeta,
                type: 'trainer',
                status: 'new',
                createdAt: new Date().toISOString(),
            });

            // Save each file as Base64 chunks in subcollection
            const CHUNK_SIZE = 800000; // ~800KB per chunk (safe under 1MB doc limit)
            for (let i = 0; i < attachments.length; i++) {
                const att = attachments[i];
                setUploadProgress(Math.round(((i) / attachments.length) * 100));
                const base64 = await fileToBase64(att.file);
                const totalChunks = Math.ceil(base64.length / CHUNK_SIZE);

                for (let c = 0; c < totalChunks; c++) {
                    const chunk = base64.slice(c * CHUNK_SIZE, (c + 1) * CHUNK_SIZE);
                    await db.collection('registrations').doc(docRef.id).collection('fileChunks').add({
                        fileIndex: i,
                        chunkIndex: c,
                        totalChunks,
                        fileName: att.file.name,
                        fileType: att.file.type,
                        data: chunk,
                    });
                }
                setUploadProgress(Math.round(((i + 1) / attachments.length) * 100));
            }

            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting trainer registration:', error);
            alert(t('حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى.', 'An error occurred. Please try again.'));
        } finally {
            setSubmitLoading(false);
            setUploadProgress(0);
        }
    };

    // Success screen
    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4 animate-fade-up">
                    <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                        <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 italic">
                        {t('تم إرسال طلبك بنجاح!', 'Application Submitted Successfully!')}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-medium">
                        {t(
                            `شكراً لك ${name}! تم استلام طلب انضمامك كمدرب في منصة شمسية. سيتم مراجعة طلبك والتواصل معك قريباً.`,
                            `Thank you ${name}! Your trainer application has been received. We will review it and contact you soon.`
                        )}
                    </p>
                    <Link to="/" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-4 rounded-2xl transition shadow-xl shadow-emerald-500/20 active:scale-95">
                        {t('العودة للرئيسية', 'Back to Home')}
                    </Link>
                </div>
            </div>
        );
    }

    const inputClass = "w-full px-4 py-4 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 outline-none transition font-medium";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24 transition-colors duration-300">
            {/* Hero Header */}
            <div className="relative pt-20 pb-16 overflow-hidden">
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full blur-[100px] animate-blob"></div>
                    <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-orange-100/40 dark:bg-orange-900/20 rounded-full blur-[80px] animate-blob delay-2000"></div>
                </div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 text-xs font-black mb-5 tracking-wide">
                        <Briefcase size={14} />
                        {t('انضم لفريقنا', 'Join Our Team')}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 italic tracking-tight animate-fade-up">
                        {isEnglish ? (
                            <>Register as <span className="text-gradient">Instructor</span></>
                        ) : (
                            <>التسجيل <span className="text-gradient">كمدرب</span></>
                        )}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto font-medium animate-fade-up delay-100">
                        {t('شاركنا خبراتك وانضم إلى فريق مدربي شمسية المحترفين', 'Share your expertise and join the Shamsiya professional trainers team')}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-4xl -mt-4">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">

                        {/* ═══════ Section 1: Personal Info ═══════ */}
                        <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl p-8 md:p-10 border border-slate-100 dark:border-slate-700 animate-fade-up">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3 italic">
                                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center">
                                    <User className="text-emerald-600 dark:text-emerald-400" size={20} />
                                </div>
                                {t('المعلومات الشخصية', 'Personal Information')}
                            </h2>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">
                                        {t('الاسم الكامل', 'Full Name')} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className={inputClass}
                                        placeholder={t('الاسم الثلاثي', 'Your full name')}
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">
                                            {t('رقم الهاتف', 'Phone Number')} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            className={inputClass}
                                            placeholder="077xxxxxxxx"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2">
                                            {t('البريد الإلكتروني', 'Email')}
                                        </label>
                                        <input
                                            type="email"
                                            className={inputClass}
                                            placeholder="example@mail.com"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ═══════ Section 2: Experience ═══════ */}
                        <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl p-8 md:p-10 border border-slate-100 dark:border-slate-700 animate-fade-up delay-100">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3 italic">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                                    <Briefcase className="text-blue-600 dark:text-blue-400" size={20} />
                                </div>
                                {t('الخبرات العلمية والعملية', 'Scientific & Professional Experience')}
                            </h2>

                            <textarea
                                className={`${inputClass} min-h-[150px] resize-y`}
                                placeholder={t(
                                    'اكتب نبذة عن خبراتك العلمية والعملية، مثال: 10 سنوات خبرة في مجال الطاقة الشمسية...',
                                    'Describe your scientific and professional experience...'
                                )}
                                value={experience}
                                onChange={e => setExperience(e.target.value)}
                            />
                        </div>

                        {/* ═══════ Section 3: Job Titles ═══════ */}
                        <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl p-8 md:p-10 border border-slate-100 dark:border-slate-700 animate-fade-up delay-200">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3 italic">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center">
                                    <Briefcase className="text-purple-600 dark:text-purple-400" size={20} />
                                </div>
                                {t('المسميات الوظيفية', 'Job Titles')}
                            </h2>

                            <div className="space-y-3">
                                {jobTitles.map((title, i) => (
                                    <div key={i} className="flex gap-3">
                                        <input
                                            type="text"
                                            className={`${inputClass} flex-1`}
                                            placeholder={t('مثال: مهندس طاقة شمسية', 'e.g. Solar Energy Engineer')}
                                            value={title}
                                            onChange={e => updateJobTitle(i, e.target.value)}
                                        />
                                        {jobTitles.length > 1 && (
                                            <button type="button" onClick={() => removeJobTitle(i)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition">
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addJobTitle} className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-4 py-2.5 rounded-xl transition">
                                    <Plus size={16} /> {t('إضافة مسمى وظيفي', 'Add Job Title')}
                                </button>
                            </div>
                        </div>

                        {/* ═══════ Section 4: Certifications ═══════ */}
                        <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl p-8 md:p-10 border border-slate-100 dark:border-slate-700 animate-fade-up delay-200">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3 italic">
                                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center">
                                    <Award className="text-amber-600 dark:text-amber-400" size={20} />
                                </div>
                                {t('الشهادات والاعتمادات', 'Certifications & Accreditations')}
                            </h2>

                            <div className="space-y-3">
                                {certifications.map((cert, i) => (
                                    <div key={i} className="flex gap-3">
                                        <input
                                            type="text"
                                            className={`${inputClass} flex-1`}
                                            placeholder={t('مثال: شهادة PMP، شهادة OSHA...', 'e.g. PMP Certificate, OSHA...')}
                                            value={cert}
                                            onChange={e => updateCertification(i, e.target.value)}
                                        />
                                        {certifications.length > 1 && (
                                            <button type="button" onClick={() => removeCertification(i)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition">
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addCertification} className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-4 py-2.5 rounded-xl transition">
                                    <Plus size={16} /> {t('إضافة شهادة', 'Add Certification')}
                                </button>
                            </div>
                        </div>

                        {/* ═══════ Section 5: Social Links ═══════ */}
                        <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl p-8 md:p-10 border border-slate-100 dark:border-slate-700 animate-fade-up delay-200">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3 italic">
                                <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/40 rounded-xl flex items-center justify-center">
                                    <Share2 className="text-teal-600 dark:text-teal-400" size={20} />
                                </div>
                                {t('قنوات التواصل', 'Communication Channels')}
                            </h2>

                            <div className="space-y-3">
                                {socials.map((social, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row gap-3">
                                        <select
                                            className={`${inputClass} sm:w-48 cursor-pointer`}
                                            value={social.type}
                                            onChange={e => updateSocial(i, 'type', e.target.value)}
                                        >
                                            {SOCIAL_TYPES.map(st => (
                                                <option key={st.value} value={st.value}>{st.label}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            className={`${inputClass} flex-1`}
                                            placeholder={
                                                social.type === 'phone' ? '077xxxxxxxx' :
                                                    social.type === 'email' ? 'example@mail.com' :
                                                        t('الرابط أو المعرّف', 'Link or handle')
                                            }
                                            value={social.value}
                                            onChange={e => updateSocial(i, 'value', e.target.value)}
                                        />
                                        {socials.length > 1 && (
                                            <button type="button" onClick={() => removeSocial(i)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition self-center">
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addSocial} className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-4 py-2.5 rounded-xl transition">
                                    <Plus size={16} /> {t('إضافة قناة تواصل', 'Add Channel')}
                                </button>
                            </div>
                        </div>

                        {/* ═══════ Section 6: File Uploads ═══════ */}
                        <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl p-8 md:p-10 border border-slate-100 dark:border-slate-700 animate-fade-up delay-200">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3 italic">
                                <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/40 rounded-xl flex items-center justify-center">
                                    <Upload className="text-rose-600 dark:text-rose-400" size={20} />
                                </div>
                                {t('إرفاق ملفات', 'Attach Files')}
                            </h2>

                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium">
                                {t('يمكنك إرفاق صور الشهادات، السيرة الذاتية (PDF)، أو أي ملفات داعمة أخرى', 'You can attach certificate images, CV (PDF), or any other supporting documents')}
                            </p>

                            {/* Drop Zone */}
                            <div
                                className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-8 text-center cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-all group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors" />
                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                                    {t('اضغط هنا لاختيار الملفات', 'Click here to select files')}
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                    {t('صور، PDF، مستندات (حد أقصى 20 ميجابايت لكل ملف)', 'Images, PDF, documents (max 20MB per file)')}
                                </p>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*,.pdf,.doc,.docx"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            {/* Attached Files Preview */}
                            {attachments.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {attachments.map((att, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                            {att.preview ? (
                                                <img src={att.preview} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                                    {getFileIcon(att.file)}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{att.file.name}</p>
                                                <p className="text-xs text-slate-400">{formatFileSize(att.file.size)}</p>
                                            </div>
                                            <button type="button" onClick={() => removeAttachment(i)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ═══════ Submit Button ═══════ */}
                        <div className="animate-fade-up delay-300">
                            <button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/20 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                                disabled={submitLoading}
                            >
                                {submitLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {uploadProgress > 0 ? (
                                            t(`جاري رفع الملفات... ${uploadProgress}%`, `Uploading files... ${uploadProgress}%`)
                                        ) : (
                                            t('جاري الإرسال...', 'Submitting...')
                                        )}
                                    </>
                                ) : (
                                    t('إرسال طلب الانضمام', 'Submit Application')
                                )}
                            </button>

                            <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4 font-medium">
                                {t('بإرسال هذا النموذج، أنت توافق على شروط وأحكام منصة شمسية.', 'By submitting this form, you agree to Shamsiya terms and conditions.')}
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TrainerRegister;
