import React, { useState, useEffect } from 'react';
import { FileText, Download, PlayCircle, Book, ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { db } from '../lib/firebase';
import { Resource } from '../types';
import { useTheme } from '../context/ThemeContext';

const Library: React.FC = () => {
  const { t, isEnglish } = useTheme();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'article' | 'pdf' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = [
    { id: 'all', label: t('الكل', 'All'), activeColor: 'bg-slate-900 text-white' },
    { id: 'article', label: t('مقالات', 'Articles'), activeColor: 'bg-blue-600 text-white' },
    { id: 'pdf', label: t('كتب وملفات', 'Books & Files'), activeColor: 'bg-red-600 text-white' },
    { id: 'video', label: t('ورش مسجلة', 'Recorded Workshops'), activeColor: 'bg-purple-600 text-white' },
  ];

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

  const ArrowIcon = isEnglish ? ArrowRight : ArrowLeft;

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-24 transition-colors duration-300">
      {/* Hero - Emerald Theme */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-orange-100/40 dark:bg-orange-900/20 rounded-full blur-[80px] animate-blob delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 italic tracking-tight animate-fade-up">
            {isEnglish ? (
              <>Knowledge <span className="text-gradient">Library</span></>
            ) : (
              <>مكتبة <span className="text-gradient">المعرفة</span></>
            )}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto font-medium animate-fade-up delay-100">
            {t(
              'مصادر تعليمية متنوعة ومفتوحة لدعم مسيرتك التعليمية والمهنية',
              'Diverse and open educational resources to support your educational and professional journey'
            )}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-4 relative z-20">
        {/* Filters - Modern Design */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-lg p-6 mb-10 flex flex-col md:flex-row gap-6 justify-between items-center animate-fade-up delay-200 border border-slate-100 dark:border-slate-700">

          <div className="flex flex-wrap gap-2 justify-center">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as any)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition duration-300 ${activeFilter === filter.id
                  ? `${filter.activeColor} shadow-lg`
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className={`absolute ${isEnglish ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
            <input
              type="text"
              placeholder={t('بحث في المصادر...', 'Search resources...')}
              className={`w-full ${isEnglish ? 'pl-12 pr-4' : 'pl-4 pr-12'} py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 outline-none transition text-sm font-bold`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-200 dark:border-emerald-900/50 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => (
              <div key={resource.id} className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl dark:hover:shadow-emerald-900/10 hover:-translate-y-2 transition-all duration-300 p-6 flex flex-col animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getColor(resource.type)} dark:bg-opacity-20`}>
                    {getIcon(resource.type)}
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700 font-bold">{resource.category}</span>
                </div>

                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-2 line-clamp-2 italic">{resource.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">{resource.description}</p>

                <div className="pt-4 border-t border-slate-50 dark:border-slate-700/50 flex justify-between items-center mt-auto">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{resource.date}</span>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm hover:text-emerald-700 dark:hover:text-emerald-300 group"
                  >
                    {resource.type === 'pdf' ? t('تحميل', 'Download') : t('مشاهدة', 'View')}
                    {resource.type === 'pdf' ? <Download size={16} className="group-hover:translate-y-0.5 transition" /> : <ArrowIcon size={16} className="group-hover:-translate-x-1 transition" />}
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700">
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900/50 mb-4 text-slate-400 dark:text-slate-500">
              <Book size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-700 dark:text-slate-200 italic mb-2">
              {t('لا توجد مصادر', 'No Resources Found')}
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              {t('لم يتم العثور على مصادر تطابق بحثك حالياً.', 'No resources matching your search were found.')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;