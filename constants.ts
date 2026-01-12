
import { Course, Instructor, Testimonial, Resource } from './types';

export const INSTRUCTORS: Instructor[] = [
  {
    id: 'inst-ahmed',
    name: 'م. أحمد حسين',
    roles: ['خبير أمن سيبراني', 'مدرب دولي', 'قائد فريق CERT95'],
    image: 'https://k.top4top.io/p_366424bn91.jpeg',
    shortBio: 'خبير أمن سيبراني ومدرب دولي معتمد، يمتلك خبرة تتجاوز 10 سنوات.',
    bio: 'خبير أمن سيبراني ومدرب دولي معتمد، يمتلك خبرة تتجاوز 10 سنوات في مجال الأمن السيبراني، الشبكات، والاختراق الأخلاقي. مدرب معتمد لدى Cisco وEC-Council، وقائد فريق CERT95. شارك في برامج تقييم وتدريب دولية، وقدم مئات الدورات وورش العمل حضوريًا وعبر الإنترنت. يتمتع بخبرة عملية وأكاديمية واسعة في اختبار الاختراق، الأدلة الجنائية الرقمية، وأمن الشبكات.',
    certifications: ['Cisco Certified Trainer', 'CEH Master', 'CISSP'],
    socials: [
      { type: 'linkedin', value: 'https://linkedin.com' },
      { type: 'email', value: 'ahmed@shamsia.edu' }
    ]
  },
  {
    id: 'inst-2',
    name: 'سارة العلي',
    roles: ['مدربة مهارات إدارية', 'مستشارة أعمال'],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    shortBio: 'مستشارة إدارية معتمدة ساعدت أكثر من 50 شركة ناشئة.',
    bio: 'مستشارة إدارية معتمدة ساعدت أكثر من 50 شركة ناشئة على تنظيم هيكلها الإداري. خبيرة في مجال الموارد البشرية والتطوير المؤسسي.',
    certifications: ['PMP', 'MBA'],
    socials: []
  },
  {
    id: 'inst-3',
    name: 'م. خالد الدوسري',
    roles: ['مطور برمجيات أول', 'Full Stack Developer'],
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    shortBio: 'مهندس برمجيات متخصص في تطوير تطبيقات الويب.',
    bio: 'مهندس برمجيات متخصص في تطوير تطبيقات الويب باستخدام أحدث التقنيات. عمل مع كبرى الشركات التقنية في المنطقة.',
    certifications: ['AWS Solution Architect'],
    socials: [
      { type: 'website', value: 'https://khaled.dev' }
    ]
  },
];

export const COURSES: Course[] = [
  {
    id: 'cyber-level-1',
    title: 'أساسيات الأمن السيبراني (المستوى الأول)',
    category: 'Cyber Security',
    level: 'مبتدئ',
    price: 400000,
    media: [{ url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800', type: 'image' }],
    instructorIds: ['inst-ahmed'],
    duration: '14 محاضرة (28 ساعة)',
    rating: 4.9,
    studentsCount: 450,
    studentsCountMode: 'manual',
    tags: ['شهادة معتمدة', 'مكثف'],
    startDate: 'الخميس والجمعة',
    description: 'هل تطمح لدخول عالم الأمن السيبراني من الطريق الصحيح؟ هذا الكورس صُمّم خصيصًا للشباب الراغبين بدخول مجال الأمن السيبراني، ويأخذك من الصفر إلى مستوى احترافي.',
    longDescription: `🚨 إعلان كورس أساسيات الأمن السيبراني للمستوى الاول...`, // truncated for brevity
    objectives: [
      'أساسيات الأمن السيبراني (نظري + عملي)',
      'فهم آلية تفكير الهاكر وأنواع الاختراقات',
      'حماية الأنظمة والشبكات والبيانات'
    ],
    targetAudience: [
      'الراغبين بدخول مجال الأمن السيبراني',
      'طلاب تكنولوجيا المعلومات'
    ],
    certifications: [
      'CCNA: Introduction to Networks',
      'Cyber Threat Management'
    ],
    syllabus: [
      { week: 'المحور 1', topic: 'أساسيات الأمن السيبراني وتهديدات العصر' },
      { week: 'المحور 2', topic: 'فهم آلية تفكير الهاكر وأنواع الهجمات' }
    ],
  },
  {
    id: 'c-react',
    title: 'تطوير واجهات المستخدم React',
    category: 'Tech',
    level: 'متوسط',
    price: 90000,
    media: [{ url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800', type: 'image' }],
    instructorIds: ['inst-3'],
    duration: '8 أسابيع',
    rating: 4.9,
    studentsCount: 850,
    studentsCountMode: 'auto',
    tags: ['تطبيقي', 'مشروع نهائي'],
    startDate: '2024-04-01',
    description: 'تعلم كيفية بناء تطبيقات ويب حديثة وسريعة الاستجابة باستخدام مكتبة React الشهيرة.',
    objectives: [
      'إتقان React Hooks و Components',
      'التعامل مع State Management'
    ],
    targetAudience: [
      'مطوري الواجهات الأمامية (Frontend Developers)',
      'الطلاب الذين يرغبون بتعلم أطر عمل حديثة'
    ],
    syllabus: [
      { week: 'الأسبوع 1', topic: 'مراجعة JavaScript ES6' },
      { week: 'الأسبوع 2', topic: 'مقدمة في React JSX' }
    ],
  },
];

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

export const RESOURCES: Resource[] = [
  {
    id: 'r-1',
    title: 'دليل الأمن السيبراني للمبتدئين',
    type: 'pdf',
    category: 'Cyber Security',
    date: '2024-01-15',
    url: '#',
    description: 'كتيب شامل يحتوي على أهم المصطلحات والمفاهيم في عالم أمن المعلومات.',
  },
  {
    id: 'r-2',
    title: 'كيف تبدأ مسارك في الهاكر الأخلاقي؟',
    type: 'article',
    category: 'Tech',
    date: '2024-02-01',
    url: '#',
    description: 'مقال تفصيلي يشرح خارطة الطريق لتعلم الاختراق الأخلاقي والشهادات المطلوبة.',
  }
];
