import React, { useState, useEffect } from 'react';
import { Target, Heart, Award, ShieldCheck, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { db } from '../lib/firebase';

interface Partner { name: string; logoUrl?: string; }

const About: React.FC = () => {
  const { t, isEnglish } = useTheme();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const pSnap = await db.collection('partners').get();
        setPartners(pSnap.docs.map(d => d.data() as Partner));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const values = [
    { icon: ShieldCheck, title: t('المصداقية', 'Integrity'), desc: t('نلتزم بأعلى معايير الشفافية والموثوقية.', 'We commit to the highest standards of transparency.'), color: 'emerald' },
    { icon: Heart, title: t('الشغف', 'Passion'), desc: t('شغفنا بالتعليم هو الدافع الرئيسي لنا.', 'Our passion for education is our main driver.'), color: 'orange' },
    { icon: Award, title: t('التميز', 'Excellence'), desc: t('لا نرضى بأقل من الجودة العالية.', 'We settle for nothing less than high quality.'), color: 'blue' },
  ];

  const missionPoints = [
    t('تقديم محتوى عربي وعراقي عالي الجودة.', 'Providing high-quality Arabic and Iraqi content.'),
    t('سد الفجوة بين التعليم الجامعي وسوق العمل.', 'Bridging the gap between education and the job market.'),
    t('دعم التعلم المستمر وتحقيق أهداف التنمية المستدامة.', 'Supporting continuous learning and SDGs.'),
  ];

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero */}
      <div className="relative pt-16 md:pt-20 pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-100/50 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-orange-100/40 rounded-full blur-[80px] animate-blob delay-2000"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-4 md:mb-6 italic tracking-tight animate-fade-up">
            {isEnglish ? (<>About <span className="text-gradient">Us</span></>) : (<>من <span className="text-gradient">نحن</span></>)}
          </h1>
          <p className="text-slate-600 text-base md:text-xl max-w-3xl mx-auto font-medium animate-fade-up delay-100 px-2">
            {t('منصة شمسية الألكترونية منصة تعمل بأيادٍ عراقية وعربية، هدفها تحقيق مفهوم التنمية المستدامة (SDG).', 'Shamsiya is an electronic platform built by Iraqi and Arab hands.')}
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-12 md:py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="animate-fade-up">
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              <div className="w-11 h-11 md:w-14 md:h-14 bg-emerald-100 rounded-xl md:rounded-2xl flex items-center justify-center">
                <Target className="text-emerald-600" size={22} />
              </div>
              <h2 className="text-xl md:text-3xl font-black text-slate-900 italic">{t('رؤيتنا ورسالتنا', 'Our Vision & Mission')}</h2>
            </div>
            <p className="text-slate-600 leading-loose text-sm md:text-lg mb-6">
              {t('نسعى لأن نكون طريقك الأمثل لتحقيق الوظيفة الدائمية من خلال توفير بيئة تعليمية تفاعلية.', 'We strive to be your optimal path to achieving permanent employment.')}
            </p>
            <ul className="space-y-3">
              {missionPoints.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700 font-medium text-sm md:text-base">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4 animate-fade-up delay-200">
            <img src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80&w=400" className="rounded-2xl md:rounded-[2rem] shadow-lg mt-6 hover:scale-105 transition duration-500" alt="Team" />
            <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=400" className="rounded-2xl md:rounded-[2rem] shadow-lg hover:scale-105 transition duration-500" alt="Office" />
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-slate-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-black text-center text-slate-900 mb-8 md:mb-12 italic animate-fade-up">
            {isEnglish ? (<>Our <span className="text-emerald-600">Core Values</span></>) : (<>قيمنا <span className="text-emerald-600">الجوهرية</span></>)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {values.map((val, idx) => {
              const colorMap: Record<string, string> = {
                emerald: 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600',
                orange: 'bg-orange-100 text-orange-600 group-hover:bg-orange-600',
                blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-600',
              };
              return (
                <div key={idx} className="group bg-white p-6 md:p-8 rounded-2xl shadow-sm text-center hover:-translate-y-2 hover:shadow-xl transition duration-300 border border-slate-100 animate-fade-up" style={{ animationDelay: `${idx * 150}ms` }}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${colorMap[val.color]} group-hover:text-white transition-all duration-300`}>
                    <val.icon size={28} />
                  </div>
                  <h3 className="text-lg font-black mb-2 text-slate-800 italic">{val.title}</h3>
                  <p className="text-slate-500 text-sm">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Partners */}
      <div className="py-12 md:py-20 container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-8 md:mb-12 italic animate-fade-up">
          {isEnglish ? (<>Success <span className="text-emerald-600">Partners</span></>) : (<>شركاء <span className="text-emerald-600">النجاح</span></>)}
        </h2>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>
        ) : partners.length > 0 ? (
          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-5 animate-fade-up delay-200">
            {partners.map((partner, idx) => (
              <div key={idx} className="flex items-center gap-2 md:gap-3 bg-white border-2 border-slate-200 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl hover:border-emerald-300 hover:shadow-lg transition duration-300 cursor-default group">
                {partner.logoUrl && <img src={partner.logoUrl} alt={partner.name} className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-lg" />}
                <span className="text-sm md:text-lg font-black text-slate-600 group-hover:text-emerald-600 transition">{partner.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 animate-fade-up delay-200">
            {[t('جامعة المستقبل', 'Future University'), 'Tech Solutions', t('معهد الإدارة', 'Management Institute')].map((p, idx) => (
              <div key={idx} className="text-sm md:text-xl font-black text-slate-400 border-2 border-slate-200 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl hover:border-emerald-300 hover:text-emerald-600 transition cursor-default">{p}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default About;