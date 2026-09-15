import { admissionScores, programs, universities } from "@/data/demo";
import type { AdmissionScore, Program, University } from "@/data/types";

// Konfiguratsiya qilinadigan chegaralar. Kelajakda bu qiymatlar ma'lumotlar
// bazasidan (app_settings) olinadi.
export const CHANCE_THRESHOLDS = {
  high: 5, // difference >= 5
  real: -2, // -2 <= difference < 5
};

export type ChanceLevel = "high" | "real" | "tough";

export const CHANCE_LABEL: Record<ChanceLevel, string> = {
  high: "Yuqori imkoniyat",
  real: "Real imkoniyat",
  tough: "Raqobat yuqori",
};

export function getChance(difference: number): ChanceLevel {
  if (difference >= CHANCE_THRESHOLDS.high) return "high";
  if (difference >= CHANCE_THRESHOLDS.real) return "real";
  return "tough";
}

export const LANGUAGE_LABEL: Record<string, string> = {
  uzbek: "O'zbek",
  rus: "Rus",
  ingliz: "Ingliz",
  qoraqalpoq: "Qoraqalpoq",
};

export const FORMAT_LABEL: Record<string, string> = {
  kunduzgi: "Kunduzgi",
  sirtqi: "Sirtqi",
  kechki: "Kechki",
  masofaviy: "Masofaviy",
};

export const TYPE_LABEL: Record<string, string> = {
  grant: "Grant",
  kontrakt: "Kontrakt",
};

export interface AdmissionRow {
  score: AdmissionScore;
  program: Program;
  university: University;
}

export const admissionRows: AdmissionRow[] = admissionScores
  .map((score) => {
    const program = programs.find((p) => p.id === score.program_id);
    const university = universities.find((u) => u.id === score.university_id);
    if (!program || !university) return null;
    return { score, program, university } as AdmissionRow;
  })
  .filter((r): r is AdmissionRow => r !== null);

export function getUniversity(id: string) {
  return universities.find((u) => u.id === id);
}

export function programsOf(universityId: string) {
  return programs.filter((p) => p.university_id === universityId);
}

export function scoresOf(programId: string) {
  return admissionScores.filter((s) => s.program_id === programId);
}

export function minScoreOf(universityId: string) {
  const list = admissionScores.filter((s) => s.university_id === universityId);
  return list.length ? Math.min(...list.map((s) => s.score)) : null;
}

export function maxScoreOf(universityId: string) {
  const list = admissionScores.filter((s) => s.university_id === universityId);
  return list.length ? Math.max(...list.map((s) => s.score)) : null;
}

export interface CalculatorPreferences {
  score: number;
  combination: string;
  language: string;
  format: string;
  region: string;
  admissionType: string;
  universityType: string;
}

export const DEFAULT_PREFERENCES: CalculatorPreferences = {
  score: 150,
  combination: "all",
  language: "all",
  format: "all",
  region: "all",
  admissionType: "all",
  universityType: "all",
};

export function matchPreferences(row: AdmissionRow, p: CalculatorPreferences) {
  if (p.combination !== "all" && row.program.subject_combination !== p.combination) return false;
  if (p.language !== "all" && row.score.education_language !== p.language) return false;
  if (p.format !== "all" && row.score.study_format !== p.format) return false;
  if (p.region !== "all" && row.university.region !== p.region) return false;
  if (p.admissionType !== "all" && row.score.admission_type !== p.admissionType) return false;
  if (p.universityType !== "all" && row.university.type !== p.universityType) return false;
  return true;
}

export const combinations = Array.from(new Set(programs.map((p) => p.subject_combination))).sort();
