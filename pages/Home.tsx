import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Star, Play, Heart, UserCheck, Rocket, ChevronLeft, Users2, Cpu, MessageCircle, Award, Users, BookOpen } from 'lucide-react';
import { TESTIMONIALS } from '../constants';
import CourseCard from '../components/CourseCard';
import { useTheme } from '../context/ThemeContext';
import { db } from '../lib/firebase';
import { Course, Testimonial } from '../types';

// Category constants - matching the Courses page
const Category = {
  TECH: 'Tech',
  HUMAN_DEV: 'Human Development',
  CYBER: 'Cyber Security',
  ADMIN: 'Admin Skills',
  STUDENT: 'Student Skills'
};

const Home: React.FC = () => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { settings, t, isEnglish } = useTheme();

  const [coursesCount, setCoursesCount] = useState(0);
  const [instructorsCount, setInstructorsCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(TESTIMONIALS);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setActiveTestimonialIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Fetch real stats from Firebase
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [coursesSnap, instructorsSnap] = await Promise.all([
          db.collection('courses').get(),
          db.collection('instructors').get()
        ]);
        setCoursesCount(coursesSnap.size);
        setInstructorsCount(instructorsSnap.size);
        // Sum up all students from courses
        let totalStudents = 0;
        coursesSnap.docs.forEach(doc => {
          const data = doc.data();
          totalStudents += data.studentsCount || 0;
        });
        setStudentsCount(totalStudents);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  // Stats data with real values from database
  const STATS = [
    { id: 1, value: `${coursesCount}+`, label: t('دورة تدريبية', 'Training Courses'), icon: Play, color: 'emerald' },
    { id: 2, value: `${studentsCount}+`, label: t('متدرب', 'Trainees'), icon: Heart, color: 'orange' },
    { id: 3, value: `${instructorsCount}+`, label: t('مدرب معتمد', 'Certified Trainers'), icon: UserCheck, color: 'blue' },
    { id: 4, value: '15', label: t('شريك توظيف استراتيجي', 'Strategic Partners'), icon: Rocket, color: 'purple' },
  ];

  // Fetch courses from database
  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const querySnapshot = await db.collection('courses').limit(6).get();
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

  // Fetch testimonials from Firebase, fallback to constants
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const snap = await db.collection('testimonials').where('isVisible', '==', true).get();
        if (snap.size > 0) {
          setTestimonials(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial)));
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };
    fetchTestimonials();
  }, []);

  // Filter courses by category
  const getFilteredCourses = () => {
    if (activeTab === 'all') return featuredCourses;
    return featuredCourses.filter(course => course.category === activeTab);
  };

  const categoryTabs = [
    { id: 'all', label: t('الكل', 'All') },
    { id: Category.TECH, label: t('تقنية', 'Tech') },
    { id: Category.CYBER, label: t('أمن سيبراني', 'Cyber Security') },
    { id: Category.HUMAN_DEV, label: t('تنمية بشرية', 'Human Dev') },
    { id: Category.ADMIN, label: t('مهارات إدارية', 'Admin Skills') },
    { id: Category.STUDENT, label: t('مهارات طلابية', 'Student Skills') },
  ];

  const getIndicatorIndex = () => {
    const idx = categoryTabs.findIndex(tab => tab.id === activeTab);
    return idx >= 0 ? idx : 0;
  };

  const ArrowIcon = isEnglish ? ArrowRight : ArrowLeft;

  return (
    <div className="animate-fade-in">
      {/* Hero Section - New Design */}
      <section id="home" className="relative pt-36 pb-16 lg:pt-64 lg:pb-48 overflow-hidden px-6">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] bg-emerald-100/50 rounded-full blur-[120px] animate-blob"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[100px] animate-blob delay-2000"></div>
        </div>

        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Content */}
            <div className={`lg:w-3/5 text-center ${isEnglish ? 'lg:text-left' : 'lg:text-right'} animate-fade-up order-2 lg:order-1`}>
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-sm border border-slate-200 text-emerald-700 text-xs md:text-sm font-black mb-8 lg:mb-10 tracking-wide hover:shadow-md transition-shadow cursor-default">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                {t('منصة التعليم الرقمي الرائدة في العراق 2026', "Iraq's Leading Digital Learning Platform 2026")}
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight italic">
                {isEnglish ? (
                  <>Build Your Career <br />Path <span className="text-gradient px-2">Smartly</span></>
                ) : (
                  <>ابنِ مسارك <br />المهني <span className="text-gradient px-2">بذكاء</span></>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-2xl text-slate-600 leading-relaxed mb-12 max-w-2xl mx-auto lg:mx-0 font-medium">
                {isEnglish
                  ? 'We combined the expertise of Arab trainers with the latest AI technologies to offer you a comprehensive learning experience that guarantees your place in the job market.'
                  : (settings.heroSubtitle || 'دمجنا خبرة المدربين العرب مع أحدث تقنيات الذكاء الاصطناعي لنقدم لك تجربة تعليمية محكمة تضمن لك مكاناً في سوق العمل.')}
              </p>

              {/* CTA Buttons */}
              <div className={`flex flex-col sm:flex-row justify-center ${isEnglish ? 'lg:justify-start' : 'lg:justify-start'} gap-5`}>
                <Link to="/courses" className="px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[20px] font-black text-xl flex items-center justify-center gap-4 transition-all shadow-2xl shadow-emerald-200 active:scale-95 group">
                  {t('استكشف الدورات', 'Explore Courses')} <ArrowIcon className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Social Proof */}
              <div className={`mt-14 flex flex-col sm:flex-row items-center justify-center ${isEnglish ? 'lg:justify-start' : 'lg:justify-start'} gap-8`}>
                <div className={`flex ${isEnglish ? '-space-x-5' : '-space-x-5 space-x-reverse'}`}>
                  {[1, 2, 3].map((i) => (
                    <img key={i} src={`https://i.pravatar.cc/150?u=a${i}`} alt="User" className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover ring-1 ring-slate-100" />
                  ))}
                  <div className="w-16 h-16 rounded-full border-4 border-white bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-lg ring-1 ring-slate-100 italic">+1.2k</div>
                </div>
                <div className={`text-center ${isEnglish ? 'lg:text-left' : 'lg:text-right'}`}>
                  <div className={`flex items-center justify-center ${isEnglish ? 'lg:justify-start' : 'lg:justify-start'} gap-1 text-yellow-400 mb-2`}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} fill="currentColor" className="w-6 h-6" />
                    ))}
                    <span className={`text-slate-900 font-black text-lg ${isEnglish ? 'ml-3' : 'mr-3'} tracking-tighter`}>4.9/5.0</span>
                  </div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest italic">
                    {t('انضم لمجتمع المتعلمين', 'Join Our Learning Community')}
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:w-2/5 relative w-full perspective-1000 order-1 lg:order-2 mb-4 lg:mb-0 px-4 lg:px-0">
              <div className="rounded-[3rem] lg:rounded-[4rem] bg-white p-4 lg:p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.1)] border border-slate-100 animate-float max-w-sm lg:max-w-md mx-auto relative group overflow-hidden">
                <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" alt="Hero Student" className="rounded-[2.5rem] lg:rounded-[3rem] w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
              </div>

              {/* Floating Badge */}
              <div className={`hidden md:flex absolute ${isEnglish ? '-left-4 lg:-left-12' : '-right-4 lg:-right-12'} top-[20%] bg-white/95 backdrop-blur-xl p-5 rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-white items-center gap-4 animate-bounce z-10 hover:scale-105 transition-transform cursor-default`}>
                <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <Award className="w-7 h-7" />
                </div>
                <div className={isEnglish ? 'text-left' : 'text-right'}>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
                    {t('شهادات', 'Certificates')}
                  </p>
                  <p className="text-base font-black text-slate-900 italic leading-none">
                    {t('معتمدة دولياً', 'Internationally Accredited')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - New Design */}
      <section className="py-16 lg:py-32 bg-white dark:bg-slate-900 border-y border-slate-50 dark:border-slate-800 px-6 relative z-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {STATS.map((stat) => {
              const colors: { [key: string]: string } = {
                emerald: 'text-emerald-600 group-hover:bg-emerald-600',
                orange: 'text-orange-600 group-hover:bg-orange-600',
                blue: 'text-blue-600 group-hover:bg-blue-600',
                purple: 'text-purple-600 group-hover:bg-purple-600',
              };

              return (
                <div
                  key={stat.id}
                  className="p-8 lg:p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center transition-all duration-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-2 group"
                >
                  <div className={`w-16 h-16 lg:w-20 lg:h-20 bg-white dark:bg-slate-900 rounded-[1.2rem] flex items-center justify-center mb-6 lg:mb-8 shadow-md ${colors[stat.color]} group-hover:text-white transition-all duration-500 ring-4 ring-slate-50 dark:ring-slate-700 group-hover:ring-offset-2 dark:group-hover:ring-offset-slate-800`}>
                    <stat.icon className="w-8 h-8 lg:w-9 lg:h-9 fill-current" />
                  </div>
                  <h3 className="text-4xl lg:text-5xl font-black mb-3 text-slate-900 dark:text-white tracking-tighter italic">
                    {stat.value}
                  </h3>
                  <p className="text-xs lg:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide leading-snug">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Course Explorer Section - New Design */}
      <section id="explore" className="py-20 lg:py-40 px-6 bg-slate-50/50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-4xl lg:text-7xl font-black text-slate-900 mb-6 lg:mb-8 italic tracking-tight">
              {isEnglish ? (
                <>What do you want to learn <span className="text-emerald-600 underline underline-offset-[16px] decoration-4 decoration-emerald-200">today?</span></>
              ) : (
                <>ماذا تود أن تتعلم <span className="text-emerald-600 underline underline-offset-[16px] decoration-4 decoration-emerald-200">اليوم؟</span></>
              )}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg lg:text-xl leading-relaxed">
              {t(
                'استكشف مكتبتنا المتنوعة التي تغطي أحدث المهارات المطلوبة عالمياً بلهجة عراقية قريبة منك.',
                'Explore our diverse library covering the latest globally demanded skills.'
              )}
            </p>
          </div>

          {/* Tabs Header */}
          <div className="flex flex-col items-center mb-16 lg:mb-20">
            <div className="flex flex-wrap gap-3 justify-center">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 lg:px-8 lg:py-4 rounded-2xl text-sm md:text-base font-black transition-all duration-300 italic ${activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xl'
                    : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          <div className="min-h-[500px]">
            {coursesLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
              </div>
            ) : getFilteredCourses().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 animate-fade-up">
                {getFilteredCourses().map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">
                  {t('لا توجد دورات متاحة في هذا التصنيف.', 'No courses available in this category.')}
                </p>
              </div>
            )}
          </div>

          {/* View All Button */}
          <div className="mt-16 text-center">
            <Link to="/courses" className="inline-flex items-center gap-3 px-10 py-5 bg-white border-2 border-slate-200 text-slate-700 rounded-[20px] font-black text-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              {t('عرض جميع الدورات', 'View All Courses')} <ArrowIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Dark Background */}
      <section id="features" className="py-24 lg:py-40 bg-slate-900 text-white relative overflow-hidden px-6">
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row gap-24 lg:gap-36 items-center">

            {/* Features Content */}
            <div className={`lg:w-1/2 ${isEnglish ? 'text-left' : 'text-right'}`}>
              <h2 className="text-4xl lg:text-[4.5rem] font-black mb-14 italic leading-[1.05] tracking-tight">
                {isEnglish ? (
                  <>Shamsiya.. Creating <br /> <span className="text-emerald-400 font-medium">Your Digital Future</span></>
                ) : (
                  <>شمسية.. نبتكر <br /> <span className="text-emerald-400 font-medium">مستقبلك الرقمي</span></>
                )}
              </h2>
              <div className="space-y-12">
                <div className="flex gap-6 lg:gap-8 group">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 shrink-0 rounded-[2.2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-700 shadow-xl">
                    <Users2 className="w-8 h-8 lg:w-10 lg:h-10" />
                  </div>
                  <div>
                    <h4 className="text-xl lg:text-2xl font-black mb-4 tracking-tight italic">
                      {t('بيئة تعليمية حية وتشاركية', 'Live & Interactive Learning Environment')}
                    </h4>
                    <p className="text-slate-400 leading-relaxed font-medium text-base lg:text-lg">
                      {t(
                        'لا نؤمن بالتعلم من طرف واحد، نتيح لك التواصل اللحظي مع الخبراء في العراق والوطن العربي لبناء شبكة علاقات قوية.',
                        "We don't believe in one-way learning. We enable real-time communication with experts in Iraq and the Arab world to build a strong network."
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 lg:gap-8 group">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 shrink-0 rounded-[2.2rem] bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-black transition-all duration-700 shadow-xl">
                    <Cpu className="w-8 h-8 lg:w-10 lg:h-10" />
                  </div>
                  <div>
                    <h4 className="text-xl lg:text-2xl font-black mb-4 tracking-tight italic">
                      {t('تطبيق عملي لمشاريع واقعية', 'Hands-on Real-World Projects')}
                    </h4>
                    <p className="text-slate-400 leading-relaxed font-medium text-base lg:text-lg">
                      {t(
                        'كل ما تتعلمه يطبق على مشاريع برمجية حقيقية تحاكي الطلبات الفعلية التي ستحصل عليها بمجرد تخرجك.',
                        'Everything you learn is applied to real programming projects that simulate actual requests you will receive upon graduation.'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Carousel */}
            <div className="lg:w-1/2 w-full relative">
              {testimonials.length > 0 && (
                <div className="relative">
                  {/* Carousel Content */}
                  <div className="relative p-10 lg:p-16 bg-white/5 border border-white/10 rounded-[3rem] lg:rounded-[4.5rem] backdrop-blur-[20px] group hover:border-emerald-500/40 transition-all duration-1000 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] min-h-[400px] flex flex-col justify-center">

                    {/* Decorative Icon */}
                    <div className={`absolute -top-5 ${isEnglish ? '-left-5 lg:-left-6' : '-right-5 lg:-right-6'} w-20 h-20 lg:w-24 lg:h-24 bg-emerald-600 rounded-[2rem] flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-700 z-20`}>
                      <Star fill="white" className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                    </div>

                    {/* Testimonial Text */}
                    <div key={activeTestimonialIndex} className="animate-fade-in">
                      <p className={`text-xl md:text-3xl font-medium leading-relaxed mb-12 lg:mb-16 relative z-10 italic text-slate-100 ${isEnglish ? 'text-left' : 'text-right'}`}>
                        "{testimonials[activeTestimonialIndex].text}"
                      </p>

                      <div className={`flex items-center gap-6 ${isEnglish ? 'justify-start text-left' : 'justify-end text-right'}`}>
                        <div>
                          <h5 className="text-xl lg:text-2xl font-black italic tracking-tighter">{testimonials[activeTestimonialIndex].name}</h5>
                          <p className="text-emerald-400 text-[10px] lg:text-xs font-black tracking-[0.2em] uppercase italic">{testimonials[activeTestimonialIndex].role}</p>
                        </div>
                        <div className="relative">
                          <img src={testimonials[activeTestimonialIndex].image || `https://ui-avatars.com/api/?name=${testimonials[activeTestimonialIndex].name}&background=10b981&color=fff`} alt={testimonials[activeTestimonialIndex].name} className="w-16 h-16 lg:w-20 lg:h-20 rounded-[2.2rem] border-2 border-emerald-500 shadow-2xl object-cover ring-4 ring-emerald-500/20" />
                          <div className={`absolute bottom-1 ${isEnglish ? '-left-1' : '-right-1'} w-4 h-4 lg:w-5 lg:h-5 bg-green-500 border-4 border-slate-900 rounded-full`}></div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Controls */}
                    {testimonials.length > 1 && (
                      <div className={`absolute bottom-8 ${isEnglish ? 'right-8' : 'left-8'} flex gap-3 z-20`}>
                        <button
                          onClick={() => {
                            setActiveTestimonialIndex(prev => prev === 0 ? testimonials.length - 1 : prev - 1);
                          }}
                          className="w-10 h-10 rounded-full bg-white/10 hover:bg-emerald-500 hover:text-white text-white/50 border border-white/10 flex items-center justify-center transition-all"
                        >
                          <ChevronLeft className={`w-5 h-5 ${isEnglish ? '' : 'rotate-180'}`} />
                        </button>
                        <button
                          onClick={() => {
                            setActiveTestimonialIndex(prev => (prev + 1) % testimonials.length);
                          }}
                          className="w-10 h-10 rounded-full bg-white/10 hover:bg-emerald-500 hover:text-white text-white/50 border border-white/10 flex items-center justify-center transition-all"
                        >
                          <ChevronLeft className={`w-5 h-5 ${isEnglish ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    )}

                    {/* Progress Indicators */}
                    {testimonials.length > 1 && (
                      <div className={`absolute top-10 ${isEnglish ? 'right-10' : 'left-10'} flex gap-1.5`}>
                        {testimonials.map((_, idx) => (
                          <div
                            key={idx}
                            onClick={() => setActiveTestimonialIndex(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${idx === activeTestimonialIndex ? 'w-8 bg-emerald-500' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                          ></div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Background Mesh Glows */}
        <div className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[160px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-emerald-400/5 rounded-full blur-[140px]"></div>
      </section>
    </div>
  );
};

export default Home;
