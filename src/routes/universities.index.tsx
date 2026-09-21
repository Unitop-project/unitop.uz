import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Building2, ExternalLink, MapPin, Search, Scale, Trophy } from "lucide-react";
import { Bookmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DATA_YEAR, programs, regions, universities } from "@/data/demo";
import { programsOf } from "@/lib/admission";
import { useCompare, useSaved } from "@/lib/store";
import { DemoBadge } from "@/components/site/ChanceBadge";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const GRADIENTS = [
  "from-blue-600 to-blue-800",
  "from-emerald-600 to-emerald-800",
  "from-violet-600 to-violet-800",
  "from-rose-600 to-rose-800",
  "from-amber-600 to-amber-800",
  "from-cyan-600 to-cyan-800",
  "from-indigo-600 to-indigo-800",
  "from-teal-600 to-teal-800",
  "from-fuchsia-600 to-fuchsia-800",
  "from-orange-600 to-orange-800",
];

function getGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function getDirections(universityId: string): string {
  const progs = programsOf(universityId);
  const names = progs.slice(0, 3).map((p) => p.name);
  return names.join(" · ");
}

export const Route = createFileRoute("/universities/")({
  head: () => ({
    meta: [
      { title: "Universitetlar bazasi | UniTopuz" },
      {
        name: "description",
        content:
          "O'zbekiston universitetlari katalogi: hudud, yo'nalishlar soni va o'tgan yilgi o'tish ballari.",
      },
      { property: "og:title", content: "Universitetlar bazasi | UniTopuz" },
      {
        property: "og:description",
        content: "Universitet yoki yo'nalish bo'yicha qidiring va batafsil ma'lumot oling.",
      },
    ],
  }),
  component: UniversitiesPage,
});

function UniversitiesPage() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("all");
  const [saved, setSaved] = useSaved();
  const [compare, setCompare] = useCompare();

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return universities
      .filter((u) => (region === "all" ? true : u.region === region))
      .filter((u) => {
        if (!needle) return true;
        const inName = `${u.name} ${u.short}`.toLowerCase().includes(needle);
        const inPrograms = programs
          .filter((p) => p.university_id === u.id)
          .some((p) => p.name.toLowerCase().includes(needle));
        return inName || inPrograms;
      });
  }, [q, region]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">{t("uni.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("uni.subtitle", { year: DATA_YEAR })}
          </p>
        </div>
        <DemoBadge />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("uni.search")}
            className="h-12 pl-9"
          />
        </div>
        <div className="sm:w-56">
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder={t("uni.region")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("uni.allRegions")}</SelectItem>
              {regions.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((u) => {
          const isSaved = saved.includes(u.id);
          const inCompare = compare.includes(u.id);
          const directions = getDirections(u.id);
          const programCount = programsOf(u.id).length;
          return (
            <article
              key={u.id}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Image area */}
              <div className="relative flex h-52 items-center justify-center overflow-hidden bg-white p-6">
                {u.photo ? (
                  <img
                    src={u.photo}
                    alt={u.name}
                    className="max-h-full w-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.classList.remove("bg-white");
                        parent.classList.add("bg-gradient-to-br");
                        const gradient = getGradient(u.id) ?? "from-blue-600 to-blue-800";
                        gradient.split(" ").forEach((c) => parent.classList.add(c));
                        const fallback = document.createElement("div");
                        fallback.className = "absolute inset-0 flex items-center justify-center";
                        fallback.innerHTML = `<span class="text-5xl font-extrabold text-white/20">${u.short}</span>`;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                ) : (
                  <>
                    <div className={cn("absolute inset-0 bg-gradient-to-br", getGradient(u.id))} />
                    <span className="relative text-5xl font-extrabold text-white/20">
                      {u.short}
                    </span>
                  </>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Type tag + action icons */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <Building2 className="size-3" />
                    {u.type === "davlat"
                      ? t("uni.state")
                      : u.type === "xorijiy"
                        ? t("uni.foreign")
                        : t("uni.private")}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setCompare((prev) =>
                          prev.includes(u.id)
                            ? prev.filter((x) => x !== u.id)
                            : [...prev, u.id].slice(-4),
                        )
                      }
                      aria-label={t("uni.compareAria")}
                      className={cn(
                        "flex size-8 items-center justify-center rounded-lg border border-border transition-colors",
                        inCompare
                          ? "border-primary bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted",
                      )}
                    >
                      <Scale className="size-4" />
                    </button>
                    <button
                      onClick={() =>
                        setSaved((prev) =>
                          prev.includes(u.id) ? prev.filter((x) => x !== u.id) : [...prev, u.id],
                        )
                      }
                      aria-label={t("uni.saveAria")}
                      className={cn(
                        "flex size-8 items-center justify-center rounded-lg border border-border transition-colors",
                        isSaved
                          ? "border-primary bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted",
                      )}
                    >
                      <Bookmark className={cn("size-4", isSaved && "fill-current")} />
                    </button>
                  </div>
                </div>

                {/* Name */}
                <h2 className="mt-3 text-lg font-bold leading-snug line-clamp-2">{u.name}</h2>

                {/* Location */}
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" />
                  {u.region}
                </p>

                {/* Ranking */}
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Trophy className="size-3.5 shrink-0" />
                  {t("uni.directions", { n: programCount })}
                </p>

                {/* Strong directions */}
                {directions && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{t("uni.strong")} </span>
                    {directions}
                  </p>
                )}

                {/* Buttons */}
                <div className="mt-5 flex gap-3">
                  {u.website ? (
                    <a
                      href={`https://${u.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                      {t("uni.site")}
                    </a>
                  ) : (
                    <span className="flex-1" />
                  )}
                  <Link
                    to="/universities/$id"
                    params={{ id: u.id }}
                    className="inline-flex items-center gap-2 rounded-xl bg-muted px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted/80"
                  >
                    {t("uni.details")}
                    <ExternalLink className="size-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {list.length === 0 && (
        <div className="surface-card mt-8 flex flex-col items-center gap-2 p-12 text-center">
          <Building2 className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t("uni.empty")}</p>
        </div>
      )}
    </div>
  );
}
