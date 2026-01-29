
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, Award, CheckCircle, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import { TESTIMONIALS } from '../constants';
import CourseCard from '../components/CourseCard';
import { useTheme } from '../context/ThemeContext';
import { db } from '../lib/firebase';
import { Course } from '../types';

// Simple CountUp Component for animation
const CountUp = ({ end, duration = 2000, suffix = '' }: { end: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easeOut = (x: number): number => {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
      };

      setCount(Math.floor(easeOut(percentage) * end));

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  return <span className="tabular-nums">{count}{suffix}</span>;
};

const Home: React.FC = () => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const { settings } = useTheme();

  // جلب أحدث 3 دورات من قاعدة البيانات
  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const querySnapshot = await db.collection('courses').limit(3).get();
        const coursesData = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        } as Course));
        
        setFeaturedCourses(coursesData);
      } catch (error) {
        console.error("Error fetching featured courses:", error);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  return (
    <div className="animate-fade-in bg-slate-50">
      {/* Hero Section */}
      <section className="relative min-h-[500px] lg:h-[600px] flex items-center overflow-hidden py-16 lg:py-0">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1920" 
            alt="Students learning" 
            className="w-full h-full object-cover animate-scale-in"
          />
          {/* Enhanced Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-900/90 to-primary-800/60 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-4xl text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6 animate-fade-in-up">
                <Sparkles size={16} className="text-secondary-400" />
                <span className="text-sm font-medium text-white/90">مستقبل التعليم الرقمي في العراق</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight animate-fade-in-up tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary-100 block mb-2">{settings.siteName || 'شمسية'}</span>
              <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white block mt-2">{settings.heroTitle}</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-primary-50 mb-10 leading-relaxed max-w-2xl animate-fade-in-up delay-100 font-light">
              {settings.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-200">
              <Link 
                to="/courses" 
                className="px-8 py-4 bg-secondary-500 hover:bg-secondary-600 text-white text-lg font-bold rounded-xl transition shadow-xl shadow-secondary-500/20 flex items-center justify-center gap-3 transform hover:-translate-y-1"
              >
                تصفح الدورات
                <ArrowLeft size={20} />
              </Link>
              <Link 
                to="/about" 
                className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/20 text-white text-lg font-bold rounded-xl transition flex items-center justify-center hover:border-white/40"
              >
                تعرف علينا
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Floating Design */}
      <section className="relative z-20 container mx-auto px-4 -mt-12 md:-mt-16">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in-up delay-300">
          <div className="text-center md:border-l md:border-slate-100">
            <div className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-extrabold text-primary-600 mb-2">
              <BookOpen size={28} className="text-secondary-500 opacity-80" />
              <CountUp end={50} suffix="+" />
            </div>
            <p className="text-sm text-slate-500 font-medium">دورة تدريبية</p>
          </div>
          <div className="text-center md:border-l md:border-slate-100">
            <div className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-extrabold text-primary-600 mb-2">
              <Users size={28} className="text-secondary-500 opacity-80" />
              <CountUp end={1200} suffix="+" />
            </div>
            <p className="text-sm text-slate-500 font-medium">طالب وطالبة</p>
          </div>
          <div className="text-center md:border-l md:border-slate-100">
            <div className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-extrabold text-primary-600 mb-2">
              <Award size={28} className="text-secondary-500 opacity-80" />
              <CountUp end={30} suffix="+" />
            </div>
            <p className="text-sm text-slate-500 font-medium">مدرب خبير</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-extrabold text-primary-600 mb-2">
              <TrendingUp size={28} className="text-secondary-500 opacity-80" />
              <CountUp end={15} />
            </div>
            <p className="text-sm text-slate-500 font-medium">شريك أكاديمي</p>
          </div>
        </div>
      </section>

      {/* Features Section - Clean Cards Design */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="text-secondary-600 font-bold tracking-wider text-sm uppercase mb-2 block">لماذا شمسية؟</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">مميزات تجعلنا خيارك الأول</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full opacity-80"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "محتوى عالي الجودة", desc: "مناهج دراسية مصممة وفق أحدث المعايير العالمية لتلبية احتياجات سوق العمل المتجددة." },
              { icon: Users, title: "نخبة المدربين", desc: "تعلم على يد خبراء وممارسين يمتلكون خبرات واقعية وشهادات دولية في مجالاتهم." },
              { icon: Award, title: "شهادات معتمدة", desc: "احصل على شهادات إتمام موثقة تعزز سيرتك الذاتية وتفتح لك آفاقاً وظيفية جديدة." }
            ].map((feature, idx) => (
              <div key={idx} className={`group bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-primary-100 transition-all duration-300 relative overflow-hidden animate-fade-in-up delay-${idx * 150}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-accent-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <feature.icon size={32} strokeWidth={1.5} />
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary-700 transition-colors">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed group-hover:text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4 animate-fade-in">
            <div className="w-full md:w-auto text-center md:text-right">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">أحدث الدورات التدريبية</h2>
              <p className="text-slate-500 text-lg">استثمر في مستقبلك مع دوراتنا المتميزة</p>
            </div>
            <Link to="/courses" className="hidden md:flex items-center px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition border border-slate-200">
              عرض كل الدورات <ArrowLeft size={20} className="mr-2" />
            </Link>
          </div>

          {coursesLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary-600" size={48} />
            </div>
          ) : featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course, idx) => (
                <div key={course.id} className={`animate-fade-in-up delay-${idx * 100}`}>
                   <CourseCard course={course} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">لا توجد دورات متاحة حالياً للعرض.</p>
            </div>
          )}
          
          <div className="mt-10 text-center md:hidden">
            <Link to="/courses" className="inline-block px-8 py-4 border border-slate-200 bg-white text-slate-700 font-bold rounded-xl hover:bg-slate-50 shadow-sm w-full">
              عرض جميع الدورات
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">قصص نجاح ملهمة</h2>
            <p className="text-slate-300 text-lg">أكثر من مجرد منصة تعليمية، نحن مجتمع يصنع النجاح</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {TESTIMONIALS.map((testimonial, idx) => (
              <div key={testimonial.id} className={`bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors duration-300 animate-fade-in-up delay-${idx * 150}`}>
                <div className="flex items-center gap-5 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary-500 to-accent-500 rounded-full blur-sm opacity-60"></div>
                    <img src={testimonial.image} alt={testimonial.name} className="relative w-16 h-16 rounded-full border-2 border-white/20 object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white">{testimonial.name}</h4>
                    <p className="text-primary-300 text-sm font-medium">{testimonial.role}</p>
                  </div>
                </div>
                <div className="relative">
                    <span className="absolute -top-4 -right-2 text-6xl text-white/10 font-serif leading-none">"</span>
                    <p className="text-slate-300 text-lg leading-relaxed relative z-10">{testimonial.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-[2.5rem] p-10 md:p-16 text-center text-white shadow-2xl shadow-primary-900/20 relative overflow-hidden transform hover:scale-[1.005] transition duration-500 animate-fade-in-up">
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6">هل أنت جاهز لبدء رحلة التعلم؟</h2>
              <p className="text-lg md:text-xl mb-10 text-primary-100 font-light leading-relaxed">
                انضم الآن إلى آلاف المتعلمين وابدأ في تطوير مهاراتك مع أفضل المدربين والمحتوى التعليمي المتميز في العراق.
              </p>
              <Link to="/register" className="inline-flex items-center gap-3 bg-white text-primary-700 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-secondary-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
               سجل الآن مجاناً
               <CheckCircle size={20} className="text-secondary-500" />
              </Link>
            </div>
            
            {/* Floating Icons */}
            <CheckCircle className="absolute top-12 left-12 text-white/10 w-24 h-24 animate-bounce-slow" />
            <Award className="absolute bottom-12 right-12 text-white/10 w-32 h-32 animate-bounce-slow delay-700" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
