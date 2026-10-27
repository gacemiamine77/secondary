import {
  Atom,
  BookOpenText,
  Brain,
  Calculator,
  CheckCircle,
  ClipboardCheck,
  Code2,
  Dna,
  Feather,
  FileText,
  Globe2,
  GraduationCap,
  Home,
  Landmark,
  Languages,
  MoonStar,
  NotebookPen,
  PenLine,
  Play,
  Presentation,
  ScrollText,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export const RESOURCE_TYPES = [
  "course",
  "exercise",
  "homework",
  "devoir",
  "exam",
  "video",
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];

export const TYPE_META: Record<
  ResourceType,
  { icon: LucideIcon; color: string; gradient: string }
> = {
  course: {
    icon: BookOpenText,
    color: "#4f3ef0",
    gradient: "linear-gradient(135deg,#4f3ef0,#7c6cff)",
  },
  exercise: {
    icon: NotebookPen,
    color: "#0d9488",
    gradient: "linear-gradient(135deg,#0d9488,#2dd4bf)",
  },
  homework: {
    icon: Home,
    color: "#b45309",
    gradient: "linear-gradient(135deg,#b45309,#f59e0b)",
  },
  devoir: {
    icon: ClipboardCheck,
    color: "#7c3aed",
    gradient: "linear-gradient(135deg,#7c3aed,#c084fc)",
  },
  exam: {
    icon: ScrollText,
    color: "#e11d48",
    gradient: "linear-gradient(135deg,#e11d48,#fb7185)",
  },
  video: {
    icon: Play,
    color: "#0284c7",
    gradient: "linear-gradient(135deg,#0284c7,#38bdf8)",
  },
};

export const SUBJECT_ICONS: Record<string, LucideIcon> = {
  mathematiques: Calculator,
  physique: Atom,
  "sciences-naturelles": Dna,
  "langue-arabe": PenLine,
  "langue-francaise": Feather,
  "langue-anglaise": Languages,
  "histoire-geographie": Landmark,
  philosophie: Brain,
  informatique: Code2,
  "education-islamique": MoonStar,
  "education-civique": Landmark,
  "eveil-scientifique": Sparkles,
  default: FileText,
};

export type EducationalCycle = "primaire" | "moyen" | "lycee";

export interface CycleMeta {
  id: EducationalCycle;
  nameFr: string;
  nameAr: string;
  nameEn: string;
  badge: string;
  color: string;
  icon: LucideIcon;
  descFr: string;
  descAr: string;
  descEn: string;
  grades: {
    id: number;
    code: string;
    labelFr: string;
    labelAr: string;
    labelEn: string;
    examBadge?: string;
  }[];
}

export const CYCLES: Record<EducationalCycle, CycleMeta> = {
  primaire: {
    id: "primaire",
    nameFr: "Primaire",
    nameAr: "الابتدائي",
    nameEn: "Primary",
    badge: "École primaire",
    color: "#16a34a",
    icon: Sparkles,
    descFr: "De la 1ère à la 5ème année : acquisition des fondamentaux, éveil et examen de 5e.",
    descAr: "من السنة الأولى إلى الخامسة ابتدائي: ترسيخ الأساسيات والتحضير لامتحان نهاية المرحلة.",
    descEn: "Grades 1 to 5: fundamentals, literacy, numeracy and primary completion exams.",
    grades: [
      { id: 1, code: "1AP", labelFr: "1ère Année Primaire", labelAr: "السنة 1 ابتدائي", labelEn: "Grade 1" },
      { id: 2, code: "2AP", labelFr: "2ème Année Primaire", labelAr: "السنة 2 ابتدائي", labelEn: "Grade 2" },
      { id: 3, code: "3AP", labelFr: "3ème Année Primaire", labelAr: "السنة 3 ابتدائي", labelEn: "Grade 3" },
      { id: 4, code: "4AP", labelFr: "4ème Année Primaire", labelAr: "السنة 4 ابتدائي", labelEn: "Grade 4" },
      { id: 5, code: "5AP", labelFr: "5ème Année Primaire (Examen)", labelAr: "السنة 5 ابتدائي (امتحان)", labelEn: "Grade 5 (Exam)", examBadge: "Examen 5e" },
    ],
  },
  moyen: {
    id: "moyen",
    nameFr: "Moyen (CEM)",
    nameAr: "المتوسط",
    nameEn: "Middle School",
    badge: "Collège / CEM",
    color: "#0284c7",
    icon: GraduationCap,
    descFr: "De la 1ère à la 4ème année moyenne : approfondissement méthodologique et préparation au BEM.",
    descAr: "من الأولى إلى الرابعة متوسط: تعميق المعارف والتحضير المكثف لشهادة التعليم المتوسط (BEM).",
    descEn: "Grades 1 to 4: intermediate curriculum and intensive BEM preparation.",
    grades: [
      { id: 1, code: "1AM", labelFr: "1ère Année Moyenne", labelAr: "السنة 1 متوسط", labelEn: "Grade 6 / 1AM" },
      { id: 2, code: "2AM", labelFr: "2ème Année Moyenne", labelAr: "السنة 2 متوسط", labelEn: "Grade 7 / 2AM" },
      { id: 3, code: "3AM", labelFr: "3ème Année Moyenne", labelAr: "السنة 3 متوسط", labelEn: "Grade 8 / 3AM" },
      { id: 4, code: "4AM", labelFr: "4ème Année Moyenne (BEM)", labelAr: "السنة 4 متوسط (شهادة BEM)", labelEn: "Grade 9 (BEM)", examBadge: "BEM" },
    ],
  },
  lycee: {
    id: "lycee",
    nameFr: "Lycée",
    nameAr: "الثانوي",
    nameEn: "High School",
    badge: "Lycée / Secondaire",
    color: "#4f3ef0",
    icon: BookOpenText,
    descFr: "Tronc commun et filières spécialisées : révisions complètes et préparation au Baccalauréat.",
    descAr: "الجذع المشترك والشعب التخصصية: مراجعة شاملة ومرافقة نحو النجاح في البكالوريا (BAC).",
    descEn: "Secondary streams & specializations: thorough preparation for the national Baccalaureate (BAC).",
    grades: [
      { id: 1, code: "1AS", labelFr: "1ère Année Secondaire (Tronc Commun)", labelAr: "السنة 1 ثانوي (جذع مشترك)", labelEn: "Grade 10 / 1AS" },
      { id: 2, code: "2AS", labelFr: "2ème Année Secondaire", labelAr: "السنة 2 ثانوي (تخصص)", labelEn: "Grade 11 / 2AS" },
      { id: 3, code: "3AS", labelFr: "3ème Année Secondaire (BAC)", labelAr: "السنة 3 ثانوي (بكالوريا BAC)", labelEn: "Grade 12 (BAC)", examBadge: "BAC" },
    ],
  },
};

export const LEVELS = [1, 2, 3] as const;
export const TRIMESTERS = [1, 2, 3] as const;

export const PAGE_SIZE = 12;

export type ResourceDTO = {
  id: number;
  titleFr: string;
  titleAr: string;
  titleEn: string;
  type: string;
  cycle?: EducationalCycle;
  gradeCode?: string;
  subjectId: number;
  subjectSlug: string;
  subjectNameFr: string;
  subjectNameAr: string;
  subjectNameEn: string;
  subjectColor: string;
  level: number;
  trimester: number;
  year: number;
  fileUrl: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  durationMin: number | null;
  pages: number;
  sizeMb: string;
  views: number;
  downloads: number;
  featured: boolean;
  teacherName: string | null;
};

export type MetaDTO = {
  subjects: {
    id: number;
    slug: string;
    nameFr: string;
    nameAr: string;
    nameEn: string;
    color: string;
    icon: string;
    count: number;
  }[];
  years: number[];
  stats: {
    resources: number;
    downloads: number;
    videos: number;
    subjects: number;
  };
  typeCounts: Record<string, number>;
};

// ---------- Interactive Online Exercises ----------
export interface ExerciseStep {
  step: number;
  title: string;
  content: string;
  keyFormula?: string;
}

export interface ExerciseOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

export interface InteractiveExercise {
  id: number;
  cycle: EducationalCycle;
  gradeCode: string;
  subjectSlug: string;
  subjectName: string;
  subjectColor: string;
  title: string;
  difficulty: "facile" | "moyen" | "difficile" | "bac_bem";
  type: "qcm" | "numeric" | "guided";
  statement: string;
  question: string;
  options?: ExerciseOption[];
  correctNumericAnswer?: number;
  tolerance?: number;
  hints: string[];
  solutionSteps: ExerciseStep[];
  teacherTip: string;
  points: number;
  authorTeacher?: string;
}

// ---------- Live Formations & Courses ----------
export interface LiveCourse {
  id: number;
  title: string;
  cycle: EducationalCycle;
  gradeCode: string;
  subjectSlug: string;
  subjectName: string;
  subjectColor: string;
  teacher: {
    name: string;
    title: string;
    avatar: string;
    rating: number;
    reviewsCount: number;
    bio: string;
  };
  scheduledDate: string;
  scheduledTime: string;
  durationMin: number;
  seatsTotal: number;
  seatsBooked: number;
  roomUrl: string;
  description: string;
  syllabus: string[];
  tierRequired: "free" | "revision" | "excellence";
  status: "live" | "upcoming" | "replay";
  tags: string[];
}

// ---------- Subscriptions ----------
export interface SubscriptionPlan {
  id: "free" | "revision" | "excellence";
  name: string;
  badge: string;
  priceDzd: number;
  periodFr: string;
  periodAr: string;
  periodEn: string;
  popular?: boolean;
  color: string;
  features: { textFr: string; textAr: string; textEn: string; included: boolean }[];
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Formule Découverte",
    badge: "100% Gratuit",
    priceDzd: 0,
    periodFr: "Accès libre",
    periodAr: "وصول مجاني دائم",
    periodEn: "Free forever",
    color: "#0d9488",
    features: [
      { textFr: "Téléchargement illimité des cours & devoirs PDF", textAr: "تحميل غير محدود لجميع الدروس والفروض PDF", textEn: "Unlimited PDF lessons and exams download", included: true },
      { textFr: "Accès à toutes les vidéos explicatives publiques", textAr: "مشاهدة جميع الفيديوهات التعليمية العامة", textEn: "Access to all public explainer videos", included: true },
      { textFr: "3 corrections interactives en ligne par jour", textAr: "3 تصحيحات تفاعلية للتمارين يومياً", textEn: "3 interactive online exercise corrections / day", included: true },
      { textFr: "Cours en direct hebdomadaires avec formateurs", textAr: "حصص مباشرة أسبوعية مع الأساتذة", textEn: "Weekly live sessions with trainers", included: false },
      { textFr: "Correction personnalisée de devoirs en 24h", textAr: "تصحيح خاص للواجبات والفروض في 24 ساعة", textEn: "Custom homework correction in 24h", included: false },
      { textFr: "Groupe privé d'entraide et sessions de révision BAC/BEM", textAr: "مجموعة خاصة للمراجعة والتحضير للبكالوريا وBEM", textEn: "Private tutor group and BAC/BEM bootcamp", included: false },
    ],
  },
  {
    id: "revision",
    name: "Pass Révision",
    badge: "Recommandé",
    popular: true,
    priceDzd: 1900,
    periodFr: "par trimestre",
    periodAr: "لكل فصل دراسي",
    periodEn: "per trimester",
    color: "#4f3ef0",
    features: [
      { textFr: "Tout ce qui est inclus dans l'accès gratuit", textAr: "كل ميزات الوصول المجاني متضمنة", textEn: "Everything in Free plan included", included: true },
      { textFr: "Exercices corrigés interactifs en ligne illimités", textAr: "تمارين تفاعلية مصححة غير محدودة", textEn: "Unlimited interactive exercise corrections", included: true },
      { textFr: "2 cours interactifs en direct par mois avec les formateurs", textAr: "حصتان مباشرتان تفاعليتان شهرياً مع الأساتذة", textEn: "2 interactive live classes per month with trainers", included: true },
      { textFr: "Replays illimités des sessions enregistrées", textAr: "تسجيلات كاملة لجميع الحصص المنتهية", textEn: "Unlimited replays of past sessions", included: true },
      { textFr: "Fiches de synthèse et astuces des enseignants", textAr: "بطاقات ملخصة ونصائح حصرية من الأساتذة", textEn: "Exclusive summary sheets & teacher tips", included: true },
      { textFr: "Correction personnalisée de devoirs en 24h", textAr: "تصحيح خاص للواجبات والفروض في 24 ساعة", textEn: "Custom homework correction in 24h", included: false },
    ],
  },
  {
    id: "excellence",
    name: "Pass Excellence VIP",
    badge: "Réussite Garantie",
    priceDzd: 4900,
    periodFr: "par an scolaire",
    periodAr: "للسنة الدراسية كاملة",
    periodEn: "per school year",
    color: "#b45309",
    features: [
      { textFr: "Accès illimité à tous les cours en direct hebdomadaires", textAr: "ولوج غير محدود لجميع الحصص المباشرة الأسبوعية", textEn: "Unlimited access to all weekly live classes", included: true },
      { textFr: "Correction personnalisée de devoirs par nos enseignants (sous 24h)", textAr: "تصحيح شخصي مفصل لواجباتك ومقالاتك في أقل من 24 ساعة", textEn: "Personalized assignment grading by tutors in 24h", included: true },
      { textFr: "Bootcamp intensif révision BAC / BEM / Examen 5e", textAr: "معسكر تدريبي مكثف لمراجعة البكالوريا والبيام", textEn: "Intensive BAC / BEM / Primary exam bootcamp", included: true },
      { textFr: "Lien direct WhatsApp & chat avec les formateurs référents", textAr: "تواصل مباشر مع الأساتذة المشرفين لطرح الأسئلة", textEn: "Direct WhatsApp & chat with certified trainers", included: true },
      { textFr: "Simulations d'examens blancs notés avec corrigé type", textAr: "امتحانات تجريبية بيضاء مصححة مع سلم تنقيط دقيق", textEn: "Graded mock exam papers with model answers", included: true },
      { textFr: "Certificat de réussite & suivi de progression individualisé", textAr: "شهادة تفوق ومتابعة شخصية للمستوى", textEn: "Completion certificates & custom progress tracking", included: true },
    ],
  },
];
