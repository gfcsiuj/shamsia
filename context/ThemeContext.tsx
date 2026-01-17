
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { SiteSettings } from '../types';

interface ThemeContextType {
  settings: SiteSettings;
  loading: boolean;
}

const defaultSettings: SiteSettings = {
  // General
  siteName: 'شمسية',
  siteDescription: 'منصة تعليمية رائدة',
  logoUrl: 'https://k.top4top.io/p_3662fca071.png',
  
  // Hero
  heroTitle: 'طريقك الأمثل لتحقيق الوظيفة الدائمية',
  heroSubtitle: 'منصة شمسية الألكترونية منصة تعمل بأيادٍ عراقية وعربية، هدفها تحقيق مفهوم التنمية المستدامة (SDG).',
  heroTitleSize: 48, // px (approx 3rem/4xl)
  heroSubtitleSize: 18, // px
  heroTitleColor: '#ffffff',
  heroSubtitleColor: '#f1f5f9',
  
  // Colors
  primaryColor: '#10b981', // Emerald 500
  secondaryColor: '#f59e0b', // Amber 500
  accentColor: '#0ea5e9',   // Sky 500 (Much better harmony with Emerald than the previous Cyan)
  backgroundColor: '#f8fafc',
  textColor: '#1e293b',
  
  // Contact
  contactPhone: '0773 220 0003',
  contactEmail: 'info@shamsia.edu',
  contactAddress: 'العراق، بغداد',
  
  // Footer
  footerText: 'جميع الحقوق محفوظة © منصة شمسية',
  footerBgColor: '#064e3b', // primary-900 equivalent
  footerTextColor: '#ffffff',

  // System
  enableRegistration: true,
  maintenanceMode: false,
  maintenanceMessage: 'نحن نعمل حالياً على تحسين تجربتكم. سنعود قريباً!'
};

export const ThemeContext = createContext<ThemeContextType>({
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
    const unsub = db.collection('site_settings').doc('general').onSnapshot((doc) => {
      if (doc.exists) {
        setSettings({ ...defaultSettings, ...doc.data() as SiteSettings });
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    // Apply colors to root CSS variables
    const root = document.documentElement;
    const primary = settings.primaryColor || '#10b981';
    const secondary = settings.secondaryColor || '#f59e0b';
    const accent = settings.accentColor || '#0ea5e9'; // Default to Sky Blue if missing

    // Primary Palette
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

    // Secondary Palette
    root.style.setProperty('--color-secondary-400', hexToRgb(adjustColor(secondary, 20)));
    root.style.setProperty('--color-secondary-500', hexToRgb(secondary));
    root.style.setProperty('--color-secondary-600', hexToRgb(adjustColor(secondary, -20)));

    // Accent Palette
    root.style.setProperty('--color-accent-50', hexToRgb(adjustColor(accent, 90)));
    root.style.setProperty('--color-accent-100', hexToRgb(adjustColor(accent, 70)));
    root.style.setProperty('--color-accent-200', hexToRgb(adjustColor(accent, 50)));
    root.style.setProperty('--color-accent-300', hexToRgb(adjustColor(accent, 30)));
    root.style.setProperty('--color-accent-400', hexToRgb(adjustColor(accent, 10)));
    root.style.setProperty('--color-accent-500', hexToRgb(accent));
    root.style.setProperty('--color-accent-600', hexToRgb(adjustColor(accent, -10)));
    root.style.setProperty('--color-accent-700', hexToRgb(adjustColor(accent, -30)));
    root.style.setProperty('--color-accent-800', hexToRgb(adjustColor(accent, -50)));
    root.style.setProperty('--color-accent-900', hexToRgb(adjustColor(accent, -70)));

    // Custom Typography & Colors
    if (settings.heroTitleSize) {
        root.style.setProperty('--hero-title-size', `${settings.heroTitleSize}px`);
    }
    if (settings.heroSubtitleSize) {
        root.style.setProperty('--hero-subtitle-size', `${settings.heroSubtitleSize}px`);
    }
    if (settings.heroTitleColor) {
        root.style.setProperty('--hero-title-color', settings.heroTitleColor);
    }
    if (settings.footerBgColor) {
        root.style.setProperty('--footer-bg', settings.footerBgColor);
    }

  }, [settings]);

  return (
    <ThemeContext.Provider value={{ settings, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};
