import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  User,
  Save,
  Building2,
  Settings,
  Languages,
  Palette,
  CalendarDays,
  Flame,
  Pencil,
  Check,
  Search,
  Globe,
  Moon,
  Sun,
  GraduationCap,
  ListChecks,
  Award,
  Camera,
  X,
  MapPin,
  Heart,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useI18n, LANGS, type Lang } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useAttempts, useProfile } from "@/lib/store";
import { DATA_YEAR, universities } from "@/data/demo";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "UniTopuz | Shaxsiy kabinet — Profilingiz" },
      {
        name: "description",
        content:
          "Ballingiz, maqsadlaringiz, saqlangan universitetlar va sozlamalar — barchasi bitta joyda.",
      },
    ],
  }),
  component: DashboardPage,
});

export function routeTitle() {
  return "Shaxsiy kabinet";
}

function DashboardPage() {
  const { t, lang, setLang } = useI18n();
  const { theme, setTheme } = useTheme();
  const { user, updateProfile, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useProfile();
  const [attempts] = useAttempts();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");

  const [uniSearch, setUniSearch] = useState("");
  const [showUniDropdown, setShowUniDropdown] = useState(false);

  const savedUniversities = useMemo(
    () => universities.filter((u) => profile.dreamUniversities.includes(u.id)),
    [profile.dreamUniversities],
  );

  const filteredUnis = useMemo(() => {
    const q = uniSearch.trim().toLowerCase();
    if (!q)
      return universities.filter((u) => !profile.dreamUniversities.includes(u.id)).slice(0, 8);
    return universities
      .filter((u) => !profile.dreamUniversities.includes(u.id))
      .filter((u) => `${u.name} ${u.short}`.toLowerCase().includes(q))
      .slice(0, 8);
  }, [uniSearch, profile.dreamUniversities]);

  const initials = (user?.name || profile.name || "A").slice(0, 2).toUpperCase();

  function saveDraft() {
    setProfile(draft);
    if (user) {
      updateProfile({ name: draft.name });
    }
    setEditing(false);
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setProfile({ ...profile, photoUrl: dataUrl });
      if (user) updateProfile({ photoUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setProfile({ ...profile, photoUrl: "" });
    if (user) updateProfile({ photoUrl: "" });
  }

  function addDreamUni(id: string) {
    if (!profile.dreamUniversities.includes(id)) {
      setProfile({ ...profile, dreamUniversities: [...profile.dreamUniversities, id] });
    }
    setUniSearch("");
    setShowUniDropdown(false);
  }

  function removeDreamUni(id: string) {
    setProfile({
      ...profile,
      dreamUniversities: profile.dreamUniversities.filter((x) => x !== id),
    });
  }

  function handlePasswordChange() {
    setPasswordMsg("");
    if (newPassword.length < 6) {
      setPasswordMsg("Parol kamida 6 ta belgi bo'lishi kerak");
      return;
    }
    if (user) updateProfile({ password: newPassword });
    setPasswordMsg("Parol muvaffaqiyatli o'zgartirildi!");
    setNewPassword("");
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="surface-card p-8">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <User className="size-8" />
          </div>
          <h2 className="text-xl font-bold">{t("auth.title")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("auth.subtitle")}</p>
          <Button asChild className="mt-6">
            <Link to="/login">{t("auth.login")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">{t("prof.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("prof.subtitle")}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-destructive hover:text-destructive"
        >
          <ArrowLeft className="size-4" />
          {t("auth.logout")}
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <User className="size-4" />
              {t("prof.profile")}
            </CardTitle>
            {!editing ? (
              <Button variant="ghost" size="sm" onClick={() => setDraft(profile)}>
                <Pencil className="size-3.5" />
                {t("prof.edit")}
              </Button>
            ) : null}
          </CardHeader>
          <CardContent>
            {!editing ? (
              <div className="flex items-start gap-4">
                <div className="relative">
                  {profile.photoUrl ? (
                    <img
                      src={profile.photoUrl}
                      alt={user?.name || profile.name}
                      className="size-20 rounded-full object-cover"
                    />
                  ) : (
                    <Avatar className="size-20">
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-bold">{user?.name || profile.name}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    @{user?.username || profile.username}
                  </p>
                  {profile.address && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="size-3.5" />
                      {profile.address}
                    </p>
                  )}
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-muted/60 p-3">
                      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Award className="size-3" />
                        {t("prof.target")}
                      </p>
                      <p className="mt-1 text-xl font-extrabold">{profile.targetScore}</p>
                    </div>
                    <div className="rounded-lg bg-muted/60 p-3">
                      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <ListChecks className="size-3" />
                        {t("prof.current")}
                      </p>
                      <p className="mt-1 text-xl font-extrabold">{profile.currentScore}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Flame className="size-4 text-orange-500" />
                      {profile.streak} {t("prof.streak")}
                    </span>
                    {profile.examDate && (
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="size-4" />
                        {profile.examDate}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Photo upload */}
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    {profile.photoUrl ? (
                      <img
                        src={profile.photoUrl}
                        alt={user?.name || profile.name}
                        className="size-20 rounded-full object-cover"
                      />
                    ) : (
                      <Avatar className="size-20">
                        <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Camera className="size-5 text-white" />
                    </button>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("prof.photo")}</p>
                    <div className="mt-1 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                      >
                        <Camera className="size-3.5" />
                        {t("prof.photoChange")}
                      </Button>
                      {profile.photoUrl && (
                        <Button variant="ghost" size="sm" type="button" onClick={removePhoto}>
                          <X className="size-3.5" />
                          {t("prof.photoRemove")}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Basic info */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>{t("prof.name")}</Label>
                    <Input
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("prof.username")}</Label>
                    <Input
                      value={draft.username}
                      onChange={(e) => setDraft({ ...draft, username: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("prof.address")}</Label>
                    <Input
                      value={draft.address}
                      onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                      placeholder={t("prof.addressPlaceholder")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("prof.phone")}</Label>
                    <Input
                      value={user?.phone || ""}
                      readOnly
                      placeholder="+998 90 123 45 67"
                      className="bg-muted"
                    />
                  </div>
                </div>

                {/* Scores */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>{t("prof.target")}</Label>
                    <Input
                      type="number"
                      value={draft.targetScore}
                      onChange={(e) => setDraft({ ...draft, targetScore: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("prof.current")}</Label>
                    <Input
                      type="number"
                      value={draft.currentScore}
                      onChange={(e) => setDraft({ ...draft, currentScore: Number(e.target.value) })}
                    />
                  </div>
                </div>

                {/* Dream universities */}
                <div className="space-y-1.5">
                  <Label className="flex items-center gap-2">
                    <Heart className="size-3.5" />
                    {t("prof.dreamUnis")}
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={uniSearch}
                      onChange={(e) => {
                        setUniSearch(e.target.value);
                        setShowUniDropdown(true);
                      }}
                      onFocus={() => setShowUniDropdown(true)}
                      placeholder={t("prof.dreamUnisHint")}
                      className="h-10 pl-9"
                    />
                    {showUniDropdown && filteredUnis.length > 0 && (
                      <div className="absolute inset-x-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
                        {filteredUnis.map((u) => (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => addDreamUni(u.id)}
                            className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-muted transition-colors"
                          >
                            <div
                              className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white"
                              style={{ backgroundColor: u.brandColor ?? "var(--primary)" }}
                            >
                              {u.short.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-medium">{u.short}</p>
                              <p className="truncate text-xs text-muted-foreground">{u.name}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {profile.dreamUniversities.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {t("prof.dreamUnisCount", { n: profile.dreamUniversities.length })}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {savedUniversities.map((u) => (
                      <span
                        key={u.id}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      >
                        {u.short}
                        <button
                          type="button"
                          onClick={() => removeDreamUni(u.id)}
                          className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Exam date */}
                <div className="space-y-1.5">
                  <Label>{t("prof.examDate")}</Label>
                  <Input
                    type="date"
                    value={draft.examDate}
                    onChange={(e) => setDraft({ ...draft, examDate: e.target.value })}
                  />
                </div>

                <div className="flex items-end gap-2">
                  <Button onClick={saveDraft}>
                    <Check className="size-4" />
                    {t("prof.update")}
                  </Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>
                    Bekor qilish
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="size-4" />
                {t("prof.settings")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Languages className="size-3.5" />
                  {t("prof.lang")}
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {LANGS.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className="rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors"
                      style={{
                        borderColor: lang === l.code ? "var(--primary)" : undefined,
                        backgroundColor: lang === l.code ? "hsl(var(--primary) / 0.1)" : undefined,
                        color: lang === l.code ? "hsl(var(--primary))" : undefined,
                      }}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Palette className="size-3.5" />
                  {t("prof.theme")}
                </Label>
                <div className="flex gap-2">
                  {(
                    [
                      { v: "light", label: "Yorug'" },
                      { v: "dark", label: "Qorong'u" },
                      { v: "system", label: "Tizim" },
                    ] as const
                  ).map(({ v, label }) => (
                    <button
                      key={v}
                      onClick={() => setTheme(v)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
                      style={{
                        borderColor: theme === v ? "var(--primary)" : undefined,
                        backgroundColor: theme === v ? "hsl(var(--primary) / 0.1)" : undefined,
                        color: theme === v ? "hsl(var(--primary))" : undefined,
                      }}
                    >
                      {v === "light" ? (
                        <Sun className="size-4" />
                      ) : v === "dark" ? (
                        <Moon className="size-4" />
                      ) : (
                        <Globe className="size-4" />
                      )}
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password change */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="size-4" />
                {t("prof.password")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>{t("prof.newPassword")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-10 pl-9 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              {passwordMsg && <p className="text-xs text-primary">{passwordMsg}</p>}
              <Button onClick={handlePasswordChange} size="sm" className="w-full">
                <Check className="size-3.5" />
                {t("prof.savePassword")}
              </Button>
            </CardContent>
          </Card>

          {/* Account info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="size-4" />
                {t("prof.about")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("auth.email")}</span>
                <span className="font-medium">{user?.email || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("prof.joined")}</span>
                <span className="font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("uz-UZ") : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hisob turi</span>
                <span className="font-medium capitalize">{user?.provider || "email"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Saved universities */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <Save className="size-5 text-emerald-600" />
            {t("prof.saved")}
            <span className="text-sm font-normal text-muted-foreground">
              {savedUniversities.length}
            </span>
          </h2>
        </div>

        {savedUniversities.length === 0 ? (
          <div className="mt-3 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card p-10 text-center">
            <Building2 className="size-6 text-muted-foreground" />
            <p className="max-w-sm text-sm text-muted-foreground">{t("prof.savedEmpty")}</p>
            <Button asChild>
              <Link to="/universities">
                <Search className="size-4" />
                {t("prof.browseUnis")}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedUniversities.map((u) => (
              <Link
                key={u.id}
                to="/universities/$id"
                params={{ id: u.id }}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex size-11 items-center justify-center rounded-xl text-lg font-bold text-white"
                    style={{ backgroundColor: u.brandColor ?? "var(--primary)" }}
                  >
                    {u.short.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{u.short}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{u.name}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {u.city}, {u.region}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Activity */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="size-4" />
            {t("prof.activity")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {attempts.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("prof.noActivity")}</p>
          ) : (
            <ul className="divide-y">
              {attempts.slice(0, 5).map((a) => (
                <li key={a.id} className="flex items-center justify-between py-3 text-sm">
                  <span className="font-medium">{a.subjectName}</span>
                  <span className="text-muted-foreground">
                    {a.correct}/{a.total} · {DATE.format(new Date(a.date), "dd MMM")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const DATE = new Intl.DateTimeFormat();
