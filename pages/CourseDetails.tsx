
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Award, PlayCircle, CheckCircle, User, BarChart, Users, Medal, FileText, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { Course, Instructor } from '../types';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'syllabus' | 'instructor' | 'details'>('about');

  useEffect(() => {
    const fetchCourseAndInstructor = async () => {
      try {
        if (!id) return;

        // Fetch course data
        const courseDoc = await db.collection('courses').doc(id).get();
        if (courseDoc.exists) {
          const courseData = { id: courseDoc.id, ...courseDoc.data() } as Course;
          setCourse(courseData);

          // Fetch instructor data if instructorIds exists
          const instructorId = courseData.instructorIds?.[0];
          if (instructorId) {
            const instructorDoc = await db.collection('instructors').doc(instructorId).get();
            if (instructorDoc.exists) {
              setInstructor({ id: instructorDoc.id, ...instructorDoc.data() } as Instructor);
            }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <h2 className="text-2xl font-bold mb-4">الدورة غير موجودة</h2>
          <Link to="/courses" className="text-primary-600 hover:underline">العودة للدورات</Link>
        </div>
      </div>
    );
  }

  const mediaItem = course.media?.[0];
  const mediaUrl = mediaItem?.url || 'https://via.placeholder.com/800x450';
  const isVideo = mediaItem?.type === 'video';

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header / Hero */}
      <div className="bg-primary-900 text-white pt-8 md:pt-12 pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="lg:w-2/3 animate-fade-in-right">
              <span className="inline-block bg-secondary-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 animate-scale-in delay-100">
                {course.category}
              </span>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight animate-fade-in-up delay-200">{course.title}</h1>
              <p className="text-primary-100 text-base md:text-lg mb-6 md:mb-8 leading-relaxed max-w-2xl animate-fade-in-up delay-300">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-4 md:gap-6 text-sm md:text-base animate-fade-in-up delay-400">
                <div className="flex items-center gap-2">
                  <User className="text-secondary-400" size={18} />
                  <span>المدرب: {instructor?.name || 'غير محدد'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart className="text-secondary-400" size={18} />
                  <span>المستوى: {course.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="text-secondary-400" size={18} />
                  <span>شهادة إتمام معتمدة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 md:-mt-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main Content Column */}
          <div className="lg:w-2/3 animate-fade-in-up delay-500">
            {/* Video Placeholder */}
            <div className="bg-black rounded-xl overflow-hidden aspect-video shadow-lg mb-8 relative group cursor-pointer">
              {isVideo ? (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">
                  <PlayCircle size={64} className="opacity-80" />
                </div>
              ) : (
                <img src={mediaUrl} alt={course.title} className="w-full h-full object-cover" />
              )}
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white rounded-t-xl border-b border-slate-200 flex overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('about')}
                className={`flex-shrink-0 px-6 md:px-8 py-4 font-bold text-sm md:text-base whitespace-nowrap border-b-2 transition ${activeTab === 'about' ? 'border-primary-600 text-primary-600 bg-primary-50' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                عن الدورة
              </button>
              {course.longDescription && (
                <button
                  onClick={() => setActiveTab('details')}
                  className={`flex-shrink-0 px-6 md:px-8 py-4 font-bold text-sm md:text-base whitespace-nowrap border-b-2 transition ${activeTab === 'details' ? 'border-primary-600 text-primary-600 bg-primary-50' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  تفاصيل الدورة
                </button>
              )}
              <button
                onClick={() => setActiveTab('syllabus')}
                className={`flex-shrink-0 px-6 md:px-8 py-4 font-bold text-sm md:text-base whitespace-nowrap border-b-2 transition ${activeTab === 'syllabus' ? 'border-primary-600 text-primary-600 bg-primary-50' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                المنهج الدراسي
              </button>
              <button
                onClick={() => setActiveTab('instructor')}
                className={`flex-shrink-0 px-6 md:px-8 py-4 font-bold text-sm md:text-base whitespace-nowrap border-b-2 transition ${activeTab === 'instructor' ? 'border-primary-600 text-primary-600 bg-primary-50' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                المدرب
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-b-xl shadow-sm p-6 md:p-8 min-h-[400px]">
              {activeTab === 'about' && (
                <div className="animate-fade-in space-y-8">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4">ماذا ستتعلم؟</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.objectives.map((obj, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle className="text-secondary-500 flex-shrink-0 mt-1" size={20} />
                          <span className="text-slate-600 text-sm md:text-base">{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications Section */}
                  {course.certifications && course.certifications.length > 0 && (
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                      <h3 className="text-lg md:text-xl font-bold text-primary-800 mb-4 flex items-center gap-2">
                        <Medal size={22} className="text-secondary-500" />
                        الشهادات والاعتمادات
                      </h3>
                      <p className="text-sm text-slate-500 mb-3">يؤهلك هذا الكورس للتقدم للشهادات التالية:</p>
                      <div className="flex flex-wrap gap-2">
                        {course.certifications.map((cert, i) => (
                          <span key={i} className="bg-white text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium shadow-sm">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Target Audience Section */}
                  <div className="bg-primary-50 p-6 rounded-xl border border-primary-100">
                    <h3 className="text-lg md:text-xl font-bold text-primary-800 mb-4 flex items-center gap-2">
                      <Users size={22} />
                      الفئة المستهدفة
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">هذه الدورة مصممة خصيصاً لـ:</p>
                    <ul className="grid grid-cols-1 gap-3">
                      {course.targetAudience.map((target, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-700 font-medium text-sm md:text-base">
                          <div className="w-2 h-2 rounded-full bg-secondary-500"></div>
                          {target}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4">وصف مختصر</h3>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
                      {course.description}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'details' && course.longDescription && (
                <div className="animate-fade-in">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <FileText className="text-secondary-500" />
                    تفاصيل الإعلان
                  </h3>
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-slate-700 leading-loose whitespace-pre-line text-sm md:text-base font-medium">
                    {course.longDescription}
                  </div>
                </div>
              )}

              {activeTab === 'syllabus' && (
                <div className="animate-fade-in space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">محتوى الدورة</h3>
                  {course.syllabus.map((week, i) => (
                    <div key={i} className={`border border-slate-100 rounded-lg p-4 hover:border-primary-200 transition bg-slate-50 hover:bg-white animate-fade-in-up delay-${i * 100}`}>
                      <div className="flex items-center gap-4">
                        <div className="bg-primary-100 text-primary-700 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center font-bold text-base md:text-lg flex-shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm md:text-base">{week.week}</h4>
                          <p className="text-slate-500 text-xs md:text-sm">{week.topic}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'instructor' && instructor && (
                <div className="animate-fade-in flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-center md:text-right">
                  <img src={instructor.image} alt={instructor.name} className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-md" />
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">{instructor.name}</h3>
                    <p className="text-secondary-600 font-medium mb-4">{instructor.roles?.[0]}</p>
                    <p className="text-slate-600 leading-relaxed mb-6 text-sm md:text-base">
                      {instructor.bio}
                    </p>
                    <Link to="/instructors" className="text-primary-600 font-bold hover:underline">
                      عرض ملف المدرب الكامل
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 animate-fade-in-left delay-500">
            <div className="bg-white rounded-xl shadow-lg p-6 lg:sticky lg:top-24 border border-slate-100">
              <div className="text-2xl md:text-3xl font-extrabold text-primary-800 mb-2">
                {course.price.toLocaleString()} د.ع <span className="text-xs md:text-sm font-normal text-slate-500">/ شامل الضريبة</span>
              </div>
              {course.oldPrice && (
                <div className="text-slate-400 line-through text-sm mb-6">{course.oldPrice.toLocaleString()} د.ع</div>
              )}

              {/* Updated Register Button */}
              <Link to={`/courses/${course.id}/register`} className="block w-full bg-secondary-500 hover:bg-secondary-600 text-white font-bold text-center py-4 rounded-xl transition shadow-lg shadow-secondary-500/20 mb-6 transform hover:scale-105 duration-300">
                سجل الآن
              </Link>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <span className="flex items-center gap-2"><Clock size={18} /> المدة:</span>
                  <span className="font-bold">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <span className="flex items-center gap-2"><Calendar size={18} /> المواعيد:</span>
                  <span className="font-bold">{course.startDate}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <span className="flex items-center gap-2"><User size={18} /> عدد الطلاب:</span>
                  <span className="font-bold">{course.studentsCount}</span>
                </div>
              </div>

              <div className="mt-6 bg-slate-50 p-4 rounded-lg text-xs text-slate-500 leading-relaxed text-center">
                ضمان استرداد الأموال خلال 14 يوماً في حال عدم رضاك عن المحتوى التعليمي.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseDetails;