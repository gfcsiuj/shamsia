import React from 'react';
import { Target, Heart, Award, ShieldCheck } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
       {/* Hero */}
       <div className="bg-primary-900 py-20 text-white text-center">
         <div className="container mx-auto px-4">
           <h1 className="text-4xl md:text-5xl font-bold mb-6">من نحن</h1>
           <p className="text-xl text-primary-100 max-w-3xl mx-auto">
             منصة شمسية الألكترونية منصة تعمل بأيادٍ عراقية وعربية، هدفها تحقيق مفهوم التنمية المستدامة (SDG).
           </p>
         </div>
       </div>

       {/* Mission & Vision */}
       <div className="py-20 container mx-auto px-4">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
           <div>
             <div className="flex items-center gap-3 mb-4">
               <Target className="text-secondary-500" size={32} />
               <h2 className="text-3xl font-bold text-primary-900">رؤيتنا ورسالتنا</h2>
             </div>
             <p className="text-slate-600 leading-loose text-lg mb-6">
               نسعى لأن نكون طريقك الأمثل لتحقيق الوظيفة الدائمية من خلال توفير بيئة تعليمية تفاعلية تعتمد على أحدث التقنيات وأفضل الممارسات العالمية.
             </p>
             <ul className="space-y-4">
               {[
                 'تقديم محتوى عربي وعراقي عالي الجودة.',
                 'سد الفجوة بين التعليم الجامعي وسوق العمل.',
                 'دعم التعلم المستمر وتحقيق أهداف التنمية المستدامة.',
               ].map((item, idx) => (
                 <li key={idx} className="flex items-center gap-3 text-slate-700 font-medium">
                   <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
                   {item}
                 </li>
               ))}
             </ul>
           </div>
           <div className="grid grid-cols-2 gap-4">
             <img src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80&w=400" className="rounded-2xl shadow-lg mt-8" alt="Team" />
             <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=400" className="rounded-2xl shadow-lg" alt="Office" />
           </div>
         </div>
       </div>

       {/* Stats / Values */}
       <div className="bg-slate-50 py-20">
         <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-primary-900 mb-12">قيمنا الجوهرية</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: ShieldCheck, title: 'المصداقية', desc: 'نلتزم بأعلى معايير الشفافية والموثوقية في كل ما نقدمه.' },
                { icon: Heart, title: 'الشغف', desc: 'شغفنا بالتعليم هو الدافع الرئيسي لكل مبادرة نطلقها.' },
                { icon: Award, title: 'التميز', desc: 'لا نرضى بأقل من الجودة العالية في المحتوى والتقديم.' },
              ].map((val, idx) => (
                <div key={idx} className="bg-white p-8 rounded-xl shadow-sm text-center hover:-translate-y-1 transition duration-300">
                  <val.icon className="text-secondary-500 mx-auto mb-4" size={40} />
                  <h3 className="text-xl font-bold mb-3 text-slate-800">{val.title}</h3>
                  <p className="text-slate-600">{val.desc}</p>
                </div>
              ))}
            </div>
         </div>
       </div>

       {/* Partners */}
       <div className="py-20 container mx-auto px-4 text-center">
         <h2 className="text-3xl font-bold text-primary-900 mb-12">شركاء النجاح والاعتمادات</h2>
         <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Dummy Logos placeholders */}
            <div className="text-2xl font-bold text-slate-400 border-2 border-slate-200 p-4 rounded-lg">جامعة المستقبل</div>
            <div className="text-2xl font-bold text-slate-400 border-2 border-slate-200 p-4 rounded-lg">Tech Solutions</div>
            <div className="text-2xl font-bold text-slate-400 border-2 border-slate-200 p-4 rounded-lg">معهد الإدارة</div>
            <div className="text-2xl font-bold text-slate-400 border-2 border-slate-200 p-4 rounded-lg">CyberGuard</div>
         </div>
         
         <div className="mt-16 bg-primary-50 p-8 rounded-2xl inline-block max-w-4xl">
            <h3 className="text-lg font-bold text-primary-800 mb-4">الشهادات المعتمدة</h3>
            <div className="flex gap-4 justify-center">
              <div className="w-32 h-40 bg-white border border-slate-200 shadow-sm flex items-center justify-center text-xs text-slate-400">نموذج شهادة 1</div>
              <div className="w-32 h-40 bg-white border border-slate-200 shadow-sm flex items-center justify-center text-xs text-slate-400">نموذج شهادة 2</div>
            </div>
         </div>
       </div>
    </div>
  );
};

export default About;