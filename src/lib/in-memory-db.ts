import { SUBJECT_SEED, TEACHERS, TOPICS, VIDEO_SEED } from "@/lib/seed-data";
import type {
  EducationalCycle,
  InteractiveExercise,
  LiveCourse,
  MetaDTO,
  ResourceDTO,
} from "@/lib/constants";
import type { ResourceFilters } from "@/lib/queries";

export type InMemorySubject = {
  id: number;
  slug: string;
  nameFr: string;
  nameAr: string;
  nameEn: string;
  color: string;
  icon: string;
  rgb: [number, number, number];
};

export type InMemoryResource = ResourceDTO & {
  createdAt: Date;
};

// Deterministic pseudo-random generator
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TR_FR = ["1er trimestre", "2eme trimestre", "3eme trimestre"];
const TR_AR = ["الفصل الأول", "الفصل الثاني", "الفصل الثالث"];
const TR_EN = ["Term 1", "Term 2", "Term 3"];

function titles(
  type: string,
  topic: { fr: string; ar: string; en: string },
  extra: { n?: number; term?: number; subject?: { fr: string; ar: string; en: string } }
) {
  switch (type) {
    case "course":
      return {
        fr: `Cours : ${topic.fr}`,
        ar: `درس: ${topic.ar}`,
        en: `Lesson: ${topic.en}`,
      };
    case "exercise":
      return {
        fr: `Exercices corrigés : ${topic.fr}`,
        ar: `تمارين محلولة: ${topic.ar}`,
        en: `Solved exercises: ${topic.en}`,
      };
    case "homework":
      return {
        fr: `Devoir maison : ${topic.fr}`,
        ar: `فرض منزلي: ${topic.ar}`,
        en: `Homework: ${topic.en}`,
      };
    case "devoir":
      return {
        fr: `Devoir surveillé N°${extra.n ?? 1} : ${topic.fr}`,
        ar: `فرض مراقبة رقم ${extra.n ?? 1}: ${topic.ar}`,
        en: `Supervised test #${extra.n ?? 1}: ${topic.en}`,
      };
    case "exam":
      return {
        fr: `Examen du ${TR_FR[(extra.term ?? 3) - 1]} : ${extra.subject?.fr ?? ""}`,
        ar: `اختبار ${TR_AR[(extra.term ?? 3) - 1]}: مادة ${extra.subject?.ar ?? ""}`,
        en: `${TR_EN[(extra.term ?? 3) - 1]} exam: ${extra.subject?.en ?? ""}`,
      };
    case "video":
      return {
        fr: `Vidéo explicative : ${topic.fr}`,
        ar: `فيديو تعليمي: ${topic.ar}`,
        en: `Explainer video: ${topic.en}`,
      };
    default:
      return { fr: topic.fr, ar: topic.ar, en: topic.en };
  }
}

// ---------------- Primary / Middle Extra Topics ----------------
const PRIMAIRE_TOPICS: Record<string, { fr: string; ar: string; en: string }[]> = {
  mathematiques: [
    { fr: "L'addition et la soustraction des grands nombres", ar: "الجمع والطرح للأعداد الكبيرة", en: "Addition & subtraction of large numbers" },
    { fr: "La table de multiplication et la division euclidienne", ar: "جدول الضرب والقسمة الإقليدية", en: "Multiplication tables & division" },
    { fr: "Les fractions simples et les nombres décimaux", ar: "الكسور البسيطة والأعداد العشرية", en: "Simple fractions & decimals" },
    { fr: "Le périmètre et l'aire du carré et du rectangle", ar: "المحيط ومساحة المربع والمستطيل", en: "Perimeter & area of polygons" },
    { fr: "Résolution de problèmes de proportionnalité (Examen 5e)", ar: "حل مسائل التناسبية (شهادة التعليم الابتدائي)", en: "Proportionality problem solving (5AP)" },
  ],
  "langue-arabe": [
    { fr: "Les règles de la phrase nominale et verbale", ar: "الجملة الاسمية والجملة الفعلية", en: "Nominal and verbal sentence structures" },
    { fr: "Les temps du verbe (Passé, Présent, Impératif)", ar: "تصريف الأفعال: الماضي والمضارع والأمر", en: "Verb tenses conjugation" },
    { fr: "La dictée et l'orthographe (Hamza et Ta)", ar: "الإملاء وقواعد كتابة الهمزة والتاء", en: "Spelling rules: Hamza & Ta" },
    { fr: "Production écrite : rédiger un récit de 8 lignes", ar: "التعبير الكتابي: كتابة نص سردي قصير", en: "Written expression: short story" },
  ],
  "langue-francaise": [
    { fr: "Les articles et le pluriel des noms", ar: "أدوات التعريف والتنكير وجمع الأسماء", en: "Articles and plural nouns" },
    { fr: "Le présent de l'indicatif (1er et 2e groupe)", ar: "تصريف أفعال المجموعة الأولى والثانية في الحاضر", en: "Present tense conjugation" },
    { fr: "Compréhension de l'écrit : les contes et fables", ar: "فهم النص: القصص والحكايات", en: "Reading comprehension: tales" },
  ],
  "education-islamique": [
    { fr: "Sourate Al-Qaria et Sourate Al-Zalzalah", ar: "حفظ وتفسير سورة القارعة والزلزلة", en: "Surah Al-Qariah & Al-Zalzalah" },
    { fr: "Les règles des ablutions et de la prière", ar: "أحكام الوضوء والصلاة المفروضة", en: "Rules of purification and prayer" },
    { fr: "Le respect des parents et l'honnêteté", ar: "بر الوالدين وخلق الصدق والأمانة", en: "Respect of parents and honesty" },
  ],
};

const MOYEN_TOPICS: Record<string, { fr: string; ar: string; en: string }[]> = {
  mathematiques: [
    { fr: "Le théorème de Pythagore et sa réciproque", ar: "مبرهنة فيثاغورس وخاصيتها العكسية", en: "Pythagorean theorem & converse" },
    { fr: "Le théorème de Thalès et le calcul des longueurs", ar: "مبرهنة طاليس وحساب الأطوال", en: "Thales' theorem & ratio calculations" },
    { fr: "Le calcul littéral et le développement factorisation", ar: "الحساب الحرفي والنشر والتحليل", en: "Algebraic expressions expansion & factoring" },
    { fr: "Les équations et inéquations du premier degré", ar: "المعادلات والمتراجحات من الدرجة الأولى", en: "Linear equations and inequalities" },
    { fr: "La trigonométrie dans le triangle rectangle (BEM)", ar: "النسب المثلثية في المثلث القائم (شهادة BEM)", en: "Trigonometry in right triangle (BEM)" },
    { fr: "Les fonctions linéaires et affines (BEM)", ar: "الدوال الخطية والتآلفية (تحضير BEM)", en: "Linear and affine functions (BEM)" },
  ],
  physique: [
    { fr: "La matière et ses transformations chimiques", ar: "المادة وتحولاتها الكيميائية", en: "Matter & chemical transformations" },
    { fr: "Le courant électrique continu et alternatif", ar: "التيار الكهربائي المستمر والمتناوب", en: "Direct & alternating current" },
    { fr: "Les forces et le principe des actions réciproques", ar: "القوى ومبدأ الفعلين المتبادلين", en: "Forces & Newton's action-reaction" },
    { fr: "La lumière et la propagation rectiligne", ar: "الظواهر الضوئية والانتشار المستقيم للضوء", en: "Light & rectilinear propagation" },
  ],
  "sciences-naturelles": [
    { fr: "La digestion et l'absorption des nutriments", ar: "الهضم وامتصاص المغذيات في الأمعاء", en: "Digestion & nutrient absorption" },
    { fr: "La respiration et les échanges gazeux", ar: "التنفس والمبادلات الغازية الخلوية", en: "Respiration and gas exchange" },
    { fr: "Le système immunitaire et la réponse inflammatoire", ar: "الجهاز المناعي والاستجابة الالتهابية", en: "Immune system & inflammatory response" },
    { fr: "La génétique et la transmission des caractères (BEM)", ar: "انتقال الصفات الوراثية والصبغيات (BEM)", en: "Genetics & chromosomal inheritance (BEM)" },
  ],
  "langue-anglaise": [
    { fr: "Past Simple and Past Continuous", ar: "الماضي البسيط والماضي المستمر", en: "Past Simple and Past Continuous" },
    { fr: "Modal Verbs (Can, Must, Should)", ar: "الأفعال المساعدة وقواعد الاستعمال", en: "Modal verbs usage" },
    { fr: "Expressing causes, effects and purpose (BEM)", ar: "التعبير عن السبب والنتيجة والهدف (BEM)", en: "Expressing cause, effect and purpose" },
  ],
};

// ---------------- Interactive Exercises Seed ----------------
const INITIAL_EXERCISES: InteractiveExercise[] = [
  {
    id: 1,
    cycle: "lycee",
    gradeCode: "3AS",
    subjectSlug: "mathematiques",
    subjectName: "Mathématiques",
    subjectColor: "#4f3ef0",
    title: "Convergence d'une suite géométrique & Limite",
    difficulty: "bac_bem",
    type: "qcm",
    statement: "Soit $(u_n)$ la suite numérique définie pour tout $n \\in \\mathbb{N}$ par : $u_0 = 4$ et $u_{n+1} = \\frac{1}{2}u_n + 3$.\nOn pose pour tout $n \\in \\mathbb{N}$ : $v_n = u_n - 6$.",
    question: "Quelle est l'expression explicite de $v_n$ en fonction de $n$, et quelle est la limite de $(u_n)$ quand $n \\to +\\infty$ ?",
    options: [
      {
        id: "a",
        text: "v_n = -2 × (1/2)^n et lim u_n = 6",
        isCorrect: true,
        feedback: "Parfait ! v_n est une suite géométrique de raison q = 1/2 et de premier terme v_0 = 4 - 6 = -2. Comme |q| < 1, lim v_n = 0 donc lim u_n = 6.",
      },
      {
        id: "b",
        text: "v_n = 2 × (1/2)^n et lim u_n = 3",
        isCorrect: false,
        feedback: "Attention au premier terme : v_0 = u_0 - 6 = 4 - 6 = -2 (et non +2). De plus, si v_n → 0, u_n = v_n + 6 tend vers 6.",
      },
      {
        id: "c",
        text: "v_n = -2 × 2^n et (u_n) diverge vers +∞",
        isCorrect: false,
        feedback: "La raison est q = 1/2 (terme devant u_n dans la relation de récurrence), donc la suite converge vers 6.",
      },
      {
        id: "d",
        text: "v_n = 4 × (1/2)^n et lim u_n = 0",
        isCorrect: false,
        feedback: "v_0 n'est pas égal à u_0, on a v_0 = u_0 - 6 = -2.",
      },
    ],
    hints: [
      "Calculez d'abord v_{n+1} en remplaçant u_{n+1} par (1/2)u_n + 3.",
      "Factorisez par 1/2 pour faire apparaître (u_n - 6).",
      "Rappelez-vous que si une suite géométrique a une raison q comprise entre -1 et 1, sa limite quand n → +∞ est 0.",
    ],
    solutionSteps: [
      {
        step: 1,
        title: "Démontrer que (v_n) est géométrique",
        content: "Pour tout n ∈ ℕ : v_{n+1} = u_{n+1} - 6 = (1/2)u_n + 3 - 6 = (1/2)u_n - 3 = (1/2)(u_n - 6) = (1/2)v_n.",
        keyFormula: "v_{n+1} = q \\times v_n \\text{ avec } q = \\frac{1}{2}",
      },
      {
        step: 2,
        title: "Calcul du premier terme v_0",
        content: "v_0 = u_0 - 6 = 4 - 6 = -2.",
        keyFormula: "v_0 = -2",
      },
      {
        step: 3,
        title: "Forme explicite et limite",
        content: "On en déduit que pour tout n : v_n = -2 × (1/2)^n. Comme -1 < 1/2 < 1, lim_{n→+∞} (1/2)^n = 0, donc lim v_n = 0. Or u_n = v_n + 6, d'où lim_{n→+∞} u_n = 6.",
        keyFormula: "\\lim_{n \\to +\\infty} u_n = 6",
      },
    ],
    teacherTip: "Au BAC, rédigez toujours la justification complète : calcul de v_{n+1}, factorisation par la raison q, conclusion sur la nature géométrique et vérification de la condition |q| < 1.",
    points: 20,
    authorTeacher: "M. Benali (Professeur agrégé de Mathématiques)",
  },
  {
    id: 2,
    cycle: "lycee",
    gradeCode: "3AS",
    subjectSlug: "physique",
    subjectName: "Physique & Chimie",
    subjectColor: "#0284c7",
    title: "Circuit RC : Équation différentielle de charge du condensateur",
    difficulty: "bac_bem",
    type: "qcm",
    statement: "On charge un condensateur de capacité C à travers un conducteur ohmique de résistance R par un générateur idéal de tension continue E.\nLa loi des mailles s'écrit : u_R(t) + u_C(t) = E.",
    question: "Quelle est la solution de l'équation différentielle vérifiée par la tension u_C(t) aux bornes du condensateur avec la condition initiale u_C(0) = 0 V ?",
    options: [
      {
        id: "a",
        text: "u_C(t) = E × (1 - e^(-t / RC))",
        isCorrect: true,
        feedback: "Exact ! C'est la solution classique de la charge : à t = 0, u_C = 0 V et quand t → +∞, u_C tend vers E avec une constante de temps τ = RC.",
      },
      {
        id: "b",
        text: "u_C(t) = E × e^(-t / RC)",
        isCorrect: false,
        feedback: "Attention, u_C(t) = E × e^(-t / RC) correspond à la décharge du condensateur, pas à sa charge !",
      },
      {
        id: "c",
        text: "u_C(t) = E × (1 + e^(-t / RC))",
        isCorrect: false,
        feedback: "Cette fonction donnerait u_C(0) = 2E, ce qui est physiquement impossible pour un condensateur initialement déchargé.",
      },
      {
        id: "d",
        text: "u_C(t) = (E / RC) × t",
        isCorrect: false,
        feedback: "La charge à travers une résistance n'est pas linéaire mais exponentielle en raison de l'amortissement causé par la résistance.",
      },
    ],
    hints: [
      "Exprimez le courant i(t) en fonction de la dérivée de u_C(t) : i(t) = C (du_C / dt).",
      "Appliquez la loi d'Ohm : u_R(t) = R × i(t) = RC (du_C / dt).",
      "Vérifiez les conditions aux limites : à t = 0, u_C = 0 et à t → ∞, u_C = E.",
    ],
    solutionSteps: [
      {
        step: 1,
        title: "Établissement de l'équation différentielle",
        content: "D'après la loi d'additivité des tensions : u_R + u_C = E. Comme i = C (du_C/dt) et u_R = R i, on a : RC (du_C/dt) + u_C = E.",
        keyFormula: "\\frac{du_C}{dt} + \\frac{1}{RC} u_C = \\frac{E}{RC}",
      },
      {
        step: 2,
        title: "Résolution avec constante de temps τ = RC",
        content: "La solution générale est de la forme u_C(t) = A e^(-t/τ) + B. Quand t → ∞, u_C = E donc B = E. À t = 0, u_C(0) = A + E = 0 donc A = -E.",
        keyFormula: "u_C(t) = E(1 - e^{-t / \\tau})",
      },
    ],
    teacherTip: "Retenez qu'à t = 5τ (avec τ = RC), le condensateur est considéré comme complètement chargé à plus de 99,3 %.",
    points: 15,
    authorTeacher: "Mme Khelifi (Inspectrice de Physique-Chimie)",
  },
  {
    id: 3,
    cycle: "moyen",
    gradeCode: "4AM",
    subjectSlug: "mathematiques",
    subjectName: "Mathématiques",
    subjectColor: "#4f3ef0",
    title: "Théorème de Thalès : Calcul d'une hauteur (Type BEM)",
    difficulty: "bac_bem",
    type: "qcm",
    statement: "Sur la figure ci-contre, les droites (AB) et (CD) sont sécantes en O, et les droites (AC) et (BD) sont parallèles.\nOn donne les longueurs suivantes : OA = 3 cm, OB = 9 cm, OC = 4 cm et AC = 2,5 cm.",
    question: "Calculer la longueur OD et la longueur BD.",
    options: [
      {
        id: "a",
        text: "OD = 12 cm et BD = 7,5 cm",
        isCorrect: true,
        feedback: "Bravo ! D'après le théorème de Thalès : OA/OB = OC/OD = AC/BD = 3/9 = 1/3. Donc OD = 4 × 3 = 12 cm et BD = 2,5 × 3 = 7,5 cm.",
      },
      {
        id: "b",
        text: "OD = 10 cm et BD = 6,5 cm",
        isCorrect: false,
        feedback: "Le rapport d'agrandissement est de k = OB / OA = 9 / 3 = 3. Multipliez chaque longueur par 3.",
      },
      {
        id: "c",
        text: "OD = 15 cm et BD = 8 cm",
        isCorrect: false,
        feedback: "Revoyez l'égalité des rapports : OA / OB = OC / OD = AC / BD.",
      },
    ],
    hints: [
      "Vérifiez d'abord les conditions : points alignés et droites parallèles.",
      "Écrivez l'égalité des trois rapports de Thalès à partir du sommet commun O.",
      "Utilisez le produit en croix pour calculer les deux grandeurs demandées.",
    ],
    solutionSteps: [
      {
        step: 1,
        title: "Énoncé des hypothèses et du théorème",
        content: "Les points O, A, B d'une part et O, C, D d'autre part sont alignés dans cet ordre. Les droites (AC) et (BD) sont parallèles. D'après le théorème de Thalès : OA / OB = OC / OD = AC / BD.",
        keyFormula: "\\frac{OA}{OB} = \\frac{OC}{OD} = \\frac{AC}{BD}",
      },
      {
        step: 2,
        title: "Calcul de OD",
        content: "3 / 9 = 4 / OD ⟹ OD = (9 × 4) / 3 = 12 cm.",
        keyFormula: "OD = 12\\text{ cm}",
      },
      {
        step: 3,
        title: "Calcul de BD",
        content: "3 / 9 = 2,5 / BD ⟹ BD = (9 × 2,5) / 3 = 7,5 cm.",
        keyFormula: "BD = 7,5\\text{ cm}",
      },
    ],
    teacherTip: "Dans l'épreuve de mathématiques du BEM, la rédaction rigoureuse (justification du parallélisme et citation du théorème) rapporte la moitié des points de l'exercice !",
    points: 15,
    authorTeacher: "M. Hamidi (Enseignant principal CEM)",
  },
  {
    id: 4,
    cycle: "primaire",
    gradeCode: "5AP",
    subjectSlug: "mathematiques",
    subjectName: "Mathématiques",
    subjectColor: "#16a34a",
    title: "Problème de proportionnalité & Pourcentage (Examen 5e)",
    difficulty: "moyen",
    type: "qcm",
    statement: "Un libraire achète 15 livres de lecture pour la somme de 4 500 DZD. Il décide ensuite d'acheter 25 livres du même modèle.\nIl bénéficie d'une remise de 10 % sur le montant total de son second achat.",
    question: "Quel est le montant final payé par le libraire pour les 25 livres après réduction ?",
    options: [
      {
        id: "a",
        text: "6 750 DZD",
        isCorrect: true,
        feedback: "Excellent ! Le prix d'un livre est 4 500 ÷ 15 = 300 DZD. Pour 25 livres : 25 × 300 = 7 500 DZD. La remise de 10 % est de 750 DZD, donc montant final = 7 500 - 750 = 6 750 DZD.",
      },
      {
        id: "b",
        text: "7 000 DZD",
        isCorrect: false,
        feedback: "N'oubliez pas de calculer d'abord le prix unitaire d'un livre (4 500 ÷ 15 = 300 DZD).",
      },
      {
        id: "c",
        text: "6 500 DZD",
        isCorrect: false,
        feedback: "Une réduction de 10 % sur 7 500 DZD correspond à 750 DZD, pas 1 000 DZD.",
      },
    ],
    hints: [
      "Étape 1 : Calculez le prix d'un seul livre.",
      "Étape 2 : Calculez le prix des 25 livres sans réduction.",
      "Étape 3 : Calculez 10 % du montant et soustrayez-le.",
    ],
    solutionSteps: [
      {
        step: 1,
        title: "Calcul du prix unitaire",
        content: "Prix d'un livre = 4 500 ÷ 15 = 300 DZD.",
        keyFormula: "4 500 \\div 15 = 300\\text{ DZD}",
      },
      {
        step: 2,
        title: "Prix des 25 livres avant remise",
        content: "Montant brut = 25 × 300 = 7 500 DZD.",
        keyFormula: "25 \\times 300 = 7 500\\text{ DZD}",
      },
      {
        step: 3,
        title: "Application de la remise de 10 %",
        content: "Montant de la remise = (7 500 × 10) ÷ 100 = 750 DZD. Montant payé = 7 500 - 750 = 6 750 DZD.",
        keyFormula: "7 500 - 750 = 6 750\\text{ DZD}",
      },
    ],
    teacherTip: "Pour calculer 10 % d'un nombre se terminant par un zéro, il suffit de supprimer le dernier zéro (7 500 → 750) !",
    points: 10,
    authorTeacher: "Mme Cherif (Conseillère pédagogique primaire)",
  },
  {
    id: 5,
    cycle: "lycee",
    gradeCode: "3AS",
    subjectSlug: "sciences-naturelles",
    subjectName: "Sciences naturelles",
    subjectColor: "#0d9488",
    title: "Synthèse des protéines : Transcription et Traduction",
    difficulty: "bac_bem",
    type: "qcm",
    statement: "Soit le brin transcrit d'ADN suivant : 3' - TAC GGC TTA CGA ATT - 5'.\nOn rappelle le code génétique : AUG = Méthionine (initiateur), CCG = Proline, AAU = Asparagine, GCU = Alanine, UAA = Stop.",
    question: "Quelle est la séquence d'acides aminés issue de la traduction de l'ARNm correspondant ?",
    options: [
      {
        id: "a",
        text: "Méthionine - Proline - Asparagine - Alanine",
        isCorrect: true,
        feedback: "Parfait ! La transcription du brin transcrit 3'-TAC GGC TTA CGA ATT-5' donne l'ARNm 5'-AUG CCG AAU GCU UAA-3'. La traduction s'arrête au codon UAA (Stop), donnant bien ces 4 acides aminés.",
      },
      {
        id: "b",
        text: "Méthionine - Proline - Asparagine - Alanine - Stop",
        isCorrect: false,
        feedback: "Le codon Stop (UAA) ne code pour aucun acide aminé, il signale simplement l'arrêt de la traduction.",
      },
      {
        id: "c",
        text: "Tyrosine - Glycine - Leucine - Arginine",
        isCorrect: false,
        feedback: "Attention, vous avez traduit directement les triplets d'ADN sans transcrire au préalable en ARNm complémentaire !",
      },
    ],
    hints: [
      "Transcrivez le brin d'ADN en ARNm par complémentarité des bases : A → U, T → A, C → G, G → C.",
      "Repérez le codon initiateur AUG et le codon de fin (Stop).",
    ],
    solutionSteps: [
      {
        step: 1,
        title: "Transcription en ARNm",
        content: "Brin transcrit ADN : 3'-TAC GGC TTA CGA ATT-5'\nARNm complémentaire : 5'-AUG CCG AAU GCU UAA-3'.",
        keyFormula: "\\text{ADN } 3' \\to 5' \\Longrightarrow \\text{ARNm } 5' \\to 3'",
      },
      {
        step: 2,
        title: "Traduction en chaîne polypeptidique",
        content: "AUG = Met, CCG = Pro, AAU = Asn, GCU = Ala, UAA = Codon Stop (libération de la chaîne par les facteurs de terminaison).",
        keyFormula: "\\text{Met - Pro - Asn - Ala}",
      },
    ],
    teacherTip: "Au BAC Sciences, n'oubliez jamais de préciser les polarités 5' et 3' des molécules d'acide nucléique.",
    points: 15,
    authorTeacher: "M. Ziani (Professeur agrégé de Sciences)",
  },
  {
    id: 6,
    cycle: "moyen",
    gradeCode: "4AM",
    subjectSlug: "physique",
    subjectName: "Physique & Chimie",
    subjectColor: "#0284c7",
    title: "Le courant électrique alternatif : Tension maximale & efficace",
    difficulty: "moyen",
    type: "qcm",
    statement: "Sur l'écran d'un oscilloscope, on observe la courbe d'une tension sinusoïdale alternative. Le spot dévie verticalement de 3 divisions par rapport à l'axe central. La sensibilité verticale est réglée sur Sv = 5 V/div.",
    question: "Quelle est la valeur de la tension maximale Umax et quelle est la tension efficace Ueff mesurée par un voltmètre en position AC ?",
    options: [
      {
        id: "a",
        text: "Umax = 15 V et Ueff ≈ 10,6 V",
        isCorrect: true,
        feedback: "Exactement ! Umax = 3 div × 5 V/div = 15 V. La tension efficace est Ueff = Umax / √2 = 15 / 1,414 ≈ 10,6 V.",
      },
      {
        id: "b",
        text: "Umax = 15 V et Ueff = 30 V",
        isCorrect: false,
        feedback: "La tension efficace est toujours inférieure à la tension maximale : Ueff = Umax / √2.",
      },
      {
        id: "c",
        text: "Umax = 8 V et Ueff = 5,6 V",
        isCorrect: false,
        feedback: "La sensibilité est de 5 V/div et la déviation est de 3 divisions, donc Umax = 3 × 5 = 15 V (et non 3 + 5).",
      },
    ],
    hints: [
      "Formule : Umax = y × Sv (avec y le nombre de divisions verticales).",
      "Formule : Ueff = Umax / √2.",
    ],
    solutionSteps: [
      {
        step: 1,
        title: "Calcul de la tension crête (maximale)",
        content: "Umax = y × Sv = 3 div × 5 V/div = 15 V.",
        keyFormula: "U_{\\max} = y \\times S_v = 15\\text{ V}",
      },
      {
        step: 2,
        title: "Calcul de la tension efficace",
        content: "Ueff = Umax / √2 = 15 / 1,414 ≈ 10,6 V.",
        keyFormula: "U_{\\text{eff}} = \\frac{U_{\\max}}{\\sqrt{2}} \\approx 10,6\\text{ V}",
      },
    ],
    teacherTip: "Rappel BEM : Le voltmètre mesure toujours la valeur efficace (Ueff), alors que l'oscilloscope mesure la valeur maximale (Umax) !",
    points: 10,
    authorTeacher: "Mme Lakhdari (Professeur de Physique CEM)",
  },
];

// ---------------- Live Formations & Courses Seed ----------------
const INITIAL_LIVE_COURSES: LiveCourse[] = [
  {
    id: 1,
    title: "Stage Intensif BAC : Les Suites Numériques & Raisonnement par Récurrence",
    cycle: "lycee",
    gradeCode: "3AS",
    subjectSlug: "mathematiques",
    subjectName: "Mathématiques",
    subjectColor: "#4f3ef0",
    teacher: {
      name: "M. Benali",
      title: "Professeur agrégé & Concepteur de sujets BAC",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
      rating: 4.95,
      reviewsCount: 142,
      bio: "18 ans d'expérience en lycée d'excellence. Plus de 1 200 élèves accompagnés vers la mention Très Bien au Baccalauréat.",
    },
    scheduledDate: "Samedi 1 Novembre 2026",
    scheduledTime: "18:00 - 20:00 (2h en direct)",
    durationMin: 120,
    seatsTotal: 30,
    seatsBooked: 24,
    roomUrl: "https://meet.google.com/ais-massar-math-3as",
    description: "Session interactive de 2 heures dédiée aux types d'exercices incontournables du BAC : suites arithmético-géométriques, théorème des gendarmes, convergence monotone et questions pièges.",
    syllabus: [
      "Méthode infaillible pour le raisonnement par récurrence",
      "Étude de suites auxiliaires géométriques (v_n = u_n - α)",
      "Résolution en direct d'un sujet officiel du BAC 2024",
      "Questions / Réponses individuelles avec le micro ouvert",
      "Fiche mémo téléchargeable & feuille d'exercices d'application",
    ],
    tierRequired: "revision",
    status: "live",
    tags: ["BAC 2026", "Suites", "Direct Interactif", "Maths"],
  },
  {
    id: 2,
    title: "Séance Prépa BEM : Maîtriser Thalès, Pythagore & Trigonométrie",
    cycle: "moyen",
    gradeCode: "4AM",
    subjectSlug: "mathematiques",
    subjectName: "Mathématiques",
    subjectColor: "#0284c7",
    teacher: {
      name: "M. Hamidi",
      title: "Enseignant principal de Mathématiques CEM",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
      rating: 4.9,
      reviewsCount: 98,
      bio: "Spécialiste de la préparation au Brevet (BEM). Approche visuelle et astuces simples pour ne perdre aucun point en géométrie.",
    },
    scheduledDate: "Dimanche 2 Novembre 2026",
    scheduledTime: "16:30 - 18:00 (1h30)",
    durationMin: 90,
    seatsTotal: 25,
    seatsBooked: 19,
    roomUrl: "https://meet.google.com/ais-massar-math-4am",
    description: "Un atelier de renforcement intensif pour consolider les réflexes géométriques exigés au BEM. Exercices progressifs et entraînement sur les sujets récents.",
    syllabus: [
      "Règles de rédaction type pour le théorème de Thalès et sa réciproque",
      "Différencier Cosinus, Sinus et Tangente sans se tromper",
      "Résolution guidée du grand problème de géométrie du BEM",
      "Auto-évaluation interactive et quiz d'échauffement",
    ],
    tierRequired: "free",
    status: "upcoming",
    tags: ["BEM 2026", "Géométrie", "Collège", "Atelier pratique"],
  },
  {
    id: 3,
    title: "Atelier Chimie BAC : Titrages Acide-Base & Suivi Cinétique",
    cycle: "lycee",
    gradeCode: "3AS",
    subjectSlug: "physique",
    subjectName: "Physique & Chimie",
    subjectColor: "#0284c7",
    teacher: {
      name: "Mme Khelifi",
      title: "Inspectrice & Enseignante de Physique-Chimie",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80",
      rating: 4.92,
      reviewsCount: 115,
      bio: "Passionnée par la vulgarisation expérimentale. Des simulations numériques 3D pour visualiser chaque réaction moléculaire.",
    },
    scheduledDate: "Mardi 4 Novembre 2026",
    scheduledTime: "19:00 - 20:30 (1h30)",
    durationMin: 90,
    seatsTotal: 30,
    seatsBooked: 15,
    roomUrl: "https://meet.google.com/ais-massar-chimie-3as",
    description: "Tout comprendre sur le titrage pH-métrique et conductimétrique : équivalence, choix de l'indicateur coloré, tableau d'avancement et incertitudes.",
    syllabus: [
      "Tableau d'avancement et détermination de l'état d'équivalence",
      "Méthode des tangentes parallèles et dérivée dpH/dV",
      "Étude complète d'un sujet d'annales BAC",
      "Fiche récapitulative des formules clefs",
    ],
    tierRequired: "revision",
    status: "upcoming",
    tags: ["BAC", "Chimie", "Titrages", "TP Interactif"],
  },
  {
    id: 4,
    title: "Primaire 5AP : Les Secrets pour Réussir la Production Écrite en Arabe",
    cycle: "primaire",
    gradeCode: "5AP",
    subjectSlug: "langue-arabe",
    subjectName: "Langue arabe",
    subjectColor: "#16a34a",
    teacher: {
      name: "Mme Cherif",
      title: "Enseignante chevronnée & Formatrice primaire",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80",
      rating: 4.98,
      reviewsCount: 88,
      bio: "Accompagnement bienveillant et ludique des jeunes élèves vers la maîtrise de l'expression écrite et de l'orthographe.",
    },
    scheduledDate: "Mercredi 5 Novembre 2026",
    scheduledTime: "14:00 - 15:15 (1h15)",
    durationMin: 75,
    seatsTotal: 20,
    seatsBooked: 14,
    roomUrl: "https://meet.google.com/ais-massar-arabe-5ap",
    description: "Un atelier spécialement conçu pour les élèves de 5ème année primaire pour apprendre à structurer un paragraphe de 8 à 10 lignes sans fautes d'accord ni d'orthographe.",
    syllabus: [
      "Les 3 parties incontournables : Introduction, Développement, Conclusion",
      "Enrichir son vocabulaire avec des adjectifs et des connecteurs logiques",
      "Éviter les répétitions et soigner la ponctuation",
      "Correction en direct de textes rédigés par les élèves",
    ],
    tierRequired: "free",
    status: "upcoming",
    tags: ["Primaire 5AP", "Tâbir", "Examen 5e", "Arabe"],
  },
  {
    id: 5,
    title: "Masterclass BAC : Rédaction de la Dissertation Philosophique",
    cycle: "lycee",
    gradeCode: "3AS",
    subjectSlug: "philosophie",
    subjectName: "Philosophie",
    subjectColor: "#7c3aed",
    teacher: {
      name: "M. Boumediene",
      title: "Docteur en Philosophie & Professeur en Classes Préparatoires",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
      rating: 4.88,
      reviewsCount: 76,
      bio: "Démystifier la philosophie pour toutes les filières (Scientifiques, Lettres, Gestion). Méthode dialectique claire et efficace.",
    },
    scheduledDate: "Jeudi 6 Novembre 2026",
    scheduledTime: "18:30 - 20:00 (1h30)",
    durationMin: 90,
    seatsTotal: 35,
    seatsBooked: 28,
    roomUrl: "https://meet.google.com/ais-massar-philo-3as",
    description: "Comment transformer une question philosophique en problématique captivante et rédiger un plan dialectique (Thèse / Antithèse / Synthèse) noté 16+/20.",
    syllabus: [
      "Analyse conceptuelle des mots-clés du sujet",
      "La méthode de problématisation étape par étape",
      "Mobiliser des citations et exemples pertinents",
      "Exemples de dissertations modèles rédigées",
    ],
    tierRequired: "excellence",
    status: "upcoming",
    tags: ["BAC Philo", "Dissertation", "Méthodologie", "Excellence VIP"],
  },
  {
    id: 6,
    title: "Atelier Replay : Sciences Naturelles 4AM - L'Immunité & les Vaccins",
    cycle: "moyen",
    gradeCode: "4AM",
    subjectSlug: "sciences-naturelles",
    subjectName: "Sciences naturelles",
    subjectColor: "#0d9488",
    teacher: {
      name: "M. Ziani",
      title: "Professeur agrégé de Sciences",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&h=200&q=80",
      rating: 4.94,
      reviewsCount: 104,
      bio: "Pédagogue expérimenté, spécialiste des schémas fonctionnels et de l'analyse d'expériences au BEM et au BAC.",
    },
    scheduledDate: "Session archivée (Disponible en Replay HD)",
    scheduledTime: "Replay vidéo 1h45 + PDF corrigé",
    durationMin: 105,
    seatsTotal: 500,
    seatsBooked: 320,
    roomUrl: "https://videos.pexels.com/video-files/32402591/13822273_3840_2160_25fps.mp4",
    description: "Replay complet de la session de révision sur le système immunitaire : réaction inflammatoire, phagocytose, immunité humorale et cellulaire.",
    syllabus: [
      "Schéma bilan de la réponse immunitaire innée et acquise",
      "Différence entre sérum thérapeutique et vaccin préventif",
      "Résolution de l'exercice type BEM sur les groupes sanguins",
    ],
    tierRequired: "revision",
    status: "replay",
    tags: ["Replay BEM", "Sciences", "Immunité", "Schémas bilans"],
  },
];

// ---------------- Multi-Cycle Data Initialization ----------------
function initData(): {
  subjects: InMemorySubject[];
  resources: InMemoryResource[];
  exercises: InteractiveExercise[];
  liveCourses: LiveCourse[];
} {
  const rand = mulberry32(20250917);
  const subjects: InMemorySubject[] = SUBJECT_SEED.map((s, index) => ({
    id: index + 1,
    slug: s.slug,
    nameFr: s.nameFr,
    nameAr: s.nameAr,
    nameEn: s.nameEn,
    color: s.color,
    icon: s.icon,
    rgb: s.rgb,
  }));

  const resources: InMemoryResource[] = [];
  let seq = 0;

  const pushDoc = (opts: {
    type: string;
    subjectSlug: string;
    cycle: EducationalCycle;
    gradeCode: string;
    level: number;
    trimester: number;
    year: number;
    t: { fr: string; ar: string; en: string };
    titleExtra?: { n?: number; term?: number; subject?: { fr: string; ar: string; en: string } };
    pages: number;
  }) => {
    const subject = subjects.find((x) => x.slug === opts.subjectSlug)!;
    const tt = titles(opts.type, opts.t, opts.titleExtra ?? {});
    seq += 1;
    const fileName = `${opts.subjectSlug}-${opts.cycle}-${opts.gradeCode.toLowerCase()}-t${opts.trimester}-${opts.type}-${String(seq).padStart(3, "0")}.pdf`;

    resources.push({
      id: seq,
      titleFr: tt.fr,
      titleAr: tt.ar,
      titleEn: tt.en,
      type: opts.type,
      cycle: opts.cycle,
      gradeCode: opts.gradeCode,
      subjectId: subject.id,
      subjectSlug: subject.slug,
      subjectNameFr: subject.nameFr,
      subjectNameAr: subject.nameAr,
      subjectNameEn: subject.nameEn,
      subjectColor: subject.color,
      level: opts.level,
      trimester: opts.trimester,
      year: opts.year,
      fileUrl: `/api/files/${fileName}`,
      videoUrl: null,
      thumbnailUrl: null,
      durationMin: null,
      pages: opts.pages,
      sizeMb: `${(0.6 + opts.pages * 0.22 + rand() * 0.4).toFixed(1)} Mo`,
      views: Math.floor(400 + rand() * 42000),
      downloads: Math.floor(150 + rand() * 18000),
      featured: rand() > 0.82,
      teacherName: TEACHERS[Math.floor(rand() * TEACHERS.length)],
      createdAt: new Date(2025, Math.floor(rand() * 12), 1 + Math.floor(rand() * 27)),
    });
  };

  // 1. Lycée (1AS, 2AS, 3AS BAC)
  for (let si = 0; si < SUBJECT_SEED.length; si++) {
    const subject = SUBJECT_SEED[si];
    const topics = TOPICS[subject.slug] || [];
    const examTerm = [3, 2, 3, 1, 3, 1, 2, 3, 1, 2][si % 10];

    for (let level = 1; level <= 3; level++) {
      pushDoc({
        type: "course",
        subjectSlug: subject.slug,
        cycle: "lycee",
        gradeCode: `${level}AS`,
        level,
        trimester: level,
        year: 2023 + ((si + level) % 3),
        t: topics[(si + level) % topics.length] || { fr: "Introduction", ar: "مقدمة", en: "Introduction" },
        pages: 5 + ((si + level) % 4),
      });
    }

    for (let k = 0; k < 2; k++) {
      pushDoc({
        type: "exercise",
        subjectSlug: subject.slug,
        cycle: "lycee",
        gradeCode: `${((si + k) % 3) + 1}AS`,
        level: ((si + k) % 3) + 1,
        trimester: ((si + k + 1) % 3) + 1,
        year: 2023 + ((si + k) % 3),
        t: topics[(si + k + 2) % topics.length] || { fr: "Exercices", ar: "تمارين", en: "Exercises" },
        pages: 3 + ((si + k) % 3),
      });
    }

    pushDoc({
      type: "homework",
      subjectSlug: subject.slug,
      cycle: "lycee",
      gradeCode: `${(si % 3) + 1}AS`,
      level: (si % 3) + 1,
      trimester: ((si + 2) % 3) + 1,
      year: 2023 + (si % 3),
      t: topics[(si + 3) % topics.length] || { fr: "Devoir", ar: "واجب", en: "Homework" },
      pages: 2 + (si % 2),
    });

    for (let k = 0; k < 2; k++) {
      pushDoc({
        type: "devoir",
        subjectSlug: subject.slug,
        cycle: "lycee",
        gradeCode: `${((si + k + 1) % 3) + 1}AS`,
        level: ((si + k + 1) % 3) + 1,
        trimester: ((si + k) % 3) + 1,
        year: 2022 + ((si + k) % 4),
        t: topics[(si + k + 1) % topics.length] || { fr: "Contrôle", ar: "مراقبة", en: "Test" },
        titleExtra: { n: k + 1 },
        pages: 2 + ((si + k) % 3),
      });
    }

    pushDoc({
      type: "exam",
      subjectSlug: subject.slug,
      cycle: "lycee",
      gradeCode: "3AS",
      level: 3,
      trimester: examTerm,
      year: 2021 + (si % 5),
      t: topics[si % topics.length] || { fr: "Examen", ar: "امتحان", en: "Exam" },
      titleExtra: {
        term: examTerm,
        subject: { fr: subject.nameFr, ar: subject.nameAr, en: subject.nameEn },
      },
      pages: 3 + (si % 3),
    });
  }

  // 2. Moyen (CEM : 1AM, 2AM, 3AM, 4AM BEM)
  const MOYEN_SUBJECT_SLUGS = ["mathematiques", "physique", "sciences-naturelles", "langue-arabe", "langue-francaise", "langue-anglaise", "histoire-geographie", "education-islamique"];
  for (const mSlug of MOYEN_SUBJECT_SLUGS) {
    const mTopics = MOYEN_TOPICS[mSlug] || TOPICS[mSlug] || [{ fr: "Leçon CEM", ar: "درس متوسط", en: "Middle school lesson" }];
    for (let grade = 1; grade <= 4; grade++) {
      const topic = mTopics[(grade - 1) % mTopics.length];
      // Cours
      pushDoc({
        type: "course",
        subjectSlug: mSlug,
        cycle: "moyen",
        gradeCode: `${grade}AM`,
        level: grade,
        trimester: (grade % 3) + 1,
        year: 2024,
        t: topic,
        pages: 4,
      });
      // Exercices
      pushDoc({
        type: "exercise",
        subjectSlug: mSlug,
        cycle: "moyen",
        gradeCode: `${grade}AM`,
        level: grade,
        trimester: ((grade + 1) % 3) + 1,
        year: 2024,
        t: topic,
        pages: 3,
      });
      // Examen / BEM
      if (grade === 4) {
        pushDoc({
          type: "exam",
          subjectSlug: mSlug,
          cycle: "moyen",
          gradeCode: "4AM",
          level: 4,
          trimester: 3,
          year: 2024,
          t: { fr: `Épreuve officielle du BEM : ${mSlug}`, ar: `موضوع شهادة التعليم المتوسط BEM: ${mSlug}`, en: `Official BEM exam: ${mSlug}` },
          pages: 4,
        });
      }
    }
  }

  // 3. Primaire (1AP à 5AP)
  const PRIMAIRE_SUBJECT_SLUGS = ["mathematiques", "langue-arabe", "langue-francaise", "education-islamique"];
  for (const pSlug of PRIMAIRE_SUBJECT_SLUGS) {
    const pTopics = PRIMAIRE_TOPICS[pSlug] || [{ fr: "Leçon Primaire", ar: "درس ابتدائي", en: "Primary lesson" }];
    for (let grade = 1; grade <= 5; grade++) {
      const topic = pTopics[(grade - 1) % pTopics.length];
      // Cours
      pushDoc({
        type: "course",
        subjectSlug: pSlug,
        cycle: "primaire",
        gradeCode: `${grade}AP`,
        level: grade,
        trimester: (grade % 3) + 1,
        year: 2024,
        t: topic,
        pages: 3,
      });
      // Exercices
      pushDoc({
        type: "exercise",
        subjectSlug: pSlug,
        cycle: "primaire",
        gradeCode: `${grade}AP`,
        level: grade,
        trimester: 2,
        year: 2024,
        t: topic,
        pages: 2,
      });
      // Examen 5e pour 5AP
      if (grade === 5) {
        pushDoc({
          type: "exam",
          subjectSlug: pSlug,
          cycle: "primaire",
          gradeCode: "5AP",
          level: 5,
          trimester: 3,
          year: 2024,
          t: { fr: `Examen de Fin de Cycle Primaire (5e) : ${pSlug}`, ar: `امتحان نهاية مرحلة التعليم الابتدائي: ${pSlug}`, en: `Primary Completion Exam (Grade 5): ${pSlug}` },
          pages: 3,
        });
      }
    }
  }

  // 4. Videos
  for (const video of VIDEO_SEED) {
    const subject = subjects.find((x) => x.slug === video.subject)!;
    const topics = TOPICS[video.subject] || [];
    const topic = topics[video.topicIndex % topics.length] || { fr: "Vidéo", ar: "فيديو", en: "Video" };
    const tt = titles("video", topic, {});
    seq += 1;
    resources.push({
      id: seq,
      titleFr: tt.fr,
      titleAr: tt.ar,
      titleEn: tt.en,
      type: "video",
      cycle: (video.topicIndex % 3 === 0 ? "lycee" : video.topicIndex % 3 === 1 ? "moyen" : "primaire") as EducationalCycle,
      gradeCode: video.topicIndex % 3 === 0 ? "3AS" : video.topicIndex % 3 === 1 ? "4AM" : "5AP",
      subjectId: subject.id,
      subjectSlug: subject.slug,
      subjectNameFr: subject.nameFr,
      subjectNameAr: subject.nameAr,
      subjectNameEn: subject.nameEn,
      subjectColor: subject.color,
      level: (video.topicIndex % 3) + 1,
      trimester: ((video.topicIndex + 1) % 3) + 1,
      year: 2024 + (video.topicIndex % 2),
      fileUrl: null,
      videoUrl: video.url,
      thumbnailUrl: video.thumb,
      durationMin: video.duration,
      pages: 0,
      sizeMb: "—",
      views: Math.floor(2000 + rand() * 60000),
      downloads: Math.floor(50 + rand() * 1500),
      featured: true,
      teacherName: TEACHERS[Math.floor(rand() * TEACHERS.length)],
      createdAt: new Date(2025, Math.floor(rand() * 12), 1 + Math.floor(rand() * 27)),
    });
  }

  return {
    subjects,
    resources,
    exercises: [...INITIAL_EXERCISES],
    liveCourses: [...INITIAL_LIVE_COURSES],
  };
}

const globalForStore = globalThis as unknown as {
  __massarStore?: {
    subjects: InMemorySubject[];
    resources: InMemoryResource[];
    exercises: InteractiveExercise[];
    liveCourses: LiveCourse[];
  };
};

export function getStore() {
  if (!globalForStore.__massarStore) {
    globalForStore.__massarStore = initData();
  }
  return globalForStore.__massarStore;
}

// ---------------- Resource Queries ----------------
export function getInMemoryResources(filters: ResourceFilters): {
  items: ResourceDTO[];
  total: number;
  hasMore: boolean;
} {
  const store = getStore();
  let list = [...store.resources];

  if (filters.q && filters.q.trim().length > 0) {
    const pattern = filters.q.trim().toLowerCase();
    list = list.filter(
      (r) =>
        r.titleFr.toLowerCase().includes(pattern) ||
        r.titleAr.toLowerCase().includes(pattern) ||
        r.titleEn.toLowerCase().includes(pattern) ||
        r.subjectNameFr.toLowerCase().includes(pattern) ||
        r.subjectNameAr.toLowerCase().includes(pattern) ||
        r.subjectNameEn.toLowerCase().includes(pattern) ||
        (r.gradeCode && r.gradeCode.toLowerCase().includes(pattern))
    );
  }

  if (filters.cycle) {
    list = list.filter((r) => r.cycle === filters.cycle);
  }
  if (filters.gradeCode) {
    list = list.filter((r) => r.gradeCode === filters.gradeCode);
  }
  if (filters.type) {
    list = list.filter((r) => r.type === filters.type);
  }
  if (filters.subject) {
    list = list.filter((r) => r.subjectSlug === filters.subject);
  }
  if (filters.level && !filters.cycle) {
    list = list.filter((r) => r.level === filters.level);
  }
  if (filters.trimester) {
    list = list.filter((r) => r.trimester === filters.trimester);
  }
  if (filters.year) {
    list = list.filter((r) => r.year === filters.year);
  }

  if (filters.sort === "downloads") {
    list.sort((a, b) => b.downloads - a.downloads || b.id - a.id);
  } else if (filters.sort === "views") {
    list.sort((a, b) => b.views - a.views || b.id - a.id);
  } else {
    list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime() || b.id - a.id);
  }

  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(48, Math.max(4, filters.pageSize ?? 12));
  const total = list.length;
  const start = (page - 1) * pageSize;
  const items = list.slice(start, start + pageSize).map(({ createdAt: _c, ...rest }) => rest);

  return {
    items,
    total,
    hasMore: page * pageSize < total,
  };
}

export function getInMemoryMeta(): MetaDTO {
  const store = getStore();
  const subjectsWithCount = store.subjects.map((s) => {
    const count = store.resources.filter((r) => r.subjectId === s.id).length;
    return {
      id: s.id,
      slug: s.slug,
      nameFr: s.nameFr,
      nameAr: s.nameAr,
      nameEn: s.nameEn,
      color: s.color,
      icon: s.icon,
      count,
    };
  });

  const yearsSet = new Set<number>();
  const typeCounts: Record<string, number> = {};
  let totalDownloads = 0;
  let totalVideos = 0;

  for (const r of store.resources) {
    yearsSet.add(r.year);
    typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
    totalDownloads += r.downloads;
    if (r.type === "video") totalVideos++;
  }

  const years = Array.from(yearsSet).sort((a, b) => b - a);

  return {
    subjects: subjectsWithCount,
    years,
    stats: {
      resources: store.resources.length,
      downloads: totalDownloads,
      videos: totalVideos,
      subjects: store.subjects.length,
    },
    typeCounts,
  };
}

export function getInMemoryFeaturedVideos(limit = 4): ResourceDTO[] {
  return getInMemoryResources({ type: "video", sort: "views", page: 1, pageSize: limit }).items;
}

export function getInMemoryLatest(limit = 6): ResourceDTO[] {
  return getInMemoryResources({ sort: "new", page: 1, pageSize: limit }).items;
}

export function getInMemorySubjects(): InMemorySubject[] {
  return getStore().subjects;
}

export function incrementInMemoryDownloads(id: number): { fileUrl: string | null; downloads: number } | null {
  const store = getStore();
  const r = store.resources.find((item) => item.id === id);
  if (!r) return null;
  r.downloads += 1;
  return { fileUrl: r.fileUrl, downloads: r.downloads };
}

export function incrementInMemoryViews(id: number): { views: number } | null {
  const store = getStore();
  const r = store.resources.find((item) => item.id === id);
  if (!r) return null;
  r.views += 1;
  return { views: r.views };
}

export function deleteInMemoryResource(id: number): InMemoryResource | null {
  const store = getStore();
  const idx = store.resources.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  const [removed] = store.resources.splice(idx, 1);
  return removed;
}

export function addInMemoryResource(resource: Omit<InMemoryResource, "id" | "createdAt" | "views" | "downloads">): InMemoryResource {
  const store = getStore();
  const nextId = store.resources.reduce((max, r) => Math.max(max, r.id), 0) + 1;
  const newRow: InMemoryResource = {
    ...resource,
    id: nextId,
    views: 0,
    downloads: 0,
    createdAt: new Date(),
  };
  store.resources.unshift(newRow);
  return newRow;
}

// ---------------- Interactive Exercises Queries ----------------
export function getInteractiveExercises(filters?: {
  cycle?: EducationalCycle;
  gradeCode?: string;
  subjectSlug?: string;
  difficulty?: string;
  q?: string;
}): InteractiveExercise[] {
  const store = getStore();
  let list = [...store.exercises];

  if (filters?.cycle) {
    list = list.filter((e) => e.cycle === filters.cycle);
  }
  if (filters?.gradeCode) {
    list = list.filter((e) => e.gradeCode === filters.gradeCode);
  }
  if (filters?.subjectSlug) {
    list = list.filter((e) => e.subjectSlug === filters.subjectSlug);
  }
  if (filters?.difficulty) {
    list = list.filter((e) => e.difficulty === filters.difficulty);
  }
  if (filters?.q && filters.q.trim().length > 0) {
    const q = filters.q.trim().toLowerCase();
    list = list.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.statement.toLowerCase().includes(q) ||
        e.subjectName.toLowerCase().includes(q)
    );
  }

  return list;
}

export function getInteractiveExerciseById(id: number): InteractiveExercise | null {
  return getStore().exercises.find((e) => e.id === id) ?? null;
}

export function addInteractiveExercise(exercise: Omit<InteractiveExercise, "id">): InteractiveExercise {
  const store = getStore();
  const nextId = store.exercises.reduce((max, e) => Math.max(max, e.id), 0) + 1;
  const newRow: InteractiveExercise = { ...exercise, id: nextId };
  store.exercises.unshift(newRow);
  return newRow;
}

export function deleteInteractiveExercise(id: number): boolean {
  const store = getStore();
  const idx = store.exercises.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  store.exercises.splice(idx, 1);
  return true;
}

// ---------------- Live Courses Queries ----------------
export function getLiveCourses(filters?: {
  cycle?: EducationalCycle;
  gradeCode?: string;
  subjectSlug?: string;
  status?: string;
  q?: string;
}): LiveCourse[] {
  const store = getStore();
  let list = [...store.liveCourses];

  if (filters?.cycle) {
    list = list.filter((c) => c.cycle === filters.cycle);
  }
  if (filters?.gradeCode) {
    list = list.filter((c) => c.gradeCode === filters.gradeCode);
  }
  if (filters?.subjectSlug) {
    list = list.filter((c) => c.subjectSlug === filters.subjectSlug);
  }
  if (filters?.status) {
    list = list.filter((c) => c.status === filters.status);
  }
  if (filters?.q && filters.q.trim().length > 0) {
    const q = filters.q.trim().toLowerCase();
    list = list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.teacher.name.toLowerCase().includes(q) ||
        c.subjectName.toLowerCase().includes(q)
    );
  }

  return list;
}

export function getLiveCourseById(id: number): LiveCourse | null {
  return getStore().liveCourses.find((c) => c.id === id) ?? null;
}

export function bookLiveCourse(courseId: number): { ok: boolean; seatsBooked?: number; message?: string } {
  const store = getStore();
  const course = store.liveCourses.find((c) => c.id === courseId);
  if (!course) return { ok: false, message: "Course not found" };
  if (course.seatsBooked >= course.seatsTotal) {
    return { ok: false, message: "Session complète" };
  }
  course.seatsBooked += 1;
  return { ok: true, seatsBooked: course.seatsBooked };
}

export function addLiveCourse(course: Omit<LiveCourse, "id">): LiveCourse {
  const store = getStore();
  const nextId = store.liveCourses.reduce((max, c) => Math.max(max, c.id), 0) + 1;
  const newRow: LiveCourse = { ...course, id: nextId };
  store.liveCourses.unshift(newRow);
  return newRow;
}

export function deleteLiveCourse(id: number): boolean {
  const store = getStore();
  const idx = store.liveCourses.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  store.liveCourses.splice(idx, 1);
  return true;
}
