import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { universities } from "@/data/demo";
import { FORMAT_LABEL, LANGUAGE_LABEL, TYPE_LABEL, programsOf, scoresOf } from "@/lib/admission";
import { useCompare, useSaved } from "@/lib/store";
import { DemoBadge, Disclaimer } from "@/components/site/ChanceBadge";
import { cn } from "@/lib/utils";

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
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Universitet topilmadi</h1>
      <Button asChild className="mt-6">
        <Link to="/universities">Universitetlar ro'yxati</Link>
      </Button>
    </div>
  ),
});

function UniversityDetail() {
  const { university: u } = Route.useLoaderData();
  const [saved, setSaved] = useSaved();
  const [compare, setCompare] = useCompare();
  const list = programsOf(u.id);
  const isSaved = saved.includes(u.id);

  return (
    <div>
      <div className="bg-navy text-navy-foreground">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex flex-wrap items-start gap-5">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold">
              {u.short.slice(0, 4)}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-extrabold sm:text-3xl">{u.name}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-navy-foreground/75">
                <MapPin className="size-4" /> {u.region}, {u.city} ·{" "}
                {u.type === "davlat" ? "Davlat" : u.type === "xorijiy" ? "Xorijiy" : "Xususiy"} OTM
              </p>
              <p className="mt-4 max-w-3xl text-sm text-navy-foreground/80">{u.about}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className={cn(
                  "border-white/25 bg-transparent text-navy-foreground hover:bg-white/10 hover:text-navy-foreground",
                  isSaved && "bg-white/15",
                )}
                onClick={() =>
                  setSaved((prev) =>
                    prev.includes(u.id) ? prev.filter((x) => x !== u.id) : [...prev, u.id],
                  )
                }
              >
                <Heart className={cn("size-4", isSaved && "fill-current")} />
                {isSaved ? "Saqlangan" : "Saqlash"}
              </Button>
              <Button
                onClick={() =>
                  setCompare((prev) => (prev.includes(u.id) ? prev : [...prev, u.id].slice(-4)))
                }
              >
                Taqqoslashga qo'shish
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Yo'nalishlar va o'tish ballari</h2>
          <DemoBadge />
        </div>

        <div className="mt-5 space-y-5">
          {list.map((p) => (
            <div key={p.id} className="surface-card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
                <div>
                  <h3 className="font-bold">{p.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    Kod: {p.code} · {p.subject_combination}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {p.languages.map((l) => (
                    <span key={l} className="rounded-full bg-secondary px-2.5 py-1 font-medium">
                      {LANGUAGE_LABEL[l]}
                    </span>
                  ))}
                  {p.formats.map((f) => (
                    <span key={f} className="rounded-full bg-secondary px-2.5 py-1 font-medium">
                      {FORMAT_LABEL[f]}
                    </span>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Yil</TableHead>
                      <TableHead>Turi</TableHead>
                      <TableHead>Til</TableHead>
                      <TableHead>Shakl</TableHead>
                      <TableHead className="text-right">O'tish bali</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scoresOf(p.id).map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.year}</TableCell>
                        <TableCell>{TYPE_LABEL[s.admission_type]}</TableCell>
                        <TableCell>{LANGUAGE_LABEL[s.education_language]}</TableCell>
                        <TableCell>{FORMAT_LABEL[s.study_format]}</TableCell>
                        <TableCell className="text-right font-bold">{s.score.toFixed(1)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>

        <div className="surface-card mt-8 p-5">
          <Disclaimer />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/calculator">Ballim bilan tekshirish</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/compare">Taqqoslash sahifasi</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
