import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Loader2, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { db } from '../lib/firebase';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const { settings, t, isEnglish } = useTheme();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await db.collection('registrations').add({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        type: 'contact',
        status: 'new',
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error sending message:', error);
      alert(t('حدث خطأ، يرجى المحاولة مرة أخرى.', 'An error occurred. Please try again.'));
    } finally {
      setSubmitLoading(false);
    }
  };

  const contactInfo = [
    { icon: Phone, title: t("اتصل بنا", "Call Us"), val: settings.contactPhone },
    { icon: MessageCircle, title: t("واتساب", "WhatsApp"), val: settings.contactPhone },
    { icon: Mail, title: t("البريد الإلكتروني", "Email"), val: settings.contactEmail },
    { icon: MapPin, title: t("الموقع", "Location"), val: settings.contactAddress || t("العراق، بغداد", "Iraq, Baghdad") }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Hero */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-100/50 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] bg-orange-100/40 rounded-full blur-[80px] animate-blob delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4 italic tracking-tight animate-fade-up">
            {isEnglish ? (
              <>Contact <span className="text-gradient">Us</span></>
            ) : (
              <>تواصل <span className="text-gradient">معنا</span></>
            )}
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium animate-fade-up delay-100">
            {t('هل لديك استفسار؟ نحن هنا لمساعدتك', 'Have a question? We are here to help')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-xl overflow-hidden flex flex-col md:flex-row mb-12 animate-fade-up delay-200">

          {/* Info Side - Emerald Theme */}
          <div className="bg-emerald-600 text-white p-10 md:p-12 md:w-2/5 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-6 italic">
                {t('تواصل معنا', 'Get in Touch')}
              </h2>
              <p className="text-emerald-100 mb-10 leading-relaxed">
                {t(
                  'هل لديك استفسار حول دوراتنا؟ أو ترغب في تسجيل مجموعة؟ نحن هنا لمساعدتك.',
                  'Do you have questions about our courses? Or want to register a group? We are here to help.'
                )}
              </p>

              <div className="space-y-6">
                {contactInfo.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-base">{item.title}</h4>
                      <p className="text-emerald-100 text-sm ltr">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-emerald-500/30 relative z-10">
              <p className="text-sm opacity-70">
                {t('أوقات العمل: الأحد - الخميس 9ص - 5م', 'Working Hours: Sunday - Thursday 9AM - 5PM')}
              </p>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-10 md:p-12 md:w-3/5">
            <h2 className="text-2xl font-black text-slate-800 mb-8 italic">
              {t('أرسل رسالة', 'Send a Message')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {t('الاسم الكامل', 'Full Name')}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition font-medium"
                  placeholder={t('محمد أحمد', 'John Doe')}
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {t('البريد الإلكتروني', 'Email')}
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition font-medium"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    {t('رقم الهاتف', 'Phone Number')}
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition font-medium"
                    placeholder="077xxxxxxxx"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {t('الرسالة', 'Message')}
                </label>
                <textarea
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition resize-none font-medium"
                  placeholder={t('كيف يمكننا مساعدتك؟', 'How can we help you?')}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-3 italic">
                    {t('تم إرسال رسالتك بنجاح!', 'Message Sent Successfully!')}
                  </h3>
                  <p className="text-slate-500">
                    {t('سيقوم فريقنا بالتواصل معك قريباً.', 'Our team will contact you soon.')}
                  </p>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {submitLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> {t('جاري الإرسال...', 'Sending...')}</>
                  ) : (
                    <>{t('إرسال الرسالة', 'Send Message')} <Send size={18} /></>
                  )}
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Google Maps */}
        <div className="bg-white rounded-[2rem] shadow-lg p-3 overflow-hidden h-80 animate-fade-up delay-300">
          <iframe
            src={`https://maps.google.com/maps?q=33.347750,44.432194&hl=${isEnglish ? 'en' : 'ar'}&z=15&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '1.5rem' }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Shamsia Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;