import { useCallback, useEffect, useState } from "react";

// Mahalliy saqlash qatlami. Lovable Cloud ulangach bu funksiyalar
// users / saved_universities / user_progress / user_goals jadvallariga
// almashtiriladi — UI o'zgarmaydi.

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue(read<T>(key, initial));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* ignore */
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, update, hydrated] as const;
}

export interface UserProfile {
  name: string;
  username: string;
  targetScore: number;
  currentScore: number;
  examDate: string;
  streak: number;
}

export const DEFAULT_PROFILE: UserProfile = {
  name: "Abituriyent",
  username: "abituriyent_2026",
  targetScore: 175,
  currentScore: 142,
  examDate: "",
  streak: 6,
};

export interface AttemptRecord {
  id: string;
  subjectId: string;
  subjectName: string;
  mode: string;
  total: number;
  correct: number;
  seconds: number;
  date: string;
  topicStats: Record<string, { correct: number; total: number }>;
  wrongIds?: string[];
}

export const useProfile = () => useLocalState<UserProfile>("ut_profile", DEFAULT_PROFILE);
export const useSaved = () => useLocalState<string[]>("ut_saved", []);
export const useCompare = () => useLocalState<string[]>("ut_compare", []);
export const useAttempts = () => useLocalState<AttemptRecord[]>("ut_attempts", []);
export const useTasks = () => useLocalState<Record<string, boolean>>("ut_tasks", {});
