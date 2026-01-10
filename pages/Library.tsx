import React, { useState } from 'react';
import { FileText, Download, PlayCircle, Book, ArrowLeft } from 'lucide-react';
import { RESOURCES } from '../constants';

const Library: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'article' | 'pdf' | 'video'>('all');

  const filteredResources = activeFilter === 'all' 
    ? RESOURCES 
    : RESOURCES.filter(r => r.type === activeFilter);

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <Book size={24} />;
      case 'video': return <PlayCircle size={24} />;
      case 'article': return <FileText size={24} />;
      default: return <FileText size={24} />;
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case 'pdf': return 'كتب وملفات';
      case 'video': return 'ورش مسجلة';
      case 'article': return 'مقالات';
      default: return '';
    }
  };

  const getColor = (type: string) => {
     switch (type) {
      case 'pdf': return 'bg-red-100 text-red-600';
      case 'video': return 'bg-purple-100 text-purple-600';
      case 'article': return 'bg-blue-100 text-blue-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-primary-900 py-16 text-white overflow-hidden relative">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in-down">مكتبة المعرفة</h1>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto animate-fade-in-up delay-100">
            مصادر تعليمية متنوعة ومفتوحة لدعم مسيرتك التعليمية والمهنية
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-8 flex flex-wrap justify-center gap-4 animate-scale-in delay-200">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-6 py-2 rounded-full font-bold transition duration-300 transform active:scale-95 ${activeFilter === 'all' ? 'bg-primary-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            الكل
          </button>
          <button 
            onClick={() => setActiveFilter('article')}
            className={`px-6 py-2 rounded-full font-bold transition duration-300 transform active:scale-95 ${activeFilter === 'article' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            مقالات
          </button>
          <button 
            onClick={() => setActiveFilter('pdf')}
            className={`px-6 py-2 rounded-full font-bold transition duration-300 transform active:scale-95 ${activeFilter === 'pdf' ? 'bg-red-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            كتب وملفات
          </button>
          <button 
            onClick={() => setActiveFilter('video')}
            className={`px-6 py-2 rounded-full font-bold transition duration-300 transform active:scale-95 ${activeFilter === 'video' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            ورش مسجلة
          </button>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => (
            <div key={resource.id} className={`bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col animate-fade-in-up delay-${(index % 5) * 100 + 300}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColor(resource.type)}`}>
                  {getIcon(resource.type)}
                </div>
                <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{resource.category}</span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-2">{resource.title}</h3>
              <p className="text-slate-500 text-sm mb-6 flex-grow">{resource.description}</p>
              
              <div className="pt-4 border-t border-slate-50 flex justify-between items-center mt-auto">
                <span className="text-xs text-slate-400">{resource.date}</span>
                <button className="flex items-center gap-2 text-primary-600 font-bold text-sm hover:underline group">
                  {resource.type === 'pdf' ? 'تحميل' : 'مشاهدة'}
                  {resource.type === 'pdf' ? <Download size={16} className="group-hover:translate-y-1 transition" /> : <ArrowLeft size={16} className="group-hover:-translate-x-1 transition" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Library;