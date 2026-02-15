import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { Certificate } from '../types';
import { CheckCircle, XCircle, Award, Calendar, User, BookOpen, Loader2, ArrowRight } from 'lucide-react';

const VerifyCertificate: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [certificate, setCertificate] = useState<Certificate | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCertificate = async () => {
            if (!id) return;
            try {
                const snap = await db.collection('certificates')
                    .where('certificateNumber', '==', id)
                    .limit(1)
                    .get();

                if (!snap.empty) {
                    setCertificate({ id: snap.docs[0].id, ...snap.docs[0].data() } as Certificate);
                } else {
                    setError('لم يتم العثور على شهادة بهذا الرقم. يرجى التأكد من الرقم والمحاولة مرة أخرى.');
                }
            } catch (err) {
                console.error(err);
                setError('حدث خطأ أثناء التحقق من الشهادة.');
            } finally {
                setLoading(false);
            }
        };

        fetchCertificate();
    }, [id]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block mb-4">
                        <img src="https://k.top4top.io/p_3662fca071.png" alt="شمسية" className="w-16 h-16 mx-auto rounded-xl shadow-lg" />
                    </Link>
                    <h1 className="text-2xl font-black text-slate-800">نظام التحقق من الشهادات</h1>
                    <p className="text-slate-500 font-medium">منصة شمسية التعليمية</p>
                </div>

                {loading ? (
                    <div className="bg-white rounded-3xl p-10 shadow-xl text-center">
                        <Loader2 className="animate-spin text-emerald-600 mx-auto mb-4" size={40} />
                        <p className="text-slate-600 font-bold">جاري التحقق من صحة الشهادة...</p>
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-3xl p-10 shadow-xl text-center border-b-4 border-red-500 animate-fade-up">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="text-red-500" size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-red-600 mb-2">شهادة غير صالحة</h2>
                        <p className="text-slate-600 mb-6">{error}</p>
                        <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-500 font-mono mb-6">
                            رقم الشهادة: {id}
                        </div>
                        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold transition">
                            <ArrowRight size={18} /> العودة للصفحة الرئيسية
                        </Link>
                    </div>
                ) : certificate ? (
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-b-4 border-emerald-500 animate-fade-up relative">
                        {/* Status Banner */}
                        <div className={`p-4 text-center font-bold text-white ${certificate.status === 'issued' ? 'bg-emerald-600' : 'bg-red-500'}`}>
                            {certificate.status === 'issued' ? (
                                <div className="flex items-center justify-center gap-2"><CheckCircle size={20} /> شهادة معتمدة وصحيحة</div>
                            ) : (
                                <div className="flex items-center justify-center gap-2"><XCircle size={20} /> هذه الشهادة ملغاة</div>
                            )}
                        </div>

                        <div className="p-8 md:p-10">
                            <div className="text-center mb-8">
                                <Award className={`mx-auto mb-4 ${certificate.status === 'issued' ? 'text-amber-500' : 'text-slate-300'}`} size={64} />
                                <h2 className="text-xl font-bold text-slate-900 mb-1">شهادة إتمام دورة</h2>
                                <div className="text-sm text-slate-400 font-mono">{certificate.certificateNumber}</div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <User className="text-blue-600" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-400 font-bold mb-1">اسم المتدرب</div>
                                        <div className="text-lg font-black text-slate-800">{certificate.studentName}</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <BookOpen className="text-purple-600" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-400 font-bold mb-1">اسم الدورة</div>
                                        <div className="text-lg font-black text-slate-800">{certificate.courseTitle}</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Calendar className="text-orange-600" size={20} />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-400 font-bold mb-1">تاريخ الإصدار</div>
                                        <div className="text-lg font-black text-slate-800">
                                            {new Date(certificate.issueDate).toLocaleDateString('ar-IQ', {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 text-center">
                                <p className="text-xs text-slate-400 mb-4">تم إصدار هذه الشهادة إلكترونياً من منصة شمسية</p>
                                <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold transition p-2 hover:bg-emerald-50 rounded-xl">
                                    الذهاب للمنصة <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default VerifyCertificate;
