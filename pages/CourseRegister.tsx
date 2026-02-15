import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, BookOpen, ExternalLink, AlertCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { Course } from '../types';
import { useTheme } from '../context/ThemeContext';

const CourseRegister: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, isEnglish } = useTheme();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(id || '');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    paymentMethod: 'zaincash'
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await db.collection('courses').get();
        const coursesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Course));
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (id) {
      setSelectedCourseId(id);
    }
  }, [id]);

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) {
      alert(t('يرجى اختيار دورة تدريبية أولاً.', 'Please select a course first.'));
      return;
    }
    setSubmitLoading(true);
    try {
      // Save registration to Firebase
      await db.collection('registrations').add({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        jobTitle: formData.jobTitle,
        paymentMethod: formData.paymentMethod,
        courseId: selectedCourseId,
        courseTitle: selectedCourse?.title || '',
        status: 'pending',
        type: 'course',
        createdAt: new Date().toISOString(),
      });

      // Auto-increment student count if mode is 'auto'
      if (selectedCourse && selectedCourse.studentsCountMode === 'auto') {
        await db.collection('courses').doc(selectedCourseId).update({
          studentsCount: (selectedCourse.studentsCount || 0) + 1
        });
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Error saving registration:', error);
      alert(t('حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى.', 'An error occurred. Please try again.'));
    } finally {
      setSubmitLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4 italic">
            {t('تم التسجيل بنجاح!', 'Registration Successful!')}
          </h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            {t(
              `شكراً لك ${formData.name}! تم استلام طلب تسجيلك في دورة "${selectedCourse?.title}". سيتم التواصل معك قريباً.`,
              `Thank you ${formData.name}! Your registration for "${selectedCourse?.title}" has been received. We will contact you soon.`
            )}
          </p>
          <Link to="/courses" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-4 rounded-2xl transition shadow-xl">
            {t('تصفح الدورات', 'Browse Courses')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Hero Header */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-orange-100/40 rounded-full blur-[80px] animate-blob delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 italic tracking-tight animate-fade-up">
            {isEnglish ? (
              <>New <span className="text-gradient">Student Registration</span></>
            ) : (
              <>تسجيل <span className="text-gradient">طالب جديد</span></>
            )}
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium animate-fade-up delay-100">
            {t('املأ النموذج أدناه لبدء رحلتك التعليمية مع شمسية', 'Fill out the form below to start your learning journey with Shamsiya')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl -mt-4">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Form Column */}
          <div className="lg:w-2/3 animate-fade-up delay-200">
            <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-10 border border-slate-100">

              {/* Course Selection Section */}
              <div className="mb-8 border-b border-slate-100 pb-8">
                <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3 italic">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="text-emerald-600" size={20} />
                  </div>
                  {t('معلومات الدورة', 'Course Information')}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-black text-slate-700 mb-2">
                      {t('اختر الدورة التدريبية', 'Select Course')}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="flex-grow px-4 py-4 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition cursor-pointer font-medium"
                      >
                        <option value="" disabled>{t('-- اختر دورة --', '-- Select a course --')}</option>
                        {courses.map(course => (
                          <option key={course.id} value={course.id}>{course.title}</option>
                        ))}
                      </select>

                      {selectedCourseId && (
                        <Link
                          to={`/courses/${selectedCourseId}`}
                          target="_blank"
                          className="px-5 py-4 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition flex items-center justify-center gap-2 font-black whitespace-nowrap border border-emerald-100"
                          title={t('عرض تفاصيل الدورة', 'View Course Details')}
                        >
                          <ExternalLink size={18} />
                          <span>{t('التفاصيل', 'Details')}</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-black text-slate-900 mb-6 italic">
                {t('بيانات المتدرب', 'Student Information')}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">
                    {t('الاسم الثلاثي', 'Full Name')}
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-4 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition font-medium"
                    placeholder={t('كما سيظهر في الشهادة', 'As it will appear on the certificate')}
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-black text-slate-700 mb-2">
                      {t('رقم الهاتف', 'Phone Number')}
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-4 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition font-medium"
                      placeholder="077xxxxxxxx"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-slate-700 mb-2">
                      {t('البريد الإلكتروني', 'Email')}
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-4 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition font-medium"
                      placeholder="example@mail.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">
                    {t('المسمى الوظيفي / التخصص الدراسي', 'Job Title / Field of Study')}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-4 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition font-medium"
                    placeholder={t('مثال: طالب علوم حاسوب / مهندس مدني', 'Example: Computer Science Student / Civil Engineer')}
                    value={formData.jobTitle}
                    onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                  />
                </div>

                <div className="pt-6">
                  <h2 className="text-xl font-black text-slate-900 mb-6 italic">
                    {t('طريقة الدفع', 'Payment Method')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`border-2 rounded-2xl p-5 cursor-pointer transition duration-300 flex items-center gap-3 ${formData.paymentMethod === 'zaincash' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="zaincash"
                        checked={formData.paymentMethod === 'zaincash'}
                        onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-5 h-5 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-black text-slate-700">{t('زين كاش (ZainCash)', 'ZainCash')}</span>
                    </label>

                    <label className={`border-2 rounded-2xl p-5 cursor-pointer transition duration-300 flex items-center gap-3 ${formData.paymentMethod === 'cash' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-5 h-5 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-black text-slate-700">{t('دفع نقدي (في المقر)', 'Cash (On-site)')}</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/20 transition duration-300 mt-8 disabled:opacity-50 disabled:cursor-not-allowed text-lg transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                  disabled={!selectedCourseId || submitLoading}
                >
                  {submitLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> {t('جاري التسجيل...', 'Registering...')}</>
                  ) : (
                    t('إتمام التسجيل', 'Complete Registration')
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Summary Column */}
          <div className="lg:w-1/3 animate-fade-up delay-300">
            <div className="bg-emerald-600 text-white rounded-[2rem] shadow-xl p-8 lg:sticky lg:top-24 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/20 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>

              <h3 className="text-xl font-black mb-6 pb-4 border-b border-emerald-500/30 italic relative z-10">
                {t('ملخص الطلب', 'Order Summary')}
              </h3>

              {selectedCourse ? (
                <div className="relative z-10">
                  <div className="mb-6">
                    <div className="text-emerald-200 text-xs font-bold uppercase tracking-wide mb-1">
                      {t('اسم الدورة', 'Course Name')}
                    </div>
                    <div className="font-black text-lg leading-tight">{selectedCourse.title}</div>
                  </div>

                  <div className="flex justify-between items-center mb-4 text-sm">
                    <span className="text-emerald-200">{t('المدة', 'Duration')}</span>
                    <span className="font-bold">{selectedCourse.duration}</span>
                  </div>

                  <div className="flex justify-between items-center mb-6 text-sm">
                    <span className="text-emerald-200">{t('تاريخ البدء', 'Start Date')}</span>
                    <span className="font-bold">{selectedCourse.startDate}</span>
                  </div>

                  <div className="border-t border-emerald-500/30 pt-6 mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-emerald-200">{t('سعر الدورة', 'Course Price')}</span>
                      <span className="font-bold">{selectedCourse.price.toLocaleString()} {t('د.ع', 'IQD')}</span>
                    </div>
                    {selectedCourse.oldPrice && (
                      <div className="flex justify-between items-center mb-4 text-xs text-emerald-300/60 line-through">
                        <span>{t('السعر الأصلي', 'Original Price')}</span>
                        <span>{selectedCourse.oldPrice.toLocaleString()} {t('د.ع', 'IQD')}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-2xl font-black mt-4 bg-white/10 p-4 rounded-xl">
                      <span>{t('الإجمالي', 'Total')}</span>
                      <span>{selectedCourse.price.toLocaleString()} {t('د.ع', 'IQD')}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 opacity-70 relative z-10">
                  <AlertCircle size={48} className="mx-auto mb-4" />
                  <p className="text-sm">{t('يرجى اختيار دورة من القائمة لعرض الملخص', 'Please select a course from the list to view summary')}</p>
                </div>
              )}

              <div className="mt-8 bg-emerald-700/50 p-4 rounded-xl text-xs text-emerald-100 leading-relaxed flex gap-2 relative z-10">
                <CheckCircle size={16} className="flex-shrink-0 text-white" />
                <span>{t('بإرسال هذا النموذج، أنت توافق على شروط وأحكام منصة شمسية للتعليم الإلكتروني.', 'By submitting this form, you agree to the terms and conditions of Shamsiya e-learning platform.')}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseRegister;