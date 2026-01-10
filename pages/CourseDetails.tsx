import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Award, PlayCircle, CheckCircle, User, BarChart } from 'lucide-react';
import { COURSES, INSTRUCTORS } from '../constants';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const course = COURSES.find(c => c.id === id);
  const instructor = INSTRUCTORS.find(i => i.id === course?.instructorId);
  const [activeTab, setActiveTab] = useState<'about' | 'syllabus' | 'instructor'>('about');

  if (!course) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">الدورة غير موجودة</h2>
          <Link to="/courses" className="text-primary-600 hover:underline">العودة للدورات</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header / Hero */}
      <div className="bg-primary-900 text-white pt-12 pb-24">
        <div className="container mx-auto px-4">
           <div className="flex flex-col lg:flex-row gap-8 items-start">
             <div className="lg:w-2/3">
                <span className="inline-block bg-secondary-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                  {course.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{course.title}</h1>
                <p className="text-primary-100 text-lg mb-8 leading-relaxed max-w-2xl">
                  {course.description}
                </p>
                
                <div className="flex flex-wrap gap-6 text-sm md:text-base">
                  <div className="flex items-center gap-2">
                    <User className="text-secondary-400" size={20} />
                    <span>المدرب: {instructor?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart className="text-secondary-400" size={20} />
                    <span>المستوى: {course.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="text-secondary-400" size={20} />
                    <span>شهادة إتمام معتمدة</span>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Column */}
          <div className="lg:w-2/3">
            {/* Video Placeholder */}
            <div className="bg-black rounded-xl overflow-hidden aspect-video shadow-lg mb-8 relative group cursor-pointer">
              <img src={course.image} alt={course.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition" />
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircle size={64} className="text-white drop-shadow-lg group-hover:scale-110 transition" />
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white rounded-t-xl border-b border-slate-200 flex overflow-x-auto">
              <button 
                onClick={() => setActiveTab('about')}
                className={`px-8 py-4 font-bold text-sm md:text-base whitespace-nowrap border-b-2 transition ${activeTab === 'about' ? 'border-primary-600 text-primary-600 bg-primary-50' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                عن الدورة
              </button>
              <button 
                onClick={() => setActiveTab('syllabus')}
                className={`px-8 py-4 font-bold text-sm md:text-base whitespace-nowrap border-b-2 transition ${activeTab === 'syllabus' ? 'border-primary-600 text-primary-600 bg-primary-50' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                المنهج الدراسي
              </button>
              <button 
                onClick={() => setActiveTab('instructor')}
                className={`px-8 py-4 font-bold text-sm md:text-base whitespace-nowrap border-b-2 transition ${activeTab === 'instructor' ? 'border-primary-600 text-primary-600 bg-primary-50' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                المدرب
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-b-xl shadow-sm p-8 min-h-[400px]">
              {activeTab === 'about' && (
                <div className="animate-fade-in space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">ماذا ستتعلم؟</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.objectives.map((obj, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle className="text-secondary-500 flex-shrink-0 mt-1" size={20} />
                          <span className="text-slate-600">{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">وصف شامل</h3>
                    <p className="text-slate-600 leading-relaxed">
                      تقدم هذه الدورة تجربة تعليمية فريدة تمزج بين النظرية والتطبيق. 
                      سواء كنت مبتدئاً أو محترفاً يسعى لتطوير مهاراته، فإن المحتوى المقدم هنا مصمم ليسد الفجوة بين المعرفة الأكاديمية واحتياجات سوق العمل.
                      <br /><br />
                      ستحصل على وصول غير محدود للمحاضرات المسجلة، بالإضافة إلى جلسات نقاش مباشرة وتمارين عملية لضمان استيعابك للمفاهيم بشكل كامل.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'syllabus' && (
                <div className="animate-fade-in space-y-4">
                  <h3 className="text-2xl font-bold text-slate-800 mb-6">محتوى الدورة</h3>
                  {course.syllabus.map((week, i) => (
                    <div key={i} className="border border-slate-100 rounded-lg p-4 hover:border-primary-200 transition bg-slate-50 hover:bg-white">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary-100 text-primary-700 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{week.week}</h4>
                          <p className="text-slate-500">{week.topic}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'instructor' && instructor && (
                <div className="animate-fade-in flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-right">
                  <img src={instructor.image} alt={instructor.name} className="w-32 h-32 rounded-full object-cover shadow-md" />
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{instructor.name}</h3>
                    <p className="text-secondary-600 font-medium mb-4">{instructor.role}</p>
                    <p className="text-slate-600 leading-relaxed mb-6">
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
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-slate-100">
              <div className="text-3xl font-extrabold text-primary-800 mb-2">
                {course.price} ر.س <span className="text-sm font-normal text-slate-500">/ شامل الضريبة</span>
              </div>
              {course.oldPrice && (
                <div className="text-slate-400 line-through text-sm mb-6">{course.oldPrice} ر.س</div>
              )}

              <Link to="/contact" className="block w-full bg-secondary-500 hover:bg-secondary-600 text-white font-bold text-center py-4 rounded-xl transition shadow-lg shadow-secondary-500/20 mb-6">
                سجل الآن
              </Link>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <span className="flex items-center gap-2"><Clock size={18}/> المدة:</span>
                  <span className="font-bold">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <span className="flex items-center gap-2"><Calendar size={18}/> تاريخ البدء:</span>
                  <span className="font-bold">{course.startDate}</span>
                </div>
                 <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <span className="flex items-center gap-2"><User size={18}/> عدد الطلاب:</span>
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
