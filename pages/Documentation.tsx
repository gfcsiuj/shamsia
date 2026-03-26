import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  BookOpen, Code2, Database, Globe, Layout, Palette, Shield, Rocket,
  Monitor, Users, Award, Calendar, MessageSquare, Settings, ClipboardList,
  GraduationCap, Search, LogIn, ChevronDown, ChevronUp, FileText, Server,
  Smartphone, Moon, Languages, Wrench, Lock, ExternalLink, Zap, Heart,
  BookMarked, Phone, Mail, MapPin, User, Instagram, Printer
} from 'lucide-react';

// ─── Section Data ───────────────────────────────────────────────────────────

const tools = [
  { name: 'Visual Studio Code', desc: 'محرر الأكواد الأساسي لكتابة جميع ملفات المشروع', icon: Code2, color: 'blue' },
  { name: 'GitHub', desc: 'إدارة الإصدارات والتحكم بالكود المصدري باستخدام Git', icon: Globe, color: 'slate' },
  { name: 'Chrome DevTools', desc: 'اختبار وتصحيح الواجهات وفحص الأداء والتجاوبية', icon: Monitor, color: 'amber' },
  { name: 'Terminal', desc: 'تشغيل أوامر التطوير والبناء والنشر', icon: Zap, color: 'purple' },
];

const languages = [
  { name: 'TypeScript (TSX)', desc: 'اللغة الأساسية لبناء كامل المشروع مع نظام أنواع صارم', color: 'blue' },
  { name: 'React 19', desc: 'المكتبة الرئيسية لبناء واجهة المستخدم بنظام المكونات', color: 'cyan' },
  { name: 'Tailwind CSS', desc: 'إطار عمل CSS لتصميم الواجهات بسرعة', color: 'teal' },
  { name: 'Vite', desc: 'أداة البناء والتطوير السريعة', color: 'purple' },
  { name: 'React Router', desc: 'إدارة التنقل بين الصفحات', color: 'red' },
  { name: 'Lucide Icons', desc: 'مكتبة أيقونات SVG حديثة وخفيفة', color: 'orange' },
];

const firebaseServices = [
  { name: 'Authentication', desc: 'نظام مصادقة آمن لتسجيل دخول المسؤولين', icon: Lock },
  { name: 'Cloud Firestore', desc: 'قاعدة بيانات NoSQL لتخزين جميع البيانات', icon: Database },
  { name: 'Storage', desc: 'تخزين الملفات والصور والوسائط المتعددة', icon: Server },
  { name: 'Analytics', desc: 'تتبع وتحليل زيارات الموقع', icon: Monitor },
];

const collections = [
  { name: 'courses', desc: 'الدورات التدريبية' },
  { name: 'instructors', desc: 'بيانات المدربين' },
  { name: 'graduates', desc: 'بيانات الخريجين' },
  { name: 'certificates', desc: 'الشهادات الصادرة' },
  { name: 'testimonials', desc: 'آراء المتدربين' },
  { name: 'calendarEntries', desc: 'التقويم الأكاديمي' },
  { name: 'registrations', desc: 'طلبات التسجيل' },
  { name: 'partners', desc: 'شركاء النجاح' },
  { name: 'site_settings', desc: 'إعدادات الموقع' },
];

const designFeatures = [
  { name: 'تصميم متجاوب', desc: 'يعمل على الهواتف والأجهزة اللوحية والحواسيب', icon: Smartphone },
  { name: 'الوضع الداكن', desc: 'دعم كامل للوضع الداكن والفاتح', icon: Moon },
  { name: 'ثنائية اللغة', desc: 'دعم العربية (RTL) والإنجليزية (LTR)', icon: Languages },
  { name: 'أنيميشن وحركات', desc: 'تأثيرات بصرية سلسة ومتحركة', icon: Zap },
  { name: 'وضع الصيانة', desc: 'إمكانية حجب الموقع مؤقتاً', icon: Wrench },
  { name: 'نظام أمان', desc: 'حماية كاملة لصفحات لوحة التحكم', icon: Shield },
];

const publicPages = [
  { name: 'الصفحة الرئيسية', path: '/', icon: Layout, desc: 'ترويسة + إحصائيات + دورات مميزة + آراء المتدربين' },
  { name: 'الدورات', path: '/courses', icon: BookOpen, desc: 'عرض وتصفية جميع الدورات المتاحة مع بحث' },
  { name: 'تفاصيل الدورة', path: '/courses/:id', icon: FileText, desc: 'الوصف والمنهج والمدربين والتسجيل' },
  { name: 'التسجيل في دورة', path: '/register', icon: ClipboardList, desc: 'نموذج تسجيل شامل للمتدربين' },
  { name: 'انضمام كمدرب', path: '/join-trainer', icon: Users, desc: 'نموذج تفصيلي لراغبي الانضمام كمدربين' },
  { name: 'المدربين والخريجين', path: '/instructors', icon: GraduationCap, desc: 'بطاقات المدربين والخريجين المميزين' },
  { name: 'التقويم', path: '/calendar', icon: Calendar, desc: 'جدول التقويم الأكاديمي بتنسيق جدولي' },
  { name: 'الشهادات', path: '/certificates', icon: Award, desc: 'عرض الشهادات الصادرة' },
  { name: 'التحقق من شهادة', path: '/verify/:id', icon: Shield, desc: 'التحقق بالرقم أو رمز QR' },
  { name: 'من نحن', path: '/about', icon: Heart, desc: 'معلومات المنصة ورؤيتها وشركاء النجاح' },
  { name: 'اتصل بنا', path: '/contact', icon: Phone, desc: 'نموذج اتصال ومعلومات التواصل' },
  { name: 'المكتبة', path: '/library', icon: BookMarked, desc: 'موارد تعليمية (مقالات، PDF، فيديو)' },
];

const adminSections = [
  { name: 'لوحة التحكم الرئيسية', icon: Layout, color: 'emerald', desc: 'الصفحة الأولى التي تظهر بعد تسجيل الدخول - نظرة شاملة على المنصة', details: [
    'تظهر رسالة "مرحباً بك، المشرف 👋" مع نظرة عامة على المنصة',
    'شريط بحث موحد: اكتب اسم أي دورة أو مدرب أو خريج وستظهر النتائج فوراً',
    '8 بطاقات كبيرة للتنقل السريع: (الدورات، المدربين، الخريجين، التسجيلات، الشهادات، الآراء، الإعدادات، التقويم)',
    'الشريط الجانبي (على اليمين في الحاسوب): يحتوي على كل الأقسام + زر "عرض الموقع" + زر "تسجيل الخروج"',
    'على الهاتف: يظهر شريط علوي مبسط مع زر تسجيل خروج',
  ] },
  { name: 'إدارة الدورات', icon: BookOpen, color: 'orange', desc: 'إضافة وتعديل وحذف الدورات التدريبية بالتفصيل الكامل', details: [
    '📋 لإضافة دورة جديدة: اضغط زر "إضافة دورة جديدة" ثم املأ النموذج التالي:',
    'العنوان: اسم الدورة (مثال: "دورة الأمن السيبراني المتقدم")',
    'الفئة: اختر من القائمة (تقنية، أمن سيبراني، تنمية بشرية، مهارات إدارية، طاقة شمسية، كهرباء، مولدات، ميكانيك، حلاقة، لغات، تأسيسات كهربائية)',
    'المستوى: مبتدئ / متوسط / متقدم',
    'السعر: أدخل الرقم بالدينار. يمكنك تفعيل "إخفاء السعر" أو كتابة نص بديل مثل "مجاناً"',
    'السعر القديم: اختياري - لعرض خط على السعر القديم (خصم)',
    '🖼️ الوسائط: أضف روابط الصور أو الفيديوهات (⚠️ لا ترفع صور مباشرة! حوّل الصورة إلى رابط من موقع top4top.io أولاً)',
    'المدربين: اختر من قائمة المدربين المسجلين مسبقاً، أو اكتب اسم المدرب يدوياً',
    'المدة: مثل "4 أسابيع" أو "40 ساعة"',
    'التواريخ: تاريخ البدء وتاريخ الانتهاء + عدد المحاضرات',
    'التقييم: من 1 إلى 5 نجوم',
    'عدد الطلاب: تلقائي (يحسب من التسجيلات) أو يدوي (تدخل الرقم بنفسك)',
    'الوسوم (Tags): كلمات مفتاحية للبحث مثل "برمجة، أمن، هاكر"',
    'الوصف المختصر + الوصف المفصل: يظهران في صفحة تفاصيل الدورة',
    'أهداف الدورة: أضف كل هدف في سطر منفصل',
    'الجمهور المستهدف: من يستفيد من هذه الدورة',
    'المنهج الدراسي: أضف أسابيع/وحدات مع عنوان + محور + نقاط تفصيلية لكل أسبوع',
    'الشهادات: اسم الشهادة التي يحصل عليها الخريج',
    'ملاحظات إضافية: أي معلومات أخرى تريد عرضها',
    '✏️ للتعديل: اضغط على زر التعديل بجانب أي دورة → عدّل الحقول → احفظ',
    '🗑️ للحذف: اضغط زر الحذف → تأكيد → يتم الحذف نهائياً',
  ] },
  { name: 'إدارة المدربين', icon: Users, color: 'green', desc: 'إضافة وتعديل وحذف بيانات المدربين مع كل تفاصيلهم', details: [
    '📋 لإضافة مدرب جديد: اضغط "إضافة مدرب" ثم املأ:',
    'الاسم الكامل + رابط الصورة الشخصية (⚠️ حوّل الصورة لرابط من top4top.io)',
    'الأدوار/التخصصات: يمكن إضافة عدة تخصصات مثل "مدرب أمن سيبراني" + "محاضر جامعي"',
    'السيرة المختصرة: جملة أو جملتين تظهر في بطاقة المدرب',
    'السيرة التفصيلية: وصف كامل يظهر عند الضغط على المدرب',
    'الشهادات والمؤهلات: أضف كل شهادة في سطر',
    'روابط التواصل: Facebook, Instagram, LinkedIn, Twitter, YouTube, Telegram, WhatsApp, بريد إلكتروني, هاتف, موقع شخصي',
    '✏️ للتعديل: اضغط على بطاقة المدرب → عدّل → احفظ',
    '🗑️ للحذف: اضغط أيقونة الحذف → تأكيد',
  ] },
  { name: 'إدارة الخريجين', icon: GraduationCap, color: 'amber', desc: 'نفس واجهة وحقول إدارة المدربين تماماً ولكن لقسم الخريجين المميزين', details: [
    'نفس نموذج المدربين بالضبط (الاسم، الصورة، التخصصات، السيرة، الشهادات، روابط التواصل)',
    'الخريجون يظهرون في صفحة "أعضاؤنا" بجانب المدربين',
    'يمكن ربط الخريجين بدورات معينة كمتخرجين منها',
    '⚠️ نفس ملاحظة الصور: استخدم top4top.io لتحويل الصور إلى روابط',
  ] },
  { name: 'إدارة التسجيلات', icon: ClipboardList, color: 'indigo', desc: 'عرض جميع طلبات التسجيل التي يرسلها المستخدمون من الموقع', details: [
    'تظهر جميع الطلبات التي أرسلها الزوار عبر نموذج التسجيل',
    'كل طلب يحتوي: اسم المتقدم، بريده الإلكتروني، رقم هاتفه، الدورة المختارة، رسالة إضافية',
    'يمكنك قبول أو رفض كل طلب بضغطة زر',
    'يمكنك حذف الطلبات القديمة أو المرفوضة',
    'يوجد بحث وتصفية للعثور على طلب معين بسرعة',
  ] },
  { name: 'إدارة الشهادات', icon: Award, color: 'yellow', desc: 'إصدار شهادات للطلاب مع رمز QR للتحقق الإلكتروني', details: [
    '📋 لإصدار شهادة جديدة: اضغط "إصدار شهادة" ثم:',
    'اكتب اسم الطالب بالكامل',
    'اختر الدورة التي أكملها من القائمة',
    'حدد تاريخ الإصدار',
    'رقم الشهادة: يُولد تلقائياً أو أدخله يدوياً',
    'رمز QR: يُنشأ تلقائياً ويمكن لأي شخص مسحه للتحقق من الشهادة عبر صفحة /verify',
    'الحالة: "صادرة" (سارية) أو "ملغاة" (تم إلغاؤها)',
    '✏️ يمكنك تعديل بيانات الشهادة أو تغيير حالتها لاحقاً',
    'الزوار يمكنهم التحقق من أي شهادة عبر رابط shamsia.org/verify/رقم-الشهادة',
  ] },
  { name: 'آراء المتدربين', icon: MessageSquare, color: 'teal', desc: 'إضافة وإدارة التقييمات التي تظهر في الصفحة الرئيسية', details: [
    '📋 لإضافة رأي متدرب: اضغط "إضافة رأي" ثم:',
    'اسم المتدرب + دوره/تخصصه (مثال: "متدرب أمن سيبراني")',
    'نص الرأي/التقييم: ما كتبه المتدرب عن تجربته',
    'رابط الصورة: (⚠️ استخدم top4top.io لتحويل الصورة)',
    'التقييم: من 1 إلى 5 نجوم',
    'حالة الظهور: "مرئي" يظهر في الرئيسية / "مخفي" لا يظهر',
    '✏️ يمكنك تعديل أي رأي أو تبديل حالته بين مرئي ومخفي',
    '⚠️ فقط الآراء المرئية (isVisible = true) تظهر في كاروسيل الصفحة الرئيسية',
  ] },
  { name: 'إدارة التقويم', icon: Calendar, color: 'cyan', desc: 'إدارة جدول الدورات والمواعيد في التقويم الأكاديمي', details: [
    '📋 لإضافة إدخال تقويم: اضغط "إضافة" ثم:',
    'اختر دورة موجودة من القائمة أو اكتب العنوان يدوياً',
    'الفئة + تاريخ البدء والانتهاء',
    'عدد المحاضرات + المدة الزمنية + اسم المدرب',
    'المكان/الموقع (مثال: "أونلاين" أو "قاعة المحاضرات")',
    'الحالة: قادمة 🔵 / جارية 🟢 / مكتملة ✅ / ملغاة ❌',
    'السعر + ملاحظات إضافية',
    'يمكنك تصفية الإدخالات حسب الحالة من أزرار الفلتر',
  ] },
  { name: 'إعدادات الموقع', icon: Settings, color: 'slate', desc: 'أهم قسم - تحكم كامل في الموقع عبر 5 تبويبات', details: [
    '🔵 تبويب "عام": اسم الموقع + اللغة الافتراضية + وصف الموقع (SEO) + رابط الشعار + رابط الأيقونة',
    '🔵 تبويب "عام" - الإحصائيات: اختر "تلقائي" (من قاعدة البيانات) أو "يدوي" (تدخل الأرقام بنفسك: الدورات، المتدربين، المدربين، الشركاء)',
    '🔵 تبويب "عام" - شركاء النجاح: أضف اسم الشريك + رابط شعاره واحذف الشركاء',
    '🟣 تبويب "المظهر": تغيير ألوان الموقع (اللون الأساسي + الثانوي + لون التمييز) مع زر استعادة الافتراضي',
    '🟣 تبويب "المظهر" - الترويسة: تغيير العنوان الرئيسي والفرعي + لونهما + حجمهما بشريط تمرير',
    '🟣 تبويب "المظهر" - التذييل: تغيير نص الحقوق + لون خلفية التذييل',
    '🟢 تبويب "التواصل": رقم الهاتف + البريد الإلكتروني + العنوان الفعلي',
    '🟢 تبويب "التواصل" - السوشيال: إدخال روابط Facebook, Instagram, LinkedIn, Twitter, YouTube, Telegram',
    '🟠 تبويب "الدورات": تشغيل/إيقاف عرض الأسعار + عدد الطلاب + التسجيل + نمط بطاقات الدورات',
    '🔴 تبويب "النظام": تفعيل/إيقاف وضع الصيانة + تخصيص رسالة الصيانة',
    '⚠️ لا تنسَ الضغط على "حفظ التغييرات" بعد كل تعديل!',
  ] },
];

// ─── Collapsible Section Component ──────────────────────────────────────────

const CollapsibleCard: React.FC<{ title: string; icon: React.ElementType; color: string; desc: string; details: string[]; defaultOpen?: boolean }> = ({ title, icon: Icon, color, desc, details, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400',
    yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
    teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400',
    cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-400',
    slate: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  };

  return (
    <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/50 overflow-hidden transition-all hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800/50">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center gap-4 p-5 text-right">
        <div className={`w-12 h-12 rounded-xl ${colorMap[color] || colorMap.slate} flex items-center justify-center shrink-0`}>
          <Icon size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-black text-slate-900 dark:text-white text-lg">{title}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
        </div>
        {isOpen ? <ChevronUp className="text-slate-400 shrink-0" size={20} /> : <ChevronDown className="text-slate-400 shrink-0" size={20} />}
      </button>
      {isOpen && (
        <div className="px-5 pb-5 animate-fade-in">
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50">
            <ul className="space-y-2.5">
              {details.map((d, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                  <span className="font-medium">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Tab Button Component ───────────────────────────────────────────────────

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ElementType; label: string; color: string }> = ({ active, onClick, icon: Icon, label, color }) => {
  const activeColors: Record<string, string> = {
    blue: 'bg-blue-600 text-white shadow-blue-200 dark:shadow-blue-900/30',
    emerald: 'bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-900/30',
    purple: 'bg-purple-600 text-white shadow-purple-200 dark:shadow-purple-900/30',
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 whitespace-nowrap ${active
        ? `${activeColors[color]} shadow-xl scale-105`
        : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );
};

// ─── Main Documentation Page ─────────────────────────────────────────────────

const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'build' | 'frontend' | 'admin' | 'developer'>('build');
  const { t, isEnglish } = useTheme();

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<title>توثيق منصة شمسية التعليمية</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Cairo', sans-serif; color: #1e293b; line-height: 1.8; padding: 40px; font-size: 13px; }
.cover { text-align: center; padding: 120px 40px; page-break-after: always; }
.cover h1 { font-size: 48px; font-weight: 900; color: #0f172a; margin-bottom: 12px; }
.cover .subtitle { font-size: 18px; color: #64748b; margin-bottom: 30px; }
.cover .url { color: #10b981; font-weight: 700; font-size: 16px; }
.cover .date { margin-top: 40px; color: #94a3b8; font-size: 13px; }
.cover .dev { margin-top: 12px; color: #64748b; font-size: 14px; font-weight: 700; }
h2 { font-size: 26px; font-weight: 900; color: #0f172a; margin: 30px 0 16px; padding-bottom: 10px; border-bottom: 3px solid #10b981; }
h3 { font-size: 18px; font-weight: 800; color: #334155; margin: 20px 0 10px; }
h4 { font-size: 15px; font-weight: 700; color: #475569; margin: 14px 0 8px; }
table { width: 100%; border-collapse: collapse; margin: 12px 0 20px; font-size: 12.5px; }
th { background: #f1f5f9; padding: 10px 14px; text-align: right; font-weight: 800; border: 1px solid #e2e8f0; color: #334155; }
td { padding: 8px 14px; border: 1px solid #e2e8f0; }
tr:nth-child(even) { background: #f8fafc; }
ul, ol { padding-right: 24px; margin: 8px 0; }
li { margin: 4px 0; }
h3, h4 { page-break-after: avoid; break-after: avoid; }
table { page-break-inside: avoid; break-inside: avoid; }
ol, ul { page-break-inside: avoid; break-inside: avoid; }
p { orphans: 3; widows: 3; }
.section { page-break-before: always; }
.section:first-of-type { page-break-before: avoid; }
.sub-section { page-break-inside: avoid; break-inside: avoid; margin-bottom: 16px; }
.warn { background: #fef2f2; border: 2px solid #fca5a5; border-radius: 10px; padding: 16px 20px; margin: 16px 0; page-break-inside: avoid; break-inside: avoid; }
.warn h4 { color: #991b1b; margin: 0 0 8px; }
.warn p, .warn li { color: #7f1d1d; font-size: 12.5px; }
.tip { background: #fffbeb; border: 2px solid #fcd34d; border-radius: 10px; padding: 16px 20px; margin: 16px 0; page-break-inside: avoid; break-inside: avoid; }
.tip li { color: #78350f; font-size: 12.5px; }
.info-box { background: #f0fdf4; border: 1px solid #86efac; border-radius: 10px; padding: 16px 20px; margin: 16px 0; page-break-inside: avoid; break-inside: avoid; }
.badge { display: inline-block; background: #e2e8f0; color: #334155; padding: 2px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; margin: 2px; }
code { background: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-family: monospace; color: #059669; }
.dev-section { background: #0f172a; color: white; border-radius: 16px; padding: 32px; margin: 20px 0; page-break-inside: avoid; break-inside: avoid; }
.dev-section h3 { color: #10b981; border: none; margin-top: 0; }
.dev-section p { color: #cbd5e1; }
.dev-section .stat { display: inline-block; text-align: center; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 24px; margin: 6px; }
.dev-section .stat b { display: block; font-size: 24px; color: #10b981; }
.dev-section .stat span { font-size: 11px; color: #94a3b8; }
hr { border: none; border-top: 1px solid #e2e8f0; margin: 24px 0; }
@media print { body { padding: 20px; } .cover { padding: 80px 20px; } }
</style>
</head>
<body>

<div class="cover">
  <h1>📖 توثيق منصة شمسية التعليمية</h1>
  <p class="subtitle">دليل شامل يوضح كيف تم بناء الموقع، وما يراه المستخدم، وكيفية إدارته بالكامل</p>
  <p class="url">🔗 https://shamsia.org</p>
  <p class="date">تم إعداد هذا التوثيق بتاريخ: 24 مارس 2026</p>
  <p class="dev">تطوير: محمد حازم أحمد الخاتوني</p>
</div>

<div class="section">
  <h2>القسم الأول: بناء الموقع والأدوات المستخدمة</h2>
  <h3>🛠️ أدوات التطوير</h3>
  <table><tr><th>الأداة</th><th>الاستخدام</th></tr>
  <tr><td><b>Visual Studio Code</b></td><td>محرر الأكواد الأساسي لكتابة جميع ملفات المشروع</td></tr>
  <tr><td><b>GitHub</b></td><td>إدارة الإصدارات والتحكم بالكود المصدري باستخدام Git</td></tr>
  <tr><td><b>Chrome DevTools</b></td><td>اختبار وتصحيح الواجهات وفحص الأداء والتجاوبية</td></tr>
  <tr><td><b>Terminal</b></td><td>تشغيل أوامر التطوير والبناء والنشر</td></tr>
  </table>

  <h3>💻 اللغات والأطر</h3>
  <table><tr><th>التقنية</th><th>الإصدار</th><th>الوظيفة</th></tr>
  <tr><td><b>TypeScript (TSX)</b></td><td>-</td><td>اللغة الأساسية لبناء كامل المشروع مع نظام أنواع صارم</td></tr>
  <tr><td><b>React</b></td><td>19.2.3</td><td>المكتبة الرئيسية لبناء واجهة المستخدم بنظام المكونات</td></tr>
  <tr><td><b>Vite</b></td><td>6.2.0</td><td>أداة البناء والتطوير السريعة</td></tr>
  <tr><td><b>Tailwind CSS</b></td><td>3.4.19</td><td>إطار عمل CSS لتصميم الواجهات بسرعة</td></tr>
  <tr><td><b>React Router</b></td><td>7.12.0</td><td>إدارة التنقل بين الصفحات</td></tr>
  <tr><td><b>Lucide Icons</b></td><td>0.562.0</td><td>مكتبة أيقونات حديثة وخفيفة</td></tr>
  </table>

  <h3>☁️ Firebase - قاعدة البيانات والخدمات السحابية</h3>
  <table><tr><th>الخدمة</th><th>الوظيفة</th></tr>
  <tr><td><b>Authentication</b></td><td>نظام مصادقة آمن لتسجيل دخول المسؤولين</td></tr>
  <tr><td><b>Cloud Firestore</b></td><td>قاعدة بيانات NoSQL لتخزين جميع البيانات</td></tr>
  <tr><td><b>Storage</b></td><td>تخزين الملفات والوسائط</td></tr>
  <tr><td><b>Analytics</b></td><td>تتبع وتحليل زيارات الموقع</td></tr>
  </table>

  <h3>🚀 Netlify - الاستضافة والنشر</h3>
  <div class="info-box">الموقع مستضاف ومنشور على <b>Netlify</b> عبر الرابط: <code>https://shamsia.org</code></div>

  <h3>📦 مجموعات البيانات في Firestore</h3>
  <table><tr><th>المجموعة</th><th>المحتوى</th></tr>
  <tr><td><code>courses</code></td><td>الدورات التدريبية</td></tr>
  <tr><td><code>instructors</code></td><td>بيانات المدربين</td></tr>
  <tr><td><code>graduates</code></td><td>بيانات الخريجين</td></tr>
  <tr><td><code>certificates</code></td><td>الشهادات الصادرة</td></tr>
  <tr><td><code>testimonials</code></td><td>آراء المتدربين</td></tr>
  <tr><td><code>calendarEntries</code></td><td>التقويم الأكاديمي</td></tr>
  <tr><td><code>registrations</code></td><td>طلبات التسجيل</td></tr>
  <tr><td><code>partners</code></td><td>شركاء النجاح</td></tr>
  <tr><td><code>site_settings</code></td><td>إعدادات الموقع العامة</td></tr>
  </table>

  <h3>🎨 ميزات التصميم</h3>
  <ul>
  <li><b>تصميم متجاوب</b>: يعمل على الهواتف والأجهزة اللوحية والحواسيب</li>
  <li><b>الوضع الداكن</b>: دعم كامل للوضع الداكن والفاتح</li>
  <li><b>ثنائية اللغة</b>: دعم العربية (RTL) والإنجليزية (LTR)</li>
  <li><b>أنيميشن وحركات</b>: تأثيرات بصرية سلسة ومتحركة</li>
  <li><b>وضع الصيانة</b>: إمكانية حجب الموقع مؤقتاً</li>
  <li><b>نظام أمان</b>: حماية كاملة لصفحات لوحة التحكم</li>
  </ul>
</div>

<div class="section">
  <h2>القسم الثاني: واجهة الموقع الرئيسية</h2>
  <h3>🧭 شريط التنقل (Navbar)</h3>
  <p>يظهر في جميع الصفحات ويحتوي على: الشعار، روابط التنقل، البحث اللحظي، زر الوضع الداكن، تبديل اللغة، وزر التسجيل. على الهاتف يتحول لقائمة منسدلة مع شريط تنقل سفلي.</p>
  <p>التبويبات: <span class="badge">الرئيسية</span><span class="badge">الدورات</span><span class="badge">التقويم</span><span class="badge">الشهادات</span><span class="badge">أعضاؤنا</span><span class="badge">من نحن</span><span class="badge">اتصل بنا</span></p>

  <h3>📄 صفحات الموقع</h3>
  <table><tr><th>الصفحة</th><th>المسار</th><th>الوصف</th></tr>
  <tr><td><b>الرئيسية</b></td><td><code>/</code></td><td>ترويسة + إحصائيات + دورات مميزة + آراء المتدربين</td></tr>
  <tr><td><b>الدورات</b></td><td><code>/courses</code></td><td>عرض وتصفية جميع الدورات مع بحث</td></tr>
  <tr><td><b>تفاصيل الدورة</b></td><td><code>/courses/:id</code></td><td>الوصف والمنهج والمدربين والتسجيل</td></tr>
  <tr><td><b>التسجيل في دورة</b></td><td><code>/register</code></td><td>نموذج تسجيل شامل للمتدربين</td></tr>
  <tr><td><b>انضمام كمدرب</b></td><td><code>/join-trainer</code></td><td>نموذج تفصيلي للراغبين بالانضمام</td></tr>
  <tr><td><b>المدربون والخريجون</b></td><td><code>/instructors</code></td><td>بطاقات المدربين والخريجين المميزين</td></tr>
  <tr><td><b>التقويم</b></td><td><code>/calendar</code></td><td>جدول التقويم الأكاديمي</td></tr>
  <tr><td><b>الشهادات</b></td><td><code>/certificates</code></td><td>عرض الشهادات الصادرة</td></tr>
  <tr><td><b>التحقق من شهادة</b></td><td><code>/verify/:id</code></td><td>التحقق بالرقم أو رمز QR</td></tr>
  <tr><td><b>من نحن</b></td><td><code>/about</code></td><td>معلومات المنصة وشركاء النجاح</td></tr>
  <tr><td><b>اتصل بنا</b></td><td><code>/contact</code></td><td>نموذج اتصال ومعلومات التواصل</td></tr>
  <tr><td><b>المكتبة</b></td><td><code>/library</code></td><td>موارد تعليمية (مقالات، PDF، فيديو)</td></tr>
  </table>

  <h3>🔗 التذييل (Footer)</h3>
  <ul>
  <li>شعار ووصف المنصة + روابط التواصل الاجتماعي</li>
  <li>روابط سريعة لجميع الصفحات + معلومات الاتصال</li>
  <li>نموذج اشتراك بالنشرة البريدية + زر واتساب عائم</li>
  </ul>
</div>

<div class="section">
  <h2>القسم الثالث: لوحة التحكم</h2>
  <h3>🔓 كيفية الدخول</h3>
  <ol>
  <li>افتح الرابط: <code>shamsia.org/admin</code></li>
  <li>أدخل البريد الإلكتروني وكلمة المرور</li>
  <li>اضغط "تسجيل الدخول" للانتقال للوحة التحكم</li>
  </ol>
  <p><b>ملاحظة:</b> فقط الحسابات المسجلة في Firebase Authentication يمكنها الدخول.</p>

  <hr>
  <h3>🏠 لوحة التحكم الرئيسية</h3>
  <ul>
  <li>رسالة "مرحباً بك، المشرف 👋" مع نظرة عامة</li>
  <li>شريط بحث موحد في الدورات والمدربين والخريجين</li>
  <li>8 بطاقات كبيرة للتنقل السريع لكل قسم</li>
  <li>شريط جانبي يحتوي كل الأقسام + عرض الموقع + تسجيل الخروج</li>
  </ul>

  <div class="sub-section">
  <h3>📚 إدارة الدورات</h3>
  <h4>لإضافة دورة جديدة:</h4>
  <ol>
  <li>اضغط زر "إضافة دورة جديدة"</li>
  <li>املأ الحقول: العنوان، الفئة، المستوى، السعر</li>
  <li>أضف روابط الوسائط (صور/فيديو) - <b>استخدم top4top.io لتحويل الصور لروابط</b></li>
  <li>اختر المدربين من القائمة أو اكتب الاسم يدوياً</li>
  <li>حدد المدة والتواريخ وعدد المحاضرات والتقييم</li>
  <li>أضف الوسوم والوصف والأهداف والجمهور المستهدف</li>
  <li>أضف المنهج الدراسي (أسابيع + محاور + نقاط)</li>
  <li>أضف الشهادات والملاحظات</li>
  <li>اضغط "حفظ"</li>
  </ol>
  <p><b>للتعديل:</b> اضغط زر التعديل بجانب الدورة → عدّل → احفظ</p>
  <p><b>للحذف:</b> اضغط زر الحذف → تأكيد</p>
  </div>

  <div class="sub-section">
  <h3>👥 إدارة المدربين</h3>
  <h4>لإضافة مدرب:</h4>
  <ol>
  <li>اضغط "إضافة مدرب"</li>
  <li>أدخل الاسم + رابط الصورة (من top4top.io)</li>
  <li>أضف التخصصات والسيرة المختصرة والتفصيلية</li>
  <li>أضف الشهادات والمؤهلات</li>
  <li>أضف روابط التواصل (Facebook, Instagram, LinkedIn, Twitter, YouTube, Telegram, WhatsApp, بريد، هاتف، موقع)</li>
  <li>اضغط "حفظ"</li>
  </ol>
  </div>

  <div class="sub-section">
  <h3>🎓 إدارة الخريجين</h3>
  <p>نفس واجهة وحقول إدارة المدربين تماماً ولكن لقسم الخريجين المميزين.</p>
  </div>

  <div class="sub-section">
  <h3>📋 إدارة التسجيلات</h3>
  <ul>
  <li>عرض جميع طلبات التسجيل من الزوار</li>
  <li>تفاصيل كل طلب: الاسم، البريد، الهاتف، الدورة، الرسالة</li>
  <li>قبول / رفض / حذف الطلبات</li>
  </ul>
  </div>

  <div class="sub-section">
  <h3>🏅 إدارة الشهادات</h3>
  <h4>لإصدار شهادة:</h4>
  <ol>
  <li>اضغط "إصدار شهادة"</li>
  <li>أدخل اسم الطالب + اختر الدورة + تاريخ الإصدار</li>
  <li>رقم الشهادة يُولد تلقائياً أو أدخله يدوياً</li>
  <li>رمز QR يُنشأ تلقائياً للتحقق</li>
  <li>الحالة: صادرة أو ملغاة</li>
  </ol>
  <p>التحقق: <code>shamsia.org/verify/رقم-الشهادة</code></p>
  </div>

  <div class="sub-section">
  <h3>💬 آراء المتدربين</h3>
  <h4>لإضافة رأي:</h4>
  <ol>
  <li>اضغط "إضافة رأي"</li>
  <li>أدخل الاسم + التخصص + نص الرأي + رابط الصورة</li>
  <li>حدد التقييم (1-5 نجوم) وحالة الظهور (مرئي/مخفي)</li>
  </ol>
  <p><b>ملاحظة:</b> فقط الآراء المرئية تظهر في الصفحة الرئيسية.</p>
  </div>

  <div class="sub-section">
  <h3>📅 إدارة التقويم</h3>
  <h4>لإضافة إدخال:</h4>
  <ol>
  <li>اختر دورة أو اكتب العنوان يدوياً</li>
  <li>حدد الفئة + التواريخ + المحاضرات + المدة + المدرب + المكان</li>
  <li>اختر الحالة: قادمة / جارية / مكتملة / ملغاة</li>
  <li>أدخل السعر والملاحظات</li>
  </ol>
  </div>

  <div class="sub-section">
  <h3>⚙️ إعدادات الموقع (5 تبويبات)</h3>
  <table><tr><th>التبويب</th><th>المحتوى</th></tr>
  <tr><td><b>🔵 عام</b></td><td>اسم الموقع + اللغة + الوصف + الشعار + الأيقونة + الإحصائيات (تلقائي/يدوي) + شركاء النجاح</td></tr>
  <tr><td><b>🟣 المظهر</b></td><td>ألوان الهوية + ترويسة الموقع (العنوان/اللون/الحجم) + التذييل</td></tr>
  <tr><td><b>🟢 التواصل</b></td><td>الهاتف + البريد + العنوان + روابط السوشيال ميديا</td></tr>
  <tr><td><b>🟠 الدورات</b></td><td>عرض الأسعار + عدد الطلاب + التسجيل + نمط البطاقات</td></tr>
  <tr><td><b>🔴 النظام</b></td><td>وضع الصيانة + رسالة الصيانة</td></tr>
  </table>
  </div>

  <div class="warn">
  <h4>⚠️ ملاحظة مهمة جداً حول الصور</h4>
  <p><b>لا ترفع الصور كملفات إلى Firebase Storage</b> لأنها تأخذ مساحة تخزين كبيرة جداً!</p>
  <p><b>الطريقة الصحيحة:</b></p>
  <ol>
  <li>اذهب إلى موقع <b>top4top.io</b></li>
  <li>ارفع الصورة هناك (مجاني وسريع)</li>
  <li>انسخ رابط الصورة المباشر</li>
  <li>الصق الرابط في حقل الصورة في لوحة التحكم</li>
  </ol>
  <p>ينطبق على: صور الدورات، المدربين، الخريجين، الآراء، الشعار، وأي صورة أخرى.</p>
  </div>

  <div class="tip">
  <h4>💡 نصائح مهمة للمسؤول</h4>
  <ul>
  <li>لا تنسَ حفظ التغييرات بعد كل تعديل</li>
  <li>استخدم وضع الصيانة عند التحديثات الكبيرة</li>
  <li>تأكد من صحة روابط الصور (HTTPS)</li>
  <li>الآراء المخفية لن تظهر في الرئيسية</li>
  <li>يمكنك الدخول للوحة التحكم حتى أثناء الصيانة</li>
  </ul>
  </div>
</div>

<div class="section">
  <h2>القسم الرابع: المطور</h2>
  <div class="dev-section">
  <h3>محمد حازم أحمد الخاتوني</h3>
  <p style="margin: 8px 0"><span class="badge" style="background:#10b981;color:white">مطور مستقل</span> <span class="badge" style="background:#3b82f6;color:white">الموصل، العراق</span></p>
  <p style="margin: 12px 0">مطور ويب مستقل بعمر 17 سنة. بدأ مسيرته عام 2020 وأنجز ما يقارب 10 مواقع لشركات مختلفة. يسعى دائماً لتقديم حلول رقمية عصرية ومبتكرة.</p>
  <div style="margin: 16px 0">
    <div class="stat"><b>2020</b><span>بداية المسيرة</span></div>
    <div class="stat"><b>+10</b><span>مواقع منجزة</span></div>
    <div class="stat"><b>17</b><span>سنة</span></div>
  </div>
  <h4 style="color: #e2e8f0; margin-top: 16px">قنوات التواصل:</h4>
  <ul style="color: #94a3b8">
  <li>انستغرام: <b style="color:white">instagram.com/tiipf</b></li>
  <li>واتساب: <b style="color:white" dir="ltr">+964 777 182 1250</b></li>
  <li>فيسبوك: <b style="color:white">facebook.com/mohammed.al.ahmed.23957</b></li>
  </ul>
  </div>
</div>

<div style="text-align:center; margin-top: 40px; padding: 20px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px;">
  <p>منصة شمسية التعليمية © 2026 - جميع الحقوق محفوظة</p>
</div>

</body>
</html>`);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Header */}
      <section className="relative pt-32 pb-16 lg:pt-44 lg:pb-28 overflow-hidden px-4">
        {/* Backgrounds */}
        <div className="absolute inset-0 -z-20 bg-grid-pattern dark:bg-grid-pattern-dark bg-[length:32px_32px] opacity-30"></div>
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-900"></div>
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-blue-200/30 rounded-full blur-[120px] animate-blob"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[100px] animate-blob delay-2000"></div>
        </div>

        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-blue-700 dark:text-blue-400 text-xs font-black mb-8 tracking-wide">
            <FileText size={14} />
            {t('التوثيق الرسمي', 'Official Documentation')}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight italic leading-tight">
            {isEnglish ? (
              <>Shamsia Platform <br /><span className="text-gradient">Documentation</span></>
            ) : (
              <>توثيق منصة <br /><span className="text-gradient">شمسية</span> التعليمية</>
            )}
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed mb-4">
            {t(
              'دليل شامل يوضح كيف تم بناء الموقع، وما يراه المستخدم، وكيفية إدارته بالكامل',
              'A comprehensive guide explaining how the site was built, what the user sees, and how to manage it'
            )}
          </p>
          <a href="https://shamsia.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm hover:underline">
            <ExternalLink size={16} />
            shamsia.org
          </a>
          <div className="mt-6">
            <button onClick={handlePrint} className="inline-flex items-center gap-2.5 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
              <Printer size={18} />
              {t('طباعة / تحويل إلى PDF', 'Print / Export PDF')}
            </button>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-[60px] lg:top-[72px] z-40 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-4 py-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex gap-3 overflow-x-auto pb-1 justify-start sm:justify-center">
            <TabButton active={activeSection === 'build'} onClick={() => setActiveSection('build')} icon={Code2} label={t('بناء الموقع', 'Building')} color="blue" />
            <TabButton active={activeSection === 'frontend'} onClick={() => setActiveSection('frontend')} icon={Monitor} label={t('واجهة المستخدم', 'Frontend')} color="emerald" />
            <TabButton active={activeSection === 'admin'} onClick={() => setActiveSection('admin')} icon={Shield} label={t('لوحة التحكم', 'Admin Panel')} color="purple" />
            <TabButton active={activeSection === 'developer'} onClick={() => setActiveSection('developer')} icon={User} label={t('المطور', 'Developer')} color="blue" />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-20 px-4">
        <div className="container mx-auto max-w-5xl">

          {/* ═══════════ Section 1: Building ═══════════ */}
          {activeSection === 'build' && (
            <div className="space-y-12 animate-fade-up">
              {/* Tools */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
                    <Wrench size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white italic tracking-tight">{t('أدوات التطوير', 'Development Tools')}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('الأدوات المستخدمة في بناء المشروع', 'Tools used to build the project')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tools.map((tool) => (
                    <div key={tool.name} className="flex items-center gap-4 bg-white dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800/50 transition-all group">
                      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <tool.icon size={22} />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 dark:text-white">{tool.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{tool.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages & Frameworks */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center">
                    <Code2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white italic tracking-tight">{t('اللغات والأطر', 'Languages & Frameworks')}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('التقنيات الأساسية المستخدمة', 'Core technologies used')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {languages.map((lang) => {
                    const colorMap: Record<string, string> = {
                      blue: 'border-blue-200 dark:border-blue-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20',
                      cyan: 'border-cyan-200 dark:border-cyan-800/50 hover:bg-cyan-50 dark:hover:bg-cyan-900/20',
                      teal: 'border-teal-200 dark:border-teal-800/50 hover:bg-teal-50 dark:hover:bg-teal-900/20',
                      purple: 'border-purple-200 dark:border-purple-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20',
                      red: 'border-red-200 dark:border-red-800/50 hover:bg-red-50 dark:hover:bg-red-900/20',
                      orange: 'border-orange-200 dark:border-orange-800/50 hover:bg-orange-50 dark:hover:bg-orange-900/20',
                    };
                    return (
                      <div key={lang.name} className={`bg-white dark:bg-slate-800/60 p-5 rounded-2xl border ${colorMap[lang.color]} transition-all text-center`}>
                        <h4 className="font-black text-slate-900 dark:text-white mb-1 text-sm lg:text-base">{lang.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{lang.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Firebase Services */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center">
                    <Database size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white italic tracking-tight">{t('Firebase - قاعدة البيانات', 'Firebase - Database')}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('خدمات Google السحابية المستخدمة', 'Google cloud services used')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {firebaseServices.map((s) => (
                    <div key={s.name} className="flex items-center gap-4 bg-white dark:bg-slate-800/60 p-5 rounded-2xl border border-amber-100 dark:border-amber-800/30 hover:shadow-lg transition-all">
                      <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
                        <s.icon size={22} />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 dark:text-white">{s.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Netlify Hosting */}
                <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-6 rounded-2xl text-white flex items-center gap-4 shadow-xl mb-8">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                    <Rocket size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-lg">{t('Netlify - الاستضافة والنشر', 'Netlify - Hosting & Deployment')}</h4>
                    <p className="text-teal-100 text-sm font-medium">{t('الموقع مستضاف ومنشور على', 'Website hosted and deployed on')} <a href="https://shamsia.org" target="_blank" rel="noopener noreferrer" className="underline font-bold text-white">shamsia.org</a></p>
                  </div>
                </div>

                {/* Collections */}
                <h3 className="font-black text-lg text-slate-900 dark:text-white mb-4">{t('مجموعات البيانات في Firestore', 'Firestore Collections')}</h3>
                <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/50 overflow-hidden">
                  {collections.map((c, i) => (
                    <div key={c.name} className={`flex items-center gap-4 px-5 py-3.5 ${i < collections.length - 1 ? 'border-b border-slate-100 dark:border-slate-700/50' : ''} hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors`}>
                      <code className="text-xs bg-slate-100 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg font-bold text-emerald-700 dark:text-emerald-400 font-mono whitespace-nowrap">{c.name}</code>
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{c.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Design Features */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
                    <Palette size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white italic tracking-tight">{t('ميزات التصميم', 'Design Features')}</h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {designFeatures.map((f) => (
                    <div key={f.name} className="bg-white dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 text-center hover:shadow-lg transition-all group">
                      <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <f.icon size={22} />
                      </div>
                      <h4 className="font-black text-slate-900 dark:text-white text-sm mb-1">{f.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══════════ Section 2: Frontend ═══════════ */}
          {activeSection === 'frontend' && (
            <div className="space-y-12 animate-fade-up">
              {/* Navbar */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-8 lg:p-10 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDRtLTQgNGg0bS00IDRoNE00MCAxNGg0bS00IDRoNG0tNCA0aDQiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl lg:text-4xl font-black mb-4 italic tracking-tight">{t('🧭 شريط التنقل (Navbar)', '🧭 Navigation Bar')}</h2>
                  <p className="text-emerald-100 font-medium mb-6 max-w-2xl text-sm lg:text-base">{t('يظهر في جميع صفحات الموقع ويحتوي على الشعار، روابط التنقل، البحث اللحظي، زر الوضع الداكن، تبديل اللغة، وزر التسجيل. على الهاتف يتحول لقائمة منسدلة مع تنقل سفلي.', 'Appears on all pages with logo, nav links, live search, dark mode, language toggle, and register button. On mobile it becomes a dropdown with bottom nav.')}</p>
                  <div className="flex flex-wrap gap-2">
                    {['الرئيسية', 'الدورات', 'التقويم', 'الشهادات', 'أعضاؤنا', 'من نحن', 'اتصل بنا'].map((item) => (
                      <span key={item} className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-bold border border-white/10">{item}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Public Pages */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white italic tracking-tight">{t('صفحات الموقع', 'Website Pages')}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('12 صفحة رئيسية يراها المستخدم', '12 main pages visible to users')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {publicPages.map((page) => (
                    <div key={page.name} className="flex items-start gap-4 bg-white dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-all group">
                      <div className="w-11 h-11 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform mt-0.5">
                        <page.icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-black text-slate-900 dark:text-white">{page.name}</h4>
                          <code className="text-[10px] bg-slate-100 dark:bg-slate-900/50 px-2 py-0.5 rounded font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">{page.path}</code>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{page.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer & WhatsApp */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 dark:bg-slate-800 p-6 rounded-2xl text-white">
                  <h3 className="font-black text-lg mb-3 flex items-center gap-2"><Layout size={20} /> {t('التذييل (Footer)', 'Footer')}</h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{t('شعار ووصف المنصة', 'Logo & platform description')}</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{t('روابط التواصل الاجتماعي', 'Social media links')}</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{t('روابط سريعة + معلومات الاتصال', 'Quick links + contact info')}</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{t('نموذج اشتراك بالنشرة البريدية', 'Newsletter subscription form')}</li>
                  </ul>
                </div>
                <div className="bg-emerald-600 p-6 rounded-2xl text-white">
                  <h3 className="font-black text-lg mb-3 flex items-center gap-2"><MessageSquare size={20} /> {t('زر واتساب العائم', 'Floating WhatsApp')}</h3>
                  <p className="text-sm text-emerald-100 font-medium">{t('زر دائري أخضر ثابت في الزاوية السفلية اليسرى، يفتح محادثة واتساب مباشرة مع المنصة ويظهر في جميع الصفحات.', 'Fixed green circular button in the bottom-left corner. Opens a direct WhatsApp chat and appears on all pages.')}</p>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════ Section 3: Admin Panel ═══════════ */}
          {activeSection === 'admin' && (
            <div className="space-y-12 animate-fade-up">
              {/* Login Instructions */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 lg:p-10 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0aDRtLTQgNGg0bS00IDRoNE00MCAxNGg0bS00IDRoNG0tNCA0aDQiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                      <LogIn size={28} />
                    </div>
                    <h2 className="text-2xl lg:text-4xl font-black italic tracking-tight">{t('🔓 كيفية الدخول', '🔓 How to Login')}</h2>
                  </div>
                  <div className="space-y-3 text-sm lg:text-base font-medium text-purple-100">
                    <p className="flex items-center gap-3"><span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-black text-white shrink-0">1</span>{t('افتح الرابط', 'Open')} <code className="bg-white/10 px-3 py-1 rounded-lg text-white font-bold">shamsia.org/admin</code></p>
                    <p className="flex items-center gap-3"><span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-black text-white shrink-0">2</span>{t('أدخل البريد الإلكتروني وكلمة المرور', 'Enter email and password')}</p>
                    <p className="flex items-center gap-3"><span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-black text-white shrink-0">3</span>{t('اضغط "تسجيل الدخول" للانتقال للوحة التحكم', 'Click "Login" to enter the dashboard')}</p>
                  </div>
                </div>
              </div>

              {/* Admin Sections */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center">
                    <Settings size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white italic tracking-tight">{t('أقسام لوحة التحكم', 'Admin Panel Sections')}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('اضغط على أي قسم لعرض التفاصيل', 'Click any section for details')}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {adminSections.map((section, i) => (
                    <CollapsibleCard
                      key={section.name}
                      title={section.name}
                      icon={section.icon}
                      color={section.color}
                      desc={section.desc}
                      details={section.details}
                      defaultOpen={i === 0}
                    />
                  ))}
                </div>
              </div>

              {/* Image Hosting Warning */}
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800/50 p-6 lg:p-8 rounded-2xl">
                <h3 className="font-black text-lg text-red-800 dark:text-red-300 mb-3 flex items-center gap-2">⚠️ {t('ملاحظة مهمة جداً حول الصور', 'Very Important Note About Images')}</h3>
                <div className="space-y-3 text-sm text-red-700 dark:text-red-300/80 font-medium">
                  <p>{t('لا ترفع الصور كملفات إلى Firebase Storage لأنها تأخذ مساحة تخزين كبيرة جداً وقد تنفد المساحة المجانية بسرعة!', 'Do not upload images as files to Firebase Storage as it takes too much storage space!')}</p>
                  <p className="font-black text-red-900 dark:text-red-200">{t('الطريقة الصحيحة:', 'Correct method:')}</p>
                  <ol className="list-decimal list-inside space-y-2 pr-2">
                    <li>{t('اذهب إلى موقع', 'Go to')} <a href="https://top4top.io" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 underline font-black hover:text-red-800">top4top.io</a></li>
                    <li>{t('ارفع الصورة هناك (مجاني وسريع)', 'Upload the image there (free and fast)')}</li>
                    <li>{t('بعد الرفع، انسخ رابط الصورة المباشر', 'After upload, copy the direct image link')}</li>
                    <li>{t('الصق الرابط في حقل الصورة في لوحة التحكم', 'Paste the link in the image field in the admin panel')}</li>
                  </ol>
                  <p className="text-xs text-red-500 dark:text-red-400/70 mt-2">{t('ينطبق هذا على: صور الدورات، صور المدربين، صور الخريجين، صور آراء المتدربين، الشعار، وأي صورة أخرى', 'This applies to: course images, instructor photos, graduate photos, testimonial photos, logo, and any other image')}</p>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 p-6 lg:p-8 rounded-2xl">
                <h3 className="font-black text-lg text-amber-900 dark:text-amber-300 mb-4 flex items-center gap-2">💡 {t('نصائح مهمة للمسؤول', 'Important Admin Tips')}</h3>
                <ul className="space-y-3 text-sm text-amber-800 dark:text-amber-300/80 font-medium">
                  <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>{t('لا تنسَ حفظ التغييرات بعد كل تعديل في الإعدادات', "Don't forget to save changes after editing settings")}</li>
                  <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>{t('استخدم وضع الصيانة عند إجراء تحديثات كبيرة', 'Use maintenance mode during major updates')}</li>
                  <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>{t('تأكد من صحة روابط الصور قبل حفظها (HTTPS)', 'Verify image URLs before saving (HTTPS)')}</li>
                  <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>{t('آراء المتدربين المخفية لن تظهر في الصفحة الرئيسية', 'Hidden testimonials will not appear on the homepage')}</li>
                  <li className="flex items-start gap-3"><span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>{t('يمكنك الوصول للوحة التحكم حتى أثناء وضع الصيانة', 'You can access the admin panel even in maintenance mode')}</li>
                </ul>
              </div>
            </div>
          )}
          {/* ═══════════ Section 4: Developer ═══════════ */}
          {activeSection === 'developer' && (
            <div className="space-y-8 animate-fade-up">
              {/* Developer Card */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 lg:p-12 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-[-30%] right-[-20%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px]"></div>
                  <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px]"></div>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-black border border-emerald-500/30">{t('مطور مستقل', 'Freelance Developer')}</span>
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-black border border-blue-500/30">{t('الموصل، العراق', 'Mosul, Iraq')}</span>
                  </div>
                  <h2 className="text-3xl lg:text-5xl font-black mb-4 italic tracking-tight">{t('محمد حازم أحمد', 'Mohammed Hazem Ahmed')}</h2>
                  <h3 className="text-xl lg:text-2xl font-bold text-slate-300 mb-6">{t('الخاتوني', 'Al-Khatooni')}</h3>
                  <p className="text-slate-300 font-medium leading-relaxed max-w-2xl text-sm lg:text-base mb-8">
                    {t(
                      'مطور ويب مستقل من الموصل، العراق بعمر 17 سنة. بدأ مسيرته في مجال التطوير عام 2020 وعمل على عدد من المشاريع لشركات وأفراد مختلفين. تم إنجاز ما يقارب 10 مواقع ويب لشركات مختلفة. يسعى دائماً لتقديم حلول رقمية عصرية ومبتكرة تلبي احتياجات العملاء بأعلى جودة.',
                      'A freelance web developer from Mosul, Iraq, aged 17. Started his development journey in 2020 and has worked on numerous projects for various companies and individuals. Approximately 10 websites have been completed for different companies. He strives to deliver modern and innovative digital solutions that meet client needs with the highest quality.'
                    )}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
                      <p className="text-3xl font-black text-emerald-400">2020</p>
                      <p className="text-xs text-slate-400 font-bold mt-1">{t('بداية المسيرة', 'Career Start')}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
                      <p className="text-3xl font-black text-blue-400">+10</p>
                      <p className="text-xs text-slate-400 font-bold mt-1">{t('مواقع منجزة', 'Websites Built')}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
                      <p className="text-3xl font-black text-amber-400">17</p>
                      <p className="text-xs text-slate-400 font-bold mt-1">{t('سنة', 'Years Old')}</p>
                    </div>
                  </div>

                  {/* Contact Links */}
                  <h4 className="font-black text-lg mb-4 text-white">{t('قنوات التواصل', 'Contact Channels')}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <a href="https://www.instagram.com/tiipf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-gradient-to-r from-pink-600/20 to-purple-600/20 hover:from-pink-600/30 hover:to-purple-600/30 p-4 rounded-xl border border-pink-500/20 transition-all group">
                      <Instagram size={22} className="text-pink-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="text-xs text-slate-400">{t('انستغرام', 'Instagram')}</p>
                        <p className="text-sm font-black text-white">@tiipf</p>
                      </div>
                    </a>
                    <a href="https://wa.me/9647771821250" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-emerald-600/20 hover:bg-emerald-600/30 p-4 rounded-xl border border-emerald-500/20 transition-all group">
                      <Phone size={22} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="text-xs text-slate-400">{t('واتساب', 'WhatsApp')}</p>
                        <p className="text-sm font-black text-white" dir="ltr">+964 777 182 1250</p>
                      </div>
                    </a>
                    <a href="https://www.facebook.com/mohammed.al.ahmed.23957" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-blue-600/20 hover:bg-blue-600/30 p-4 rounded-xl border border-blue-500/20 transition-all group">
                      <Globe size={22} className="text-blue-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="text-xs text-slate-400">{t('فيسبوك', 'Facebook')}</p>
                        <p className="text-sm font-black text-white">Mohammed</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Footer */}
      <section className="py-10 text-center border-t border-slate-100 dark:border-slate-800 px-4">
        <p className="text-sm text-slate-400 dark:text-slate-500 font-bold">
          {t('تم إعداد هذا التوثيق بتاريخ 24 مارس 2026', 'Documentation prepared on March 24, 2026')}
        </p>
        <p className="text-xs text-slate-300 dark:text-slate-600 font-bold mt-2">
          {t('منصة شمسية التعليمية © 2026 - جميع الحقوق محفوظة', 'Shamsia Educational Platform © 2026 - All Rights Reserved')}
        </p>
      </section>
    </div>
  );
};

export default Documentation;
