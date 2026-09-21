import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Kirish | UniTopuz" },
      {
        name: "description",
        content: "UniTopuz platformasiga kirish yoki ro'yxatdan o'tish",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { t } = useI18n();
  const { loginWithGoogle, loginWithTelegram, loginWithEmail, register, isAuthenticated } =
    useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="surface-card p-8">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="size-8" />
          </div>
          <h2 className="text-xl font-bold">{t("auth.success.login")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("auth.subtitle")}</p>
          <Button asChild className="mt-6">
            <Link to="/dashboard">{t("nav.profile")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  function handleGoogleLogin() {
    loginWithGoogle();
    setSuccess(t("auth.success.login"));
    setTimeout(() => router.navigate({ to: "/dashboard" }), 500);
  }

  function handleTelegramLogin() {
    loginWithTelegram();
    setSuccess(t("auth.success.login"));
    setTimeout(() => router.navigate({ to: "/dashboard" }), 500);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "register") {
      if (!name.trim()) {
        setError(t("auth.name") + " kiriting");
        return;
      }
      if (!email.trim()) {
        setError(t("auth.email") + " kiriting");
        return;
      }
      if (password.length < 6) {
        setError("Parol kamida 6 ta belgi bo'lishi kerak");
        return;
      }
      if (password !== confirmPassword) {
        setError(t("auth.error.passwordMismatch"));
        return;
      }
      const err = register(name.trim(), email.trim(), password);
      if (err) {
        setError(err);
        return;
      }
      setSuccess(t("auth.success.registered"));
      setTimeout(() => router.navigate({ to: "/dashboard" }), 500);
    } else {
      if (!email.trim() || !password) {
        setError("Email va parolni kiriting");
        return;
      }
      const err = loginWithEmail(email.trim(), password);
      if (err) {
        setError(err);
        return;
      }
      setSuccess(t("auth.success.login"));
      setTimeout(() => router.navigate({ to: "/dashboard" }), 500);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t("nav.home")}
      </Link>

      <div className="surface-card p-6 sm:p-8">
        <h1 className="text-2xl font-extrabold">{t("auth.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("auth.subtitle")}</p>

        {/* Social logins */}
        <div className="mt-6 space-y-3">
          <Button
            variant="outline"
            className="h-12 w-full text-sm font-medium"
            onClick={handleGoogleLogin}
          >
            <svg className="mr-2 size-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {t("auth.withGoogle")}
          </Button>

          <Button
            variant="outline"
            className="h-12 w-full text-sm font-medium"
            onClick={handleTelegramLogin}
          >
            <svg className="mr-2 size-5" viewBox="0 0 24 24" fill="#0088CC">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            {t("auth.withTelegram")}
          </Button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">{t("auth.orContinue")}</span>
          </div>
        </div>

        {/* Email form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-1.5">
              <Label>{t("auth.name")}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ismingiz"
                  className="h-11 pl-9"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>{t("auth.email")}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="h-11 pl-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{t("auth.password")}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 pl-9 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {mode === "register" && (
            <div className="space-y-1.5">
              <Label>{t("auth.confirmPassword")}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 pl-9"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}

          {success && (
            <div className="rounded-lg bg-primary/10 p-3 text-sm text-primary">{success}</div>
          )}

          <Button type="submit" className="h-12 w-full text-base font-semibold">
            {mode === "login" ? t("auth.login") : t("auth.register")}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              {t("auth.noAccount")}{" "}
              <button
                onClick={() => {
                  setMode("register");
                  setError("");
                  setSuccess("");
                }}
                className="font-medium text-primary hover:underline"
              >
                {t("auth.register")}
              </button>
            </>
          ) : (
            <>
              {t("auth.hasAccount")}{" "}
              <button
                onClick={() => {
                  setMode("login");
                  setError("");
                  setSuccess("");
                }}
                className="font-medium text-primary hover:underline"
              >
                {t("auth.login")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
