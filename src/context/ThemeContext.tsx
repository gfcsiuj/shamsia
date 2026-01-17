import React, { createContext, useContext, useEffect, useState } from 'react';
// التغيير هنا: في Vite، عادة ما يكون ملف lib داخل src.
// لنتأكد من استدعائه من المسار الصحيح.
// إذا كان في src/lib/firebase.ts، فالمسار الصحيح هو ../lib/firebase
import { db } from '../lib/firebase'; 
import { doc, onSnapshot } from 'firebase/firestore';
import { SiteSettings } from '../types';

interface ThemeContextType {
  settings: SiteSettings;
  loading: boolean;
}

const defaultSettings: SiteSettings = {
  heroTitle: 'طريقك الأمثل لتحقيق الوظيفة الدائمية',
  heroSubtitle: 'منصة شمسية الألكترونية منصة تعمل بأيادٍ عراقية وعربية، هدفها تحقيق مفهوم التنمية المستدامة (SDG).',
  primaryColor: '#10b981', // Emerald 500
  secondaryColor: '#f59e0b', // Amber 500
  logoUrl: 'https://k.top4top.io/p_3662fca071.png',
  contactPhone: '0773 220 0003',
  contactEmail: 'info@shamsia.edu'
};

const ThemeContext = createContext<ThemeContextType>({
  settings: defaultSettings,
  loading: true,
});

export const useTheme = () => useContext(ThemeContext);

// Helper to convert hex to RGB string "r g b"
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
    : '0 0 0';
};

// Helper to lighten/darken hex color (simple version)
const adjustColor = (hex: string, percent: number) => {
    let R = parseInt(hex.substring(1,3),16);
    let G = parseInt(hex.substring(3,5),16);
    let B = parseInt(hex.substring(5,7),16);

    R = Math.floor(R * (100 + percent) / 100);
    G = Math.floor(G * (100 + percent) / 100);
    B = Math.floor(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    const RR = ((R.toString(16).length===1)?"0"+R.toString(16):R.toString(16));
    const GG = ((G.toString(16).length===1)?"0"+G.toString(16):G.toString(16));
    const BB = ((B.toString(16).length===1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // التأكد من أن قاعدة البيانات قد تم تحميلها
    if (!db) {
      console.error("Firebase DB is not initialized");
      setLoading(false);
      return;
    }

    try {
      const unsub = onSnapshot(doc(db, 'site_settings', 'general'), (doc) => {
        if (doc.exists()) {
          setSettings({ ...defaultSettings, ...doc.data() as SiteSettings });
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching settings:", error);
        setLoading(false);
      });

      return () => unsub();
    } catch (err) {
      console.error("Error setting up snapshot listener:", err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const primary = settings.primaryColor;
    const secondary = settings.secondaryColor;

    try {
      root.style.setProperty('--color-primary-50', hexToRgb(adjustColor(primary, 90)));
      root.style.setProperty('--color-primary-100', hexToRgb(adjustColor(primary, 70)));
      root.style.setProperty('--color-primary-200', hexToRgb(adjustColor(primary, 50)));
      root.style.setProperty('--color-primary-300', hexToRgb(adjustColor(primary, 30)));
      root.style.setProperty('--color-primary-400', hexToRgb(adjustColor(primary, 10)));
      root.style.setProperty('--color-primary-500', hexToRgb(primary));
      root.style.setProperty('--color-primary-600', hexToRgb(adjustColor(primary, -10)));
      root.style.setProperty('--color-primary-700', hexToRgb(adjustColor(primary, -30)));
      root.style.setProperty('--color-primary-800', hexToRgb(adjustColor(primary, -50)));
      root.style.setProperty('--color-primary-900', hexToRgb(adjustColor(primary, -70)));

      root.style.setProperty('--color-secondary-400', hexToRgb(adjustColor(secondary, 20)));
      root.style.setProperty('--color-secondary-500', hexToRgb(secondary));
      root.style.setProperty('--color-secondary-600', hexToRgb(adjustColor(secondary, -20)));
    } catch (e) {
      console.error("Error applying theme colors", e);
    }

  }, [settings]);

  return (
    <ThemeContext.Provider value={{ settings, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};
