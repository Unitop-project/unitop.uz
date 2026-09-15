import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
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
import { DATA_YEAR, programs, regions, universities } from "@/data/demo";
import {
  FORMAT_LABEL,
  LANGUAGE_LABEL,
  combinations,
  getUniversity,
  scoresOf,
} from "@/lib/admission";
import { DemoBadge, Disclaimer } from "@/components/site/ChanceBadge";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Yo'nalishlar qidiruvi | UniTopuz" },
      {
        name: "description",
        content:
          "Fanlar majmuasi, universitet, hudud, ta'lim tili va shakli bo'yicha bakalavr yo'nalishlarini qidiring.",
      },
      { property: "og:title", content: "Yo'nalishlar qidiruvi | UniTopuz" },
      {
        property: "og:description",
        content: "O'tgan yilgi o'tish ballari bilan yo'nalishlar katalogi.",
      },
    ],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  const [q, setQ] = useState("");
  const [combo, setCombo] = useState("all");
  const [uni, setUni] = useState("all");
  const [region, setRegion] = useState("all");
  const [lang, setLang] = useState("all");
  const [type, setType] = useState("all");
  const [format, setFormat] = useState("all");

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return programs.filter((p) => {
      const u = getUniversity(p.university_id);
      if (!u) return false;
      if (needle && !`${p.name} ${u.name} ${u.short}`.toLowerCase().includes(needle)) return false;
      if (combo !== "all" && p.subject_combination !== combo) return false;
      if (uni !== "all" && p.university_id !== uni) return false;
      if (region !== "all" && u.region !== region) return false;
      if (lang !== "all" && !p.languages.includes(lang as never)) return false;
      if (format !== "all" && !p.formats.includes(format as never)) return false;
      if (type !== "all" && !scoresOf(p.id).some((s) => s.admission_type === type)) return false;
      return true;
    });
  }, [q, combo, uni, region, lang, type, format]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Yo'nalishlar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {DATA_YEAR}-yilgi o'tish ballari asosida yo'nalishlar qidiruvi
          </p>
        </div>
        <DemoBadge />
      </div>

      <div className="surface-card mt-6 space-y-4 p-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Universitet yoki yo'nalish qidiring..."
            className="h-12 pl-9"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Pick
            label="Fanlar majmuasi"
            value={combo}
            onChange={setCombo}
            options={[["all", "Barchasi"], ...combinations.map((c) => [c, c] as [string, string])]}
          />
          <Pick
            label="Universitet"
            value={uni}
            onChange={setUni}
            options={[
              ["all", "Barchasi"],
              ...universities.map((u) => [u.id, u.short] as [string, string]),
            ]}
          />
          <Pick
            label="Hudud"
            value={region}
            onChange={setRegion}
            options={[["all", "Barchasi"], ...regions.map((r) => [r, r] as [string, string])]}
          />
          <Pick
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
          <Pick
            label="Grant / Kontrakt"
            value={type}
            onChange={setType}
            options={[
              ["all", "Barchasi"],
              ["grant", "Grant"],
              ["kontrakt", "Kontrakt"],
            ]}
          />
          <Pick
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
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">{list.length} ta yo'nalish</p>

      <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => {
          const u = getUniversity(p.university_id)!;
          const scores = scoresOf(p.id);
          const best = scores.length ? Math.min(...scores.map((s) => s.score)) : null;
          return (
            <article key={p.id} className="surface-card flex flex-col p-5">
              <h2 className="font-bold">{p.name}</h2>
              <Link
                to="/universities/$id"
                params={{ id: u.id }}
                className="mt-1 text-sm text-primary hover:underline"
              >
                {u.name}
              </Link>
              <p className="mt-3 text-xs text-muted-foreground">{p.subject_combination}</p>
              <div className="mt-3 rounded-lg bg-muted/60 p-3">
                <div className="text-[11px] text-muted-foreground">
                  Eng past o'tish bali ({DATA_YEAR})
                </div>
                <div className="text-lg font-bold">{best ? best.toFixed(1) : "-"}</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
                {p.formats.map((f) => (
                  <span key={f} className="rounded-full bg-secondary px-2 py-0.5 font-medium">
                    {FORMAT_LABEL[f]}
                  </span>
                ))}
                {p.languages.map((l) => (
                  <span key={l} className="rounded-full bg-secondary px-2 py-0.5 font-medium">
                    {LANGUAGE_LABEL[l]}
                  </span>
                ))}
              </div>
              <Button asChild className="mt-4">
                <Link to="/calculator">Ballim bilan tekshirish</Link>
              </Button>
            </article>
          );
        })}
      </div>

      <div className="surface-card mt-8 p-5">
        <Disclaimer />
      </div>
    </div>
  );
}

function Pick({
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
