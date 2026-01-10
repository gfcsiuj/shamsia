import React from 'react';
import { INSTRUCTORS } from '../constants';
import InstructorCard from '../components/InstructorCard';

const Instructors: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-primary-900 mb-4">نخبة المدربين</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            تعلم من أفضل الخبراء في الوطن العربي، حيث نجمع لك بين الخبرة الأكاديمية والممارسة العملية
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {INSTRUCTORS.map(instructor => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))}
        </div>

        {/* Join as Instructor */}
        <div className="mt-20 bg-primary-800 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">هل تمتلك خبرة تود مشاركتها؟</h2>
            <p className="text-primary-200 mb-8 max-w-2xl mx-auto">
              انضم إلى فريق مدربي شمسية وساهم في بناء جيل المستقبل. نقدم لك كافة الدعم التقني والتسويقي.
            </p>
            <button className="bg-white text-primary-800 px-8 py-3 rounded-lg font-bold hover:bg-secondary-500 hover:text-white transition">
              انضم كمدرب
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructors;
