import {
  Atom,
  BookOpenText,
  Brain,
  Calculator,
  ClipboardCheck,
  Code2,
  Dna,
  Feather,
  FileText,
  Globe2,
  Home,
  Landmark,
  Languages,
  MoonStar,
  NotebookPen,
  PenLine,
  Play,
  ScrollText,
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
  default: FileText,
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
