import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Users, Award, CheckCircle, Loader2 } from 'lucide-react';
import { TESTIMONIALS } from '../constants';
import CourseCard from '../components/CourseCard';
import { useTheme } from '../context/ThemeContext';
import { db } from '../lib/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';
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
        const q = query(collection(db, 'courses'), limit(3));
        const querySnapshot = await getDocs(q);
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
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[500px] lg:h-[600px] flex items-center overflow-hidden py-16 lg:py-0">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1920" 
            alt="Students learning" 
            className="w-full h-full object-cover animate-scale-in"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-900/80 to-primary-900/40"></div>
        </div>
        
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-4xl text-white">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-loose md:leading-relaxed lg:leading-tight animate-fade-in-up tracking-wide">
              <span className="text-secondary-400 block mb-2 sm:mb-4 sm:inline sm:ml-3">شمسية</span>
              {settings.heroTitle}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-100 mb-10 leading-loose opacity-90 max-w-2xl animate-fade-in-up delay-100">
              {settings.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-200">
              <Link 
                to="/courses" 
                className="px-6 py-4 md:px-8 md:py-4 bg-secondary-500 hover:bg-secondary-600 text-white text-base md:text-lg font-bold rounded-xl transition shadow-lg shadow-secondary-500/30 flex items-center justify-center gap-2 transform hover:scale-105 duration-300"
              >
                تصفح الدورات
                <ArrowLeft size={20} />
              </Link>
              <Link 
                to="/about" 
                className="px-6 py-4 md:px-8 md:py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white text-base md:text-lg font-bold rounded-xl transition flex items-center justify-center transform hover:scale-105 duration-300"
              >
                تعرف علينا
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 md:py-12 bg-white relative -mt-8 md:-mt-10 z-20 shadow-sm container mx-auto px-4 rounded-xl border border-slate-100 max-w-[95%] lg:max-w-container animate-fade-in-up delay-300">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 md:divide-x md:divide-x-reverse divide-slate-100">
          <div className="text-center group">
            <div className="text-3xl md:text-5xl font-extrabold text-primary-700 mb-2 group-hover:text-secondary-500 transition-colors">
              <CountUp end={50} suffix="+" />
            </div>
            <div className="text-xs md:text-sm text-slate-500 font-medium">دورة تدريبية</div>
          </div>
          <div className="text-center group">
            <div className="text-3xl md:text-5xl font-extrabold text-primary-700 mb-2 group-hover:text-secondary-500 transition-colors">
              <CountUp end={1200} suffix="+" />
            </div>
            <div className="text-xs md:text-sm text-slate-500 font-medium">طالب وطالبة</div>
          </div>
          <div className="text-center group">
            <div className="text-3xl md:text-5xl font-extrabold text-primary-700 mb-2 group-hover:text-secondary-500 transition-colors">
              <CountUp end={30} suffix="+" />
            </div>
            <div className="text-xs md:text-sm text-slate-500 font-medium">مدرب خبير</div>
          </div>
          <div className="text-center group">
            <div className="text-3xl md:text-5xl font-extrabold text-primary-700 mb-2 group-hover:text-secondary-500 transition-colors">
              <CountUp end={15} />
            </div>
            <div className="text-xs md:text-sm text-slate-500 font-medium">شريك أكاديمي</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-16 animate-fade-in-up">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-900 mb-4">لماذا تختار منصة شمسية؟</h2>
            <div className="w-20 h-1 bg-secondary-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: BookOpen, title: "محتوى عالي الجودة", desc: "مناهج دراسية مصممة وفق أحدث المعايير العالمية لتلبية احتياجات سوق العمل." },
              { icon: Users, title: "نخبة المدربين", desc: "تعلم على يد خبراء وممارسين يمتلكون خبرات واقعية في مجالاتهم." },
              { icon: Award, title: "شهادات معتمدة", desc: "احصل على شهادات إتمام موثقة تعزز سيرتك الذاتية وتفتح لك آفاقاً جديدة." }
            ].map((feature, idx) => (
              <div key={idx} className={`bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 text-center animate-fade-in-up delay-${idx * 100}`}>
                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  <feature.icon size={28} className="md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2 md:mb-3">{feature.title}</h3>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section - NOW DYNAMIC */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4 animate-fade-in">
            <div className="w-full md:w-auto text-center md:text-right">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-900 mb-2">أحدث الدورات</h2>
              <p className="text-slate-500 text-sm md:text-base">اخترنا لك مجموعة من أفضل الدورات لبدء رحلتك التعليمية</p>
            </div>
            <Link to="/courses" className="hidden md:flex items-center text-primary-600 font-bold hover:text-primary-800 transition">
              عرض كل الدورات <ArrowLeft size={20} className="mr-2" />
            </Link>
          </div>

          {coursesLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary-600" size={40} />
            </div>
          ) : featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredCourses.map((course, idx) => (
                <div key={course.id} className={`animate-fade-in-up delay-${idx * 100}`}>
                   <CourseCard course={course} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-slate-500">لا توجد دورات لعرضها حالياً.</p>
            </div>
          )}
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/courses" className="inline-block px-6 py-3 border-2 border-primary-600 text-primary-600 font-bold rounded-lg hover:bg-primary-50 text-sm">
              عرض جميع الدورات
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-20 bg-primary-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 md:mb-16 animate-fade-in-up">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">قصص نجاح ملهمة</h2>
            <p className="text-primary-200">ماذا يقول طلابنا عن تجربتهم مع شمسية</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {TESTIMONIALS.map((testimonial, idx) => (
              <div key={testimonial.id} className={`bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/10 hover:bg-white/15 transition animate-fade-in-up delay-${idx * 100}`}>
                <div className="flex items-center gap-4 mb-4 md:mb-6">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-secondary-500" />
                  <div>
                    <h4 className="font-bold text-base md:text-lg">{testimonial.name}</h4>
                    <p className="text-primary-300 text-xs md:text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-base md:text-lg leading-relaxed italic opacity-90">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl md:rounded-3xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden transform hover:scale-[1.01] transition duration-500 animate-fade-in-up">
            <div className="relative z-10">
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">جاهز لبدء رحلة التعلم؟</h2>
              <p className="text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto opacity-90">
                سجل الآن وانضم إلى مجتمع شمسية التعليمي، واحصل على وصول فوري لمحتوى تعليمي متميز.
              </p>
              <Link to="/register" className="inline-block bg-white text-secondary-600 px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-slate-100 transition shadow-lg transform hover:-translate-y-1">
               سجل الان
              </Link>
            </div>
            <CheckCircle className="absolute top-10 left-10 text-white/20 w-20 h-20 md:w-32 md:h-32 animate-bounce-slow" />
            <Award className="absolute bottom-10 right-10 text-white/20 w-20 h-20 md:w-32 md:h-32 animate-bounce-slow delay-100" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;