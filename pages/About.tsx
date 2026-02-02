import React from 'react';
import { Target, Heart, Award, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const About: React.FC = () => {
  const { t, isEnglish } = useTheme();

  const values = [
    {
      icon: ShieldCheck,
      title: t('المصداقية', 'Integrity'),
      desc: t('نلتزم بأعلى معايير الشفافية والموثوقية في كل ما نقدمه.', 'We commit to the highest standards of transparency and reliability in everything we offer.'),
      color: 'emerald'
    },
    {
      icon: Heart,
      title: t('الشغف', 'Passion'),
      desc: t('شغفنا بالتعليم هو الدافع الرئيسي لكل مبادرة نطلقها.', 'Our passion for education is the main driver behind every initiative we launch.'),
      color: 'orange'
    },
    {
      icon: Award,
      title: t('التميز', 'Excellence'),
      desc: t('لا نرضى بأقل من الجودة العالية في المحتوى والتقديم.', 'We settle for nothing less than high quality in content and delivery.'),
      color: 'blue'
    },
  ];

  const missionPoints = [
    t('تقديم محتوى عربي وعراقي عالي الجودة.', 'Providing high-quality Arabic and Iraqi content.'),
    t('سد الفجوة بين التعليم الجامعي وسوق العمل.', 'Bridging the gap between university education and the job market.'),
    t('دعم التعلم المستمر وتحقيق أهداف التنمية المستدامة.', 'Supporting continuous learning and achieving sustainable development goals.'),
  ];

  const partners = [
    t('جامعة المستقبل', 'Future University'),
    'Tech Solutions',
    t('معهد الإدارة', 'Management Institute'),
    'CyberGuard'
  ];

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero - New Emerald Design */}
      <div className="relative pt-20 pb-24 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-orange-100/40 rounded-full blur-[80px] animate-blob delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 italic tracking-tight animate-fade-up">
            {isEnglish ? (
              <>About <span className="text-gradient">Us</span></>
            ) : (
              <>من <span className="text-gradient">نحن</span></>
            )}
          </h1>
          <p className="text-slate-600 text-lg md:text-xl max-w-3xl mx-auto font-medium animate-fade-up delay-100">
            {t(
              'منصة شمسية الألكترونية منصة تعمل بأيادٍ عراقية وعربية، هدفها تحقيق مفهوم التنمية المستدامة (SDG).',
              'Shamsiya is an electronic platform built by Iraqi and Arab hands, aiming to achieve the concept of Sustainable Development Goals (SDG).'
            )}
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <Target className="text-emerald-600" size={28} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 italic">
                {t('رؤيتنا ورسالتنا', 'Our Vision & Mission')}
              </h2>
            </div>
            <p className="text-slate-600 leading-loose text-lg mb-8">
              {t(
                'نسعى لأن نكون طريقك الأمثل لتحقيق الوظيفة الدائمية من خلال توفير بيئة تعليمية تفاعلية تعتمد على أحدث التقنيات وأفضل الممارسات العالمية.',
                'We strive to be your optimal path to achieving permanent employment by providing an interactive learning environment based on the latest technologies and best global practices.'
              )}
            </p>
            <ul className="space-y-4">
              {missionPoints.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-700 font-medium">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4 animate-fade-up delay-200">
            <img src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80&w=400" className="rounded-[2rem] shadow-lg mt-8 hover:scale-105 transition duration-500" alt="Team" />
            <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=400" className="rounded-[2rem] shadow-lg hover:scale-105 transition duration-500" alt="Office" />
          </div>
        </div>
      </div>

      {/* Values - With Emerald Theme */}
      <div className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-center text-slate-900 mb-12 italic animate-fade-up">
            {isEnglish ? (
              <>Our <span className="text-emerald-600">Core Values</span></>
            ) : (
              <>قيمنا <span className="text-emerald-600">الجوهرية</span></>
            )}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, idx) => {
              const colorMap: { [key: string]: string } = {
                emerald: 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600',
                orange: 'bg-orange-100 text-orange-600 group-hover:bg-orange-600',
                blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-600',
              };
              return (
                <div key={idx} className="group bg-white p-8 rounded-[2rem] shadow-sm text-center hover:-translate-y-2 hover:shadow-xl transition duration-300 border border-slate-100 animate-fade-up" style={{ animationDelay: `${idx * 150}ms` }}>
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${colorMap[val.color]} group-hover:text-white transition-all duration-300`}>
                    <val.icon size={32} />
                  </div>
                  <h3 className="text-xl font-black mb-3 text-slate-800 italic">{val.title}</h3>
                  <p className="text-slate-500">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Partners */}
      <div className="py-20 container mx-auto px-4 text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-12 italic animate-fade-up">
          {isEnglish ? (
            <>Success <span className="text-emerald-600">Partners</span></>
          ) : (
            <>شركاء <span className="text-emerald-600">النجاح</span></>
          )}
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8 animate-fade-up delay-200">
          {partners.map((partner, idx) => (
            <div key={idx} className="text-xl font-black text-slate-400 border-2 border-slate-200 px-6 py-4 rounded-2xl hover:border-emerald-300 hover:text-emerald-600 transition duration-300 cursor-default">
              {partner}
            </div>
          ))}
        </div>

        <div className="mt-16 bg-emerald-50 p-10 rounded-[2rem] inline-block max-w-4xl border border-emerald-100 animate-fade-up delay-300">
          <h3 className="text-lg font-black text-emerald-800 mb-6 italic">
            {t('الشهادات المعتمدة', 'Accredited Certificates')}
          </h3>
          <div className="flex gap-4 justify-center">
            <div className="w-32 h-40 bg-white border border-emerald-200 shadow-sm rounded-xl flex items-center justify-center text-xs text-slate-400 hover:shadow-lg hover:border-emerald-300 transition">
              {t('نموذج شهادة 1', 'Certificate 1')}
            </div>
            <div className="w-32 h-40 bg-white border border-emerald-200 shadow-sm rounded-xl flex items-center justify-center text-xs text-slate-400 hover:shadow-lg hover:border-emerald-300 transition">
              {t('نموذج شهادة 2', 'Certificate 2')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;