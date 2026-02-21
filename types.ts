
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

export type Graduate = Instructor;

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
  priceText?: string;
  oldPrice?: number;
  media: MediaItem[];
  instructorIds: string[];
  instructorText?: string;
  duration: string;
  rating: number;
  studentsCount: number;
  studentsCountMode: 'auto' | 'manual';
  tags: string[];
  description: string;
  longDescription?: string;
  objectives: string[];
  targetAudience: string[];
  syllabus: { title: string; week: string; topic: string; points?: string[] }[];
  startDate: string;
  endDate?: string;
  lecturesCount?: number;
  certifications?: string[];
  graduateIds?: string[]; // IDs of instructors who are graduates
  notes?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  content?: string; // legacy alias for text
  image: string;
  rating: number;
  isVisible: boolean;
  createdAt?: string;
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

  // Course Settings
  showPrices?: boolean;
  enableCourseRegistration?: boolean;
  showStudentCount?: boolean;
  courseCardStyle?: 'default' | 'minimal' | 'detailed';

  // SEO & Analytics
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  ogImage?: string;
  ogTitle?: string;
  metaKeywords?: string;

  // Notifications
  adminEmail?: string;
  enableEmailNotifications?: boolean;
  registrationEmailSubject?: string;
  welcomeMessage?: string;

  // Telegram Integration
  telegramUrl?: string;

  // Language
  defaultLanguage?: 'ar' | 'en';
}

export interface Certificate {
  id: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  certificateNumber: string;
  qrCode?: string;
  templateUrl?: string;
  status: 'issued' | 'revoked';
}


