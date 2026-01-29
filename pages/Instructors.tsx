import React, { useState, useEffect } from 'react';
import { X, Award, BookOpen, Mail, Phone, ExternalLink, Loader2, Facebook, Instagram, Linkedin, Twitter, Globe, Youtube, Send } from 'lucide-react';
import { db } from '../lib/firebase';
import InstructorCard from '../components/InstructorCard';
import { Instructor, Course, SocialLink } from '../types';
import { Link } from 'react-router-dom';

const Instructors: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);

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
            id: doc.id,
            name: data.name,
            roles: data.roles || (data.role ? [data.role] : []),
            image: data.image,
            shortBio: data.shortBio || '',
            bio: data.bio || '',
            certifications: data.certifications || [],
            socials: data.socials || []
          } as Instructor;
        });

        setInstructors(instData);
        setCourses(coursesSnap.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          media: doc.data().media || (doc.data().image ? [{ url: doc.data().image, type: 'image' }] : []),
          instructorIds: doc.data().instructorIds || (doc.data().instructorId ? [doc.data().instructorId] : [])
        } as Course)));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter courses for the selected instructor
  const instructorCourses = selectedInstructor 
    ? courses.filter(c => c.instructorIds?.includes(selectedInstructor.id))
    : [];

  const getSocialIcon = (type: string) => {
    switch (type) {
      case 'facebook': return <Facebook size={18} />;
      case 'instagram': return <Instagram size={18} />;
      case 'linkedin': return <Linkedin size={18} />;
      case 'twitter': return <Twitter size={18} />;
      case 'youtube': return <Youtube size={18} />;
      case 'telegram': return <Send size={18} />;
      case 'website': return <Globe size={18} />;
      case 'email': return <Mail size={18} />;
      case 'phone': return <Phone size={18} />;
      default: return <ExternalLink size={18} />;
    }
  };

  const getSocialLink = (s: SocialLink) => {
      if (s.type === 'email') return `mailto:${s.value}`;
      if (s.type === 'phone') return `tel:${s.value}`;
      return s.value;
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-16 animate-fade-in">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-primary-900 mb-4 animate-fade-in-up">نخبة المدربين</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto animate-fade-in-up delay-100">
            تعلم من أفضل الخبراء في الوطن العربي، حيث نجمع لك بين الخبرة الأكاديمية والممارسة العملية
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {loading ? (
             <div className="flex justify-center"><Loader2 className="animate-spin text-primary-600" size={40} /></div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {instructors.map((instructor, index) => (
                <div key={instructor.id} className={`delay-${index * 100}`}>
                <InstructorCard 
                    instructor={instructor} 
                    onClick={() => setSelectedInstructor(instructor)}
                />
                </div>
            ))}
            </div>
        )}

        {/* Join as Instructor */}
        <div className="mt-20 bg-primary-800 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden animate-fade-in-up delay-300 shadow-xl">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">هل تمتلك خبرة تود مشاركتها؟</h2>
            <p className="text-primary-200 mb-8 max-w-2xl mx-auto">
              انضم إلى فريق مدربي شمسية وساهم في بناء جيل المستقبل. نقدم لك كافة الدعم التقني والتسويقي.
            </p>
            <button className="bg-white text-primary-800 px-8 py-3 rounded-lg font-bold hover:bg-secondary-500 hover:text-white transition shadow-lg transform hover:-translate-y-1">
              انضم كمدرب
            </button>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>
      </div>

      {/* Instructor Details Modal */}
      {selectedInstructor && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedInstructor(null)}
          ></div>
          
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 animate-scale-in">
            <button 
              onClick={() => setSelectedInstructor(null)}
              className="absolute top-4 left-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 transition z-20"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col md:flex-row min-h-[500px]">
              {/* Sidebar Info */}
              <div className="bg-slate-50 p-8 md:w-1/3 text-center md:text-right border-b md:border-b-0 md:border-l border-slate-100">
                <div className="relative inline-block mb-6">
                   <img 
                    src={selectedInstructor.image} 
                    alt={selectedInstructor.name} 
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                  />
                  <div className="absolute bottom-2 right-2 bg-green-500 w-4 h-4 rounded-full border-2 border-white" title="متاح للتدريب"></div>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedInstructor.name}</h2>
                <div className="flex flex-wrap gap-1 justify-center md:justify-start mb-6">
                    {selectedInstructor.roles?.map((role, i) => (
                         <span key={i} className="text-xs bg-white border border-slate-200 px-2 py-1 rounded-md text-secondary-600 font-bold">{role}</span>
                    ))}
                </div>
                
                <div className="space-y-4 text-sm text-slate-600">
                  {selectedInstructor.socials?.map((s, i) => (
                       <a key={i} href={getSocialLink(s)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 justify-center md:justify-start hover:text-primary-600 transition">
                            {getSocialIcon(s.type)}
                            <span className="truncate max-w-[180px] ltr" dir={s.type === 'phone' ? 'ltr' : 'auto'}>{s.value}</span>
                       </a>
                  ))}
                  {selectedInstructor.socials?.length === 0 && (
                      <p className="text-slate-400 text-xs italic">لا توجد معلومات تواصل</p>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-200">
                  <h4 className="font-bold text-slate-800 mb-4">الشهادات والاعتمادات</h4>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {selectedInstructor.certifications?.map((cert, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-500">{cert}</span>
                    ))}
                    {selectedInstructor.certifications?.length === 0 && (
                        <span className="text-slate-400 text-xs">غير محدد</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-8 md:w-2/3">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                    <Award className="text-secondary-500" />
                    نبذة شخصية
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                    {selectedInstructor.bio}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                    <BookOpen className="text-secondary-500" />
                    الدورات التدريبية ({instructorCourses.length})
                  </h3>
                  
                  {instructorCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {instructorCourses.map(course => (
                        <Link 
                          to={`/courses/${course.id}`} 
                          key={course.id}
                          className="flex gap-3 p-3 rounded-xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50 transition group"
                        >
                          <img 
                            src={course.media && course.media.length > 0 ? course.media[0].url : 'https://via.placeholder.com/150'} 
                            alt="" 
                            className="w-16 h-16 rounded-lg object-cover" 
                          />
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-primary-700 line-clamp-2">{course.title}</h4>
                            <span className="text-xs text-slate-500">{course.level}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">لا توجد دورات نشطة حالياً لهذا المدرب.</p>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                   <button 
                     onClick={() => setSelectedInstructor(null)}
                     className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition"
                   >
                     إغلاق
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Instructors;