import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const { settings } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('تم إرسال طلبك بنجاح! سيقوم فريقنا بالتواصل معك قريباً.');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row mb-12 animate-fade-in-up">
          
          {/* Info Side */}
          <div className="bg-primary-900 text-white p-12 md:w-2/5 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6 animate-fade-in-right delay-100">تواصل معنا</h2>
              <p className="text-primary-200 mb-12 leading-relaxed animate-fade-in-up delay-200">
                هل لديك استفسار حول دوراتنا؟ أو ترغب في تسجيل مجموعة؟ نحن هنا لمساعدتك.
              </p>
              
              <div className="space-y-6">
                {[
                    { icon: Phone, title: "اتصل بنا", val: settings.contactPhone },
                    { icon: MessageCircle, title: "واتساب", val: settings.contactPhone },
                    { icon: Mail, title: "البريد الإلكتروني", val: settings.contactEmail },
                    { icon: MapPin, title: "الموقع", val: "العراق، بغداد" }
                ].map((item, idx) => (
                    <div key={idx} className={`flex items-start gap-4 animate-fade-in-up delay-${idx * 100 + 300}`}>
                        <item.icon className="text-secondary-500 mt-1" />
                        <div>
                            <h4 className="font-bold text-lg">{item.title}</h4>
                            <p className="text-primary-200 text-sm ltr">{item.val}</p>
                        </div>
                    </div>
                ))}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-primary-800 relative z-10 animate-fade-in delay-700">
               <p className="text-sm opacity-60">أوقات العمل: الأحد - الخميس 9ص - 5م</p>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-12 md:w-3/5 animate-fade-in delay-300">
            <h2 className="text-2xl font-bold text-slate-800 mb-8">أرسل رسالة أو سجل اهتمامك</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">الاسم الكامل</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                  placeholder="محمد أحمد"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">رقم الهاتف</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                    placeholder="077xxxxxxxx"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">الرسالة</label>
                <textarea 
                  rows={4}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition resize-none"
                  placeholder="كيف يمكننا مساعدتك؟"
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-4 rounded-lg transition shadow-lg shadow-secondary-500/20 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-95"
              >
                إرسال الرسالة
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="bg-white rounded-2xl shadow-lg p-2 overflow-hidden h-96 animate-scale-in delay-500">
          <iframe 
            src="https://maps.google.com/maps?q=33.347750,44.432194&hl=ar&z=15&output=embed"
            width="100%" 
            height="100%" 
            style={{ border: 0, borderRadius: '1rem' }} 
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