import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heart, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DATA_YEAR, regions, universities } from "@/data/demo";
import {
  DEFAULT_PREFERENCES,
  FORMAT_LABEL,
  LANGUAGE_LABEL,
  TYPE_LABEL,
  admissionRows,
  combinations,
  getChance,
  matchPreferences,
  type CalculatorPreferences,
} from "@/lib/admission";
import { useLocalState, useSaved } from "@/lib/store";
import { ChanceBadge, DemoBadge, Disclaimer } from "@/components/site/ChanceBadge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Natijalar | ballingizga mos yo'nalishlar | UniTopuz" },
      {
        name: "description",
        content:
          "Ballingiz va o'tgan yilgi o'tish ballari taqqoslangan yo'nalishlar ro'yxati, filtrlar va saralash.",
      },
      { property: "og:title", content: "Ballingizga mos yo'nalishlar | UniTopuz" },
      {
        property: "og:description",
        content: "Universitet, hudud, grant va kontrakt bo'yicha filtrlangan natijalar.",
      },
    ],
  }),
  component: ResultsPage,
});

type SortKey = "score" | "name" | "chance" | "closest";

function ResultsPage() {
  const [prefs] = useLocalState<CalculatorPreferences>("ut_prefs", DEFAULT_PREFERENCES);
  const [saved, setSaved] = useSaved();
  const [showFilters, setShowFilters] = useState(false);

  const [uni, setUni] = useState("all");
  const [region, setRegion] = useState("all");
  const [combo, setCombo] = useState("all");
  const [type, setType] = useState("all");
  const [lang, setLang] = useState("all");
  const [format, setFormat] = useState("all");
  const [minScore, setMinScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [sort, setSort] = useState<SortKey>("chance");

  const userScore = prefs.score;

  const rows = useMemo(() => {
    const list = admissionRows
      .filter((r) => matchPreferences(r, prefs))
      .filter((r) => (uni === "all" ? true : r.university.id === uni))
      .filter((r) => (region === "all" ? true : r.university.region === region))
      .filter((r) => (combo === "all" ? true : r.program.subject_combination === combo))
      .filter((r) => (type === "all" ? true : r.score.admission_type === type))
      .filter((r) => (lang === "all" ? true : r.score.education_language === lang))
      .filter((r) => (format === "all" ? true : r.score.study_format === format))
      .filter((r) => (minScore === "" ? true : r.score.score >= Number(minScore)))
      .filter((r) => (maxScore === "" ? true : r.score.score <= Number(maxScore)))
      .map((r) => ({ ...r, difference: +(userScore - r.score.score).toFixed(1) }));

    const sorted = [...list];
    if (sort === "score") sorted.sort((a, b) => b.score.score - a.score.score);
    if (sort === "name") sorted.sort((a, b) => a.university.name.localeCompare(b.university.name));
    if (sort === "chance") sorted.sort((a, b) => b.difference - a.difference);
    if (sort === "closest") sorted.sort((a, b) => Math.abs(a.difference) - Math.abs(b.difference));
    return sorted;
  }, [prefs, uni, region, combo, type, lang, format, minScore, maxScore, sort, userScore]);

  const counts = {
    high: rows.filter((r) => getChance(r.difference) === "high").length,
    real: rows.filter((r) => getChance(r.difference) === "real").length,
    tough: rows.filter((r) => getChance(r.difference) === "tough").length,
  };

  function toggleSave(id: string) {
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Natijalar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sizning ballingiz: <span className="font-bold text-foreground">{userScore}</span> ·{" "}
            {DATA_YEAR}-yil ma'lumotlari asosida
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/calculator">Ballni o'zgartirish</Link>
          </Button>
          <Button variant="outline" onClick={() => setShowFilters((s) => !s)} className="lg:hidden">
            <SlidersHorizontal className="size-4" /> Filtrlar
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <StatCard label="Yuqori imkoniyat" value={counts.high} tone="success" />
        <StatCard label="Real imkoniyat" value={counts.real} tone="warning" />
        <StatCard label="Raqobat yuqori" value={counts.tough} tone="destructive" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className={cn("space-y-4", showFilters ? "block" : "hidden lg:block")}>
          <div className="surface-card space-y-4 p-5">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
              Filtrlar
            </h2>
            <FilterSelect
              label="Universitet"
              value={uni}
              onChange={setUni}
              options={[
                ["all", "Barchasi"],
                ...universities.map((u) => [u.id, u.short] as [string, string]),
              ]}
            />
            <FilterSelect
              label="Hudud"
              value={region}
              onChange={setRegion}
              options={[["all", "Barchasi"], ...regions.map((r) => [r, r] as [string, string])]}
            />
            <FilterSelect
              label="Yo'nalish majmuasi"
              value={combo}
              onChange={setCombo}
              options={[
                ["all", "Barchasi"],
                ...combinations.map((c) => [c, c] as [string, string]),
              ]}
            />
            <FilterSelect
              label="Grant / Kontrakt"
              value={type}
              onChange={setType}
              options={[
                ["all", "Barchasi"],
                ["grant", "Grant"],
                ["kontrakt", "Kontrakt"],
              ]}
            />
            <FilterSelect
              label="Ta'lim tili"
              value={lang}
              onChange={setLang}
              options={[
                ["all", "Barchasi"],
                ["uzbek", "O'zbek"],
                ["rus", "Rus"],
                ["ingliz", "Ingliz"],
              ]}
            />
            <FilterSelect
              label="Ta'lim shakli"
              value={format}
              onChange={setFormat}
              options={[
                ["all", "Barchasi"],
                ["kunduzgi", "Kunduzgi"],
                ["sirtqi", "Sirtqi"],
                ["kechki", "Kechki"],
              ]}
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Min ball</Label>
                <Input
                  value={minScore}
                  onChange={(e) => setMinScore(e.target.value)}
                  placeholder="0"
                  inputMode="decimal"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Max ball</Label>
                <Input
                  value={maxScore}
                  onChange={(e) => setMaxScore(e.target.value)}
                  placeholder="189"
                  inputMode="decimal"
                />
              </div>
            </div>
          </div>
          <div className="surface-card p-5">
            <Disclaimer />
            <DemoBadge className="mt-3" />
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{rows.length} ta natija topildi</p>
            <div className="w-56">
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chance">Eng katta imkoniyat</SelectItem>
                  <SelectItem value="closest">Eng yaqin o'tish bali</SelectItem>
                  <SelectItem value="score">Ball bo'yicha</SelectItem>
                  <SelectItem value="name">Universitet nomi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {rows.length === 0 && (
              <div className="surface-card p-10 text-center text-sm text-muted-foreground">
                Tanlangan shartlar bo'yicha natija topilmadi. Filtrlarni yumshatib ko'ring.
              </div>
            )}
            {rows.map((r) => {
              const level = getChance(r.difference);
              const isSaved = saved.includes(r.university.id);
              return (
                <article
                  key={r.score.id}
                  className="surface-card p-5 transition-shadow hover:shadow-[var(--shadow-lift)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <Link
                        to="/universities/$id"
                        params={{ id: r.university.id }}
                        className="text-base font-bold hover:text-primary"
                      >
                        {r.university.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{r.program.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChanceBadge level={level} />
                      <button
                        onClick={() => toggleSave(r.university.id)}
                        aria-label="Saqlash"
                        className={cn(
                          "flex size-9 items-center justify-center rounded-lg border border-border transition-colors",
                          isSaved
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-secondary",
                        )}
                      >
                        <Heart className={cn("size-4", isSaved && "fill-current")} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <Metric
                      label={`O'tgan yilgi o'tish bali (${r.score.year})`}
                      value={r.score.score.toFixed(1)}
                    />
                    <Metric label="Sizning ballingiz" value={userScore.toFixed(1)} />
                    <Metric
                      label="Farq"
                      value={`${r.difference > 0 ? "+" : ""}${r.difference.toFixed(1)} ball`}
                      tone={r.difference >= 0 ? "success" : "destructive"}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <Chip>{TYPE_LABEL[r.score.admission_type]}</Chip>
                    <Chip>{LANGUAGE_LABEL[r.score.education_language]} tili</Chip>
                    <Chip>{FORMAT_LABEL[r.score.study_format]}</Chip>
                    <Chip>{r.university.region}</Chip>
                    <Chip>{r.score.year}-yil</Chip>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-secondary px-2.5 py-1 font-medium">{children}</span>;
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "success" | "destructive";
}) {
  return (
    <div className="rounded-lg bg-muted/60 p-3">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div
        className={cn(
          "mt-0.5 text-lg font-bold",
          tone === "success" && "text-success",
          tone === "destructive" && "text-destructive",
        )}
      >
        {value}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "success" | "warning" | "destructive";
}) {
  return (
    <div className="surface-card p-4">
      <div
        className={cn(
          "text-2xl font-extrabold",
          tone === "success" && "text-success",
          tone === "warning" && "text-warning",
          tone === "destructive" && "text-destructive",
        )}
      >
        {value}
      </div>
      <div className="text-xs text-muted-foreground sm:text-sm">{label}</div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(([v, l]) => (
            <SelectItem key={v} value={v}>
              {l}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
