export type SubjectSeed = {
  slug: string;
  nameFr: string;
  nameAr: string;
  nameEn: string;
  color: string;
  rgb: [number, number, number];
  icon: string;
};

export const SUBJECT_SEED: SubjectSeed[] = [
  {
    slug: "mathematiques",
    nameFr: "Mathématiques",
    nameAr: "الرياضيات",
    nameEn: "Mathematics",
    color: "#4f3ef0",
    rgb: [0.31, 0.24, 0.94],
    icon: "Calculator",
  },
  {
    slug: "physique",
    nameFr: "Physique & Chimie",
    nameAr: "الفيزياء والكيمياء",
    nameEn: "Physics & Chemistry",
    color: "#0284c7",
    rgb: [0.01, 0.52, 0.77],
    icon: "Atom",
  },
  {
    slug: "sciences-naturelles",
    nameFr: "Sciences naturelles",
    nameAr: "العلوم الطبيعية",
    nameEn: "Natural Sciences",
    color: "#0d9488",
    rgb: [0.05, 0.58, 0.53],
    icon: "Dna",
  },
  {
    slug: "langue-arabe",
    nameFr: "Langue arabe",
    nameAr: "اللغة العربية وآدابها",
    nameEn: "Arabic Language",
    color: "#b45309",
    rgb: [0.71, 0.33, 0.04],
    icon: "PenLine",
  },
  {
    slug: "langue-francaise",
    nameFr: "Langue française",
    nameAr: "اللغة الفرنسية",
    nameEn: "French Language",
    color: "#e11d48",
    rgb: [0.88, 0.11, 0.28],
    icon: "Feather",
  },
  {
    slug: "langue-anglaise",
    nameFr: "Langue anglaise",
    nameAr: "اللغة الإنجليزية",
    nameEn: "English Language",
    color: "#2563eb",
    rgb: [0.15, 0.39, 0.92],
    icon: "Languages",
  },
  {
    slug: "histoire-geographie",
    nameFr: "Histoire & Géographie",
    nameAr: "التاريخ والجغرافيا",
    nameEn: "History & Geography",
    color: "#c2410c",
    rgb: [0.76, 0.25, 0.05],
    icon: "Landmark",
  },
  {
    slug: "philosophie",
    nameFr: "Philosophie",
    nameAr: "الفلسفة",
    nameEn: "Philosophy",
    color: "#7c3aed",
    rgb: [0.49, 0.23, 0.93],
    icon: "Brain",
  },
  {
    slug: "informatique",
    nameFr: "Informatique",
    nameAr: "الإعلام الآلي",
    nameEn: "Computer Science",
    color: "#0891b2",
    rgb: [0.03, 0.57, 0.7],
    icon: "Code2",
  },
  {
    slug: "education-islamique",
    nameFr: "Éducation islamique",
    nameAr: "التربية الإسلامية",
    nameEn: "Islamic Studies",
    color: "#15803d",
    rgb: [0.08, 0.5, 0.24],
    icon: "MoonStar",
  },
];

export type Topic = { fr: string; ar: string; en: string };

export const TOPICS: Record<string, Topic[]> = {
  mathematiques: [
    { fr: "Les suites numériques", ar: "المتتاليات العددية", en: "Numerical sequences" },
    { fr: "Les fonctions exponentielles", ar: "الدوال الأسية", en: "Exponential functions" },
    { fr: "Les limites et la continuité", ar: "النهايات والاستمرارية", en: "Limits and continuity" },
    { fr: "Les nombres complexes", ar: "الأعداد المركبة", en: "Complex numbers" },
    { fr: "Les probabilités", ar: "الاحتمالات", en: "Probability" },
    { fr: "La géométrie dans l'espace", ar: "الهندسة في الفضاء", en: "Geometry in space" },
    { fr: "Les intégrales", ar: "التكاملات", en: "Integrals" },
    { fr: "L'arithmétique", ar: "الحسابيات", en: "Arithmetic" },
  ],
  physique: [
    { fr: "La mécanique newtonienne", ar: "الميكانيك النيوتوني", en: "Newtonian mechanics" },
    { fr: "Les circuits électriques", ar: "الدوائر الكهربائية", en: "Electric circuits" },
    { fr: "Les ondes mécaniques", ar: "الموجات الميكانيكية", en: "Mechanical waves" },
    { fr: "La chimie organique", ar: "الكيمياء العضوية", en: "Organic chemistry" },
    { fr: "Les réactions acide-base", ar: "تفاعلات الحمض والقاعدة", en: "Acid-base reactions" },
    { fr: "La radioactivité", ar: "النشاط الإشعاعي", en: "Radioactivity" },
    { fr: "L'énergie cinétique et potentielle", ar: "الطاقة الحركية والكامنة", en: "Kinetic & potential energy" },
  ],
  "sciences-naturelles": [
    { fr: "La génétique et l'hérédité", ar: "علم الوراثة", en: "Genetics & heredity" },
    { fr: "La géologie : la structure de la Terre", ar: "الجيولوجيا: بنية الأرض", en: "Geology: Earth's structure" },
    { fr: "L'immunologie", ar: "علم المناعة", en: "Immunology" },
    { fr: "La photosynthèse", ar: "البناء الضوئي", en: "Photosynthesis" },
    { fr: "Le système nerveux", ar: "الجهاز العصبي", en: "The nervous system" },
    { fr: "La reproduction chez les êtres vivants", ar: "التكاثر عند الكائنات الحية", en: "Reproduction in living beings" },
  ],
  "langue-arabe": [
    { fr: "Analyse de textes littéraires", ar: "تحليل النصوص الأدبية", en: "Literary text analysis" },
    { fr: "La grammaire : l'accord et la fonction", ar: "النحو: الإعراب والوظيفة", en: "Grammar essentials" },
    { fr: "La poésie arabe classique", ar: "الشعر العربي الكلاسيكي", en: "Classical Arabic poetry" },
    { fr: "La rhétorique et les figures de style", ar: "البلاغة والصور البيانية", en: "Rhetoric & figures of speech" },
    { fr: "La dissertation littéraire", ar: "المقالة الأدبية", en: "Literary essay" },
  ],
  "langue-francaise": [
    { fr: "Le roman réaliste du XIXe siècle", ar: "الرواية الواقعية في القرن التاسع عشر", en: "The 19th century realist novel" },
    { fr: "La poésie et ses genres", ar: "الشعر وأنواعه", en: "Poetry and its genres" },
    { fr: "La grammaire de la phrase", ar: "قواعد الجملة", en: "Sentence grammar" },
    { fr: "La méthode de la dissertation", ar: "منهجية كتابة المقالة", en: "Essay methodology" },
    { fr: "Le théâtre classique", ar: "المسرح الكلاسيكي", en: "Classical theatre" },
  ],
  "langue-anglaise": [
    { fr: "Les temps verbaux en anglais", ar: "الأزمنة في اللغة الإنجليزية", en: "English verb tenses" },
    { fr: "La compréhension écrite", ar: "الفهم القرائي", en: "Reading comprehension" },
    { fr: "Le vocabulaire de la technologie", ar: "مفردات التكنولوجيا", en: "Technology vocabulary" },
    { fr: "Rédiger un paragraphe argumentatif", ar: "كتابة فقرة حجاجية", en: "Writing an argumentative paragraph" },
    { fr: "Les civilisations anglophones", ar: "الحضارات الناطقة بالإنجليزية", en: "Anglophone civilizations" },
  ],
  "histoire-geographie": [
    { fr: "La Première Guerre mondiale", ar: "الحرب العالمية الأولى", en: "World War I" },
    { fr: "La Révolution algérienne (1954-1962)", ar: "الثورة الجزائرية 1954-1962", en: "The Algerian Revolution" },
    { fr: "La décolonisation en Afrique et en Asie", ar: "تصفية الاستعمار في إفريقيا وآسيا", en: "Decolonization in Africa & Asia" },
    { fr: "Le relief et le climat du monde", ar: "تضاريس العالم ومناخه", en: "World relief and climate" },
    { fr: "La mondialisation et ses enjeux", ar: "العولمة ورهاناتها", en: "Globalization and its stakes" },
  ],
  philosophie: [
    { fr: "La conscience et l'inconscient", ar: "الوعي واللاوعي", en: "Consciousness & the unconscious" },
    { fr: "La notion de vérité", ar: "مفهوم الحقيقة", en: "The notion of truth" },
    { fr: "Le devoir et la morale", ar: "الواجب والأخلاق", en: "Duty and morality" },
    { fr: "La science et la certitude", ar: "العلم واليقين", en: "Science and certainty" },
    { fr: "La liberté", ar: "الحرية", en: "Freedom" },
  ],
  informatique: [
    { fr: "Les algorithmes et les structures de données", ar: "الخوارزميات وهياكل البيانات", en: "Algorithms & data structures" },
    { fr: "Programmation : variables et boucles", ar: "البرمجة: المتغيرات والحلقات", en: "Programming: variables & loops" },
    { fr: "Les bases de données", ar: "قواعد البيانات", en: "Databases" },
    { fr: "Internet et les réseaux", ar: "الإنترنت والشبكات", en: "Internet and networks" },
    { fr: "Créer une page web avec HTML", ar: "إنشاء صفحة ويب بلغة HTML", en: "Building a web page with HTML" },
  ],
  "education-islamique": [
    { fr: "Les piliers de la foi", ar: "أركان الإيمان", en: "Pillars of faith" },
    { fr: "La jurisprudence de la prière", ar: "فقه الصلاة", en: "Jurisprudence of prayer" },
    { fr: "La biographie du Prophète", ar: "السيرة النبوية", en: "The Prophet's biography" },
    { fr: "Les valeurs et l'éthique", ar: "القيم والأخلاق", en: "Values and ethics" },
  ],
};

export const VIDEO_SEED: {
  url: string;
  thumb: string;
  subject: string;
  topicIndex: number;
  duration: number;
}[] = [
  {
    url: "https://videos.pexels.com/video-files/6219854/6219854-uhd_4096_2160_30fps.mp4",
    thumb: "https://images.pexels.com/videos/6219854/pexels-photo-6219854.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    subject: "mathematiques",
    topicIndex: 0,
    duration: 21,
  },
  {
    url: "https://videos.pexels.com/video-files/8617058/8617058-hd_1920_1080_25fps.mp4",
    thumb: "https://images.pexels.com/videos/8617058/pexels-photo-8617058.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    subject: "mathematiques",
    topicIndex: 3,
    duration: 18,
  },
  {
    url: "https://videos.pexels.com/video-files/3196291/3196291-uhd_3840_2160_25fps.mp4",
    thumb: "https://images.pexels.com/videos/3196291/free-video-3196291.jpg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    subject: "mathematiques",
    topicIndex: 6,
    duration: 24,
  },
  {
    url: "https://videos.pexels.com/video-files/3196425/3196425-uhd_3840_2160_25fps.mp4",
    thumb: "https://images.pexels.com/videos/3196425/free-video-3196425.jpg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    subject: "physique",
    topicIndex: 1,
    duration: 16,
  },
  {
    url: "https://videos.pexels.com/video-files/8926873/8926873-hd_1920_1080_25fps.mp4",
    thumb: "https://images.pexels.com/videos/8926873/pexels-photo-8926873.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    subject: "physique",
    topicIndex: 4,
    duration: 19,
  },
  {
    url: "https://videos.pexels.com/video-files/8533986/8533986-uhd_3840_2160_30fps.mp4",
    thumb: "https://images.pexels.com/videos/8533986/pexels-photo-8533986.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    subject: "sciences-naturelles",
    topicIndex: 4,
    duration: 14,
  },
  {
    url: "https://videos.pexels.com/video-files/32402591/13822273_3840_2160_25fps.mp4",
    thumb: "https://images.pexels.com/videos/32402591/scientists-conduct-biological-research-using-microscopes-laboratory-equipment-for-biological-and-32402591.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    subject: "sciences-naturelles",
    topicIndex: 0,
    duration: 12,
  },
  {
    url: "https://videos.pexels.com/video-files/8617235/8617235-hd_1920_1080_25fps.mp4",
    thumb: "https://images.pexels.com/videos/8617235/algebra-business-calculus-chalk-8617235.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    subject: "langue-francaise",
    topicIndex: 3,
    duration: 15,
  },
  {
    url: "https://videos.pexels.com/video-files/8197037/8197037-hd_1920_1080_25fps.mp4",
    thumb: "https://images.pexels.com/videos/8197037/algebra-calculus-chalk-chalkboard-8197037.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=630&w=1200",
    subject: "langue-anglaise",
    topicIndex: 0,
    duration: 17,
  },
];

export const TEACHERS = [
  "M. Benali",
  "Mme Khelifi",
  "M. Hamidi",
  "Mme Cherif",
  "M. Boumediene",
  "Mme Amrane",
  "M. Ziani",
  "Mme Lakhdari",
];
