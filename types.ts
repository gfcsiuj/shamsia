
export interface SocialLink {
  type: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'website' | 'email' | 'phone' | 'youtube' | 'telegram';
  value: string;
}

export interface Instructor {
  id: string;
  name: string;
  roles: string[];
  image: string;
  shortBio: string;
  bio: string;
  certifications: string[];
  socials: SocialLink[];
}

export interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

export interface Course {
  id: string;
  title: string;
  category: string;
  level: string;
  price: number;
  oldPrice?: number;
  media: MediaItem[];
  instructorIds: string[];
  duration: string;
  rating: number;
  studentsCount: number;
  studentsCountMode: 'auto' | 'manual';
  tags: string[];
  description: string;
  longDescription?: string; 
  objectives: string[];
  targetAudience: string[];
  syllabus: { week: string; topic: string }[];
  startDate: string;
  certifications?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  image: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'article' | 'pdf' | 'video';
  category: string;
  date: string;
  url: string;
  description: string;
}

export interface SiteSettings {
  // General
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  faviconUrl?: string;

  // Hero Section Customization
  heroTitle: string;
  heroSubtitle: string;
  heroTitleColor?: string;
  heroTitleSize?: number; // in px
  heroSubtitleColor?: string;
  heroSubtitleSize?: number; // in px
  heroOverlayOpacity?: number; // 0-100

  // Theme & Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string; // New Accent Color
  backgroundColor?: string;
  surfaceColor?: string;
  textColor?: string;
  
  // Contact
  contactPhone: string;
  contactEmail: string;
  contactAddress?: string;
  
  // Social Media
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;

  // Footer
  footerText?: string;
  footerBgColor?: string;
  footerTextColor?: string;

  // System
  enableRegistration: boolean;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
}
