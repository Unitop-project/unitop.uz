import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookMarked, FileText, Library, Notebook, Search, Sigma, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { materials, subjects } from "@/data/demo";
import { DemoBadge } from "@/components/site/ChanceBadge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/materials")({
  head: () => ({
    meta: [
      { title: "O'quv materiallari kutubxonasi | UniTopuz" },
      {
        name: "description",
        content:
          "Darsliklar, konspektlar, PDF materiallar, video darslar va formulalar to'plami bitta kutubxonada.",
      },
      { property: "og:title", content: "O'quv materiallari | UniTopuz" },
      {
        property: "og:description",
        content: "Fan va mavzu bo'yicha saralangan tayyorgarlik materiallari.",
      },
    ],
  }),
  component: MaterialsPage,
});

const categories = [
  { id: "all", label: "Barchasi", icon: Library },
  { id: "darslik", label: "Darsliklar", icon: BookMarked },
  { id: "konspekt", label: "Konspektlar", icon: Notebook },
  { id: "pdf", label: "PDF materiallar", icon: FileText },
  { id: "video", label: "Video darslar", icon: Video },
  { id: "formula", label: "Formulalar", icon: Sigma },
  { id: "mavzu", label: "Muhim mavzular", icon: BookMarked },
] as const;

function MaterialsPage() {
  const [cat, setCat] = useState<string>("all");
  const [subject, setSubject] = useState<string>("all");
  const [q, setQ] = useState("");

  const list = materials.filter((m) => {
    if (cat !== "all" && m.category !== cat) return false;
    if (subject !== "all" && m.subject_id !== subject) return false;
    if (q && !`${m.title} ${m.topic}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Materiallar</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Raqamli kutubxona: darsliklar, konspektlar, video darslar va formulalar.
          </p>
        </div>
        <DemoBadge />
      </div>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Material qidiring..."
            className="h-12 pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSubject("all")}
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium",
              subject === "all" ? "border-primary bg-primary/10 text-primary" : "border-border",
            )}
          >
            Barcha fanlar
          </button>
          {subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => setSubject(s.id)}
              className={cn(
                "rounded-lg border px-3 py-2 text-sm font-medium",
                subject === s.id ? "border-primary bg-primary/10 text-primary" : "border-border",
              )}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
              cat === c.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:bg-secondary",
            )}
          >
            <c.icon className="size-4" />
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((m) => (
          <article key={m.id} className="surface-card flex flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-bold">{m.title}</h2>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium capitalize">
                {m.category}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{m.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
              <span className="rounded-full bg-muted px-2 py-0.5">
                {subjects.find((s) => s.id === m.subject_id)?.name}
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5">{m.topic}</span>
              <span className="rounded-full bg-muted px-2 py-0.5">{m.difficulty}</span>
              <span className="rounded-full bg-muted px-2 py-0.5">{m.format}</span>
            </div>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => toast("Material tez orada yuklanadi", { description: m.title })}
            >
              Ko'rish
            </Button>
          </article>
        ))}
      </div>

      {list.length === 0 && (
        <div className="surface-card mt-8 p-12 text-center text-sm text-muted-foreground">
          Material topilmadi.
        </div>
      )}
    </div>
  );
}
