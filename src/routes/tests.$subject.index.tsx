import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BookOpen, ListChecks, Target, TimerReset, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { materials, questions, subjects } from "@/data/demo";
import { useAttempts } from "@/lib/store";

export const Route = createFileRoute("/tests/$subject/")({
  loader: ({ params }) => {
    const subject = subjects.find((s) => s.id === params.subject);
    if (!subject) throw notFound();
    return { subject };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Fan topilmadi | UniTopuz" }, { name: "robots", content: "noindex" }],
      };
    }
    const s = loaderData.subject;
    return {
      meta: [
        { title: `${s.name} testlari | UniTopuz` },
        {
          name: "description",
          content: `${s.name} fanidan mavzular, mini testlar, mock test va xatolar tahlili.`,
        },
        { property: "og:title", content: `${s.name} testlari | UniTopuz` },
        { property: "og:description", content: `${s.name} bo'yicha tayyorgarlik va mashqlar.` },
      ],
    };
  },
  component: SubjectPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Fan topilmadi</h1>
      <Button asChild className="mt-6">
        <Link to="/tests">Testlar</Link>
      </Button>
    </div>
  ),
});

function SubjectPage() {
  const { subject } = Route.useLoaderData();
  const [attempts] = useAttempts();
  const subjectQuestions = questions.filter((q) => q.subject_id === subject.id);
  const subjectAttempts = attempts.filter((a) => a.subjectId === subject.id);
  const subjectMaterials = materials.filter((m) => m.subject_id === subject.id);

  const topicStats = subject.topics.map((t) => {
    let correct = 0;
    let total = 0;
    subjectAttempts.forEach((a) => {
      const st = a.topicStats[t.id];
      if (st) {
        correct += st.correct;
        total += st.total;
      }
    });
    return { topic: t, percent: total ? Math.round((correct / total) * 100) : null, total };
  });

  const wrongCount = subjectAttempts.reduce((acc, a) => acc + (a.total - a.correct), 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link to="/tests" className="text-sm text-muted-foreground hover:text-foreground">
        ← Barcha fanlar
      </Link>
      <h1 className="mt-3 text-3xl font-extrabold">{subject.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {subject.topics.length} mavzu · {subjectQuestions.length} savol · {subjectAttempts.length}{" "}
        ta urinish
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Button asChild size="lg" className="h-14">
          <Link to="/tests/$subject/run" params={{ subject: subject.id }} search={{ mode: "mini" }}>
            <TimerReset className="size-4" /> Mini test (10 savol)
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-14">
          <Link to="/tests/$subject/run" params={{ subject: subject.id }} search={{ mode: "mock" }}>
            <Target className="size-4" /> Mock test
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-14">
          <Link
            to="/tests/$subject/run"
            params={{ subject: subject.id }}
            search={{ mode: "xatolar" }}
          >
            <TriangleAlert className="size-4" /> Xatolarim ({wrongCount})
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="mavzular" className="mt-8">
        <TabsList>
          <TabsTrigger value="mavzular">Mavzular</TabsTrigger>
          <TabsTrigger value="testlar">Testlar</TabsTrigger>
          <TabsTrigger value="materiallar">Materiallar</TabsTrigger>
        </TabsList>

        <TabsContent value="mavzular" className="mt-5 space-y-3">
          {topicStats.map((ts) => (
            <div key={ts.topic.id} className="surface-card p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{ts.topic.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {ts.total > 0 ? `${ts.total} ta savol ishlangan` : "Hali ishlanmagan"}
                  </p>
                </div>
                <span className="text-lg font-bold">
                  {ts.percent === null ? "-" : `${ts.percent}%`}
                </span>
              </div>
              <Progress value={ts.percent ?? 0} className="mt-3 h-2" />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="testlar" className="mt-5 space-y-3">
          {subjectAttempts.length === 0 && (
            <div className="surface-card p-8 text-center text-sm text-muted-foreground">
              Hali test ishlanmagan. Mini testdan boshlang.
            </div>
          )}
          {subjectAttempts
            .slice()
            .reverse()
            .map((a) => (
              <div key={a.id} className="surface-card flex items-center justify-between p-5">
                <div>
                  <h3 className="font-semibold capitalize">{a.mode} test</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(a.date).toLocaleString("uz-UZ")}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {a.correct} / {a.total}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {Math.round((a.correct / a.total) * 100)}%
                  </div>
                </div>
              </div>
            ))}
        </TabsContent>

        <TabsContent value="materiallar" className="mt-5 space-y-3">
          {subjectMaterials.length === 0 && (
            <div className="surface-card p-8 text-center text-sm text-muted-foreground">
              Bu fan uchun material hozircha qo'shilmagan.
            </div>
          )}
          {subjectMaterials.map((m) => (
            <div key={m.id} className="surface-card flex items-center gap-4 p-5">
              <BookOpen className="size-5 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">{m.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {m.topic} · {m.format}
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/materials">Ko'rish</Link>
              </Button>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      <div className="surface-card mt-8 flex items-center gap-3 p-5 text-sm text-muted-foreground">
        <ListChecks className="size-4 shrink-0 text-primary" />
        Har bir testdan keyin to'g'ri javob va izoh ko'rsatiladi. Xatolarni darhol tahlil qiling.
      </div>
    </div>
  );
}
