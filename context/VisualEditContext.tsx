
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
  loading: boolean;
}

const VisualEditContext = createContext<VisualEditContextType>({
  isEditing: false,
  overrides: [],
  toggleEditMode: () => {},
  saveOverride: () => {},
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

  // Load Overrides
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

  // Inject Styles into Head
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

      // Handle Text Content (Best Effort for static text)
      // Note: Replacing text via JS is tricky in React due to re-renders. 
      // We use a MutationObserver in the VisualEditor component to enforce text, 
      // or we accept that CSS handles the styling and text is best effort.
    });

    styleTag.textContent = css;

  }, [overrides]);

  // Apply Text Overrides Logic (Run periodically or on mutation)
  useEffect(() => {
    const applyTextOverrides = () => {
        overrides.forEach(override => {
            if (override.text) {
                const els = document.querySelectorAll(override.selector);
                els.forEach(el => {
                    // Only replace if it's a direct text node to avoid breaking nested structures
                    if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
                        if (el.textContent !== override.text) {
                            el.textContent = override.text;
                        }
                    }
                });
            }
        });
    };

    const interval = setInterval(applyTextOverrides, 1000); // Check every second
    return () => clearInterval(interval);
  }, [overrides]);


  const saveOverride = async (newOverride: StyleOverride) => {
    // Merge with existing overrides
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
    
    // Persist
    try {
      await db.collection('site_settings').doc('visual_overrides').set({ overrides: updatedOverrides }, { merge: true });
    } catch (e) {
      console.error("Failed to save override", e);
    }
  };

  const toggleEditMode = () => setIsEditing(!isEditing);

  return (
    <VisualEditContext.Provider value={{ isEditing, overrides, toggleEditMode, saveOverride, loading }}>
      {children}
    </VisualEditContext.Provider>
  );
};
