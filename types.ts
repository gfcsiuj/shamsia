
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
  heroTitle: string;
  heroSubtitle: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  contactPhone: string;
  contactEmail: string;
}