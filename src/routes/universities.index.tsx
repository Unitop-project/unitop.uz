import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Building2, Heart, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DATA_YEAR, programs, regions, universities } from "@/data/demo";
import { maxScoreOf, minScoreOf, programsOf } from "@/lib/admission";
import { useCompare, useSaved } from "@/lib/store";
import { DemoBadge } from "@/components/site/ChanceBadge";
import { cn } from "@/lib/utils";

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
          <h1 className="text-3xl font-extrabold">Universitetlar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {DATA_YEAR}-yil o'tish ballari bilan universitet katalogi
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
            placeholder="Universitet yoki yo'nalish qidiring..."
            className="h-12 pl-9"
          />
        </div>
        <div className="sm:w-56">
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Hudud" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha hududlar</SelectItem>
              {regions.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((u) => {
          const min = minScoreOf(u.id);
          const max = maxScoreOf(u.id);
          const isSaved = saved.includes(u.id);
          const inCompare = compare.includes(u.id);
          return (
            <article key={u.id} className="surface-card flex flex-col p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy text-sm font-bold text-navy-foreground">
                  {u.short.slice(0, 4)}
                </span>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold leading-snug">{u.name}</h2>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" /> {u.region}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setSaved((prev) =>
                      prev.includes(u.id) ? prev.filter((x) => x !== u.id) : [...prev, u.id],
                    )
                  }
                  aria-label="Saqlash"
                  className={cn(
                    "ml-auto flex size-9 shrink-0 items-center justify-center rounded-lg border border-border",
                    isSaved ? "bg-primary/10 text-primary" : "text-muted-foreground",
                  )}
                >
                  <Heart className={cn("size-4", isSaved && "fill-current")} />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Mini label="Yo'nalish" value={String(programsOf(u.id).length)} />
                <Mini label="Eng past ball" value={min ? min.toFixed(1) : "-"} />
                <Mini label="Eng yuqori" value={max ? max.toFixed(1) : "-"} />
              </div>

              <div className="mt-4 flex gap-2">
                <Button asChild className="flex-1">
                  <Link to="/universities/$id" params={{ id: u.id }}>
                    Batafsil
                  </Link>
                </Button>
                <Button
                  variant={inCompare ? "secondary" : "outline"}
                  onClick={() =>
                    setCompare((prev) =>
                      prev.includes(u.id)
                        ? prev.filter((x) => x !== u.id)
                        : [...prev, u.id].slice(-4),
                    )
                  }
                >
                  {inCompare ? "Tanlandi" : "Taqqoslash"}
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      {list.length === 0 && (
        <div className="surface-card mt-8 flex flex-col items-center gap-2 p-12 text-center">
          <Building2 className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Hech narsa topilmadi.</p>
        </div>
      )}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/60 p-2">
      <div className="text-sm font-bold">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}
