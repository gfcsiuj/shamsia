import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Award, Loader2, ChevronLeft, ChevronRight, X, User, Share2, ShieldCheck, BadgeCheck, GraduationCap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { db } from '../lib/firebase';
import { Instructor } from '../types';

interface TrainerCert { id: string; instructorId: string; instructorName: string; title: string; description: string; images: string[]; }
interface CompanyCert { id: string; name: string; frontImage: string; backImage?: string; }

const Certificates: React.FC = () => {
    const { t, isEnglish } = useTheme();
    const [trainerCerts, setTrainerCerts] = useState<TrainerCert[]>([]);
    const [companyCerts, setCompanyCerts] = useState<CompanyCert[]>([]);
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [loading, setLoading] = useState(true);

    // Distribution
    const [distText, setDistText] = useState('');
    const [distImages, setDistImages] = useState<string[]>([]);

    // Lightbox
    const [lbImages, setLbImages] = useState<string[]>([]);
    const [lbIdx, setLbIdx] = useState(0);
    const [lbOpen, setLbOpen] = useState(false);

    // Trainer cert modal
    const [selectedCert, setSelectedCert] = useState<TrainerCert | null>(null);
    const [certImgIdx, setCertImgIdx] = useState(0);

    // Active filter tab
    const [activeTab, setActiveTab] = useState<'all' | 'company' | 'trainer' | 'distribution'>('all');

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [tSnap, cSnap, iSnap, distSnap] = await Promise.all([
                    db.collection('trainerCertificates').get(),
                    db.collection('companyCertificates').get(),
                    db.collection('instructors').get(),
                    db.collection('siteSettings').doc('certificateDistribution').get(),
                ]);
                setTrainerCerts(tSnap.docs.map(d => ({ id: d.id, ...d.data() } as TrainerCert)));
                setCompanyCerts(cSnap.docs.map(d => ({ id: d.id, ...d.data() } as CompanyCert)));
                setInstructors(iSnap.docs.map(d => ({ id: d.id, ...d.data() } as Instructor)));
                if (distSnap.exists) {
                    const data = distSnap.data() as any;
                    setDistText(data.text || '');
                    setDistImages((data.images || []).filter((i: string) => i.trim()));
                }
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

    // Count badges
    const companyCount = companyCerts.length;
    const trainerCount = trainerCerts.length;
    const distCount = distImages.length;
    const totalCount = companyCount + trainerCount + distCount;

    const showCompany = activeTab === 'all' || activeTab === 'company';
    const showTrainer = activeTab === 'all' || activeTab === 'trainer';
    const showDist = activeTab === 'all' || activeTab === 'distribution';

    /* ═══════════ LIGHTBOX ═══════════ */
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

    /* ═══════════ CERT DETAIL MODAL ═══════════ */
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
                    <button onClick={closeCertModal} style={{
                        position: 'absolute', top: '16px', left: '16px', zIndex: 20,
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569',
                    }}><X size={20} /></button>

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

                    <div style={{ padding: '24px 28px 28px' }}>
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

                        {instructor && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {instructor.image ? (
                                    <img src={instructor.image} alt={instructor.name} style={{
                                        width: '44px', height: '44px', borderRadius: '14px', objectFit: 'cover',
                                        border: '2px solid #e2e8f0',
                                    }} />
                                ) : (
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '14px', background: '#f0fdfa',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <User size={18} style={{ color: '#14b8a6' }} />
                                    </div>
                                )}
                                <div>
                                    <p style={{ fontWeight: 800, color: '#0f172a', fontSize: '15px', margin: 0 }}>{instructor.name}</p>
                                    <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>{instructor.specialization || t('مدرب', 'Instructor')}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );

        return ReactDOM.createPortal(modal, document.body);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Hero Section */}
            <div className="relative pt-20 pb-16 overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-100/50 rounded-full blur-[100px] animate-blob"></div>
                    <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-emerald-100/40 rounded-full blur-[80px] animate-blob delay-2000"></div>
                </div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-6 animate-fade-up">
                        <Award size={16} />
                        {!loading && <span>{totalCount} {t('شهادة معتمدة', 'Accredited Certificates')}</span>}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 italic tracking-tight animate-fade-up">
                        {isEnglish ? (
                            <>Our <span className="text-gradient">Certificates</span></>
                        ) : (
                            <>الشهادات <span className="text-gradient">والاعتمادات</span></>
                        )}
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium animate-fade-up delay-100">
                        {t('تصفح شهاداتنا المعتمدة وشهادات المدربين المتخصصين', 'Browse our accredited certificates and specialized trainer certifications')}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl -mt-4">
                {/* Filter Tabs */}
                <div className="flex justify-center mb-10">
                    <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100 flex gap-1 flex-wrap justify-center">
                        {[
                            { key: 'all' as const, label: t('الكل', 'All'), icon: Award, count: totalCount },
                            { key: 'company' as const, label: t('شهادات المركز', 'Company'), icon: ShieldCheck, count: companyCount },
                            { key: 'trainer' as const, label: t('شهادات المدربين', 'Trainers'), icon: GraduationCap, count: trainerCount },
                            { key: 'distribution' as const, label: t('توزيع الشهادات', 'Distribution'), icon: Share2, count: distCount },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === tab.key
                                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                    }`}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                                {!loading && tab.count > 0 && (
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>
                ) : (
                    <div className="space-y-16">
                        {/* ══════ Company Certificates ══════ */}
                        {showCompany && companyCerts.length > 0 && (
                            <section className="animate-fade-up">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                        <ShieldCheck size={20} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-black text-slate-900 italic">
                                            {isEnglish ? <>Accredited <span className="text-emerald-600">Certificates</span></> : <>الشهادات <span className="text-emerald-600">المعتمدة</span></>}
                                        </h2>
                                        <p className="text-xs text-slate-400 font-bold">{companyCount} {t('شهادة', 'certificates')}</p>
                                    </div>
                                </div>
                                <div className="bg-white rounded-[2rem] p-4 md:p-8 border border-slate-100 shadow-sm">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                                        {companyCerts.map(cert => {
                                            const imgs = [cert.frontImage];
                                            if (cert.backImage) imgs.push(cert.backImage);
                                            return (
                                                <div key={cert.id} className="cursor-pointer group" onClick={() => openLb(imgs)}>
                                                    <div className="bg-slate-50 border-2 border-slate-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-xl hover:border-emerald-400 hover:-translate-y-2 transition-all duration-300 aspect-[3/4] p-3 flex items-center justify-center group-hover:bg-emerald-50/50">
                                                        <img src={cert.frontImage} alt={cert.name} className="max-w-full max-h-full object-contain" />
                                                    </div>
                                                    <p className="text-xs md:text-sm font-black text-slate-700 mt-3 text-center truncate">{cert.name}</p>
                                                    {cert.backImage && <p className="text-[10px] text-emerald-600 font-bold text-center mt-0.5">{t('وجهان', '2 sides')}</p>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* ══════ Trainer Certificates ══════ */}
                        {showTrainer && trainerCerts.length > 0 && (
                            <section className="animate-fade-up">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                        <GraduationCap size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-black text-slate-900 italic">
                                            {isEnglish ? <>Trainer <span className="text-blue-600">Certificates</span></> : <>شهادات <span className="text-blue-600">المدربين</span></>}
                                        </h2>
                                        <p className="text-xs text-slate-400 font-bold">{trainerCount} {t('شهادة', 'certificates')}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                                    {trainerCerts.map(tc => {
                                        const instructor = instructors.find(i => i.id === tc.instructorId);
                                        return (
                                            <div key={tc.id}
                                                className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group text-right cursor-pointer"
                                                onClick={() => openCertModal(tc)}
                                            >
                                                {tc.images.length > 0 && (
                                                    <div className="relative h-48 md:h-56 overflow-hidden bg-slate-100">
                                                        <img src={tc.images[0]} alt={tc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                        {tc.images.length > 1 && (
                                                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-xl text-[11px] font-bold">
                                                                📷 {tc.images.length}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="p-5 md:p-6">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        {instructor?.image ? (
                                                            <img src={instructor.image} alt={instructor.name} className="w-8 h-8 rounded-xl object-cover border border-slate-200" />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center">
                                                                <User size={14} className="text-teal-600" />
                                                            </div>
                                                        )}
                                                        <span className="text-[11px] font-bold text-teal-700">{tc.instructorName}</span>
                                                    </div>
                                                    <h4 className="font-black text-slate-800 text-sm md:text-base mb-1 line-clamp-2">{tc.title}</h4>
                                                    {tc.description && <p className="text-xs text-slate-400 line-clamp-2">{tc.description}</p>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* ══════ Certificate Distribution ══════ */}
                        {showDist && (distText || distImages.length > 0) && (
                            <section className="animate-fade-up">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                        <Share2 size={20} className="text-orange-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-black text-slate-900 italic">
                                            {isEnglish ? <>Certificate <span className="text-orange-600">Distribution</span></> : <>توزيع <span className="text-orange-600">الشهادات</span></>}
                                        </h2>
                                        {distImages.length > 0 && <p className="text-xs text-slate-400 font-bold">{distCount} {t('صورة', 'images')}</p>}
                                    </div>
                                </div>

                                {distText && (
                                    <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm mb-6">
                                        <p className="text-slate-600 text-sm md:text-base leading-loose whitespace-pre-wrap">{distText}</p>
                                    </div>
                                )}

                                {distImages.length > 0 && (
                                    <div className="bg-white rounded-[2rem] p-4 md:p-8 border border-slate-100 shadow-sm">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                                            {distImages.map((img, idx) => (
                                                <div key={idx} className="cursor-pointer group" onClick={() => openLb(distImages, idx)}>
                                                    <div className="bg-slate-50 border-2 border-slate-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-xl hover:border-orange-400 hover:-translate-y-2 transition-all duration-300 aspect-square p-1 flex items-center justify-center">
                                                        <img src={img} alt={`${idx + 1}`} className="max-w-full max-h-full object-cover rounded-lg" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Empty state */}
                        {!loading && companyCerts.length === 0 && trainerCerts.length === 0 && !distText && distImages.length === 0 && (
                            <div className="text-center py-20">
                                <Award className="mx-auto mb-4 text-slate-300" size={64} />
                                <p className="text-slate-400 font-bold text-lg">{t('لا توجد شهادات حالياً', 'No certificates available at the moment')}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {renderLightbox()}
            {renderCertModal()}
        </div>
    );
};

export default Certificates;
