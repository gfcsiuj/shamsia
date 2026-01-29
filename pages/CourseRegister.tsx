import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, BookOpen, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { Course } from '../types';

const CourseRegister: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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

  // Fetch courses from Firebase
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

  // Effect to update selected course if ID changes from URL
  useEffect(() => {
    if (id) {
      setSelectedCourseId(id);
    }
  }, [id]);

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) {
      alert('يرجى اختيار دورة تدريبية أولاً.');
      return;
    }
    alert(`شكراً لك ${formData.name}! تم استلام طلب تسجيلك في دورة "${selectedCourse?.title}". سيتم التواصل معك قريباً لإتمام الدفع عبر ${formData.paymentMethod === 'zaincash' ? 'زين كاش' : 'الكاش'}.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">

          <div className="mb-6 md:mb-8 animate-fade-in-down">
            <h1 className="text-2xl md:text-3xl font-bold text-primary-900 mb-2">تسجيل طالب جديد</h1>
            <p className="text-slate-600 text-sm md:text-base">املأ النموذج أدناه لبدء رحلتك التعليمية مع شمسية</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">

            {/* Form Column */}
            <div className="lg:w-2/3 animate-fade-in-up delay-100">
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">

                {/* Course Selection Section */}
                <div className="mb-8 border-b border-slate-100 pb-8">
                  <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <BookOpen className="text-secondary-500" size={24} />
                    معلومات الدورة
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">اختر الدورة التدريبية</label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <select
                          value={selectedCourseId}
                          onChange={(e) => setSelectedCourseId(e.target.value)}
                          className="flex-grow px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition cursor-pointer text-sm md:text-base"
                        >
                          <option value="" disabled>-- اختر دورة --</option>
                          {courses.map(course => (
                            <option key={course.id} value={course.id}>{course.title}</option>
                          ))}
                        </select>

                        {selectedCourseId && (
                          <Link
                            to={`/courses/${selectedCourseId}`}
                            target="_blank"
                            className="px-4 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition flex items-center justify-center gap-2 font-bold whitespace-nowrap text-sm md:text-base animate-pop-in"
                            title="عرض تفاصيل الدورة"
                          >
                            <ExternalLink size={18} />
                            <span>التفاصيل</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <h2 className="text-lg md:text-xl font-bold border-b border-slate-100 pb-4 mb-6 text-slate-800">بيانات المتدرب</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">الاسم الثلاثي</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                      placeholder="كما سيظهر في الشهادة"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">رقم الهاتف</label>
                      <input
                        type="tel"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                        placeholder="077xxxxxxxx"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                        placeholder="example@mail.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">المسمى الوظيفي / التخصص الدراسي</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                      placeholder="مثال: طالب علوم حاسوب / مهندس مدني"
                      value={formData.jobTitle}
                      onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                    />
                  </div>

                  <div className="pt-6">
                    <h2 className="text-lg md:text-xl font-bold border-b border-slate-100 pb-4 mb-6 text-slate-800">طريقة الدفع</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className={`border rounded-xl p-4 cursor-pointer transition duration-300 flex items-center gap-3 ${formData.paymentMethod === 'zaincash' ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-primary-300'}`}>
                        <input
                          type="radio"
                          name="payment"
                          value="zaincash"
                          checked={formData.paymentMethod === 'zaincash'}
                          onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="font-bold text-slate-700 text-sm md:text-base">زين كاش (ZainCash)</span>
                      </label>

                      <label className={`border rounded-xl p-4 cursor-pointer transition duration-300 flex items-center gap-3 ${formData.paymentMethod === 'cash' ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-primary-300'}`}>
                        <input
                          type="radio"
                          name="payment"
                          value="cash"
                          checked={formData.paymentMethod === 'cash'}
                          onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="font-bold text-slate-700 text-sm md:text-base">دفع نقدي (في المقر)</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-secondary-500/20 transition duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed text-lg transform hover:scale-[1.01] active:scale-95"
                    disabled={!selectedCourseId}
                  >
                    إتمام التسجيل
                  </button>
                </form>
              </div>
            </div>

            {/* Summary Column */}
            <div className="lg:w-1/3 animate-fade-in-left delay-300">
              <div className="bg-primary-900 text-white rounded-xl shadow-lg p-6 lg:sticky lg:top-24">
                <h3 className="text-lg font-bold mb-4 pb-4 border-b border-primary-800">ملخص الطلب</h3>

                {selectedCourse ? (
                  <div className="animate-fade-in">
                    <div className="mb-6">
                      <div className="text-primary-200 text-xs mb-1">اسم الدورة</div>
                      <div className="font-bold text-base md:text-lg leading-tight">{selectedCourse.title}</div>
                    </div>

                    <div className="flex justify-between items-center mb-6 text-sm md:text-base">
                      <span className="text-primary-200">المدة</span>
                      <span className="font-bold">{selectedCourse.duration}</span>
                    </div>

                    <div className="flex justify-between items-center mb-6 text-sm md:text-base">
                      <span className="text-primary-200">تاريخ البدء</span>
                      <span className="font-bold">{selectedCourse.startDate}</span>
                    </div>

                    <div className="border-t border-primary-800 pt-6 mt-6">
                      <div className="flex justify-between items-center mb-2 text-sm md:text-base">
                        <span className="text-primary-200">سعر الدورة</span>
                        <span>{selectedCourse.price.toLocaleString()} د.ع</span>
                      </div>
                      {selectedCourse.oldPrice && (
                        <div className="flex justify-between items-center mb-4 text-xs text-primary-400 line-through">
                          <span>السعر الأصلي</span>
                          <span>{selectedCourse.oldPrice.toLocaleString()} د.ع</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-xl font-extrabold text-secondary-400 mt-2">
                        <span>الإجمالي</span>
                        <span>{selectedCourse.price.toLocaleString()} د.ع</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 opacity-60">
                    <AlertCircle size={48} className="mx-auto mb-4" />
                    <p className="text-sm">يرجى اختيار دورة من القائمة لعرض الملخص</p>
                  </div>
                )}

                <div className="mt-8 bg-primary-800/50 p-4 rounded-lg text-xs text-primary-200 leading-relaxed flex gap-2">
                  <CheckCircle size={16} className="flex-shrink-0 text-secondary-500" />
                  <span>بإرسال هذا النموذج، أنت توافق على شروط وأحكام منصة شمسية للتعليم الإلكتروني.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseRegister;