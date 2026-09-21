// Database-ready domain types. These mirror the future Supabase tables so the
// demo data layer can be swapped for real queries without touching the UI.

export type AdmissionType = "grant" | "kontrakt";
export type EducationLanguage = "uzbek" | "rus" | "ingliz" | "qoraqalpoq" | "arab" | "fors";
export type StudyFormat = "kunduzgi" | "sirtqi" | "kechki" | "masofaviy";

export interface University {
  id: string;
  name: string;
  short: string;
  region: string;
  city: string;
  type: "davlat" | "xususiy" | "xorijiy";
  about: string;
  website?: string;
  photo?: string;
  brandColor?: string;
}

export interface Program {
  id: string;
  university_id: string;
  name: string;
  code: string;
  subject_combination: string; // "Matematika — Fizika"
  languages: EducationLanguage[];
  formats: StudyFormat[];
}

export interface AdmissionScore {
  id: string;
  year: number;
  university_id: string;
  program_id: string;
  admission_type: AdmissionType;
  education_language: EducationLanguage;
  study_format: StudyFormat;
  score: number;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  subject_id: string;
  name: string;
}

export interface Question {
  id: string;
  subject_id: string;
  topic_id: string;
  text: string;
  answers: string[];
  correct_index: number;
  explanation: string;
  difficulty: "oson" | "o'rta" | "qiyin";
}

export interface FormulaSection {
  title: string;
  items: string[];
}

export interface Material {
  id: string;
  title: string;
  subject_id: string;
  topic: string;
  category: "darslik" | "konspekt" | "pdf" | "video" | "formula" | "mavzu";
  difficulty: "boshlang'ich" | "o'rta" | "yuqori";
  format: string;
  description: string;
  url?: string;
  thumbnail?: string;
  formulaSections?: FormulaSection[];
}

export interface LeaderboardEntry {
  username: string;
  tests: number;
  average: number;
  period: "kun" | "hafta" | "oy";
}
