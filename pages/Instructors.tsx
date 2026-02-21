import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { ArrowRight, Award, BookOpen, Mail, Phone, ExternalLink, Facebook, Instagram, Linkedin, Twitter, Globe, Youtube, Send, X } from 'lucide-react';
import { db } from '../lib/firebase';
import InstructorCard from '../components/InstructorCard';
import { Instructor, Course, SocialLink, Graduate } from '../types';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Instructors: React.FC = () => {
  const { t, isEnglish } = useTheme();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [graduates, setGraduates] = useState<Graduate[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) setSearchQuery(q);
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [instructorsSnap, graduatesSnap, coursesSnap] = await Promise.all([
          db.collection('instructors').get(),
          db.collection('graduates').get(),
          db.collection('courses').get()
        ]);
        const instData = instructorsSnap.docs.map(doc => {
          const data = doc.data() as any;
          return {
            id: doc.id, name: data.name,
            roles: data.roles || (data.role ? [data.role] : []),
            image: data.image, shortBio: data.shortBio || '', bio: data.bio || '',
            certifications: data.certifications || [], socials: data.socials || []
          } as Instructor;
        });
        const gradData = graduatesSnap.docs.map(doc => {
          const data = doc.data() as any;
          return {
            id: doc.id, name: data.name,
            roles: data.roles || (data.role ? [data.role] : []),
            image: data.image, shortBio: data.shortBio || '', bio: data.bio || '',
            certifications: data.certifications || [], socials: data.socials || []
          } as Graduate;
        });
        setInstructors(instData);
        setGraduates(gradData);
        setCourses(coursesSnap.docs.map(doc => ({
          id: doc.id, ...doc.data(),
          media: doc.data().media || (doc.data().image ? [{ url: doc.data().image, type: 'image' }] : []),
          instructorIds: doc.data().instructorIds || (doc.data().instructorId ? [doc.data().instructorId] : [])
        } as Course)));
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const filteredInstructors = instructors.filter(inst => {
    return (inst.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (inst.shortBio?.toLowerCase() || '').includes(searchQuery.toLowerCase());
  });

  const filteredGraduates = graduates.filter(grad => {
    return (grad.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (grad.shortBio?.toLowerCase() || '').includes(searchQuery.toLowerCase());
  });

  const openInstructor = useCallback((inst: Instructor) => {
    setSelectedInstructor(inst);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeInstructor = useCallback(() => {
    setSelectedInstructor(null);
    document.body.style.overflow = '';
  }, []);

  const instructorCourses = selectedInstructor
    ? courses.filter(c => c.instructorIds?.includes(selectedInstructor.id))
    : [];

  const getSocialIcon = (type: string) => {
    const map: Record<string, React.ReactNode> = {
      facebook: <Facebook size={18} />, instagram: <Instagram size={18} />,
      linkedin: <Linkedin size={18} />, twitter: <Twitter size={18} />,
      youtube: <Youtube size={18} />, telegram: <Send size={18} />,
      website: <Globe size={18} />, email: <Mail size={18} />, phone: <Phone size={18} />,
    };
    return map[type] || <ExternalLink size={18} />;
  };

  const getSocialLink = (s: SocialLink) => {
    if (s.type === 'email') return `mailto:${s.value}`;
    if (s.type === 'phone') return `tel:${s.value}`;
    return s.value;
  };

  /* ═══════════════════════════════════════════
     INSTRUCTOR DETAIL — rendered via Portal
     ═══════════════════════════════════════════ */
  const renderInstructorDetail = () => {
    if (!selectedInstructor) return null;

    const overlay = (
      <div
        className="fixed inset-0 z-[99999] bg-white dark:bg-slate-900 overflow-y-auto"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Sticky top bar */}
        <div className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={closeInstructor} className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold text-sm p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition">
              <ArrowRight size={20} />
              <span>{t('العودة', 'Back')}</span>
            </button>
            <button onClick={closeInstructor} className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Green hero */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 pt-8 px-4 pb-10 text-center relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-20%] w-[300px] h-[300px] bg-white/10 rounded-full blur-[60px]"></div>
          <img
            src={selectedInstructor.image}
            alt={selectedInstructor.name}
            className="w-32 h-32 rounded-3xl object-cover border-4 border-white/30 shadow-2xl mx-auto mb-4"
          />
          <h1 className="text-3xl font-black text-white italic mb-3">{selectedInstructor.name}</h1>
          <div className="flex flex-wrap gap-2 justify-center">
            {selectedInstructor.roles?.map((role, i) => (
              <span key={i} className="text-xs bg-white/20 text-white px-3 py-1.5 rounded-full font-bold backdrop-blur-sm border border-white/10">{role}</span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
          <div className="grid grid-cols-1 gap-6">

            {/* Social Links */}
            {selectedInstructor.socials && selectedInstructor.socials.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-black text-slate-900 dark:text-white mb-3 text-sm">{t('معلومات التواصل', 'Contact')}</h3>
                <div className="flex flex-col gap-2">
                  {selectedInstructor.socials.map((s, i) => (
                    <a key={i} href={getSocialLink(s)} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 p-2 rounded-xl text-sm transition group">
                      <div className="w-9 h-9 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:border-emerald-200 dark:group-hover:border-emerald-700">
                        {getSocialIcon(s.type)}
                      </div>
                      <span className="truncate" dir={s.type === 'phone' ? 'ltr' : 'auto'}>{s.value}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {selectedInstructor.certifications && selectedInstructor.certifications.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="font-black text-slate-900 dark:text-white mb-3 text-sm flex items-center gap-2">
                  <Award size={16} className="text-emerald-600 dark:text-emerald-400" />
                  {t('الشهادات', 'Certifications')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedInstructor.certifications.map((cert, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-300 font-medium shadow-sm">{cert}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2.5 italic">
                <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center shrink-0">
                  <Award size={18} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                {t('نبذة شخصية', 'Personal Bio')}
              </h3>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-300 leading-loose text-[15px] whitespace-pre-line m-0">
                  {selectedInstructor.bio || t('لا توجد نبذة متاحة', 'No bio available')}
                </p>
              </div>
            </div>

            {/* Courses */}
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2.5 italic">
                <div className="w-9 h-9 bg-orange-100 dark:bg-orange-900/40 rounded-xl flex items-center justify-center shrink-0">
                  <BookOpen size={18} className="text-orange-600 dark:text-orange-400" />
                </div>
                {t('الدورات التدريبية', 'Courses')} ({instructorCourses.length})
              </h3>
              {instructorCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {instructorCourses.map(course => (
                    <Link to={`/courses/${course.id}`} key={course.id} onClick={closeInstructor}
                      className="flex gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-700 transition">
                      <img src={course.media && course.media.length > 0 ? course.media[0].url : 'https://via.placeholder.com/150'} alt=""
                        className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100 dark:bg-slate-700" />
                      <div className="flex-1 min-w-0 py-1">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1 line-clamp-2">{course.title}</h4>
                        <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-lg">{course.level}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-700">
                  <BookOpen className="mx-auto mb-2 text-slate-300 dark:text-slate-600" size={32} />
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm m-0">{t('لا توجد دورات نشطة حالياً', 'No active courses')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Back button */}
          <div className="mt-10 text-center">
            <button onClick={closeInstructor}
              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-8 py-3 rounded-xl font-bold inline-flex items-center gap-2 text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition">
              <ArrowRight size={18} />
              {t('العودة للقائمة', 'Back to List')}
            </button>
          </div>
        </div>
      </div>
    );

    // Portal: render OUTSIDE the React component tree, directly on body
    return ReactDOM.createPortal(overlay, document.body);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-300">
      {/* Hero */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-orange-100/40 dark:bg-orange-900/20 rounded-full blur-[80px] animate-blob delay-2000"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 italic tracking-tight animate-fade-up">
            {isEnglish ? (<>Our <span className="text-gradient">Instructors & Graduates</span></>) : (<>نخبة <span className="text-gradient">المدربين والخريجين</span></>)}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg max-w-2xl mx-auto font-medium animate-fade-up delay-100">
            {t('تعلم من أفضل الخبراء وتعرف على خريجينا المتميزين', 'Learn from the best experts and meet our outstanding graduates')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-200 dark:border-emerald-900/50 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {filteredInstructors.length > 0 && (
              <div className="mb-16">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 flex items-center justify-center md:justify-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 items-center justify-center hidden md:flex">
                    <Award size={24} />
                  </div>
                  {t('المدربون', 'Instructors')}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                  {filteredInstructors.map((instructor, index) => (
                    <div key={instructor.id} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <InstructorCard instructor={instructor} onClick={() => openInstructor(instructor)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredGraduates.length > 0 && (
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 flex items-center justify-center md:justify-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 items-center justify-center hidden md:flex">
                    <Award size={24} />
                  </div>
                  {t('الخريجون', 'Graduates')}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                  {filteredGraduates.map((graduate, index) => (
                    <div key={graduate.id} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <InstructorCard instructor={graduate} onClick={() => openInstructor(graduate)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredInstructors.length === 0 && filteredGraduates.length === 0 && (
              <div className="text-center py-20 text-slate-500 dark:text-slate-400 font-medium">
                {t('لا توجد نتائج مطابقة لبحثك', 'No matching results found')}
              </div>
            )}
          </>
        )}

        {/* Join CTA */}
        <div className="mt-16 md:mt-20 bg-emerald-600 rounded-2xl md:rounded-[2rem] p-8 md:p-14 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-600/20">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-black mb-4 italic">{t('هل تمتلك خبرة تود مشاركتها؟', 'Do you have expertise to share?')}</h2>
            <p className="text-emerald-100 mb-6 md:mb-8 max-w-2xl mx-auto text-base md:text-lg">{t('انضم إلى فريق مدربي شمسية', 'Join the Shamsiya trainers team')}</p>
            <button className="bg-white text-emerald-700 px-8 md:px-10 py-3 md:py-4 rounded-xl font-black text-base md:text-lg hover:bg-emerald-50 transition shadow-lg">
              {t('انضم كمدرب', 'Join as Instructor')}
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>
      </div>

      {/* Portal-rendered instructor detail */}
      {renderInstructorDetail()}
    </div>
  );
};

export default Instructors;