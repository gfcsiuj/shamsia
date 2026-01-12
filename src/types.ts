export interface Instructor {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
  };
}

export interface Course {
  id: string;
  title: string;
  category: 'Tech' | 'Human Development' | 'Cyber Security' | 'Admin Skills' | 'Student Skills';
  level: 'مبتدئ' | 'متوسط' | 'متقدم' | 'دبلوم';
  price: number;
  oldPrice?: number;
  image: string;
  instructorId: string;
  duration: string;
  rating: number;
  studentsCount: number;
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