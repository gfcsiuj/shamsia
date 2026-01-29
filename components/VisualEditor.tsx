
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useVisualEdit } from '../context/VisualEditContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  X, Save, Move, Type, Palette, Layout, MousePointer2, Check, Loader2, 
  ChevronRight, ChevronDown, Maximize2, Layers, AlignLeft, AlignCenter, AlignRight, Globe, Image as ImageIcon
} from 'lucide-react';

// --- Helper: Robust Selector Generator ---
const getUniqueSelector = (el: HTMLElement): string => {
  // 1. ID Strategy (Best)
  if (el.id) return `#${el.id}`;
  
  // 2. Path Strategy
  let path = [];
  let current = el;
  
  while (current.parentElement) {
    let tag = current.tagName.toLowerCase();
    
    // Stop at body
    if (tag === 'body') break;

    const parent = current.parentElement;
    
    // IGNORE Editor UI elements in calculation if they somehow slip in
    if (current.classList.contains('visual-editor-ui') || current.closest('.visual-editor-ui')) {
        return ''; // Should not happen with Portal, but safety first
    }

    const siblings = Array.from(parent.children).filter(
        child => !child.classList.contains('visual-editor-ui') && child.tagName.toLowerCase() !== 'script'
    );
    
    let index = 1;
    let hasSameTagSiblings = false;

    for (let i = 0; i < siblings.length; i++) {
        const sibling = siblings[i];
        if (sibling === current) break;
        if (sibling.tagName.toLowerCase() === tag) {
            index++;
            hasSameTagSiblings = true;
        }
    }
    
    // Optimization: If it's a unique tag in parent, just use tag name (e.g., 'header')
    // unless it's a generic div/span
    const isGeneric = ['div', 'span', 'p', 'a', 'li'].includes(tag);
    if (!hasSameTagSiblings && !isGeneric && siblings.filter(s => s.tagName.toLowerCase() === tag).length === 1) {
        path.unshift(tag);
    } else {
        path.unshift(`${tag}:nth-of-type(${index})`);
    }
    
    current = parent;
  }
  
  return 'body > ' + path.join(' > ');
};

// --- Sub-components ---
const Section = ({ title, icon: Icon, children, isOpen, onToggle }: any) => (
    <div className="border-b border-slate-100 last:border-0">
        <button 
            onClick={onToggle}
            className="w-full flex items-center justify-between p-3 bg-white hover:bg-slate-50 transition text-slate-700 font-bold text-xs"
        >
            <div className="flex items-center gap-2">
                <Icon size={14} className="text-secondary-500" />
                {title}
            </div>
            {isOpen ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
        </button>
        {isOpen && <div className="p-3 bg-slate-50/50 space-y-3">{children}</div>}
    </div>
);

const VisualEditor: React.FC = () => {
  const { isEditing, saveOverride, saveAllChanges } = useVisualEdit();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [hoveredEl, setHoveredEl] = useState<HTMLElement | null>(null);
  const [selectedEl, setSelectedEl] = useState<HTMLElement | null>(null);
  const [selector, setSelector] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Editor Panel State
  const [textContent, setTextContent] = useState('');
  const [styles, setStyles] = useState<Record<string, string>>({});
  
  // Accordion State
  const [openSection, setOpenSection] = useState<string>('text');

  // Navigation Links
  const navLinks = [
      { name: 'الرئيسية', path: '/' },
      { name: 'الدورات', path: '/courses' },
      { name: 'المدربون', path: '/instructors' },
      { name: 'المكتبة', path: '/library' },
      { name: 'من نحن', path: '/about' },
      { name: 'اتصل بنا', path: '/contact' },
  ];

  const handleNavigate = (path: string) => {
      navigate(`${path}?visualEdit=true`);
  };

  useEffect(() => {
    if (!isEditing) return;

    const handleMouseOver = (e: MouseEvent) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;
      // Don't select editor UI or root containers
      if (target.closest('.visual-editor-ui') || target.id === 'root' || target.tagName === 'BODY' || target.tagName === 'HTML') return;
      setHoveredEl(target);
    };

    const handleClick = (e: MouseEvent) => {
      if (!isEditing) return;
      const target = e.target as HTMLElement;
      
      if (target.closest('.visual-editor-ui')) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      // Don't select root/body
      if(target.id === 'root' || target.tagName === 'BODY') return;

      setSelectedEl(target);
      const uniqueSelector = getUniqueSelector(target);
      setSelector(uniqueSelector);
      
      // Init inputs
      setTextContent(target.innerText);
      setStyles({});
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('click', handleClick, true); 

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('click', handleClick, true);
    };
  }, [isEditing]);

  const handleApply = () => {
    if (!selector || !selectedEl) return;
    
    // Remove temporary inline styles
    Object.keys(styles).forEach(key => {
        selectedEl.style.removeProperty(key);
    });
    
    const cleanStyles: Record<string, string> = {};
    Object.entries(styles).forEach(([k, v]) => {
        if (v) cleanStyles[k] = v;
    });

    saveOverride({
        selector,
        styles: cleanStyles,
        text: (textContent !== selectedEl.innerText && selectedEl.children.length === 0) ? textContent : undefined
    });
    
    setSelectedEl(null);
  };

  const handleGlobalSave = async () => {
      setIsSaving(true);
      try {
          await saveAllChanges();
          alert('تم حفظ التغييرات بنجاح! ستظهر التعديلات الآن لجميع الزوار.');
      } catch (error: any) {
          alert('حدث خطأ أثناء الحفظ.');
      } finally {
          setIsSaving(false);
      }
  };

  const handleExit = () => {
      const url = new URL(window.location.href);
      url.searchParams.delete('visualEdit');
      window.location.href = url.toString();
  };

  const updateStyle = (key: string, value: string) => {
    setStyles(prev => ({ ...prev, [key]: value }));
    if (selectedEl) {
        selectedEl.style.setProperty(key, value, 'important');
    }
  };

  if (!isEditing) return null;

  // Use Portal to render outside root div to avoid shifting DOM indices
  return createPortal(
    <>
      {/* 1. Global Overlay UI */}
      
      {/* Hover Box */}
      {hoveredEl && !selectedEl && (
        <div 
            className="fixed pointer-events-none z-[9998] border-2 border-dashed border-secondary-400 transition-all duration-75 ease-out rounded-sm bg-secondary-400/10 visual-editor-ui"
            style={{
                top: hoveredEl.getBoundingClientRect().top,
                left: hoveredEl.getBoundingClientRect().left,
                width: hoveredEl.getBoundingClientRect().width,
                height: hoveredEl.getBoundingClientRect().height,
            }}
        >
            <span className="absolute -top-6 left-0 bg-secondary-500 text-white text-[10px] px-2 py-0.5 rounded-t font-mono">
                {hoveredEl.tagName.toLowerCase()}
            </span>
        </div>
      )}

      {/* Selection Box */}
      {selectedEl && (
        <div 
            className="fixed pointer-events-none z-[9998] border-2 border-primary-500 shadow-[0_0_0_100vw_rgba(0,0,0,0.6)] visual-editor-ui"
            style={{
                top: selectedEl.getBoundingClientRect().top,
                left: selectedEl.getBoundingClientRect().left,
                width: selectedEl.getBoundingClientRect().width,
                height: selectedEl.getBoundingClientRect().height,
            }}
        ></div>
      )}

      {/* 2. Top Toolbar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white z-[10000] flex items-center justify-between px-4 shadow-2xl visual-editor-ui border-b border-slate-700 font-sans">
          
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                  <MousePointer2 size={16} className="text-secondary-400 animate-pulse" />
                  <span className="font-bold text-sm hidden sm:inline">وضع التخصيص الحر</span>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
                  <div className="px-2 text-slate-500"><Globe size={14}/></div>
                  {navLinks.map(link => (
                      <button
                        key={link.path}
                        onClick={() => handleNavigate(link.path)}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
                            location.pathname === link.path 
                            ? 'bg-secondary-500 text-white shadow-sm' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-700'
                        }`}
                      >
                          {link.name}
                      </button>
                  ))}
              </div>

              <div className="h-8 w-px bg-slate-700 mx-1 hidden lg:block"></div>

              <button 
                onClick={handleGlobalSave}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-green-900/20"
              >
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  حفظ
              </button>
              <button 
                onClick={handleExit}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-red-900/20"
              >
                  <X size={16} />
                  خروج
              </button>
          </div>
      </div>

      {/* 3. Editor Panel */}
      {selectedEl && (
          <div 
            className="fixed z-[10001] bg-white rounded-xl shadow-2xl border border-slate-200 w-80 visual-editor-ui overflow-hidden animate-slide-in-left flex flex-col font-sans"
            style={{ 
                top: 80, 
                left: 20,
                maxHeight: 'calc(100vh - 100px)'
            }}
          >
              <div className="bg-slate-50 border-b border-slate-200 p-3 flex justify-between items-center cursor-move shrink-0">
                  <div className="flex items-center gap-2">
                      <Layout size={14} className="text-primary-600" />
                      <span className="text-xs font-bold text-slate-600 truncate max-w-[180px]" dir="ltr">{selector}</span>
                  </div>
                  <button onClick={() => setSelectedEl(null)} className="text-slate-400 hover:text-red-500"><X size={16}/></button>
              </div>

              <div className="overflow-y-auto flex-1 custom-scrollbar">
                  
                  {/* Text Edit */}
                  {selectedEl.children.length === 0 && !['IMG', 'INPUT', 'HR', 'BR', 'svg'].includes(selectedEl.tagName) && (
                      <Section title="المحتوى النصي" icon={Type} isOpen={openSection === 'text'} onToggle={() => setOpenSection(openSection === 'text' ? '' : 'text')}>
                          <textarea 
                            className="w-full text-sm p-2 border border-slate-200 rounded-lg focus:border-secondary-500 outline-none text-slate-700 min-h-[80px]"
                            value={textContent}
                            onChange={e => setTextContent(e.target.value)}
                          ></textarea>
                      </Section>
                  )}

                  {/* Layout */}
                  <Section title="الأبعاد والمسافات" icon={Maximize2} isOpen={openSection === 'layout'} onToggle={() => setOpenSection(openSection === 'layout' ? '' : 'layout')}>
                      <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                              <div>
                                  <label className="text-[10px] text-slate-500 block mb-1">Width</label>
                                  <input type="text" className="w-full text-xs p-1.5 border rounded" placeholder="auto" onChange={e => updateStyle('width', e.target.value)} />
                              </div>
                              <div>
                                  <label className="text-[10px] text-slate-500 block mb-1">Height</label>
                                  <input type="text" className="w-full text-xs p-1.5 border rounded" placeholder="auto" onChange={e => updateStyle('height', e.target.value)} />
                              </div>
                          </div>
                          <div>
                              <label className="text-[10px] text-slate-500 block mb-1">Padding</label>
                              <div className="flex gap-1">
                                  <input type="number" className="w-full text-xs p-1 border rounded" placeholder="All" onChange={e => updateStyle('padding', `${e.target.value}px`)} />
                              </div>
                          </div>
                          <div>
                              <label className="text-[10px] text-slate-500 block mb-1">Margin</label>
                              <div className="flex gap-1">
                                  <input type="number" className="w-full text-xs p-1 border rounded" placeholder="All" onChange={e => updateStyle('margin', `${e.target.value}px`)} />
                              </div>
                          </div>
                          <div>
                              <label className="text-[10px] text-slate-500 block mb-1">Display</label>
                              <select className="w-full text-xs p-1.5 border rounded" onChange={e => updateStyle('display', e.target.value)}>
                                  <option value="">Default</option>
                                  <option value="block">Block</option>
                                  <option value="flex">Flex</option>
                                  <option value="none" className="text-red-500">None (Hide)</option>
                              </select>
                          </div>
                      </div>
                  </Section>

                  {/* Typography */}
                  <Section title="الخطوط والنصوص" icon={AlignLeft} isOpen={openSection === 'typography'} onToggle={() => setOpenSection(openSection === 'typography' ? '' : 'typography')}>
                      <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                              <div>
                                  <label className="text-[10px] text-slate-500 block mb-1">Size (px)</label>
                                  <input type="number" className="w-full text-xs p-1.5 border rounded" onChange={e => updateStyle('font-size', `${e.target.value}px`)} />
                              </div>
                              <div>
                                  <label className="text-[10px] text-slate-500 block mb-1">Weight</label>
                                  <select className="w-full text-xs p-1.5 border rounded" onChange={e => updateStyle('font-weight', e.target.value)}>
                                      <option value="">Default</option>
                                      <option value="400">Normal</option>
                                      <option value="700">Bold</option>
                                      <option value="900">Black</option>
                                  </select>
                              </div>
                          </div>
                          <div>
                              <label className="text-[10px] text-slate-500 block mb-1">Alignment</label>
                              <div className="flex bg-slate-200 rounded p-0.5">
                                  <button onClick={() => updateStyle('text-align', 'right')} className="flex-1 hover:bg-white rounded py-1 flex justify-center"><AlignRight size={14}/></button>
                                  <button onClick={() => updateStyle('text-align', 'center')} className="flex-1 hover:bg-white rounded py-1 flex justify-center"><AlignCenter size={14}/></button>
                                  <button onClick={() => updateStyle('text-align', 'left')} className="flex-1 hover:bg-white rounded py-1 flex justify-center"><AlignLeft size={14}/></button>
                              </div>
                          </div>
                      </div>
                  </Section>

                  {/* Colors */}
                  <Section title="الألوان والخلفية" icon={Palette} isOpen={openSection === 'colors'} onToggle={() => setOpenSection(openSection === 'colors' ? '' : 'colors')}>
                      <div className="grid grid-cols-2 gap-3">
                          <div>
                              <span className="text-[10px] text-slate-500 block mb-1">Text Color</span>
                              <div className="flex items-center gap-2">
                                  <input 
                                    type="color" 
                                    className="w-8 h-8 rounded border p-0.5 cursor-pointer"
                                    onChange={e => updateStyle('color', e.target.value)}
                                  />
                              </div>
                          </div>
                          <div>
                              <span className="text-[10px] text-slate-500 block mb-1">Background</span>
                              <div className="flex items-center gap-2">
                                  <input 
                                    type="color" 
                                    className="w-8 h-8 rounded border p-0.5 cursor-pointer"
                                    onChange={e => updateStyle('background-color', e.target.value)}
                                  />
                              </div>
                          </div>
                      </div>
                  </Section>

                  {/* Transform */}
                  <Section title="التحريك (Transform)" icon={Move} isOpen={openSection === 'transform'} onToggle={() => setOpenSection(openSection === 'transform' ? '' : 'transform')}>
                      <div className="space-y-3">
                          <div>
                              <span className="text-[10px] text-slate-500 block mb-1">Translate X (px)</span>
                              <input 
                                type="range" min="-50" max="50"
                                className="w-full h-1 bg-slate-200 rounded appearance-none"
                                onChange={e => updateStyle('transform', `translate(${e.target.value}px, ${styles['transform']?.split(',')[1] || '0px'})`)}
                              />
                          </div>
                          <div>
                              <span className="text-[10px] text-slate-500 block mb-1">Translate Y (px)</span>
                              <input 
                                type="range" min="-50" max="50"
                                className="w-full h-1 bg-slate-200 rounded appearance-none"
                                onChange={e => updateStyle('transform', `translate(${styles['transform']?.split(',')[0].split('(')[1] || '0px'}, ${e.target.value}px)`)}
                              />
                          </div>
                      </div>
                  </Section>

              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-200 shrink-0">
                  <button 
                    onClick={handleApply}
                    className="w-full bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 shadow-lg shadow-secondary-500/20 active:scale-95 transition"
                  >
                      <Check size={18} />
                      تطبيق التعديل
                  </button>
              </div>
          </div>
      )}
    </>,
    document.body // Portal to body
  );
};

export default VisualEditor;
