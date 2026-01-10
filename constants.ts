import { Course, Instructor, Testimonial, Resource } from './types';

export const INSTRUCTORS: Instructor[] = [
  {
    id: 'inst-1',
    name: 'د. أحمد المنصور',
    role: 'خبير الأمن السيبراني',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    bio: 'دكتوراه في أمن المعلومات بخبرة تزيد عن 15 عاماً في حماية البنية التحتية الرقمية.',
  },
  {
    id: 'inst-2',
    name: 'سارة العلي',
    role: 'مدربة مهارات إدارية',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    bio: 'مستشارة إدارية معتمدة ساعدت أكثر من 50 شركة ناشئة على تنظيم هيكلها الإداري.',
  },
  {
    id: 'inst-3',
    name: 'م. خالد الدوسري',
    role: 'مطور برمجيات أول',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    bio: 'مهندس برمجيات متخصص في تطوير تطبيقات الويب باستخدام أحدث التقنيات.',
  },
  {
    id: 'inst-4',
    name: 'أ. ليلى حسن',
    role: 'أخصائية تنمية بشرية',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    bio: 'مدربة معتمدة في مجال تطوير الذات والقيادة الشخصية.',
  },
];

export const COURSES: Course[] = [
  {
    id: 'c-1',
    title: 'أساسيات الأمن السيبراني',
    category: 'Cyber Security',
    level: 'مبتدئ',
    price: 75000,
    oldPrice: 100000,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    instructorId: 'inst-1',
    duration: '6 أسابيع',
    rating: 4.8,
    studentsCount: 1200,
    startDate: '2024-03-15',
    description: 'دورة شاملة تغطي أساسيات حماية المعلومات والشبكات من الاختراقات والهجمات الإلكترونية.',
    objectives: [
      'فهم مفاهيم الأمن السيبراني الأساسية',
      'التعرف على أنواع الهجمات الإلكترونية',
      'تعلم طرق حماية البيانات الشخصية والمؤسسية',
      'أساسيات التشفير والشبكات',
    ],
    targetAudience: [
      'طلاب تكنولوجيا المعلومات والحاسبات',
      'المهتمين بمجال أمن المعلومات',
      'مسؤولي الأنظمة والشبكات المبتدئين'
    ],
    syllabus: [
      { week: 'الأسبوع 1', topic: 'مقدمة في أمن المعلومات' },
      { week: 'الأسبوع 2', topic: 'أنواع البرمجيات الخبيثة' },
      { week: 'الأسبوع 3', topic: 'أمن الشبكات' },
      { week: 'الأسبوع 4', topic: 'التشفير وحماية البيانات' },
    ],
  },
  {
    id: 'c-2',
    title: 'تطوير واجهات المستخدم React',
    category: 'Tech',
    level: 'متوسط',
    price: 90000,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
    instructorId: 'inst-3',
    duration: '8 أسابيع',
    rating: 4.9,
    studentsCount: 850,
    startDate: '2024-04-01',
    description: 'تعلم كيفية بناء تطبيقات ويب حديثة وسريعة الاستجابة باستخدام مكتبة React الشهيرة.',
    objectives: [
      'إتقان React Hooks و Components',
      'التعامل مع State Management',
      'ربط التطبيق مع API',
      'بناء مشروع متكامل',
    ],
    targetAudience: [
      'مطوري الواجهات الأمامية (Frontend Developers)',
      'الطلاب الذين يرغبون بتعلم أطر عمل حديثة',
      'مبرمجي JavaScript'
    ],
    syllabus: [
      { week: 'الأسبوع 1', topic: 'مراجعة JavaScript ES6' },
      { week: 'الأسبوع 2', topic: 'مقدمة في React JSX' },
      { week: 'الأسبوع 3', topic: 'State and Props' },
      { week: 'الأسبوع 4', topic: 'React Hooks' },
    ],
  },
  {
    id: 'c-3',
    title: 'القيادة الإدارية الناجحة',
    category: 'Admin Skills',
    level: 'متقدم',
    price: 125000,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
    instructorId: 'inst-2',
    duration: '4 أسابيع',
    rating: 4.7,
    studentsCount: 500,
    startDate: '2024-03-20',
    description: 'برنامج مكثف لتطوير المهارات القيادية للإداريين ورؤساء الأقسام.',
    objectives: [
      'تطوير الفكر الاستراتيجي',
      'إدارة فرق العمل بفعالية',
      'اتخاذ القرارات وحل المشكلات',
      'التواصل القيادي الفعال',
    ],
    targetAudience: [
      'مدراء الأقسام ورؤساء الفرق',
      'رواد الأعمال وأصحاب المشاريع',
      'المرشحين للمناصب القيادية'
    ],
    syllabus: [
      { week: 'الأسبوع 1', topic: 'سمات القائد الناجح' },
      { week: 'الأسبوع 2', topic: 'بناء وإدارة الفرق' },
      { week: 'الأسبوع 3', topic: 'التخطيط الاستراتيجي' },
    ],
  },
  {
    id: 'c-4',
    title: 'مهارات التفوق الدراسي',
    category: 'Student Skills',
    level: 'مبتدئ',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    instructorId: 'inst-4',
    duration: '2 أسابيع',
    rating: 4.9,
    studentsCount: 2300,
    startDate: '2024-03-10',
    description: 'دورة موجهة للطلاب لتحسين عادات الدراسة وزيادة التحصيل العلمي.',
    objectives: [
      'تنظيم الوقت الدراسي',
      'طرق الحفظ والمراجعة الذكية',
      'التعامل مع قلق الاختبارات',
    ],
    targetAudience: [
      'طلاب المدارس الثانوية والجامعات',
      'أولياء الأمور المهتمين بتطوير أبنائهم',
      'المرشدين التربويين'
    ],
    syllabus: [
      { week: 'الأسبوع 1', topic: 'تنظيم البيئة الدراسية' },
      { week: 'الأسبوع 2', topic: 'تقنيات التذكر والخرائط الذهنية' },
    ],
  },
  {
    id: 'c-5',
    title: 'مقدمة في الذكاء الاصطناعي',
    category: 'Tech',
    level: 'مبتدئ',
    price: 60000,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    instructorId: 'inst-3',
    duration: '5 أسابيع',
    rating: 4.6,
    studentsCount: 950,
    startDate: '2024-05-15',
    description: 'استكشف عالم الذكاء الاصطناعي وتعلم المفاهيم الأساسية وتطبيقاته في الحياة اليومية.',
    objectives: [
      'فهم تاريخ ومستقبل AI',
      'التعرف على التعلم الآلي',
      'أخلاقيات الذكاء الاصطناعي',
    ],
    targetAudience: [
      'المهتمين بالتقنيات الحديثة',
      'الطلاب والباحثين',
      'رواد الأعمال في المجال التقني'
    ],
    syllabus: [
      { week: 'الأسبوع 1', topic: 'ما هو الذكاء الاصطناعي؟' },
      { week: 'الأسبوع 2', topic: 'تطبيقات عملية' },
    ],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'محمد العبدالله',
    role: 'طالب جامعي',
    content: 'منصة شمسية غيرت طريقتي في التعلم. الدورات مرتبة والمدربون على مستوى عالي من الكفاءة.',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 't-2',
    name: 'نورة السعيد',
    role: 'مديرة مشاريع',
    content: 'حصلت على شهادة إدارة المشاريع بفضل الدورة المكثفة هنا. أنصح الجميع بالتسجيل.',
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
    title: 'كيف تبدأ مسارك في البرمجة؟',
    type: 'article',
    category: 'Tech',
    date: '2024-02-01',
    url: '#',
    description: 'مقال تفصيلي يشرح خارطة الطريق لتعلم لغات البرمجة الأكثر طلباً في السوق.',
  },
  {
    id: 'r-3',
    title: 'ورشة عمل: القيادة في الأزمات',
    type: 'video',
    category: 'Admin Skills',
    date: '2023-12-20',
    url: '#',
    description: 'تسجيل كامل لورشة عمل تفاعلية عن استراتيجيات القيادة الناجحة وقت الأزمات.',
  },
  {
    id: 'r-4',
    title: 'أهم 10 أدوات للطلاب الجامعيين',
    type: 'article',
    category: 'Student Skills',
    date: '2024-01-25',
    url: '#',
    description: 'مقال يستعرض أفضل التطبيقات والمواقع التي تساعد الطالب على تنظيم وقته ودراسته.',
  },
  {
    id: 'r-5',
    title: 'أساسيات الشبكات (كتاب إلكتروني)',
    type: 'pdf',
    category: 'Cyber Security',
    date: '2023-11-10',
    url: '#',
    description: 'مرجع سريع لفهم كيفية عمل الشبكات والبروتوكولات الأساسية.',
  },
];
