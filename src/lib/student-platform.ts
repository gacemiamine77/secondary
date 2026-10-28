import type { EducationalCycle } from "./constants";

export interface StudentProfile {
  id: string;
  name: string;
  studentIdCode: string; // e.g. "MASSAR-2026-DZ"
  email: string;
  avatar: string;
  cycle: EducationalCycle;
  gradeCode: string;
  streakDays: number;
  lastActiveDate: string;
  coursesCompleted: number;
  coursesTotal: number;
  exercisesCompleted: number;
  exercisesTotal: number;
  overallAccuracy: number;
  studyHoursThisWeek: number;
  studyHoursLastWeek: number;
  velocityTrend: {
    hoursDeltaPct: number;
    completionDeltaPct: number;
    direction: "up" | "down";
  };
  subjectProficiency: {
    subject: string;
    subjectSlug: string;
    scorePct: number;
    color: string;
  }[];
  knowledgeGaps: {
    id: string;
    subject: string;
    subjectSlug: string;
    topic: string;
    scorePct: number;
    recommendation: string;
  }[];
  badges: {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedAt?: string;
    progressPct: number;
  }[];
}

export interface LeaderboardStudent {
  rank: number;
  id: string;
  name: string;
  studentIdCode: string;
  cycle: EducationalCycle;
  gradeCode: string;
  avatar: string;
  points: number;
  completionPct: number;
  accuracyPct: number;
  focusHoursThisWeek: number;
  isCurrentUser?: boolean;
  weeklyBadges?: string[];
}

export interface DailyQuizQuestion {
  id: number;
  cycle: EducationalCycle;
  gradeCode: string;
  subject: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

export interface StudyRoomMessage {
  id: string;
  channelId: string;
  sender: string;
  avatar: string;
  text: string;
  timestamp: string;
  isTeacher?: boolean;
}

export interface DigitalNotebook {
  topicId: string;
  topicTitle: string;
  content: string;
  lastEditedBy: string;
  lastUpdatedAt: string;
}

export interface PeerStudyEvent {
  id: string;
  title: string;
  subject: string;
  cycle: EducationalCycle;
  date: string;
  time: string;
  host: string;
  attendeesCount: number;
  maxAttendees: number;
  isRsvp: boolean;
  description: string;
}

export interface TeacherQuestion {
  id: string;
  studentName: string;
  subject: string;
  question: string;
  contextReference: string;
  createdAt: string;
  status: "answered" | "in_review";
  teacherAnswer?: {
    teacherName: string;
    teacherTitle: string;
    answer: string;
    answeredAt: string;
  };
}

export interface DictionaryEntry {
  id: string;
  term: string;
  category: string;
  defFr: string;
  defAr: string;
  defEn: string;
  example: string;
}

// ---------------- Initial Store Seed ----------------

export const DEFAULT_STUDENT: StudentProfile = {
  id: "student-1",
  name: "Amina Benali",
  studentIdCode: "MASSAR-2026-DZ",
  email: "amina.benali@lycee-alger.dz",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
  cycle: "lycee",
  gradeCode: "3AS",
  streakDays: 14,
  lastActiveDate: "Aujourd'hui",
  coursesCompleted: 38,
  coursesTotal: 50,
  exercisesCompleted: 64,
  exercisesTotal: 80,
  overallAccuracy: 88.5,
  studyHoursThisWeek: 14.5,
  studyHoursLastWeek: 11.2,
  velocityTrend: {
    hoursDeltaPct: 29.5,
    completionDeltaPct: 8.0,
    direction: "up",
  },
  subjectProficiency: [
    { subject: "Mathématiques", subjectSlug: "mathematiques", scorePct: 88, color: "#4f3ef0" },
    { subject: "Physique & Chimie", subjectSlug: "physique", scorePct: 82, color: "#0284c7" },
    { subject: "Sciences Naturelles", subjectSlug: "sciences-naturelles", scorePct: 92, color: "#0d9488" },
    { subject: "Langue Arabe", subjectSlug: "langue-arabe", scorePct: 85, color: "#16a34a" },
    { subject: "Langue Française", subjectSlug: "langue-francaise", scorePct: 78, color: "#e11d48" },
    { subject: "Philosophie", subjectSlug: "philosophie", scorePct: 72, color: "#7c3aed" },
  ],
  knowledgeGaps: [
    {
      id: "gap-1",
      subject: "Mathématiques",
      subjectSlug: "mathematiques",
      topic: "Suites arithmético-géométriques et calcul de limite",
      scorePct: 42,
      recommendation: "Faire la série d'exercices d'annales BAC et réviser les fiches de cours.",
    },
    {
      id: "gap-2",
      subject: "Physique-Chimie",
      subjectSlug: "physique",
      topic: "Titrage acido-basique & calcul du pH à l'équivalence",
      scorePct: 50,
      recommendation: "Revoir la vidéo expérimentale et s'entraîner sur la méthode des tangentes.",
    },
    {
      id: "gap-3",
      subject: "Philosophie",
      subjectSlug: "philosophie",
      topic: "La méthode dialectique et la transition antithèse / synthèse",
      scorePct: 56,
      recommendation: "Consulter la fiche méthode de M. Boumediene et rédiger un plan détaillé.",
    },
  ],
  badges: [
    {
      id: "b-streak-14",
      name: "Flamme Olympique",
      description: "14 jours consécutifs d'apprentissage actif sans interruption.",
      icon: "flame",
      unlocked: true,
      unlockedAt: "Hier",
      progressPct: 100,
    },
    {
      id: "b-focus-10",
      name: "Sprint Focus 10h",
      description: "Enregistrer plus de 10 heures au chronomètre Pomodoro cette semaine.",
      icon: "timer",
      unlocked: true,
      unlockedAt: "Il y a 2 jours",
      progressPct: 100,
    },
    {
      id: "b-major-promo",
      name: "Top 5 National",
      description: "Se hisser parmi les 5 élèves les plus assidus du classement général.",
      icon: "trophy",
      unlocked: true,
      unlockedAt: "Cette semaine",
      progressPct: 100,
    },
    {
      id: "b-quiz-streak",
      name: "Quiz Champion",
      description: "Compléter 5 Daily Knowledge Quizzes avec un score supérieur à 80%.",
      icon: "award",
      unlocked: true,
      unlockedAt: "Il y a 3 jours",
      progressPct: 100,
    },
    {
      id: "b-notebook-collab",
      name: "Scribe Collaboratif",
      description: "Participer à la rédaction d'un Digital Notebook partagé en groupe d'étude.",
      icon: "notebook",
      unlocked: true,
      unlockedAt: "Il y a 4 jours",
      progressPct: 100,
    },
    {
      id: "b-ask-teacher",
      name: "Curiosité Scientifique",
      description: "Poser 5 questions précises aux enseignants et tuteurs.",
      icon: "message-circle-question",
      unlocked: false,
      progressPct: 60, // 3/5
    },
  ],
};

export const INITIAL_LEADERBOARD: LeaderboardStudent[] = [
  {
    rank: 1,
    id: "std-top-focus",
    name: "Yacine Touati",
    studentIdCode: "MASSAR-BAC-001",
    cycle: "lycee",
    gradeCode: "3AS Maths",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
    points: 4850,
    completionPct: 94,
    accuracyPct: 93.4,
    focusHoursThisWeek: 21.5, // MOST PRODUCTIVE STUDENT
    weeklyBadges: ["Productivité Maximale", "Major BAC"],
  },
  {
    rank: 2,
    id: "student-1",
    name: "Amina Benali (Vous)",
    studentIdCode: "MASSAR-2026-DZ",
    cycle: "lycee",
    gradeCode: "3AS Scientifique",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
    points: 4420,
    completionPct: 80,
    accuracyPct: 88.5,
    focusHoursThisWeek: 14.5,
    isCurrentUser: true,
    weeklyBadges: ["Flamme 14j", "Top 3"],
  },
  {
    rank: 3,
    id: "std-3",
    name: "Karim Mansouri",
    studentIdCode: "MASSAR-BAC-042",
    cycle: "lycee",
    gradeCode: "3AS Math-Élem",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
    points: 4180,
    completionPct: 78,
    accuracyPct: 86.2,
    focusHoursThisWeek: 16.8,
    weeklyBadges: ["Génie Géométrie"],
  },
  {
    rank: 4,
    id: "std-4",
    name: "Sara Khelifi",
    studentIdCode: "MASSAR-BEM-019",
    cycle: "moyen",
    gradeCode: "4AM BEM",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80",
    points: 3950,
    completionPct: 85,
    accuracyPct: 91.0,
    focusHoursThisWeek: 13.2,
    weeklyBadges: ["Major BEM"],
  },
  {
    rank: 5,
    id: "std-5",
    name: "Mehdi Belkacem",
    studentIdCode: "MASSAR-BAC-088",
    cycle: "lycee",
    gradeCode: "2AS Sciences",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&h=200&q=80",
    points: 3620,
    completionPct: 72,
    accuracyPct: 84.1,
    focusHoursThisWeek: 12.0,
  },
  {
    rank: 6,
    id: "std-6",
    name: "Rania Amrani",
    studentIdCode: "MASSAR-PRI-007",
    cycle: "primaire",
    gradeCode: "5AP Examen 5e",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80",
    points: 3410,
    completionPct: 90,
    accuracyPct: 94.5,
    focusHoursThisWeek: 9.5,
    weeklyBadges: ["Étoile Primaire"],
  },
  {
    rank: 7,
    id: "std-7",
    name: "Nassim Bouzid",
    studentIdCode: "MASSAR-BAC-102",
    cycle: "lycee",
    gradeCode: "3AS Gestion & Éco",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80",
    points: 3200,
    completionPct: 69,
    accuracyPct: 82.0,
    focusHoursThisWeek: 8.5,
  },
  {
    rank: 8,
    id: "std-8",
    name: "Ines Chergui",
    studentIdCode: "MASSAR-BEM-055",
    cycle: "moyen",
    gradeCode: "3AM",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80",
    points: 2980,
    completionPct: 65,
    accuracyPct: 80.5,
    focusHoursThisWeek: 7.8,
  },
];

export const INITIAL_DAILY_QUIZ: DailyQuizQuestion[] = [
  {
    id: 1,
    cycle: "lycee",
    gradeCode: "3AS",
    subject: "Mathématiques",
    question: "Si lim (u_n) = 3 et v_n = 2u_n - 1, quelle est la limite de (v_n) quand n tend vers +∞ ?",
    options: [
      { id: "a", text: "5", isCorrect: true },
      { id: "b", text: "6", isCorrect: false },
      { id: "c", text: "2", isCorrect: false },
      { id: "d", text: "Indéterminée", isCorrect: false },
    ],
    explanation: "Par opérations sur les limites : lim v_n = 2 × 3 - 1 = 6 - 1 = 5.",
  },
  {
    id: 2,
    cycle: "lycee",
    gradeCode: "3AS",
    subject: "Physique & Chimie",
    question: "Dans un circuit RC, quelle est l'unité de la constante de temps τ = RC dans le système international ?",
    options: [
      { id: "a", text: "La seconde (s)", isCorrect: true },
      { id: "b", text: "L'ohm (Ω)", isCorrect: false },
      { id: "c", text: "Le farad (F)", isCorrect: false },
      { id: "d", text: "Le volt (V)", isCorrect: false },
    ],
    explanation: "Par analyse dimensionnelle : [R] = V/A et [C] = (A·s)/V, donc [RC] = s (la seconde).",
  },
  {
    id: 3,
    cycle: "moyen",
    gradeCode: "4AM",
    subject: "Mathématiques (BEM)",
    question: "Dans un triangle rectangle dont l'hypoténuse mesure 10 cm et un côté mesure 6 cm, quelle est la longueur du 3ème côté ?",
    options: [
      { id: "a", text: "8 cm", isCorrect: true },
      { id: "b", text: "4 cm", isCorrect: false },
      { id: "c", text: "7 cm", isCorrect: false },
      { id: "d", text: "6,5 cm", isCorrect: false },
    ],
    explanation: "D'après Pythagore : c² = 10² - 6² = 100 - 36 = 64 ⟹ c = √64 = 8 cm.",
  },
  {
    id: 4,
    cycle: "lycee",
    gradeCode: "3AS",
    subject: "Sciences Naturelles",
    question: "Quel acide aminé est codé par le codon initiateur universel AUG sur l'ARNm ?",
    options: [
      { id: "a", text: "Méthionine", isCorrect: true },
      { id: "b", text: "Leucine", isCorrect: false },
      { id: "c", text: "Glycine", isCorrect: false },
      { id: "d", text: "Valine", isCorrect: false },
    ],
    explanation: "Le codon d'initiation AUG code toujours pour la Méthionine chez les eucaryotes.",
  },
  {
    id: 5,
    cycle: "primaire",
    gradeCode: "5AP",
    subject: "Langue Arabe",
    question: "ما هو إعراب كلمة « التلميذُ » في جملة : « يقرأُ التلميذُ الدرسَ » ؟",
    options: [
      { id: "a", text: "فاعل مرفوع وعلامة رفعه الضمة الظاهرة على آخره", isCorrect: true },
      { id: "b", text: "مفعول به منصوب وعلامة نصبه الفتحة", isCorrect: false },
      { id: "c", text: "مبتدأ مرفوع", isCorrect: false },
    ],
    explanation: "« التلميذُ » هو الذي قام بفعل القراءة، فهو فاعل مرفوع بالضمة الظاهرة.",
  },
];

export const INITIAL_STUDY_ROOM_MESSAGES: StudyRoomMessage[] = [
  {
    id: "msg-1",
    channelId: "maths-bac-2026",
    sender: "M. Benali",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
    text: "Bienvenue à tous ! J'ai ajouté dans le Digital Notebook ci-contre la démonstration type par récurrence pour l'exercice sur les suites. N'hésitez pas à poser vos questions.",
    timestamp: "17:15",
    isTeacher: true,
  },
  {
    id: "msg-2",
    channelId: "maths-bac-2026",
    sender: "Yacine Touati",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
    text: "Merci monsieur ! Pour la question 3, est-ce qu'on doit toujours préciser que la raison est strictement comprise entre -1 et 1 avant de conclure ?",
    timestamp: "17:22",
  },
  {
    id: "msg-3",
    channelId: "maths-bac-2026",
    sender: "M. Benali",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
    text: "Oui absolument Yacine ! Au barème officiel du BAC, la citation explicite de la condition |q| < 1 vaut 0,25 pt.",
    timestamp: "17:24",
    isTeacher: true,
  },
  {
    id: "msg-4",
    channelId: "maths-bac-2026",
    sender: "Amina Benali",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
    text: "J'ai complété le paragraphe sur la limite dans les notes partagées avec l'exemple de l'annale 2024.",
    timestamp: "17:30",
  },
];

export const INITIAL_NOTEBOOK: Record<string, DigitalNotebook> = {
  "maths-bac-2026": {
    topicId: "maths-bac-2026",
    topicTitle: "Cahier Collectif : Suites Numériques & Raisonnement par Récurrence (BAC)",
    content: `# Fiche de Révision Partagée : Les Suites Numériques (BAC 2026)

## 1. Raisonnement par Récurrence (Méthode Infaillible)
Pour démontrer qu'une propriété P(n) est vraie pour tout n ≥ n0 :
1. **Initialisation** : Vérifier que P(n0) est vraie (remplacer n par n0).
2. **Hérédité** : Soit k ≥ n0 un entier fixé. On suppose que P(k) est vraie (Hypothèse de récurrence) et on démontre que P(k+1) est vraie.
3. **Conclusion** : Par récurrence, P(n) est vraie pour tout n ≥ n0.

## 2. Suites Arithmético-Géométriques
Relation de type : $u_{n+1} = a u_n + b$ (avec $a \\neq 1$).
- **Point fixe** : Résoudre $\\alpha = a\\alpha + b \\iff \\alpha = \\frac{b}{1-a}$.
- Poser la suite auxiliaire $v_n = u_n - \\alpha$.
- $v_n$ est géométrique de raison $q = a$ et de premier terme $v_0 = u_0 - \\alpha$.
- Formule explicite : $v_n = v_0 \\times a^n$, donc $u_n = v_0 \\times a^n + \\alpha$.

## 3. Limite et Convergence
- Si $-1 < a < 1$ : $\\lim_{n \\to +\\infty} a^n = 0 \\Longrightarrow \\lim u_n = \\alpha$ (La suite converge vers son point fixe).
- Si $a > 1$ et $v_0 > 0$ : $\\lim u_n = +\\infty$ (Divergente).`,
    lastEditedBy: "Amina Benali",
    lastUpdatedAt: "Aujourd'hui à 17:30",
  },
  "physique-chimie": {
    topicId: "physique-chimie",
    topicTitle: "Cahier Collectif : Circuits RC & Titrages Acido-Basiques",
    content: `# Synthèse Physique-Chimie BAC

## 1. Circuit RC
- Loi d'additivité des tensions : $u_R(t) + u_C(t) = E$.
- Équation différentielle de charge : $RC \\frac{du_C}{dt} + u_C = E$.
- Solution : $u_C(t) = E(1 - e^{-t/\\tau})$ avec $\\tau = RC$ (constante de temps en secondes).
- À $t = \\tau$ : $u_C = 0,63 E$ (63% de charge).
- À $t = 5\\tau$ : régime permanent atteint (>99%).

## 2. Titrage Acido-Basique
- Équivalence : les réactifs ont été introduits dans les proportions stœchiométriques.
- Relation : $\\frac{C_A V_A}{a} = \\frac{C_B V_{BE}}{b}$.
- Choix de l'indicateur coloré : sa zone de virage doit englober le pH à l'équivalence $pH_E$.`,
    lastEditedBy: "Mme Khelifi",
    lastUpdatedAt: "Hier à 19:10",
  },
  "prep-bem-4am": {
    topicId: "prep-bem-4am",
    topicTitle: "Cahier Collectif BEM : Théorème de Thalès & Trigonométrie",
    content: `# Préparation Brevet (BEM) : Géométrie

## 1. Théorème de Thalès
Conditions obligatoires :
- Deux droites sécantes en O.
- Deux droites parallèles $(AB) // (CD)$.
- Égalité des rapports : $\\frac{OA}{OC} = \\frac{OB}{OD} = \\frac{AB}{CD}$.

## 2. Réciproque de Thalès
Sert à prouver que deux droites sont **parallèles**.
Règle : alignement dans le même ordre + égalité des rapports.`,
    lastEditedBy: "M. Hamidi",
    lastUpdatedAt: "Il y a 2 jours",
  },
  "entraide-generale": {
    topicId: "entraide-generale",
    topicTitle: "Entraide & Organisation du Travail",
    content: `# Conseils & Planning des Révisions

- Organiser ses sessions avec la méthode Pomodoro : 25 min de travail intense sans distractions + 5 min de pause.
- Réviser en binôme avec le Study Companion pour comparer l'assiduité et combler les lacunes !
- Télécharger et annoter directement les sujets officiels des 5 dernières années dans la bibliothèque.`,
    lastEditedBy: "Yacine Touati",
    lastUpdatedAt: "Il y a 3 jours",
  },
};

export const INITIAL_PEER_EVENTS: PeerStudyEvent[] = [
  {
    id: "evt-1",
    title: "Session Révision Groupe : Exercices Types Suites Numériques",
    subject: "Mathématiques",
    cycle: "lycee",
    date: "Samedi 1 Novembre",
    time: "20:30 - 22:00",
    host: "Yacine Touati (3AS)",
    attendeesCount: 18,
    maxAttendees: 25,
    isRsvp: true,
    description: "Résolution collaborative chronométrée de 3 exercices d'annales BAC avec micro ouvert et tableau blanc.",
  },
  {
    id: "evt-2",
    title: "Atelier Chimie : Suivi Cinétique & Tangentes",
    subject: "Physique",
    cycle: "lycee",
    date: "Dimanche 2 Novembre",
    time: "19:00 - 20:30",
    host: "Amina Benali (3AS)",
    attendeesCount: 12,
    maxAttendees: 20,
    isRsvp: true,
    description: "Comment tracer et calculer la vitesse volumique de réaction sans se tromper d'échelle graphique.",
  },
  {
    id: "evt-3",
    title: "Sprint BEM : Géométrie & Trigonométrie 4AM",
    subject: "Mathématiques",
    cycle: "moyen",
    date: "Lundi 3 Novembre",
    time: "17:30 - 18:45",
    host: "Sara Khelifi (4AM)",
    attendeesCount: 15,
    maxAttendees: 30,
    isRsvp: false,
    description: "S'entraîner sur les 10 questions classiques de Thalès et Pythagore tombées aux BEM récents.",
  },
];

export const INITIAL_TEACHER_QUESTIONS: TeacherQuestion[] = [
  {
    id: "q-1",
    studentName: "Amina Benali",
    subject: "Mathématiques",
    question: "Bonjour monsieur, dans l'exercice sur les suites, quand la raison est négative (ex: q = -0.5), est-ce que la suite alterne de signe mais converge quand même vers 0 ?",
    contextReference: "Exercice #1 - Suites numériques (3AS)",
    createdAt: "Hier à 14:20",
    status: "answered",
    teacherAnswer: {
      teacherName: "M. Benali",
      teacherTitle: "Professeur agrégé de Mathématiques",
      answer: "Excellente question Amina ! Oui absolument. Les termes changent de signe alternativement (suite alternée), mais puisque la valeur absolue |q| = 0.5 < 1, les termes se rapprochent indéfiniment de 0. La limite reste donc 0.",
      answeredAt: "Hier à 15:45",
    },
  },
  {
    id: "q-2",
    studentName: "Amina Benali",
    subject: "Physique-Chimie",
    question: "Pour le titrage du vinaigre, comment justifier avec précision le choix de la phénolphtaléine comme indicateur ?",
    contextReference: "Devoir surveillé #2 - Titrages acido-basiques",
    createdAt: "Il y a 2 jours",
    status: "answered",
    teacherAnswer: {
      teacherName: "Mme Khelifi",
      teacherTitle: "Inspectrice de Physique-Chimie",
      answer: "À l'équivalence du titrage d'un acide faible par une base forte, le pH est basique (autour de 8,2 - 8,7). La zone de virage de la phénolphtaléine est [8,2 - 10,0], ce qui englobe parfaitement le pHE. Le changement de couleur rose persiste dès la première goutte excédentaire.",
      answeredAt: "Il y a 2 jours",
    },
  },
  {
    id: "q-3",
    studentName: "Amina Benali",
    subject: "Philosophie",
    question: "Comment réussir l'amorce dans l'introduction sans tomber dans les banalités du type 'Depuis la nuit des temps' ?",
    contextReference: "Cours de Philosophie - La Conscience et l'Inconscient",
    createdAt: "Aujourd'hui à 11:10",
    status: "in_review",
  },
];

export const DICTIONARY_ENTRIES: DictionaryEntry[] = [
  {
    id: "dict-1",
    term: "Suite géométrique",
    category: "Mathématiques",
    defFr: "Suite numérique où chaque terme s'obtient en multipliant le précédent par une constante fixe appelée raison (notée q).",
    defAr: "متتالية عددية يُحسب فيها كل حد بضرب الحد السابق له في عدد ثابت يسمى الأساس (q).",
    defEn: "A sequence of numbers where each term after the first is found by multiplying the previous one by a fixed non-zero ratio.",
    example: "u_{n+1} = q \\times u_n ⟹ u_n = u_0 \\times q^n",
  },
  {
    id: "dict-2",
    term: "Titrage acido-basique",
    category: "Physique-Chimie",
    defFr: "Technique expérimentale permettant de déterminer la concentration inconnue d'un acide (ou d'une base) par une réaction totale avec une solution titrante de concentration connue.",
    defAr: "تقنية مخبرية تهدف إلى تعيين التركيز المولي المجهول لمحلول حمضي أو أساسي عبر تفاعل معايرة تام مع محلول معاير معلوم التركيز.",
    defEn: "A laboratory method of quantitative chemical analysis used to determine the unknown concentration of an identified analyte.",
    example: "C_A \\times V_A = C_B \\times V_{BE}",
  },
  {
    id: "dict-3",
    term: "Théorème de Thalès",
    category: "Mathématiques",
    defFr: "Théorème de géométrie affirmant que dans un triangle, une droite parallèle à l'un des côtés découpe un triangle semblable dont les côtés sont proportionnels.",
    defAr: "مبرهنة هندسية تنص على أنه إذا قطع مستقيمان متوازيان مستقيمين متقاطعين، فإنهما يحددان عليهما قطعاً متناسبة الأطوال.",
    defEn: "A fundamental theorem of plane geometry concerning proportions of segments cut on two intersecting lines by parallel lines.",
    example: "OA / OB = OC / OD = AC / BD",
  },
  {
    id: "dict-4",
    term: "Transcription génétique",
    category: "Sciences Naturelles",
    defFr: "Processus biologique cellulaire au cours duquel un brin d'ADN est copié en une molécule d'acide ribonucléique messager (ARNm) par l'ARN polymérase.",
    defAr: "عملية حيوية يتم خلالها استنساخ سلسلة من الـ ADN إلى جزيء ARN رسول (ARNm) بواسطة أنزيم ARN بوليميراز في النواة.",
    defEn: "The biological process in which a segment of DNA is copied into RNA by the enzyme RNA polymerase.",
    example: "ADN 3'-TAC-5' ⟹ ARNm 5'-AUG-3'",
  },
  {
    id: "dict-5",
    term: "Oxydoréduction",
    category: "Physique-Chimie",
    defFr: "Réaction chimique au cours de laquelle s'effectue un transfert d'électrons entre un réducteur (qui perd des électrons) et un oxydant (qui en gagne).",
    defAr: "تفاعل كيميائي يحدث فيه انتقال إلكترونات بين مرجع (يفقد إلكترونات) ومؤكسد (يكتسب إلكترونات).",
    defEn: "A chemical reaction involving the transfer of electrons between two species (oxidation and reduction).",
    example: "Ox + n e^- ⇌ Red",
  },
  {
    id: "dict-6",
    term: "Dialectique",
    category: "Philosophie",
    defFr: "Méthode de raisonnement et de dissertation philosophique progressant par l'affrontement de thèses contradictoires (Thèse, Antithèse) pour aboutir à une Synthèse unificatrice.",
    defAr: "منهجية تفكير فلسفية تقوم على مقارعة أطروحة ونقيضها للوصول إلى تركيب شامل يتجاوز التناقض.",
    defEn: "A discourse between two opposing sides arguing through thesis, antithesis, and resolving in synthesis.",
    example: "Plan dialectique : 1. Thèse  2. Antithèse  3. Synthèse dépassante.",
  },
];

// ---------------- Global In-Memory Student Store ----------------

interface StudentPlatformStore {
  student: StudentProfile;
  leaderboard: LeaderboardStudent[];
  dailyQuiz: DailyQuizQuestion[];
  quizCompletedToday: boolean;
  quizScoreToday: number;
  studyRoomMessages: StudyRoomMessage[];
  notebooks: Record<string, DigitalNotebook>;
  peerEvents: PeerStudyEvent[];
  teacherQuestions: TeacherQuestion[];
  dictionary: DictionaryEntry[];
}

const globalForStudentPlatform = globalThis as unknown as {
  __massarStudentStore?: StudentPlatformStore;
};

export function getStudentStore(): StudentPlatformStore {
  if (!globalForStudentPlatform.__massarStudentStore) {
    globalForStudentPlatform.__massarStudentStore = {
      student: { ...DEFAULT_STUDENT },
      leaderboard: [...INITIAL_LEADERBOARD],
      dailyQuiz: [...INITIAL_DAILY_QUIZ],
      quizCompletedToday: false,
      quizScoreToday: 0,
      studyRoomMessages: [...INITIAL_STUDY_ROOM_MESSAGES],
      notebooks: { ...INITIAL_NOTEBOOK },
      peerEvents: [...INITIAL_PEER_EVENTS],
      teacherQuestions: [...INITIAL_TEACHER_QUESTIONS],
      dictionary: [...DICTIONARY_ENTRIES],
    };
  }
  return globalForStudentPlatform.__massarStudentStore;
}

export function logFocusSession(minutes: number, taskLabel?: string): {
  newTotalHours: number;
  pointsEarned: number;
  student: StudentProfile;
} {
  const store = getStudentStore();
  const hours = minutes / 60;
  store.student.studyHoursThisWeek = Number((store.student.studyHoursThisWeek + hours).toFixed(1));
  const points = Math.round(minutes * 2); // 2 pts per minute
  
  // Update student on leaderboard
  const lbUser = store.leaderboard.find((s) => s.isCurrentUser);
  if (lbUser) {
    lbUser.points += points;
    lbUser.focusHoursThisWeek = store.student.studyHoursThisWeek;
  }

  // Recalculate ranks based on points
  store.leaderboard.sort((a, b) => b.points - a.points);
  store.leaderboard.forEach((s, idx) => {
    s.rank = idx + 1;
  });

  return {
    newTotalHours: store.student.studyHoursThisWeek,
    pointsEarned: points,
    student: store.student,
  };
}

export function submitDailyQuizAnswers(answers: Record<number, string>): {
  score: number;
  total: number;
  pointsEarned: number;
  details: { questionId: number; isCorrect: boolean }[];
} {
  const store = getStudentStore();
  let correctCount = 0;
  const details: { questionId: number; isCorrect: boolean }[] = [];

  store.dailyQuiz.forEach((q) => {
    const selectedOptionId = answers[q.id];
    const correctOption = q.options.find((o) => o.isCorrect);
    const isCorrect = correctOption ? selectedOptionId === correctOption.id : false;
    if (isCorrect) correctCount += 1;
    details.push({ questionId: q.id, isCorrect });
  });

  const pointsEarned = correctCount * 25; // 25 pts per correct question
  store.quizCompletedToday = true;
  store.quizScoreToday = correctCount;

  // Add points to student
  const lbUser = store.leaderboard.find((s) => s.isCurrentUser);
  if (lbUser) {
    lbUser.points += pointsEarned;
  }
  store.student.streakDays += 1;

  return {
    score: correctCount,
    total: store.dailyQuiz.length,
    pointsEarned,
    details,
  };
}

export function askTeacherQuestion(payload: {
  studentName: string;
  subject: string;
  question: string;
  contextReference?: string;
}): TeacherQuestion {
  const store = getStudentStore();
  const newQuestion: TeacherQuestion = {
    id: `q-${Date.now()}`,
    studentName: payload.studentName || store.student.name,
    subject: payload.subject,
    question: payload.question,
    contextReference: payload.contextReference || "Question générale",
    createdAt: "À l'instant",
    status: "in_review",
  };
  store.teacherQuestions.unshift(newQuestion);
  return newQuestion;
}

export function updateDigitalNotebook(topicId: string, content: string, editorName?: string): DigitalNotebook {
  const store = getStudentStore();
  const existing = store.notebooks[topicId];
  const updated: DigitalNotebook = {
    topicId,
    topicTitle: existing ? existing.topicTitle : `Notes partagées (${topicId})`,
    content,
    lastEditedBy: editorName || store.student.name,
    lastUpdatedAt: "À l'instant",
  };
  store.notebooks[topicId] = updated;
  return updated;
}

export function postStudyRoomMessage(channelId: string, text: string, senderName?: string): StudyRoomMessage {
  const store = getStudentStore();
  const msg: StudyRoomMessage = {
    id: `msg-${Date.now()}`,
    channelId,
    sender: senderName || store.student.name,
    avatar: store.student.avatar,
    text,
    timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
  };
  store.studyRoomMessages.push(msg);
  return msg;
}

export function toggleEventRsvp(eventId: string): { ok: boolean; isRsvp: boolean; attendeesCount: number } {
  const store = getStudentStore();
  const evt = store.peerEvents.find((e) => e.id === eventId);
  if (!evt) return { ok: false, isRsvp: false, attendeesCount: 0 };
  
  if (evt.isRsvp) {
    evt.isRsvp = false;
    evt.attendeesCount = Math.max(0, evt.attendeesCount - 1);
  } else {
    evt.isRsvp = true;
    evt.attendeesCount += 1;
  }
  return { ok: true, isRsvp: evt.isRsvp, attendeesCount: evt.attendeesCount };
}
