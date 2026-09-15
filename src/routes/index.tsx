import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DATA_YEAR, platformStats } from "@/data/demo";
import { DemoBadge } from "@/components/site/ChanceBadge";
import { openUniTopChat } from "@/lib/chat";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UniTopuz | Ballingiz bilan qayerga kira olasiz?" },
      {
        name: "description",
        content:
          "Davlat test ballingizni kiriting, o'tgan yilgi o'tish ballari asosida mos universitet va yo'nalishlarni toping, testlar bilan tayyorlaning.",
      },
      { property: "og:title", content: "UniTopuz | Ball va universitet tanlash platformasi" },
      {
        property: "og:description",
        content: "Ball tahlili, universitet bazasi, testlar va tayyorgarlik materiallari.",
      },
    ],
  }),
  component: Index,
});

const features = [
  {
    icon: GraduationCap,
    title: "Universitet tanlash",
    text: "Ballingizga mos yo'nalishlarni toping.",
    to: "/universities",
  },
  {
    icon: BarChart3,
    title: "Ball tahlili",
    text: "Natijangizni o'tgan yilgi ko'rsatkichlar bilan solishtiring.",
    to: "/calculator",
  },
  {
    icon: BookOpen,
    title: "Testga tayyorgarlik",
    text: "Mavzular, testlar va materiallar orqali tayyorlaning.",
    to: "/tests",
  },
] as const;

const steps = [
  "Ballingizni kiriting",
  "Afzalliklaringizni tanlang",
  "Mos yo'nalishlarni ko'ring",
  "Testlar bilan tayyorlaning",
];

function Index() {
  return (
    <div>
      <section className="relative overflow-hidden bg-navy text-navy-foreground">
        <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium">
              <Sparkles className="size-3.5" />
              {DATA_YEAR}-yil o'tish ballari asosida
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Ballingiz bilan qayerga kira olishingizni bilib oling.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-navy-foreground/75 sm:text-lg">
              Test natijangizni kiriting va O'zbekiston universitetlari orasidan sizga mos
              variantlarni toping.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-7 text-base">
                <Link to="/calculator">
                  Ballimni tekshirish <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-white/25 bg-transparent px-7 text-base text-navy-foreground hover:bg-white/10 hover:text-navy-foreground"
              >
                <Link to="/tests">Test ishlash</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-navy-foreground/65">
              {steps.map((step, i) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold">
                    {i + 1}
                  </span>
                  {step}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-10 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.to}
              className="surface-card group p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="size-5" />
              </span>
              <h2 className="mt-4 text-lg font-bold">{f.title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Boshlash{" "}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <div className="surface-card grid grid-cols-2 gap-6 p-8 lg:grid-cols-4">
          {[
            { label: "Universitetlar", value: platformStats.universities },
            { label: "Yo'nalishlar", value: platformStats.programs },
            { label: "Test savollari", value: platformStats.questions },
            { label: "O'quvchilar", value: platformStats.students },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-primary sm:text-4xl">
                {s.value.toLocaleString("uz-UZ")}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-center">
          <DemoBadge />
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-background to-primary/5 p-8 sm:p-10 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-3">
                <Bot className="size-3.5" />
                UniTop AI Maslahatchisi
              </span>
              <h2 className="text-2xl font-extrabold sm:text-3xl text-foreground">
                Savollaringiz bormi? AI konsultantimizdan darhol so'rang!
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                {DATA_YEAR}-yil o'tish ballari, kvotalar, fanlar kombinatsiyasi, grant imtiyozlari
                yoki OTMlar bo'yicha barcha savollarga sun'iy intellekt orqali 24/7 javob oling.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={() => openUniTopChat()}
                className="h-12 px-6 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md"
              >
                <Bot className="size-5" />
                AI dan so'rash
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <div className="surface-card flex flex-col items-start gap-6 bg-navy p-8 text-navy-foreground sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold sm:text-3xl">Tayyorgarlikni bugun boshlang</h2>
            <p className="mt-2 text-navy-foreground/75">
              Mini testlar, mock imtihonlar, xatolar tahlili va shaxsiy yo'l xaritasi. Barchasi
              bitta joyda.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild size="lg">
              <Link to="/roadmap">Yo'l xaritasi</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/25 bg-transparent text-navy-foreground hover:bg-white/10 hover:text-navy-foreground"
            >
              <Link to="/materials">Materiallar</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-4 pb-4 sm:px-6">
        <p className="flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" />
          Platformadagi o'tish ballari {DATA_YEAR}-yilgi demo ma'lumotlar asosida. Natijalar
          taxminiy bo'lib, kirish kafolatlanmaydi.
        </p>
      </section>
    </div>
  );
}
