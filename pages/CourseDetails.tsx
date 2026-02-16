import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Award, PlayCircle, CheckCircle, User, BarChart, Users, Medal, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { db } from '../lib/firebase';
import { Course, Instructor } from '../types';
import { useTheme } from '../context/ThemeContext';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, isEnglish } = useTheme();
  const [course, setCourse] = useState<Course | null>(null);
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [graduates, setGraduates] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'syllabus' | 'instructor' | 'details'>('about');

  useEffect(() => {
    const fetchCourseAndInstructor = async () => {
      try {
        if (!id) return;

        const courseDoc = await db.collection('courses').doc(id).get();
        if (courseDoc.exists) {
          const courseData = { id: courseDoc.id, ...courseDoc.data() } as Course;
          setCourse(courseData);

          const instructorId = courseData.instructorIds?.[0];
          if (instructorId) {
            const instructorDoc = await db.collection('instructors').doc(instructorId).get();
            if (instructorDoc.exists) {
              setInstructor({ id: instructorDoc.id, ...instructorDoc.data() } as Instructor);
            }
          }

          // Fetch graduates (if any)
          if (courseData.graduateIds && courseData.graduateIds.length > 0) {
            const graduateDocs = await Promise.all(
              courseData.graduateIds.map(gid => db.collection('instructors').doc(gid).get())
            );
            const graduatesData = graduateDocs
              .filter(doc => doc.exists)
              .map(doc => ({ id: doc.id, ...doc.data() } as Instructor));
            setGraduates(graduatesData);
          }
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndInstructor();
  }, [id]);

  const ChevronIcon = isEnglish ? ChevronRight : ChevronLeft;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center animate-fade-up">
          <h2 className="text-2xl font-black mb-4 italic text-slate-800">
            {t('الدورة غير موجودة', 'Course Not Found')}
          </h2>
          <Link to="/courses" className="text-emerald-600 hover:underline font-bold">
            {t('العودة للدورات', 'Back to Courses')}
          </Link>
        </div>
      </div>
    );
  }

  const mediaItem = course.media?.[0];
  const mediaUrl = mediaItem?.url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800';
  const isVideo = mediaItem?.type === 'video';

  const tabs = [
    { id: 'about', label: t('عن الدورة', 'About') },
    ...(course.longDescription ? [{ id: 'details', label: t('تفاصيل الدورة', 'Course Details') }] : []),
    { id: 'syllabus', label: t('المنهج الدراسي', 'Syllabus') },
    { id: 'instructor', label: t('المدرب', 'Instructor') },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Hero Section - Emerald Theme */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-100/60 rounded-full blur-[120px] animate-blob"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-[100px] animate-blob delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="lg:w-2/3 animate-fade-up">
              <span className="inline-block bg-emerald-600 text-white text-xs font-black px-4 py-2 rounded-xl mb-6 uppercase tracking-wide">
                {course.category}
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight italic tracking-tight animate-fade-up delay-100">
                {course.title}
              </h1>
              <p className="text-slate-600 text-lg md:text-xl mb-8 leading-relaxed max-w-2xl font-medium animate-fade-up delay-200">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-6 text-sm md:text-base animate-fade-up delay-300">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-100">
                  <User className="text-emerald-600" size={18} />
                  <span className="font-bold text-slate-700">{instructor?.name || t('غير محدد', 'Not specified')}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-100">
                  <BarChart className="text-orange-500" size={18} />
                  <span className="font-bold text-slate-700">{course.level}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-100">
                  <Award className="text-blue-500" size={18} />
                  <span className="font-bold text-slate-700">{t('شهادة معتمدة', 'Certified Certificate')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl -mt-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main Content Column */}
          <div className="lg:w-2/3 animate-fade-up delay-400">
            {/* Media Preview */}
            <div className="bg-slate-900 rounded-[2rem] overflow-hidden aspect-video shadow-2xl mb-8 relative group cursor-pointer border-4 border-white">
              {isVideo ? (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white">
                  <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                    <PlayCircle size={40} className="ml-1" />
                  </div>
                </div>
              ) : (
                <img src={mediaUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              )}
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white rounded-t-[2rem] border-b border-slate-100 flex overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-shrink-0 px-6 md:px-8 py-5 font-black text-sm md:text-base whitespace-nowrap border-b-2 transition-all ${activeTab === tab.id
                    ? 'border-emerald-600 text-emerald-600 bg-emerald-50/50'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-b-[2rem] shadow-lg p-6 md:p-10 min-h-[400px] border border-t-0 border-slate-100">
              {activeTab === 'about' && (
                <div className="animate-fade-up space-y-8">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-6 italic">
                      {t('ماذا ستتعلم؟', 'What Will You Learn?')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.objectives.map((obj, i) => (
                        <div key={i} className="flex items-start gap-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                          <CheckCircle className="text-emerald-600 flex-shrink-0 mt-0.5" size={20} />
                          <span className="text-slate-700 font-medium">{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {course.certifications && course.certifications.length > 0 && (
                    <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                      <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3 italic">
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                          <Medal size={20} className="text-orange-600" />
                        </div>
                        {t('الشهادات والاعتمادات', 'Certifications & Accreditations')}
                      </h3>
                      <p className="text-sm text-slate-500 mb-4">
                        {t('يؤهلك هذا الكورس للتقدم للشهادات التالية:', 'This course qualifies you to apply for the following certificates:')}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {course.certifications.map((cert, i) => (
                          <span key={i} className="bg-white text-slate-700 px-4 py-2 rounded-xl border border-orange-200 text-sm font-bold shadow-sm">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                    <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3 italic">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Users size={20} className="text-emerald-600" />
                      </div>
                      {t('الفئة المستهدفة', 'Target Audience')}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">
                      {t('هذه الدورة مصممة خصيصاً لـ:', 'This course is designed specifically for:')}
                    </p>
                    <ul className="grid grid-cols-1 gap-3">
                      {course.targetAudience.map((target, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          {target}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {course.notes && course.notes.length > 0 && (
                    <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                      <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3 italic">
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                          <FileText size={20} className="text-orange-600" />
                        </div>
                        {t('ملاحظات', 'Notes')}
                      </h3>
                      <ul className="grid grid-cols-1 gap-3">
                        {course.notes.map((note, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-700 font-medium bg-white p-3 rounded-xl border border-orange-100">
                            <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-orange-600 text-xs font-black">{i + 1}</span>
                            </div>
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'details' && course.longDescription && (
                <div className="animate-fade-up">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3 italic">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FileText className="text-blue-600" size={20} />
                    </div>
                    {t('تفاصيل الإعلان', 'Announcement Details')}
                  </h3>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-700 leading-loose whitespace-pre-line font-medium">
                    {course.longDescription}
                  </div>
                </div>
              )}

              {activeTab === 'syllabus' && (
                <div className="animate-fade-up space-y-4">
                  <h3 className="text-2xl font-black text-slate-900 mb-6 italic">
                    {t('محتوى الدورة', 'Course Content')}
                  </h3>
                  {course.syllabus.map((week, i) => (
                    <div key={i} className="border border-slate-100 rounded-2xl p-5 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="bg-emerald-100 text-emerald-700 w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-800 italic">{week.week}</h4>
                          <p className="text-slate-500 text-sm">{week.topic}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'instructor' && instructor && (
                <div className="animate-fade-up space-y-10">
                  {/* Instructor Info */}
                  <div className={`flex flex-col md:flex-row gap-8 items-center md:items-start text-center ${isEnglish ? 'md:text-left' : 'md:text-right'}`}>
                    <img src={instructor.image} alt={instructor.name} className="w-28 h-28 md:w-36 md:h-36 rounded-[2rem] object-cover shadow-xl border-4 border-white" />
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-2 italic">{instructor.name}</h3>
                      <p className="text-emerald-600 font-bold mb-4 bg-emerald-50 px-3 py-1 rounded-lg inline-block">{instructor.roles?.[0]}</p>
                      <p className="text-slate-600 leading-relaxed mb-6">
                        {instructor.bio}
                      </p>
                      <Link to="/instructors" className="text-emerald-600 font-black hover:underline inline-flex items-center gap-2">
                        {t('عرض ملف المدرب الكامل', 'View Full Instructor Profile')} <ChevronIcon size={16} />
                      </Link>
                    </div>
                  </div>

                  {/* Graduates Section */}
                  {graduates.length > 0 && (
                    <div className="pt-8 border-t border-slate-100">
                      <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3 italic">
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                          <Award className="text-orange-600" size={20} />
                        </div>
                        {t('خريجين / مشاركين الدورة', 'Course Graduates / Participants')}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {graduates.map((grad) => (
                          <div key={grad.id} className="bg-gradient-to-br from-orange-50 to-white p-4 rounded-2xl border border-orange-100 text-center hover:shadow-lg transition-all group">
                            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden border-2 border-orange-200 group-hover:border-orange-400 transition-colors">
                              {grad.image ? (
                                <img src={grad.image} alt={grad.name} className="w-full h-full object-cover" />
                              ) : (
                                <User className="text-orange-400" size={28} />
                              )}
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm mb-1">{grad.name}</h4>
                            {grad.roles?.[0] && (
                              <p className="text-xs text-orange-600 font-medium">{grad.roles[0]}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 animate-fade-up delay-500">
            <div className="bg-white rounded-[2rem] shadow-xl p-8 lg:sticky lg:top-24 border border-slate-100">
              <div className="text-4xl font-black text-slate-900 mb-2 italic tracking-tight">
                {course.price === 0 ? t('مجاناً', 'Free') : `${course.price.toLocaleString()} ${t('د.ع', 'IQD')}`}
              </div>
              {course.oldPrice && (
                <div className="text-slate-400 line-through text-lg mb-6">{course.oldPrice.toLocaleString()} {t('د.ع', 'IQD')}</div>
              )}

              <Link
                to={`/courses/${course.id}/register`}
                className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-center py-5 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 mb-8 transform hover:scale-[1.02] active:scale-95 text-lg"
              >
                {t('سجل الآن', 'Register Now')}
              </Link>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                  <span className="flex items-center gap-2 font-medium"><Clock size={18} className="text-emerald-500" /> {t('المدة:', 'Duration:')}</span>
                  <span className="font-black text-slate-900">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                  <span className="flex items-center gap-2 font-medium"><Calendar size={18} className="text-emerald-500" /> {t('المواعيد:', 'Schedule:')}</span>
                  <span className="font-black text-slate-900">{course.startDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-medium"><User size={18} className="text-emerald-500" /> {t('عدد الطلاب:', 'Enrolled:')}</span>
                  <span className="font-black text-slate-900">{course.studentsCount}</span>
                </div>
              </div>


            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseDetails;