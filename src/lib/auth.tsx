import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  provider: "google" | "telegram" | "email";
  password?: string;
  phone?: string;
  address?: string;
  photoUrl?: string;
  targetScore: number;
  currentScore: number;
  examDate: string;
  dreamUniversities: string[];
  createdAt: string;
}

const AUTH_KEY = "ut_auth_user";
const USERS_KEY = "ut_registered_users";

function readUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function saveUser(user: AuthUser | null) {
  try {
    if (user) {
      window.localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(AUTH_KEY);
    }
  } catch {
    /* ignore */
  }
}

function readUsers(): AuthUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as AuthUser[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: AuthUser[]) {
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    /* ignore */
  }
}

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  loginWithGoogle: () => void;
  loginWithTelegram: () => void;
  loginWithEmail: (email: string, password: string) => string | null;
  register: (name: string, email: string, password: string) => string | null;
  updateProfile: (updates: Partial<AuthUser>) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(readUser());
    setLoading(false);
  }, []);

  const loginWithGoogle = useCallback(() => {
    const googleUser: AuthUser = {
      id: generateId(),
      name: "Google Foydalanuvchi",
      username: "google_user_" + Date.now().toString(36).slice(-4),
      email: "user@gmail.com",
      avatar: "",
      provider: "google",
      photoUrl: "https://ui-avatars.com/api/?name=Google+User&background=4285F4&color=fff&size=200",
      targetScore: 175,
      currentScore: 0,
      examDate: "",
      dreamUniversities: [],
      createdAt: new Date().toISOString(),
    };
    setUser(googleUser);
    saveUser(googleUser);
    const users = readUsers();
    if (!users.find((u) => u.id === googleUser.id)) {
      saveUsers([...users, googleUser]);
    }
  }, []);

  const loginWithTelegram = useCallback(() => {
    const tgUser: AuthUser = {
      id: generateId(),
      name: "Telegram Foydalanuvchi",
      username: "tg_user_" + Date.now().toString(36).slice(-4),
      email: "",
      avatar: "",
      provider: "telegram",
      phone: "+998 90 123 45 67",
      photoUrl:
        "https://ui-avatars.com/api/?name=Telegram+User&background=0088CC&color=fff&size=200",
      targetScore: 175,
      currentScore: 0,
      examDate: "",
      dreamUniversities: [],
      createdAt: new Date().toISOString(),
    };
    setUser(tgUser);
    saveUser(tgUser);
    const users = readUsers();
    if (!users.find((u) => u.id === tgUser.id)) {
      saveUsers([...users, tgUser]);
    }
  }, []);

  const loginWithEmail = useCallback((email: string, password: string): string | null => {
    const users = readUsers();
    const found = users.find((u) => u.email === email && u.provider === "email");
    if (!found) return "Bu email bilan ro'yxatdan o'tilmagan";
    if (found.password !== password) return "Noto'g'ri parol";
    setUser(found);
    saveUser(found);
    return null;
  }, []);

  const register = useCallback((name: string, email: string, password: string): string | null => {
    const users = readUsers();
    if (users.find((u) => u.email === email && u.provider === "email")) {
      return "Bu email allaqachon ro'yxatdan o'tgan";
    }
    const newUser: AuthUser = {
      id: generateId(),
      name,
      username: name.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now().toString(36).slice(-4),
      email,
      avatar: "",
      provider: "email",
      password,
      photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=059669&color=fff&size=200`,
      targetScore: 175,
      currentScore: 0,
      examDate: "",
      dreamUniversities: [],
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    setUser(newUser);
    saveUser(newUser);
    return null;
  }, []);

  const updateProfile = useCallback((updates: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      saveUser(next);
      const users = readUsers();
      const idx = users.findIndex((u) => u.id === next.id);
      if (idx >= 0) {
        users[idx] = next;
        saveUsers(users);
      }
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      loginWithGoogle,
      loginWithTelegram,
      loginWithEmail,
      register,
      updateProfile,
      logout,
      isAuthenticated: !!user,
    }),
    [
      user,
      loading,
      loginWithGoogle,
      loginWithTelegram,
      loginWithEmail,
      register,
      updateProfile,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
