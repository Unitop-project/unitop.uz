import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Timer } from "lucide-react";
import { questions, subjects } from "@/data/demo";
import { useAttempts } from "@/lib/store";

export const Route = createFileRoute("/tests/")({
  head: () => ({
    meta: [
      { title: "Testlar | fanlar bo'yicha tayyorgarlik | UniTopuz" },
      {
        name: "description",
        content:
          "Matematika, ona tili, tarix, ingliz tili va boshqa fanlar bo'yicha mini test va mock imtihonlar ishlang.",
      },
      { property: "og:title", content: "Testlar | UniTopuz" },
      {
        property: "og:description",
        content: "Mavzular, mini testlar, mock testlar va xatolar ustida ishlash.",
      },
    ],
  }),
  component: TestsPage,
});

function TestsPage() {
  const [attempts] = useAttempts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-extrabold">Testga tayyorgarlik</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Fanni tanlang va mavzular, mini testlar yoki mock imtihon bilan mashq qiling.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((s) => {
          const count = questions.filter((q) => q.subject_id === s.id).length;
          const done = attempts.filter((a) => a.subjectId === s.id).length;
          return (
            <Link
              key={s.id}
              to="/tests/$subject"
              params={{ subject: s.id }}
              className="surface-card group p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
            >
              <h2 className="text-lg font-bold">{s.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {s.topics.length} mavzu · {count} savol
              </p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Ishlangan testlar: {done}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-primary">
                  Ochish{" "}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="surface-card mt-8 flex flex-wrap items-center gap-4 p-6">
        <Timer className="size-5 text-primary" />
        <p className="text-sm text-muted-foreground">
          Mini test 10 ta savol, mock test barcha mavjud savollar. Har bir testdan so'ng xatolar
          tahlili va izohlar ko'rsatiladi.
        </p>
      </div>
    </div>
  );
}
