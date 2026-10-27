import { PDFDocument, StandardFonts, rgb, type PDFPage } from "pdf-lib";

export interface PdfInput {
  title: string; // French, sanitized
  subjectName: string;
  typeLabel: string;
  levelLabel: string;
  trimesterLabel: string;
  year: number;
  pages: number;
  color: [number, number, number];
}

const POOL = [
  "Ce document a ete prepare par des enseignants du secondaire pour accompagner les eleves de lycee tout au long de l'annee scolaire. Il couvre les notions essentielles du programme officiel avec des explications progressives.",
  "Objectifs d'apprentissage : comprendre les definitions clefs, appliquer les methodes de resolution, verifier les resultats et developper le raisonnement logique exige aux devoirs et aux examens.",
  "Rappel de cours : chaque notion est introduite par un rappel synthetique, suivi d'exemples d'application detailles etape par etape afin de faciliter la comprehension et la memorisation.",
  "Methode : lire attentivement l'enonce, identifier les donnees, choisir la propriete adaptee, rediger la solution de maniere rigoureuse puis conclure par une phrase reponse complete.",
  "Exemple d'application : on considere la situation proposee dans l'exercice type. On applique le theoreme du cours, on justifie chaque etape et on interprete le resultat obtenu dans le contexte.",
  "Points de vigilance : attention aux erreurs classiques signalees en marge, aux unites, aux conversions et aux conditions de validite des formules utilisees dans ce chapitre.",
  "Entrainement : une serie d'exercices progressifs permet de verifier l'acquisition des competences. Les corriges detailles sont donnes en fin de document pour un travail en autonomie.",
  "Evaluation : les questions sont notees selon le bareme officiel. Il est conseille de gerer son temps, de commencer par les questions maitrisees et de relire la copie avant de rendre.",
  "Synthese : ce chapitre mobilise les notions vues au trimestre en cours et prepare aux evaluations de fin de periode. Refaire les exercices sans aide est le meilleur test de reussite.",
  "Pour aller plus loin : des ressources complementaires (videos explicatives, fiches de revision et sujets corriges) sont disponibles gratuitement sur la plateforme Massar.",
];

const SECTIONS = [
  "I. Rappels de cours",
  "II. Exemples resolus",
  "III. Methode de travail",
  "IV. Exercices d'application",
  "V. Correction detaillee",
  "VI. Bilan et conseils",
];

function sanitize(input: string): string {
  return input
    .replace(/[’‘]/g, "'")
    .replace(/[«»“”]/g, '"')
    .replace(/…/g, "...")
    .replace(/[—–]/g, "-")
    .replace(/œ/g, "oe")
    .replace(/[^ -ÿ]/g, "");
}

function wrap(text: string, maxChars: number): string[] {
  const words = sanitize(text).split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > maxChars) {
      if (line) lines.push(line.trim());
      line = word;
    } else {
      line = `${line} ${word}`;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

export async function buildResourcePdf(input: PdfInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const [cr, cg, cb] = input.color;
  const accent = rgb(cr, cg, cb);
  const ink = rgb(0.13, 0.12, 0.2);
  const soft = rgb(0.42, 0.41, 0.52);
  const lineColor = rgb(0.88, 0.87, 0.9);

  const A4: [number, number] = [595.28, 841.89];

  // ---------- Cover ----------
  const cover = doc.addPage(A4);
  const { width, height } = cover.getSize();

  cover.drawRectangle({ x: 0, y: height - 210, width, height: 210, color: accent });
  cover.drawText("MASSAR", { x: 48, y: height - 70, size: 26, font: bold, color: rgb(1, 1, 1) });
  cover.drawText("La plateforme du lyceen - cours, devoirs et examens", {
    x: 48, y: height - 92, size: 11, font, color: rgb(1, 1, 1),
  });

  const typeLines = wrap(input.typeLabel.toUpperCase(), 40);
  cover.drawText(typeLines[0] ?? "", { x: 48, y: height - 140, size: 15, font: bold, color: rgb(1, 1, 1) });

  let y = height - 260;
  for (const l of wrap(input.title, 38).slice(0, 4)) {
    cover.drawText(l, { x: 48, y, size: 24, font: bold, color: ink });
    y -= 32;
  }

  y -= 14;
  cover.drawLine({ start: { x: 48, y }, end: { x: width - 48, y }, thickness: 1, color: lineColor });
  y -= 34;

  const meta: [string, string][] = [
    ["Matiere", input.subjectName],
    ["Niveau", input.levelLabel],
    ["Trimestre", input.trimesterLabel],
    ["Annee scolaire", `${input.year} - ${input.year + 1}`],
    ["Nombre de pages", String(input.pages)],
  ];
  for (const [label, value] of meta) {
    cover.drawText(sanitize(label).toUpperCase(), { x: 48, y, size: 9, font: bold, color: soft });
    cover.drawText(sanitize(value), { x: 210, y, size: 12, font, color: ink });
    y -= 26;
  }

  cover.drawRectangle({ x: 48, y: 68, width: width - 96, height: 1, color: lineColor });
  cover.drawText("Telecharge gratuitement sur Massar - indexe par matiere, niveau et trimestre.", {
    x: 48, y: 48, size: 9, font, color: soft,
  });

  // ---------- Content pages ----------
  const total = Math.max(2, input.pages);
  for (let p = 2; p <= total; p++) {
    const page: PDFPage = doc.addPage(A4);
    const { width: w, height: h } = page.getSize();

    page.drawRectangle({ x: 0, y: h - 56, width: w, height: 56, color: accent });
    page.drawText(sanitize(input.subjectName), { x: 40, y: h - 34, size: 11, font: bold, color: rgb(1, 1, 1) });
    page.drawText(sanitize(input.trimesterLabel), {
      x: w - 40 - font.widthOfTextAtSize(sanitize(input.trimesterLabel), 10),
      y: h - 34, size: 10, font, color: rgb(1, 1, 1),
    });

    let cy = h - 100;
    let sectionIdx = (p - 2) % SECTIONS.length;
    let poolCursor = (p - 2) * 2;

    for (let block = 0; block < 2; block++) {
      const sectionTitle = SECTIONS[(sectionIdx + block) % SECTIONS.length];
      page.drawText(sectionTitle, { x: 40, y: cy, size: 14, font: bold, color: accent });
      cy -= 10;
      page.drawLine({ start: { x: 40, y: cy }, end: { x: 110, y: cy }, thickness: 2, color: accent });
      cy -= 22;

      for (let pi = 0; pi < 2; pi++) {
        const paragraph = POOL[(poolCursor + pi) % POOL.length];
        for (const l of wrap(paragraph, 88)) {
          if (cy < 90) break;
          page.drawText(l, { x: 40, y: cy, size: 10.5, font, color: ink });
          cy -= 16;
        }
        cy -= 10;
      }
      cy -= 8;
    }

    page.drawText(`Massar  |  ${sanitize(input.typeLabel)}  -  ${input.year}`, {
      x: 40, y: 44, size: 8.5, font, color: soft,
    });
    const pageLabel = `Page ${p} / ${total}`;
    page.drawText(pageLabel, {
      x: w - 40 - font.widthOfTextAtSize(pageLabel, 8.5),
      y: 44, size: 8.5, font, color: soft,
    });
  }

  return doc.save();
}
