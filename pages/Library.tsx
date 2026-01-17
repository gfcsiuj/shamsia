import React, { useState, useEffect } from 'react';
import { FileText, Download, PlayCircle, Book, ArrowLeft, Loader2, Search } from 'lucide-react';
import { db } from '../lib/firebase';
import { Resource } from '../types';

const Library: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'article' | 'pdf' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const querySnapshot = await db.collection('resources').orderBy('date', 'desc').get();
        const data = querySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
        } as Resource));
        setResources(data);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const filteredResources = resources.filter(r => {
    const matchesFilter = activeFilter === 'all' || r.type === activeFilter;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <Book size={24} />;
      case 'video': return <PlayCircle size={24} />;
      case 'article': return <FileText size={24} />;
      default: return <FileText size={24} />;
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
        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-scale-in delay-200 flex flex-col md:flex-row gap-6 justify-between items-center">
          
          <div className="flex flex-wrap gap-2 justify-center">
            <button 
                onClick={() => setActiveFilter('all')}
                className={`px-5 py-2 rounded-full font-bold text-sm transition duration-300 ${activeFilter === 'all' ? 'bg-primary-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
                الكل
            </button>
            <button 
                onClick={() => setActiveFilter('article')}
                className={`px-5 py-2 rounded-full font-bold text-sm transition duration-300 ${activeFilter === 'article' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
                مقالات
            </button>
            <button 
                onClick={() => setActiveFilter('pdf')}
                className={`px-5 py-2 rounded-full font-bold text-sm transition duration-300 ${activeFilter === 'pdf' ? 'bg-red-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
                كتب وملفات
            </button>
            <button 
                onClick={() => setActiveFilter('video')}
                className={`px-5 py-2 rounded-full font-bold text-sm transition duration-300 ${activeFilter === 'video' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
                ورش مسجلة
            </button>
          </div>

          <div className="relative w-full md:w-72">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="بحث في المصادر..." 
                className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary-600" size={40} />
            </div>
        ) : filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => (
                <div key={resource.id} className={`bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col animate-fade-in-up`} style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColor(resource.type)}`}>
                    {getIcon(resource.type)}
                    </div>
                    <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{resource.category}</span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">{resource.title}</h3>
                <p className="text-slate-500 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">{resource.description}</p>
                
                <div className="pt-4 border-t border-slate-50 flex justify-between items-center mt-auto">
                    <span className="text-xs text-slate-400">{resource.date}</span>
                    <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 text-primary-600 font-bold text-sm hover:underline group"
                    >
                    {resource.type === 'pdf' ? 'تحميل' : 'مشاهدة'}
                    {resource.type === 'pdf' ? <Download size={16} className="group-hover:translate-y-1 transition" /> : <ArrowLeft size={16} className="group-hover:-translate-x-1 transition" />}
                    </a>
                </div>
                </div>
            ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-slate-50 mb-4 text-slate-400">
                    <Book size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-700">لا توجد مصادر</h3>
                <p className="text-slate-500">لم يتم العثور على مصادر تطابق بحثك حالياً.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Library;