import { Course, Instructor } from '../types';

// Groq API - Free, fast, no regional restrictions
// Get your free key at: https://console.groq.com
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY as string;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';


async function callGroq(systemPrompt: string, userText: string): Promise<string> {
  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userText },
      ],
      temperature: 0.1,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `خطأ في الاتصال بالذكاء الاصطناعي (${response.status})`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('لم يتم الحصول على رد من الذكاء الاصطناعي');
  }
  return text;
}

function extractJSON(text: string): any {
  // Try to find JSON block in markdown code fences
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1].trim());
  }
  // Try to parse the whole text as JSON
  const braceStart = text.indexOf('{');
  const braceEnd = text.lastIndexOf('}');
  if (braceStart !== -1 && braceEnd !== -1) {
    return JSON.parse(text.substring(braceStart, braceEnd + 1));
  }
  throw new Error('لم يتم العثور على بيانات صالحة في الرد');
}

const COURSE_SYSTEM_PROMPT = `أنت مساعد ذكي متخصص في استخراج وتنظيم بيانات الدورات التدريبية.

مهمتك: استخرج المعلومات من النص المقدم وأرجعها بتنسيق JSON فقط، بدون أي نص إضافي قبله أو بعده.

**هيكل JSON المطلوب بالضبط:**
{
  "title": "عنوان الدورة الكامل",
  "category": "التصنيف: Tech أو Human Development أو Cyber Security أو Admin Skills أو Solar Energy أو Electricity أو Generators أو Mechanics أو Barbering أو Languages أو Electrical Installations",
  "level": "المستوى: مبتدئ أو متوسط أو متقدم أو دبلوم",
  "price": 0,
  "duration": "مدة الدورة مثل: 4 أسابيع، 30 ساعة، شهر ونصف",
  "startDate": "تاريخ أو أيام بدء الدورة مثل: السبت والثلاثاء، 1 مارس 2025، أيام العمل",
  "endDate": "تاريخ الانتهاء أو اتركه فارغاً",
  "lecturesCount": 12,
  "instructorText": "أسماء المدربين المذكورين في النص، اجمعهم في جملة واحدة. إذا لم يُذكر مدرب اتركه فارغاً",
  "description": "وصف مختصر للدورة في جملتين أو ثلاث",
  "longDescription": "وصف تفصيلي شامل للدورة في عدة فقرات",
  "objectives": [
    "الهدف الأول من الدورة",
    "الهدف الثاني من الدورة",
    "الهدف الثالث من الدورة"
  ],
  "targetAudience": [
    "الفئة المستهدفة الأولى",
    "الفئة المستهدفة الثانية"
  ],
  "syllabus": [
    {
      "title": "اسم المحور الرئيسي مثل: مقدمة في الأمن السيبراني",
      "week": "الأسبوع 1 (أو الوحدة 1، أو الجلسة 1)",
      "topic": "العنوان الفرعي للجلسة مثل: أساسيات الشبكات",
      "points": [
        "النقطة التفصيلية الأولى في هذه الجلسة",
        "النقطة التفصيلية الثانية"
      ]
    },
    {
      "title": "اسم المحور الثاني",
      "week": "الأسبوع 2",
      "topic": "عنوان الجلسة الثانية",
      "points": [
        "تفصيل أول",
        "تفصيل ثاني"
      ]
    }
  ],
  "certifications": [
    "اسم الشهادة الممنوحة"
  ],
  "notes": [
    "ملاحظة مهمة عن الدورة"
  ],
  "tags": ["وسم1", "وسم2", "وسم3"]
}

**قواعد مهمة:**
1. أرجع JSON فقط بدون أي نص خارجه
2. إذا كان حقل غير موجود في النص، اتركه فارغاً ("" للنصوص، [] للمصفوفات، 0 للأرقام)
3. لمحور المنهج (syllabus): إذا كان النص يذكر أسابيع أو وحدات أو محاور، حولها لمصفوفة. حتى لو ذُكر المنهج بنقاط عادية، حولها لمصفوفة منظمة
4. حاول دائماً استنتاج المعلومات من السياق حتى لو لم تُذكر صراحةً
5. للفئة (category)، اختر الأقرب من القائمة المحددة
6. للمستوى (level)، اختر من: مبتدئ، متوسط، متقدم، دبلوم فقط`;

export async function fillCourseFromText(text: string): Promise<Partial<Course> & { instructorText?: string }> {
  const result = await callGroq(COURSE_SYSTEM_PROMPT, text);
  const parsed = extractJSON(result);

  // Clean and validate the parsed data
  const course: Partial<Course> & { instructorText?: string } = {};
  if (parsed.title) course.title = String(parsed.title);
  if (parsed.category) course.category = String(parsed.category);
  if (parsed.level) course.level = String(parsed.level);
  if (parsed.price !== undefined) course.price = Number(parsed.price) || 0;
  if (parsed.duration) course.duration = String(parsed.duration);
  if (parsed.startDate) course.startDate = String(parsed.startDate);
  if (parsed.endDate) course.endDate = String(parsed.endDate);
  if (parsed.lecturesCount) course.lecturesCount = Number(parsed.lecturesCount) || 0;
  if (parsed.instructorText) course.instructorText = String(parsed.instructorText);
  if (parsed.description) course.description = String(parsed.description);
  if (parsed.longDescription) course.longDescription = String(parsed.longDescription);
  if (Array.isArray(parsed.objectives) && parsed.objectives.length > 0) {
    course.objectives = parsed.objectives.map(String).filter(Boolean);
  }
  if (Array.isArray(parsed.targetAudience) && parsed.targetAudience.length > 0) {
    course.targetAudience = parsed.targetAudience.map(String).filter(Boolean);
  }
  if (Array.isArray(parsed.syllabus) && parsed.syllabus.length > 0) {
    course.syllabus = parsed.syllabus
      .filter((s: any) => s && (s.title || s.topic || s.week))
      .map((s: any) => ({
        title: String(s.title || s.topic || ''),
        week: String(s.week || ''),
        topic: String(s.topic || s.title || ''),
        points: Array.isArray(s.points) ? s.points.map(String).filter(Boolean) : [],
      }));
  }
  if (Array.isArray(parsed.certifications) && parsed.certifications.length > 0) {
    course.certifications = parsed.certifications.map(String).filter(Boolean);
  }
  if (Array.isArray(parsed.notes) && parsed.notes.length > 0) {
    course.notes = parsed.notes.map(String).filter(Boolean);
  }
  if (Array.isArray(parsed.tags) && parsed.tags.length > 0) {
    course.tags = parsed.tags.map(String).filter(Boolean);
  }

  return course;
}

const INSTRUCTOR_SYSTEM_PROMPT = `أنت مساعد ذكي متخصص في استخراج وتنظيم بيانات المدربين والمتخصصين.

مهمتك: استخرج المعلومات من النص المقدم وأرجعها بتنسيق JSON فقط، بدون أي نص إضافي.

**هيكل JSON المطلوب:**
{
  "name": "الاسم الكامل للمدرب",
  "roles": [
    "المسمى الوظيفي الأول",
    "المسمى الوظيفي الثاني"
  ],
  "shortBio": "نبذة مختصرة جداً لا تتجاوز جملتين، بأسلوب مهني واحترافي وجذاب",
  "bio": "السيرة الذاتية الكاملة والمفصلة مع كل التفاصيل والإنجازات والخبرات",
  "certifications": [
    "اسم الشهادة أو الاعتماد الأول",
    "اسم الشهادة الثاني"
  ]
}

**قواعد:**
1. أرجع JSON فقط
2. الحقول الفارغة: "" للنصوص و[] للمصفوفات
3. اكتب النبذة المختصرة بصيغة مهنية تبرز أهم ما يميز المدرب
4. استنتج المعلومات من السياق إن أمكن`;

export async function fillInstructorFromText(text: string): Promise<Partial<Instructor>> {
  const result = await callGroq(INSTRUCTOR_SYSTEM_PROMPT, text);
  const parsed = extractJSON(result);

  const instructor: Partial<Instructor> = {};
  if (parsed.name) instructor.name = String(parsed.name);
  if (Array.isArray(parsed.roles) && parsed.roles.length > 0) {
    instructor.roles = parsed.roles.map(String).filter(Boolean);
  }
  if (parsed.shortBio) instructor.shortBio = String(parsed.shortBio);
  if (parsed.bio) instructor.bio = String(parsed.bio);
  if (Array.isArray(parsed.certifications) && parsed.certifications.length > 0) {
    instructor.certifications = parsed.certifications.map(String).filter(Boolean);
  }

  return instructor;
}
