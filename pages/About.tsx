import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Target, Heart, Award, ShieldCheck, Loader2, ChevronLeft, ChevronRight, X, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { db } from '../lib/firebase';
import { Instructor } from '../types';

interface TrainerCert { id: string; instructorId: string; instructorName: string; title: string; description: string; images: string[]; }
interface CompanyCert { id: string; name: string; frontImage: string; backImage?: string; }
interface Partner { name: string; logoUrl?: string; }

const About: React.FC = () => {
  const { t, isEnglish } = useTheme();
  const [trainerCerts, setTrainerCerts] = useState<TrainerCert[]>([]);
  const [companyCerts, setCompanyCerts] = useState<CompanyCert[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  // Lightbox (company certs)
  const [lbImages, setLbImages] = useState<string[]>([]);
  const [lbIdx, setLbIdx] = useState(0);
  const [lbOpen, setLbOpen] = useState(false);

  // Trainer cert modal
  const [selectedCert, setSelectedCert] = useState<TrainerCert | null>(null);
  const [certImgIdx, setCertImgIdx] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [tSnap, cSnap, pSnap, iSnap] = await Promise.all([
          db.collection('trainerCertificates').get(),
          db.collection('companyCertificates').get(),
          db.collection('partners').get(),
          db.collection('instructors').get(),
        ]);
        setTrainerCerts(tSnap.docs.map(d => ({ id: d.id, ...d.data() } as TrainerCert)));
        setCompanyCerts(cSnap.docs.map(d => ({ id: d.id, ...d.data() } as CompanyCert)));
        setPartners(pSnap.docs.map(d => d.data() as Partner));
        setInstructors(iSnap.docs.map(d => ({ id: d.id, ...d.data() } as Instructor)));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const openLb = useCallback((images: string[], idx = 0) => {
    setLbImages(images);
    setLbIdx(idx);
    setLbOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLb = useCallback(() => {
    setLbOpen(false);
    setLbImages([]);
    document.body.style.overflow = '';
  }, []);

  const lbNext = useCallback(() => setLbIdx(prev => (prev + 1) % lbImages.length), [lbImages.length]);
  const lbPrev = useCallback(() => setLbIdx(prev => (prev - 1 + lbImages.length) % lbImages.length), [lbImages.length]);

  const openCertModal = useCallback((cert: TrainerCert) => {
    setSelectedCert(cert);
    setCertImgIdx(0);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeCertModal = useCallback(() => {
    setSelectedCert(null);
    document.body.style.overflow = '';
  }, []);

  // Keyboard nav
  useEffect(() => {
    if (!lbOpen && !selectedCert) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { if (selectedCert) closeCertModal(); else closeLb(); }
      if (lbOpen) {
        if (e.key === 'ArrowRight') lbPrev();
        if (e.key === 'ArrowLeft') lbNext();
      }
      if (selectedCert && selectedCert.images.length > 1) {
        if (e.key === 'ArrowRight') setCertImgIdx(prev => (prev - 1 + selectedCert.images.length) % selectedCert.images.length);
        if (e.key === 'ArrowLeft') setCertImgIdx(prev => (prev + 1) % selectedCert.images.length);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lbOpen, selectedCert, closeLb, closeCertModal, lbNext, lbPrev]);

  const values = [
    { icon: ShieldCheck, title: t('المصداقية', 'Integrity'), desc: t('نلتزم بأعلى معايير الشفافية والموثوقية.', 'We commit to the highest standards of transparency.'), color: 'emerald' },
    { icon: Heart, title: t('الشغف', 'Passion'), desc: t('شغفنا بالتعليم هو الدافع الرئيسي لنا.', 'Our passion for education is our main driver.'), color: 'orange' },
    { icon: Award, title: t('التميز', 'Excellence'), desc: t('لا نرضى بأقل من الجودة العالية.', 'We settle for nothing less than high quality.'), color: 'blue' },
  ];

  const missionPoints = [
    t('تقديم محتوى عربي وعراقي عالي الجودة.', 'Providing high-quality Arabic and Iraqi content.'),
    t('سد الفجوة بين التعليم الجامعي وسوق العمل.', 'Bridging the gap between education and the job market.'),
    t('دعم التعلم المستمر وتحقيق أهداف التنمية المستدامة.', 'Supporting continuous learning and SDGs.'),
  ];

  /* ═══════════ LIGHTBOX (company certs) ═══════════ */
  const renderLightbox = () => {
    if (!lbOpen || lbImages.length === 0) return null;

    const lightbox = (
      <div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.96)',
          display: 'flex', flexDirection: 'column',
        }}
        onClick={closeLb}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', flexShrink: 0,
        }} onClick={e => e.stopPropagation()}>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: 700 }}>
            {lbImages.length > 1 ? `${lbIdx + 1} / ${lbImages.length}` : ''}
          </div>
          <button onClick={closeLb} style={{
            width: '44px', height: '44px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)', border: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
          }}><X size={24} /></button>
        </div>

        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', minHeight: 0, padding: '0 8px',
        }} onClick={e => e.stopPropagation()}>
          {lbImages.length > 1 && (
            <button onClick={lbPrev} style={{
              position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
              zIndex: 5, width: '44px', height: '44px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
            }}><ChevronRight size={24} /></button>
          )}
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 48px' }}>
            <img key={lbIdx} src={lbImages[lbIdx]} alt="" style={{
              maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
              borderRadius: '12px', userSelect: 'none',
            }} draggable={false} />
          </div>
          {lbImages.length > 1 && (
            <button onClick={lbNext} style={{
              position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)',
              zIndex: 5, width: '44px', height: '44px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
            }}><ChevronLeft size={24} /></button>
          )}
        </div>

        {lbImages.length > 1 && (
          <div style={{
            flexShrink: 0, padding: '12px 16px', display: 'flex', justifyContent: 'center',
            gap: '8px', overflowX: 'auto',
          }} onClick={e => e.stopPropagation()}>
            {lbImages.map((img, idx) => (
              <button key={idx} onClick={() => setLbIdx(idx)} style={{
                width: '52px', height: '52px', borderRadius: '10px', overflow: 'hidden',
                flexShrink: 0, border: idx === lbIdx ? '2px solid #fff' : '2px solid transparent',
                opacity: idx === lbIdx ? 1 : 0.4, cursor: 'pointer',
                transform: idx === lbIdx ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.2s', padding: 0, background: 'none',
              }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        )}
      </div>
    );

    return ReactDOM.createPortal(lightbox, document.body);
  };

  /* ═══════════ CERT DETAIL MODAL (trainer certs) ═══════════ */
  const renderCertModal = () => {
    if (!selectedCert) return null;
    const instructor = instructors.find(i => i.id === selectedCert.instructorId);
    const images = selectedCert.images;

    const modal = (
      <div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 99999, backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '16px', backdropFilter: 'blur(8px)',
        }}
        onClick={closeCertModal}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: '#fff', borderRadius: '24px', maxWidth: '900px', width: '100%',
            maxHeight: '90vh', overflow: 'auto', position: 'relative',
            boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
          }}
        >
          {/* Close */}
          <button onClick={closeCertModal} style={{
            position: 'absolute', top: '16px', left: '16px', zIndex: 20,
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569',
          }}><X size={20} /></button>

          {/* Certificate Image */}
          <div style={{
            position: 'relative', background: '#f8fafc', borderRadius: '24px 24px 0 0',
            padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', minHeight: '280px',
          }}>
            {images.length > 0 && (
              <>
                <img
                  key={certImgIdx}
                  src={images[certImgIdx]}
                  alt={selectedCert.title}
                  style={{
                    maxWidth: '100%', maxHeight: '380px', objectFit: 'contain',
                    borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  }}
                />
                {images.length > 1 && (
                  <>
                    <button onClick={() => setCertImgIdx(prev => (prev - 1 + images.length) % images.length)} style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.06)',
                      border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569',
                    }}><ChevronRight size={20} /></button>
                    <button onClick={() => setCertImgIdx(prev => (prev + 1) % images.length)} style={{
                      position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                      width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,0,0,0.06)',
                      border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569',
                    }}><ChevronLeft size={20} /></button>
                  </>
                )}
              </>
            )}

            {/* Dots */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
                {images.map((_, idx) => (
                  <button key={idx} onClick={() => setCertImgIdx(idx)} style={{
                    width: idx === certImgIdx ? '24px' : '8px', height: '8px',
                    borderRadius: '4px', border: 'none', cursor: 'pointer',
                    background: idx === certImgIdx ? '#10b981' : '#cbd5e1',
                    transition: 'all 0.3s', padding: 0,
                  }} />
                ))}
              </div>
            )}
          </div>

          {/* Info section */}
          <div style={{ padding: '24px 28px 28px' }}>
            {/* Cert details */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px', background: '#ecfdf5',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Award size={18} style={{ color: '#10b981' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', fontStyle: 'italic', margin: 0 }}>
                  {selectedCert.title}
                </h3>
              </div>
              {selectedCert.description && (
                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.8', margin: 0, paddingRight: '46px' }}>
                  {selectedCert.description}
                </p>
              )}
            </div>

            <div style={{ height: '1px', background: '#f1f5f9', margin: '16px 0' }}></div>

            {/* Trainer info */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              background: '#f8fafc', borderRadius: '16px', padding: '16px 20px',
              border: '1px solid #e2e8f0',
            }}>
              {instructor?.image ? (
                <img src={instructor.image} alt={instructor.name} style={{
                  width: '56px', height: '56px', borderRadius: '16px', objectFit: 'cover',
                  border: '3px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', flexShrink: 0,
                }} />
              ) : (
                <div style={{
                  width: '56px', height: '56px', borderRadius: '16px', background: '#e2e8f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}><User size={24} style={{ color: '#94a3b8' }} /></div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0', fontStyle: 'italic' }}>
                  {instructor?.name || selectedCert.instructorName}
                </h4>
                {instructor?.roles && instructor.roles.length > 0 && (
                  <span style={{
                    fontSize: '11px', fontWeight: 700, background: '#ecfdf5', color: '#059669',
                    padding: '3px 10px', borderRadius: '8px', display: 'inline-block',
                  }}>{instructor.roles[0]}</span>
                )}
                {instructor?.shortBio && (
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 0', lineHeight: '1.5' }}>
                    {instructor.shortBio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    return ReactDOM.createPortal(modal, document.body);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero */}
      <div className="relative pt-16 md:pt-20 pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-100/50 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-orange-100/40 rounded-full blur-[80px] animate-blob delay-2000"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-4 md:mb-6 italic tracking-tight animate-fade-up">
            {isEnglish ? (<>About <span className="text-gradient">Us</span></>) : (<>من <span className="text-gradient">نحن</span></>)}
          </h1>
          <p className="text-slate-600 text-base md:text-xl max-w-3xl mx-auto font-medium animate-fade-up delay-100 px-2">
            {t('منصة شمسية الألكترونية منصة تعمل بأيادٍ عراقية وعربية، هدفها تحقيق مفهوم التنمية المستدامة (SDG).', 'Shamsiya is an electronic platform built by Iraqi and Arab hands.')}
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-12 md:py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="animate-fade-up">
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              <div className="w-11 h-11 md:w-14 md:h-14 bg-emerald-100 rounded-xl md:rounded-2xl flex items-center justify-center">
                <Target className="text-emerald-600" size={22} />
              </div>
              <h2 className="text-xl md:text-3xl font-black text-slate-900 italic">{t('رؤيتنا ورسالتنا', 'Our Vision & Mission')}</h2>
            </div>
            <p className="text-slate-600 leading-loose text-sm md:text-lg mb-6">
              {t('نسعى لأن نكون طريقك الأمثل لتحقيق الوظيفة الدائمية من خلال توفير بيئة تعليمية تفاعلية.', 'We strive to be your optimal path to achieving permanent employment.')}
            </p>
            <ul className="space-y-3">
              {missionPoints.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700 font-medium text-sm md:text-base">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4 animate-fade-up delay-200">
            <img src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80&w=400" className="rounded-2xl md:rounded-[2rem] shadow-lg mt-6 hover:scale-105 transition duration-500" alt="Team" />
            <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=400" className="rounded-2xl md:rounded-[2rem] shadow-lg hover:scale-105 transition duration-500" alt="Office" />
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-slate-50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-black text-center text-slate-900 mb-8 md:mb-12 italic animate-fade-up">
            {isEnglish ? (<>Our <span className="text-emerald-600">Core Values</span></>) : (<>قيمنا <span className="text-emerald-600">الجوهرية</span></>)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {values.map((val, idx) => {
              const colorMap: Record<string, string> = {
                emerald: 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600',
                orange: 'bg-orange-100 text-orange-600 group-hover:bg-orange-600',
                blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-600',
              };
              return (
                <div key={idx} className="group bg-white p-6 md:p-8 rounded-2xl shadow-sm text-center hover:-translate-y-2 hover:shadow-xl transition duration-300 border border-slate-100 animate-fade-up" style={{ animationDelay: `${idx * 150}ms` }}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${colorMap[val.color]} group-hover:text-white transition-all duration-300`}>
                    <val.icon size={28} />
                  </div>
                  <h3 className="text-lg font-black mb-2 text-slate-800 italic">{val.title}</h3>
                  <p className="text-slate-500 text-sm">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Partners */}
      <div className="py-12 md:py-20 container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-8 md:mb-12 italic animate-fade-up">
          {isEnglish ? (<>Success <span className="text-emerald-600">Partners</span></>) : (<>شركاء <span className="text-emerald-600">النجاح</span></>)}
        </h2>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>
        ) : partners.length > 0 ? (
          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-5 animate-fade-up delay-200">
            {partners.map((partner, idx) => (
              <div key={idx} className="flex items-center gap-2 md:gap-3 bg-white border-2 border-slate-200 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl hover:border-emerald-300 hover:shadow-lg transition duration-300 cursor-default group">
                {partner.logoUrl && <img src={partner.logoUrl} alt={partner.name} className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-lg" />}
                <span className="text-sm md:text-lg font-black text-slate-600 group-hover:text-emerald-600 transition">{partner.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 animate-fade-up delay-200">
            {[t('جامعة المستقبل', 'Future University'), 'Tech Solutions', t('معهد الإدارة', 'Management Institute')].map((p, idx) => (
              <div key={idx} className="text-sm md:text-xl font-black text-slate-400 border-2 border-slate-200 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl hover:border-emerald-300 hover:text-emerald-600 transition cursor-default">{p}</div>
            ))}
          </div>
        )}
      </div>

      {/* ══════ Company Certificates ══════ */}
      <div className="py-12 md:py-16 container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 md:mb-10 italic animate-fade-up">
          {isEnglish ? (<>Accredited <span className="text-emerald-600">Certificates</span></>) : (<>الشهادات <span className="text-emerald-600">المعتمدة</span></>)}
        </h2>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>
        ) : companyCerts.length > 0 ? (
          <div className="bg-emerald-50/50 rounded-2xl p-4 md:p-8 border border-emerald-100 max-w-5xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {companyCerts.map(cert => {
                const imgs = [cert.frontImage];
                if (cert.backImage) imgs.push(cert.backImage);
                return (
                  <div key={cert.id} className="cursor-pointer group" onClick={() => openLb(imgs)}>
                    <div className="bg-white border-2 border-emerald-200 shadow-sm rounded-xl overflow-hidden hover:shadow-xl hover:border-emerald-400 hover:-translate-y-1 transition-all duration-300 aspect-[3/4] p-2 flex items-center justify-center">
                      <img src={cert.frontImage} alt={cert.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <p className="text-xs md:text-sm font-black text-slate-700 mt-2 text-center truncate">{cert.name}</p>
                    {cert.backImage && <p className="text-[10px] text-emerald-600 font-bold text-center">{t('وجهان', '2 sides')}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 p-8 rounded-2xl inline-block border border-emerald-100">
            <div className="flex gap-3 justify-center">
              <div className="w-28 h-36 bg-white border border-emerald-200 rounded-xl flex items-center justify-center text-xs text-slate-400">{t('نموذج 1', 'Cert 1')}</div>
              <div className="w-28 h-36 bg-white border border-emerald-200 rounded-xl flex items-center justify-center text-xs text-slate-400">{t('نموذج 2', 'Cert 2')}</div>
            </div>
          </div>
        )}
      </div>

      {/* ══════ Trainer Certificates ══════ */}
      <div className="py-12 md:py-16 container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-black text-center text-slate-900 mb-8 md:mb-10 italic animate-fade-up">
          {isEnglish ? (<>Trainer <span className="text-emerald-600">Certificates</span></>) : (<>شهادات <span className="text-emerald-600">المدربين</span></>)}
        </h2>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>
        ) : trainerCerts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {trainerCerts.map(tc => {
              const instructor = instructors.find(i => i.id === tc.instructorId);
              return (
                <div key={tc.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group text-right cursor-pointer"
                  onClick={() => openCertModal(tc)}
                >
                  {tc.images.length > 0 && (
                    <div className="relative h-44 md:h-52 overflow-hidden bg-slate-100">
                      <img src={tc.images[0]} alt={tc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {tc.images.length > 1 && (
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-[11px] font-bold">
                          📷 {tc.images.length}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-4 md:p-5">
                    <div className="flex items-center gap-2 mb-2">
                      {instructor?.image ? (
                        <img src={instructor.image} alt={instructor.name} className="w-7 h-7 rounded-lg object-cover border border-slate-200" />
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center">
                          <User size={14} className="text-teal-600" />
                        </div>
                      )}
                      <span className="text-[11px] font-bold text-teal-700">{tc.instructorName}</span>
                    </div>
                    <h4 className="font-black text-slate-800 text-sm md:text-base mb-1">{tc.title}</h4>
                    {tc.description && <p className="text-xs text-slate-400 line-clamp-2">{tc.description}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-400 font-medium text-center">{t('سيتم إضافة شهادات المدربين قريباً', 'Trainer certificates coming soon')}</p>
        )}
      </div>

      {renderLightbox()}
      {renderCertModal()}
    </div>
  );
};

export default About;