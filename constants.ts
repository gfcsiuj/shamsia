import { Testimonial } from './types';

// Fallback testimonials — used when no data exists in Firebase yet
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'علي التميمي',
    role: 'متدرب أمن سيبراني',
    text: 'كورس الهاكر الأخلاقي مع المهندس أحمد غير مساري المهني تماماً. التدريب العملي كان ممتازاً ومحاكياً للواقع.',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    isVisible: true,
  },
  {
    id: 't-2',
    name: 'سارة العلي',
    role: 'طالبة IT',
    text: 'حصلت على شهادة المستوى الأول وبدأت أفهم كيف أحمي بياناتي وبيانات شركتي. شكراً شمسية.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    rating: 5,
    isVisible: true,
  },
];

// Category English → Arabic mapping
export const CATEGORY_AR: Record<string, string> = {
  'Tech': 'تقنية',
  'Human Development': 'تنمية بشرية',
  'Cyber Security': 'أمن سيبراني',
  'Admin Skills': 'مهارات إدارية',
  'Student Skills': 'مهارات طلابية',
  'Solar Energy': 'الطاقة الشمسية',
  'Electricity': 'الكهرباء',
  'Generators': 'المولدات الكهربائية',
  'Mechanics': 'الميكانيك',
  'Barbering': 'الحلاقة',
  'Languages': 'لغات',
  'Electrical Installations': 'تأسيسات كهربائية',
};

/** Returns Arabic label for a category key, or the key itself if not found */
export const getCategoryLabel = (category: string): string => CATEGORY_AR[category] || category;