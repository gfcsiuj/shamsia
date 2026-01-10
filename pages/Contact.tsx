import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('تم إرسال طلبك بنجاح! سيقوم فريقنا بالتواصل معك قريباً.');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row mb-12">
          
          {/* Info Side */}
          <div className="bg-primary-900 text-white p-12 md:w-2/5 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-6">تواصل معنا</h2>
              <p className="text-primary-200 mb-12 leading-relaxed">
                هل لديك استفسار حول دوراتنا؟ أو ترغب في تسجيل مجموعة؟ نحن هنا لمساعدتك.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Phone className="text-secondary-500 mt-1" />
                  <div>
                    <h4 className="font-bold text-lg">اتصل بنا</h4>
                    <p className="text-primary-200 text-sm ltr">0773 220 0003</p>
                  </div>
                </div>
                 <div className="flex items-start gap-4">
                  <MessageCircle className="text-secondary-500 mt-1" />
                  <div>
                    <h4 className="font-bold text-lg">واتساب</h4>
                    <p className="text-primary-200 text-sm ltr">+964 783 220 0003</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="text-secondary-500 mt-1" />
                  <div>
                    <h4 className="font-bold text-lg">البريد الإلكتروني</h4>
                    <p className="text-primary-200 text-sm">info@shamsia.edu</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="text-secondary-500 mt-1" />
                  <div>
                    <h4 className="font-bold text-lg">الموقع</h4>
                    <p className="text-primary-200 text-sm">العراق، بغداد</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-primary-800">
               <p className="text-sm opacity-60">أوقات العمل: الأحد - الخميس 9ص - 5م</p>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-12 md:w-3/5">
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
                className="w-full bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-4 rounded-lg transition shadow-lg shadow-secondary-500/20 flex items-center justify-center gap-2"
              >
                إرسال الرسالة
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="bg-white rounded-2xl shadow-lg p-2 overflow-hidden h-96">
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