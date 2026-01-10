import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, Award, CheckCircle } from 'lucide-react';
import { COURSES, TESTIMONIALS } from '../constants';
import CourseCard from '../components/CourseCard';

const Home: React.FC = () => {
  const featuredCourses = COURSES.slice(0, 3);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1920" 
            alt="Students learning" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-800/80 to-primary-900/40"></div>
        </div>
        
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              طريقك الأمثل لتحقيق الوظيفة الدائمية مع <span className="text-secondary-400">شمسية</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-100 mb-8 leading-relaxed opacity-90">
              منصة شمسية الألكترونية منصة تعمل بأيادٍ عراقية وعربية، هدفها تحقيق مفهوم التنمية المستدامة (SDG).
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/courses" 
                className="px-8 py-4 bg-secondary-500 hover:bg-secondary-600 text-white text-lg font-bold rounded-xl transition shadow-lg shadow-secondary-500/30 flex items-center justify-center gap-2"
              >
                تصفح الدورات
                <ArrowLeft size={20} />
              </Link>
              <Link 
                to="/about" 
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white text-lg font-bold rounded-xl transition flex items-center justify-center"
              >
                تعرف علينا
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white relative -mt-10 z-20 shadow-sm container mx-auto px-4 rounded-xl border border-slate-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-x-reverse divide-slate-100">
          <div className="text-center">
            <div className="text-4xl font-extrabold text-primary-700 mb-2">50+</div>
            <div className="text-slate-500 font-medium">دورة تدريبية</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-primary-700 mb-2">1200+</div>
            <div className="text-slate-500 font-medium">طالب وطالبة</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-primary-700 mb-2">30+</div>
            <div className="text-slate-500 font-medium">مدرب خبير</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-primary-700 mb-2">15</div>
            <div className="text-slate-500 font-medium">شريك أكاديمي</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary-900 mb-4">لماذا تختار منصة شمسية؟</h2>
            <div className="w-20 h-1 bg-secondary-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "محتوى عالي الجودة", desc: "مناهج دراسية مصممة وفق أحدث المعايير العالمية لتلبية احتياجات سوق العمل." },
              { icon: Users, title: "نخبة المدربين", desc: "تعلم على يد خبراء وممارسين يمتلكون خبرات واقعية في مجالاتهم." },
              { icon: Award, title: "شهادات معتمدة", desc: "احصل على شهادات إتمام موثقة تعزز سيرتك الذاتية وتفتح لك آفاقاً جديدة." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition text-center">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-600">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-primary-900 mb-2">أحدث الدورات</h2>
              <p className="text-slate-500">اخترنا لك مجموعة من أفضل الدورات لبدء رحلتك التعليمية</p>
            </div>
            <Link to="/courses" className="hidden md:flex items-center text-primary-600 font-bold hover:text-primary-800 transition">
              عرض كل الدورات <ArrowLeft size={20} className="mr-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/courses" className="inline-block px-6 py-3 border-2 border-primary-600 text-primary-600 font-bold rounded-lg hover:bg-primary-50">
              عرض جميع الدورات
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-primary-900 text-white relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">قصص نجاح ملهمة</h2>
            <p className="text-primary-200">ماذا يقول طلابنا عن تجربتهم مع شمسية</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {TESTIMONIALS.map(testimonial => (
              <div key={testimonial.id} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <img src={testimonial.image} alt={testimonial.name} className="w-14 h-14 rounded-full border-2 border-secondary-500" />
                  <div>
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-primary-300 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-lg leading-relaxed italic opacity-90">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-3xl p-12 text-center text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">جاهز لبدء رحلة التعلم؟</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
                سجل الآن وانضم إلى مجتمع شمسية التعليمي، واحصل على وصول فوري لمحتوى تعليمي متميز.
              </p>
              <Link to="/contact" className="inline-block bg-white text-secondary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition shadow-lg">
                أنشئ حسابك مجاناً
              </Link>
            </div>
            {/* Decoration */}
            <CheckCircle className="absolute top-10 left-10 text-white/20 w-32 h-32" />
            <Award className="absolute bottom-10 right-10 text-white/20 w-32 h-32" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;