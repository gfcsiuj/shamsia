
import React, { useState, useEffect, useRef } from 'react';
import { useVisualEdit } from '../context/VisualEditContext';
import { X, Save, Move, Type, Palette, Layout, MousePointer2, Check } from 'lucide-react';

// Helper to generate unique selector
const getUniqueSelector = (el: HTMLElement): string => {
  if (el.id) return `#${el.id}`;
  
  let path = [];
  while (el.parentElement) {
    let tag = el.tagName.toLowerCase();
    let siblingIndex = 1;
    let sibling = el.previousElementSibling;
    while (sibling) {
      if (sibling.tagName.toLowerCase() === tag) siblingIndex++;
      sibling = sibling.previousElementSibling;
    }
    path.unshift(`${tag}:nth-of-type(${siblingIndex})`);
    el = el.parentElement;
  }
  return path.join(' > ');
};

const VisualEditor: React.FC = () => {
  const { isEditing, saveOverride, toggleEditMode } = useVisualEdit();
  const [hoveredEl, setHoveredEl] = useState<HTMLElement | null>(null);
  const [selectedEl, setSelectedEl] = useState<HTMLElement | null>(null);
  const [selector, setSelector] = useState('');
  
  // Editor State
  const [textContent, setTextContent] = useState('');
  const [styles, setStyles] = useState<Record<string, string>>({});
  
  // UI State
  const [toolbarPos, setToolbarPos] = useState({ x: 20, y: 20 });
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (!isEditing) return;

    const handleMouseOver = (e: MouseEvent) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;
      // Don't select the editor itself
      if (target.closest('.visual-editor-ui')) return;
      setHoveredEl(target);
    };

    const handleClick = (e: MouseEvent) => {
      if (!isEditing) return;
      const target = e.target as HTMLElement;
      if (target.closest('.visual-editor-ui')) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      setSelectedEl(target);
      const uniqueSelector = getUniqueSelector(target);
      setSelector(uniqueSelector);
      
      // Init inputs
      setTextContent(target.innerText);
      const computed = window.getComputedStyle(target);
      
      // We only want to populate state with overrides if they exist, or empty strings
      // But for UX, let's grab current computed for color
      // To properly track overrides, we'd check the context 'overrides' array here.
      // For now, we start "fresh" or allow overwriting.
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('click', handleClick, true); // Capture phase

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('click', handleClick, true);
    };
  }, [isEditing]);

  const handleSave = () => {
    if (!selector) return;
    
    // Clean empty styles
    const cleanStyles: Record<string, string> = {};
    Object.entries(styles).forEach(([k, v]) => {
        if (v) cleanStyles[k] = v;
    });

    saveOverride({
        selector,
        styles: cleanStyles,
        text: textContent !== selectedEl?.innerText ? textContent : undefined
    });
    
    setSelectedEl(null);
  };

  const updateStyle = (key: string, value: string) => {
    setStyles(prev => ({ ...prev, [key]: value }));
    // Live Preview
    if (selectedEl) {
        selectedEl.style.setProperty(key, value, 'important');
    }
  };

  if (!isEditing) return null;

  return (
    <>
      {/* Hover Highlight */}
      {hoveredEl && !selectedEl && (
        <div 
            className="fixed pointer-events-none z-[9998] border-2 border-blue-400 bg-blue-400/10 transition-all duration-75 ease-out"
            style={{
                top: hoveredEl.getBoundingClientRect().top,
                left: hoveredEl.getBoundingClientRect().left,
                width: hoveredEl.getBoundingClientRect().width,
                height: hoveredEl.getBoundingClientRect().height,
                borderRadius: window.getComputedStyle(hoveredEl).borderRadius
            }}
        >
            <div className="absolute -top-6 left-0 bg-blue-500 text-white text-[10px] px-1 rounded font-mono">
                {hoveredEl.tagName.toLowerCase()}
            </div>
        </div>
      )}

      {/* Selection Highlight */}
      {selectedEl && (
        <div 
            className="fixed pointer-events-none z-[9998] border-2 border-secondary-500 shadow-[0_0_0_100vw_rgba(0,0,0,0.5)]"
            style={{
                top: selectedEl.getBoundingClientRect().top,
                left: selectedEl.getBoundingClientRect().left,
                width: selectedEl.getBoundingClientRect().width,
                height: selectedEl.getBoundingClientRect().height,
                borderRadius: window.getComputedStyle(selectedEl).borderRadius
            }}
        ></div>
      )}

      {/* Main Toolbar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-slate-900 text-white z-[10000] flex items-center justify-between px-4 shadow-xl visual-editor-ui">
          <div className="flex items-center gap-3">
              <div className="bg-secondary-500 p-1.5 rounded-lg">
                  <MousePointer2 size={18} className="text-white animate-pulse" />
              </div>
              <span className="font-bold text-sm">وضع التخصيص الحر</span>
              <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700">
                  اضغط على أي عنصر لتعديله
              </span>
          </div>
          <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.delete('visualEdit');
                    window.location.href = url.toString();
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2"
              >
                  <X size={14} />
                  خروج
              </button>
          </div>
      </div>

      {/* Floating Editor Panel */}
      {selectedEl && (
          <div 
            className="fixed z-[10001] bg-white rounded-xl shadow-2xl border border-slate-200 w-80 visual-editor-ui overflow-hidden animate-pop-in"
            style={{ 
                top: 80, 
                left: 20, // Keep it fixed for simplicity, or implement drag
            }}
          >
              <div className="bg-slate-50 border-b border-slate-200 p-3 flex justify-between items-center cursor-move">
                  <div className="flex items-center gap-2">
                      <Layout size={14} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-600 truncate max-w-[150px]">{selector}</span>
                  </div>
                  <button onClick={() => setSelectedEl(null)} className="text-slate-400 hover:text-red-500"><X size={16}/></button>
              </div>

              <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                  
                  {/* Text Edit */}
                  <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Type size={12} /> المحتوى النصي
                      </label>
                      <textarea 
                        className="w-full text-sm p-2 border border-slate-200 rounded-lg focus:border-secondary-500 outline-none text-slate-700"
                        rows={3}
                        value={textContent}
                        onChange={e => setTextContent(e.target.value)}
                      ></textarea>
                  </div>

                  {/* Colors */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Palette size={12} /> الألوان
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                          <div>
                              <span className="text-xs block text-slate-500 mb-1">لون النص</span>
                              <div className="flex items-center gap-2">
                                  <input 
                                    type="color" 
                                    className="w-8 h-8 rounded border p-0.5 cursor-pointer"
                                    onChange={e => updateStyle('color', e.target.value)}
                                  />
                              </div>
                          </div>
                          <div>
                              <span className="text-xs block text-slate-500 mb-1">الخلفية</span>
                              <div className="flex items-center gap-2">
                                  <input 
                                    type="color" 
                                    className="w-8 h-8 rounded border p-0.5 cursor-pointer"
                                    onChange={e => updateStyle('background-color', e.target.value)}
                                  />
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Dimensions & Spacing */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Move size={12} /> الأبعاد والمسافات
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                          <div>
                              <span className="text-xs block text-slate-500 mb-1">حجم الخط (px)</span>
                              <input 
                                type="number" 
                                className="w-full text-xs p-1.5 border rounded"
                                placeholder="Auto"
                                onChange={e => updateStyle('font-size', `${e.target.value}px`)}
                              />
                          </div>
                          <div>
                              <span className="text-xs block text-slate-500 mb-1">سمك الخط</span>
                              <select 
                                className="w-full text-xs p-1.5 border rounded"
                                onChange={e => updateStyle('font-weight', e.target.value)}
                              >
                                  <option value="">Default</option>
                                  <option value="400">Normal</option>
                                  <option value="700">Bold</option>
                                  <option value="900">Black</option>
                              </select>
                          </div>
                          <div>
                              <span className="text-xs block text-slate-500 mb-1">تحريك X</span>
                              <input 
                                type="range" min="-100" max="100"
                                className="w-full h-1 bg-slate-200 rounded appearance-none"
                                onChange={e => updateStyle('transform', `translate(${e.target.value}px, ${styles['transform']?.split(',')[1] || '0px'})`)}
                              />
                          </div>
                          <div>
                              <span className="text-xs block text-slate-500 mb-1">تحريك Y</span>
                              <input 
                                type="range" min="-100" max="100"
                                className="w-full h-1 bg-slate-200 rounded appearance-none"
                                onChange={e => updateStyle('transform', `translate(${styles['transform']?.split(',')[0].split('(')[1] || '0px'}, ${e.target.value}px)`)}
                              />
                          </div>
                      </div>
                  </div>

                  <button 
                    onClick={handleSave}
                    className="w-full bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2 mt-2"
                  >
                      <Save size={16} />
                      حفظ التغييرات
                  </button>
              </div>
          </div>
      )}
    </>
  );
};

export default VisualEditor;
