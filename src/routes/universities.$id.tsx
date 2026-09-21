import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  MapPin,
  Building2,
  BookOpen,
  Trophy,
  ArrowLeft,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Globe,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { universities } from "@/data/demo";
import { FORMAT_LABEL, LANGUAGE_LABEL, TYPE_LABEL, programsOf, scoresOf } from "@/lib/admission";
import { useCompare, useSaved } from "@/lib/store";
import { DemoBadge, Disclaimer } from "@/components/site/ChanceBadge";
import { langKeys, formatKeys, typeKeys, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { extractBrandColor, brandStyles, type BrandStyle } from "@/lib/brand";

export const Route = createFileRoute("/universities/$id")({
  loader: ({ params }) => {
    const university = universities.find((u) => u.id === params.id);
    if (!university) throw notFound();
    return { university };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Universitet topilmadi | UniTopuz" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const u = loaderData.university;
    return {
      meta: [
        { title: `${u.short} | o'tish ballari va yo'nalishlar | UniTopuz` },
        {
          name: "description",
          content: `${u.name}: yo'nalishlar, grant va kontrakt o'tish ballari, ta'lim tillari.`,
        },
        { property: "og:title", content: `${u.name} | UniTopuz` },
        { property: "og:description", content: u.about },
      ],
    };
  },
  component: UniversityDetail,
  notFoundComponent: () => {
    function NotFoundInner() {
      const { t } = useI18n();
      return (
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">{t("ud.notFound")}</h1>
          <Button asChild className="mt-6">
            <Link to="/universities">{t("ud.list")}</Link>
          </Button>
        </div>
      );
    }
    return <NotFoundInner />;
  },
});

function UniversityDetail() {
  const { university: u } = Route.useLoaderData();
  const { t } = useI18n();
  const [saved, setSaved] = useSaved();
  const [compare, setCompare] = useCompare();
  const list = programsOf(u.id);
  const isSaved = saved.includes(u.id);
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | null>(null);

  useEffect(() => {
    if (u.photo) {
      extractBrandColor(u.photo).then(setBrand);
    }
  }, [u.photo]);

  const allScores = list.flatMap((p) => scoresOf(p.id));
  const minScore = allScores.length > 0 ? Math.min(...allScores.map((s) => s.score)) : 0;
  const maxScore = allScores.length > 0 ? Math.max(...allScores.map((s) => s.score)) : 0;
  const c: BrandStyle = brandStyles(brand);

  return (
    <div className="min-h-screen" style={{ backgroundColor: c.brandLight }}>
      {/* Hero Header */}
      <div
        className="relative overflow-hidden text-white"
        style={{ background: `linear-gradient(135deg, ${c.brand}, ${c.brandDark})` }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tNC0yYTEgMSAwIDEgMS0yIDAgMSAxIDAgMCAyIDB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <Link
            to="/universities"
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ArrowLeft className="size-4" />
            {t("ud.all")}
          </Link>

          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            {u.photo ? (
              <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-xl sm:size-24">
                <img src={u.photo} alt={u.name} className="max-h-full w-full object-contain" />
              </div>
            ) : (
              <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl font-extrabold backdrop-blur-sm sm:size-24 sm:text-3xl">
                {u.short.slice(0, 4)}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                  <Building2 className="size-3" />
                  {u.type === "davlat"
                    ? t("ud.stateOTM")
                    : u.type === "xorijiy"
                      ? t("ud.foreignOTM")
                      : t("ud.privateOTM")}
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">
                {u.name}
              </h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-white/75">
                <MapPin className="size-4" />
                {u.region}
                {u.city !== u.region ? `, ${u.city}` : ""}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className={cn(
                  "border-white/25 bg-transparent text-white hover:bg-white/10 hover:text-white",
                  isSaved && "bg-white/15",
                )}
                onClick={() =>
                  setSaved((prev) =>
                    prev.includes(u.id) ? prev.filter((x) => x !== u.id) : [...prev, u.id],
                  )
                }
              >
                {isSaved ? t("common.saved") : t("common.save")}
              </Button>
              <Button
                className="bg-white text-slate-900 hover:bg-white/90"
                onClick={() =>
                  setCompare((prev) => (prev.includes(u.id) ? prev : [...prev, u.id].slice(-4)))
                }
              >
                {t("uni.compareAria")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className="relative -mt-6 rounded-2xl bg-card p-6 shadow-lg"
          style={{ borderWidth: 1, borderStyle: "solid", borderColor: c.brandBorder }}
        >
          <p className="text-sm leading-relaxed text-muted-foreground">{u.about}</p>
          {u.website && (
            <a
              href={`https://${u.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
              style={{ color: c.brandText }}
            >
              <Globe className="size-3.5" />
              {u.website}
              <ExternalLink className="size-3" />
            </a>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: BookOpen, label: t("ud.programs"), value: list.length },
            { icon: GraduationCap, label: t("ud.minScore"), value: minScore.toFixed(0) },
            { icon: Trophy, label: t("ud.maxScore"), value: maxScore.toFixed(0) },
            {
              icon: Languages,
              label: t("ud.langCount"),
              value: new Set(list.flatMap((p) => p.languages)).size,
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-xl bg-card p-4 text-center shadow-sm"
              style={{ borderWidth: 1, borderStyle: "solid", borderColor: c.brandBorder }}
            >
              <div
                className="mx-auto flex size-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: c.brandIconBg }}
              >
                <Icon className="size-5" style={{ color: c.brand }} />
              </div>
              <p className="mt-2 text-2xl font-extrabold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Programs Section */}
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">{t("ud.title")}</h2>
            <div className="mt-1 h-1 w-16 rounded-full" style={{ backgroundColor: c.brand }} />
          </div>
          <DemoBadge />
        </div>

        <div className="mt-6 space-y-4">
          {list.map((p) => {
            const scores = scoresOf(p.id);
            const isExpanded = expandedProgram === p.id;
            return (
              <div
                key={p.id}
                className="overflow-hidden rounded-xl bg-card shadow-sm transition-shadow hover:shadow-md"
                style={{ borderWidth: 1, borderStyle: "solid", borderColor: c.brandBorder }}
              >
                <button
                  onClick={() => setExpandedProgram(isExpanded ? null : p.id)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold leading-snug">{p.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("ud.programCode")}: {p.code} · {p.subject_combination}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {p.languages.map((l) => (
                        <span
                          key={l}
                          className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                          style={{ backgroundColor: c.brandIconBg, color: c.brandText }}
                        >
                          {t(langKeys[l] as never)}
                        </span>
                      ))}
                      {p.formats.map((f) => (
                        <span
                          key={f}
                          className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        >
                          {t(formatKeys[f] as never)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-4 shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="size-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="size-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {isExpanded && scores.length > 0 && (
                  <div className="border-t border-border/60 bg-muted/30 px-5 py-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {scores.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between rounded-lg bg-card p-3"
                          style={{
                            borderWidth: 1,
                            borderStyle: "solid",
                            borderColor: c.brandBorder,
                          }}
                        >
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">
                              {s.year} · {t(typeKeys[s.admission_type] as never)}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {t(langKeys[s.education_language] as never)} ·{" "}
                              {t(formatKeys[s.study_format] as never)}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "text-lg font-extrabold",
                              s.admission_type === "grant"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-blue-600 dark:text-blue-400",
                            )}
                          >
                            {s.score.toFixed(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {list.length === 0 && (
          <div
            className="rounded-xl bg-card p-12 text-center"
            style={{ borderWidth: 1, borderStyle: "solid", borderColor: c.brandBorder }}
          >
            <BookOpen className="mx-auto size-8 text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">{t("ud.empty")}</p>
          </div>
        )}

        <div
          className="mt-8 rounded-xl bg-card p-5"
          style={{ borderWidth: 1, borderStyle: "solid", borderColor: c.brandBorder }}
        >
          <Disclaimer />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild className="text-white" style={{ backgroundColor: c.brand }}>
            <Link to="/calculator">{t("pr.check")}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            style={{
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: c.brandBorder,
              color: c.brandText,
            }}
          >
            <Link to="/universities">
              <ArrowLeft className="size-4" />
              {t("ud.all")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
