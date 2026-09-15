import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Flag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { questions as allQuestions, subjects } from "@/data/demo";
import { useAttempts, type AttemptRecord } from "@/lib/store";
import { cn } from "@/lib/utils";

type Mode = "mini" | "mock" | "xatolar";

export const Route = createFileRoute("/tests/$subject/run")({
  validateSearch: (search: Record<string, unknown>): { mode: Mode } => {
    const mode = search["mode"];
    return { mode: mode === "mock" || mode === "xatolar" ? mode : "mini" };
  },
  loader: ({ params }) => {
    const subject = subjects.find((s) => s.id === params.subject);
    if (!subject) throw notFound();
    return { subject };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.subject.name} | test | UniTopuz` : "Test | UniTopuz" },
      {
        name: "description",
        content: "Imtihon uslubidagi test interfeysi: vaqt, belgilash va xatolar tahlili.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TestRunner,
});

function TestRunner() {
  const { subject } = Route.useLoaderData();
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useAttempts();

  const pool = useMemo(() => {
    const base = allQuestions.filter((q) => q.subject_id === subject.id);
    if (mode === "mock") return base;
    if (mode === "xatolar") {
      const wrongIds = new Set(attempts.flatMap((a) => a.wrongIds ?? []));
      const filtered = base.filter((q) => wrongIds.has(q.id));
      return filtered.length ? filtered : base.slice(0, 5);
    }
    return base.slice(0, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject.id, mode]);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [marked, setMarked] = useState<string[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [finished]);

  const question = pool[current];

  function finish() {
    const correct = pool.filter((q) => answers[q.id] === q.correct_index).length;
    const topicStats: AttemptRecord["topicStats"] = {};
    pool.forEach((q) => {
      const st = topicStats[q.topic_id] ?? { correct: 0, total: 0 };
      st.total += 1;
      if (answers[q.id] === q.correct_index) st.correct += 1;
      topicStats[q.topic_id] = st;
    });
    const record: AttemptRecord = {
      id: `${Date.now()}`,
      subjectId: subject.id,
      subjectName: subject.name,
      mode,
      total: pool.length,
      correct,
      seconds,
      date: new Date().toISOString(),
      topicStats,
      wrongIds: pool.filter((q) => answers[q.id] !== q.correct_index).map((q) => q.id),
    };
    setAttempts((prev) => [...prev, record]);
    setFinished(true);
    setConfirmOpen(false);
  }

  if (!question && !finished) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-xl font-bold">Bu bo'lim uchun savol topilmadi</h1>
        <Button asChild className="mt-6">
          <Link to="/tests/$subject" params={{ subject: subject.id }}>
            Orqaga
          </Link>
        </Button>
      </div>
    );
  }

  if (finished) {
    const correct = pool.filter((q) => answers[q.id] === q.correct_index).length;
    const answered = pool.filter((q) => answers[q.id] !== undefined).length;
    const percent = Math.round((correct / pool.length) * 100);
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-extrabold">
          Natija: {correct} / {pool.length}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {subject.name} | {mode} test
        </p>

        <div className="surface-card mt-6 p-6">
          <div className="flex items-end justify-between">
            <span className="text-5xl font-extrabold text-primary">{percent}%</span>
            <span className="text-sm text-muted-foreground">Sarflangan vaqt: {fmt(seconds)}</span>
          </div>
          <Progress value={percent} className="mt-4 h-2.5" />
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Box label="Jami savollar" value={pool.length} />
            <Box label="To'g'ri" value={correct} tone="success" />
            <Box label="Noto'g'ri" value={answered - correct} tone="destructive" />
            <Box label="Javobsiz" value={pool.length - answered} />
          </div>
        </div>

        <h2 className="mt-10 text-xl font-bold">Savollar tahlili</h2>
        <div className="mt-4 space-y-4">
          {pool.map((q, i) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correct_index;
            return (
              <div key={q.id} className="surface-card p-5">
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                      isCorrect
                        ? "bg-success/12 text-success"
                        : "bg-destructive/10 text-destructive",
                    )}
                  >
                    {isCorrect ? <Check className="size-4" /> : <X className="size-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {i + 1}. {q.text}
                    </p>
                    <div className="mt-3 space-y-1.5 text-sm">
                      <p className={cn(isCorrect ? "text-success" : "text-destructive")}>
                        Sizning javobingiz:{" "}
                        {userAnswer === undefined ? "Javob berilmagan" : q.answers[userAnswer]}
                      </p>
                      <p className="text-success">To'g'ri javob: {q.answers[q.correct_index]}</p>
                      <p className="rounded-lg bg-muted p-3 text-muted-foreground">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            onClick={() =>
              navigate({
                to: "/tests/$subject/run",
                params: { subject: subject.id },
                search: { mode: "xatolar" },
                replace: true,
              })
            }
          >
            Xatolarimni qayta ishlash
          </Button>
          <Button asChild variant="outline">
            <Link to="/tests/$subject" params={{ subject: subject.id }}>
              Fanga qaytish
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/dashboard">Kabinet</Link>
          </Button>
        </div>
      </div>
    );
  }

  const q = question!;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="surface-card sticky top-20 z-10 flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <h1 className="font-bold">
            {subject.name} |{" "}
            {mode === "mini" ? "Mini Test" : mode === "mock" ? "Mock Test" : "Xatolarim"}
          </h1>
          <p className="text-xs text-muted-foreground">
            Javob berilgan: {answeredCount} / {pool.length}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="rounded-lg bg-muted px-3 py-1.5 font-mono text-sm font-semibold">
            {fmt(seconds)}
          </span>
          <span className="text-sm font-bold">
            {current + 1} / {pool.length}
          </span>
        </div>
      </div>

      <Progress value={((current + 1) / pool.length) * 100} className="mt-4 h-1.5" />

      <div className="surface-card mt-6 p-6 sm:p-8">
        <p className="text-lg font-semibold leading-relaxed">{q.text}</p>

        <div className="mt-6 space-y-3">
          {q.answers.map((a, i) => {
            const selected = answers[q.id] === i;
            return (
              <button
                key={i}
                onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: i }))}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors",
                  selected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40 hover:bg-secondary",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                    selected ? "bg-primary text-primary-foreground" : "bg-secondary",
                  )}
                >
                  {["A", "B", "C", "D"][i]}
                </span>
                <span className="text-sm sm:text-base">{a}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            disabled={current === 0}
            onClick={() => setCurrent((c) => c - 1)}
          >
            Oldingi
          </Button>
          <Button
            variant="outline"
            disabled={current === pool.length - 1}
            onClick={() => setCurrent((c) => c + 1)}
          >
            Keyingi
          </Button>
          <Button
            variant={marked.includes(q.id) ? "secondary" : "ghost"}
            onClick={() =>
              setMarked((prev) =>
                prev.includes(q.id) ? prev.filter((x) => x !== q.id) : [...prev, q.id],
              )
            }
          >
            <Flag className="size-4" /> Belgilang
          </Button>
          <Button className="ml-auto" onClick={() => setConfirmOpen(true)}>
            Testni yakunlash
          </Button>
        </div>
      </div>

      <div className="surface-card mt-5 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Savollar
        </p>
        <div className="flex flex-wrap gap-2">
          {pool.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setCurrent(i)}
              className={cn(
                "size-9 rounded-lg border text-sm font-semibold transition-colors",
                i === current && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                marked.includes(item.id)
                  ? "border-warning bg-warning/20"
                  : answers[item.id] !== undefined
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground",
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Testni yakunlaysizmi?</AlertDialogTitle>
            <AlertDialogDescription>
              {pool.length - answeredCount > 0
                ? `${pool.length - answeredCount} ta savol javobsiz qoldi. Yakunlangach javoblarni o'zgartirib bo'lmaydi.`
                : "Barcha savollarga javob berdingiz. Natijani ko'rish uchun tasdiqlang."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction onClick={finish}>Yakunlash</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Box({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "success" | "destructive";
}) {
  return (
    <div className="rounded-lg bg-muted/60 p-3 text-center">
      <div
        className={cn(
          "text-xl font-bold",
          tone === "success" && "text-success",
          tone === "destructive" && "text-destructive",
        )}
      >
        {value}
      </div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}

function fmt(total: number) {
  const m = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
