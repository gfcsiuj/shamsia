
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../lib/firebase';

interface StyleOverride {
  selector: string;
  styles: Record<string, string>;
  text?: string;
}

interface VisualEditContextType {
  isEditing: boolean;
  overrides: StyleOverride[];
  toggleEditMode: () => void;
  saveOverride: (override: StyleOverride) => void;
  saveAllChanges: () => Promise<void>;
  loading: boolean;
}

const VisualEditContext = createContext<VisualEditContextType>({
  isEditing: false,
  overrides: [],
  toggleEditMode: () => {},
  saveOverride: () => {},
  saveAllChanges: async () => {},
  loading: true,
});

export const useVisualEdit = () => useContext(VisualEditContext);

export const VisualEditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [overrides, setOverrides] = useState<StyleOverride[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Check URL for edit mode
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('visualEdit') === 'true') {
      setIsEditing(true);
    }
  }, [location]);

  // Load Overrides from DB
  useEffect(() => {
    const unsub = db.collection('site_settings').doc('visual_overrides').onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
        if (data && data.overrides) {
          setOverrides(data.overrides);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Inject Styles into Head (Handles CSS)
  useEffect(() => {
    let styleTag = document.getElementById('visual-editor-styles');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'visual-editor-styles';
      document.head.appendChild(styleTag);
    }

    let css = '';
    overrides.forEach(item => {
      // Build CSS string
      const styleString = Object.entries(item.styles)
        .map(([key, value]) => `${key}: ${value} !important;`)
        .join(' ');
      
      if (styleString) {
        css += `${item.selector} { ${styleString} }\n`;
      }
    });

    styleTag.textContent = css;

  }, [overrides]);

  // Apply Text Overrides Logic (Handles Text Content)
  useEffect(() => {
    const applyTextOverrides = () => {
        overrides.forEach(override => {
            if (override.text) {
                const els = document.querySelectorAll(override.selector);
                els.forEach(el => {
                    // Check if current text content differs to avoid thrashing
                    if (el instanceof HTMLElement && el.innerText !== override.text) {
                         // Safer replacement for visual editing
                         el.innerText = override.text as string;
                    }
                });
            }
        });
    };

    // Run immediately when overrides change
    applyTextOverrides();

    // Run periodically to catch dynamic content (like React re-renders)
    const interval = setInterval(applyTextOverrides, 500); 
    return () => clearInterval(interval);
  }, [overrides]);


  const saveOverride = (newOverride: StyleOverride) => {
    // Merge with existing overrides - Updates LOCAL STATE ONLY
    const updatedOverrides = [...overrides];
    const index = updatedOverrides.findIndex(o => o.selector === newOverride.selector);
    
    if (index > -1) { 
      updatedOverrides[index] = {
          ...updatedOverrides[index],
          styles: { ...updatedOverrides[index].styles, ...newOverride.styles },
          text: newOverride.text !== undefined ? newOverride.text : updatedOverrides[index].text
      };
    } else {
      updatedOverrides.push(newOverride);
    }

    setOverrides(updatedOverrides);
  };

  const saveAllChanges = async () => {
    try {
      await db.collection('site_settings').doc('visual_overrides').set({ overrides: overrides }, { merge: true });
    } catch (e) {
      console.error("Failed to save all changes", e);
      throw e;
    }
  };

  const toggleEditMode = () => setIsEditing(!isEditing);

  return (
    <VisualEditContext.Provider value={{ isEditing, overrides, toggleEditMode, saveOverride, saveAllChanges, loading }}>
      {children}
    </VisualEditContext.Provider>
  );
};
