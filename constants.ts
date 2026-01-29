import { Testimonial } from './types';

// Note: Instructor and Course data is now managed in Firebase database
// Only testimonials remain here as they are not yet migrated to the database

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'علي التميمي',
    role: 'متدرب أمن سيبراني',
    content: 'كورس الهاكر الأخلاقي مع المهندس أحمد غير مساري المهني تماماً. التدريب العملي كان ممتازاً ومحاكياً للواقع.',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 't-2',
    name: 'سارة العلي',
    role: 'طالبة IT',
    content: 'حصلت على شهادة المستوى الأول وبدأت أفهم كيف أحمي بياناتي وبيانات شركتي. شكراً شمسية.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  },
];