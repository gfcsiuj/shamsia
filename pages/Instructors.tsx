import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { ArrowRight, Award, BookOpen, Mail, Phone, ExternalLink, Facebook, Instagram, Linkedin, Twitter, Globe, Youtube, Send, X } from 'lucide-react';
import { db } from '../lib/firebase';
import InstructorCard from '../components/InstructorCard';
import { Instructor, Course, SocialLink } from '../types';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Instructors: React.FC = () => {
  const { t, isEnglish } = useTheme();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
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
        const [instructorsSnap, coursesSnap] = await Promise.all([
          db.collection('instructors').get(),
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
        setInstructors(instData);
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
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 99999,
          backgroundColor: '#ffffff',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Sticky top bar */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid #f1f5f9',
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={closeInstructor}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', fontWeight: 700, fontSize: '14px', padding: '8px', borderRadius: '12px', border: 'none', background: '#f1f5f9', cursor: 'pointer' }}>
              <ArrowRight size={20} />
              <span>{t('العودة', 'Back')}</span>
            </button>
            <button onClick={closeInstructor}
              style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Green hero */}
        <div style={{
          background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
          padding: '32px 16px 40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
          <img
            src={selectedInstructor.image}
            alt={selectedInstructor.name}
            style={{ width: '120px', height: '120px', borderRadius: '24px', objectFit: 'cover', border: '4px solid rgba(255,255,255,0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', margin: '0 auto 16px' }}
          />
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', fontStyle: 'italic', margin: '0 0 12px' }}>{selectedInstructor.name}</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {selectedInstructor.roles?.map((role, i) => (
              <span key={i} style={{ fontSize: '12px', background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '6px 14px', borderRadius: '20px', fontWeight: 700, backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)' }}>{role}</span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px 60px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>

            {/* Social Links */}
            {selectedInstructor.socials && selectedInstructor.socials.length > 0 && (
              <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontWeight: 900, color: '#1e293b', marginBottom: '12px', fontSize: '14px' }}>{t('معلومات التواصل', 'Contact')}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedInstructor.socials.map((s, i) => (
                    <a key={i} href={getSocialLink(s)} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#475569', textDecoration: 'none', padding: '10px', borderRadius: '12px', fontSize: '14px' }}>
                      <div style={{ width: '34px', height: '34px', background: '#fff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        {getSocialIcon(s.type)}
                      </div>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', direction: s.type === 'phone' ? 'ltr' : 'inherit' }}>{s.value}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {selectedInstructor.certifications && selectedInstructor.certifications.length > 0 && (
              <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontWeight: 900, color: '#1e293b', marginBottom: '12px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={16} style={{ color: '#059669' }} />
                  {t('الشهادات', 'Certifications')}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedInstructor.certifications.map((cert, i) => (
                    <span key={i} style={{ padding: '6px 12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px', color: '#475569', fontWeight: 500, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>{cert}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontStyle: 'italic' }}>
                <div style={{ width: '36px', height: '36px', background: '#d1fae5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Award size={18} style={{ color: '#059669' }} />
                </div>
                {t('نبذة شخصية', 'Personal Bio')}
              </h3>
              <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                <p style={{ color: '#475569', lineHeight: 2, fontSize: '15px', whiteSpace: 'pre-line', margin: 0 }}>
                  {selectedInstructor.bio || t('لا توجد نبذة متاحة', 'No bio available')}
                </p>
              </div>
            </div>

            {/* Courses */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontStyle: 'italic' }}>
                <div style={{ width: '36px', height: '36px', background: '#ffedd5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <BookOpen size={18} style={{ color: '#ea580c' }} />
                </div>
                {t('الدورات التدريبية', 'Courses')} ({instructorCourses.length})
              </h3>
              {instructorCourses.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
                  {instructorCourses.map(course => (
                    <Link to={`/courses/${course.id}`} key={course.id} onClick={closeInstructor}
                      style={{ display: 'flex', gap: '12px', padding: '12px', borderRadius: '16px', border: '1px solid #e2e8f0', background: '#fff', textDecoration: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                      <img src={course.media && course.media.length > 0 ? course.media[0].url : 'https://via.placeholder.com/150'} alt=""
                        style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontWeight: 700, color: '#1e293b', fontSize: '14px', marginBottom: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{course.title}</h4>
                        <span style={{ fontSize: '12px', color: '#94a3b8', background: '#f1f5f9', padding: '2px 8px', borderRadius: '8px' }}>{course.level}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '32px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <BookOpen style={{ margin: '0 auto 8px', color: '#cbd5e1' }} size={32} />
                  <p style={{ color: '#94a3b8', fontWeight: 500, fontSize: '14px', margin: 0 }}>{t('لا توجد دورات نشطة حالياً', 'No active courses')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Back button */}
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <button onClick={closeInstructor}
              style={{ background: '#f1f5f9', color: '#334155', padding: '12px 32px', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <ArrowRight size={18} />
              {t('العودة لقائمة المدربين', 'Back to Instructors')}
            </button>
          </div>
        </div>
      </div>
    );

    // Portal: render OUTSIDE the React component tree, directly on body
    return ReactDOM.createPortal(overlay, document.body);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-100/50 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-orange-100/40 rounded-full blur-[80px] animate-blob delay-2000"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 italic tracking-tight animate-fade-up">
            {isEnglish ? (<>Our <span className="text-gradient">Instructors</span></>) : (<>نخبة <span className="text-gradient">المدربين</span></>)}
          </h1>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto font-medium animate-fade-up delay-100">
            {t('تعلم من أفضل الخبراء في الوطن العربي', 'Learn from the best experts in the Arab world')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {instructors.map((instructor, index) => (
              <div key={instructor.id} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <InstructorCard instructor={instructor} onClick={() => openInstructor(instructor)} />
              </div>
            ))}
          </div>
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