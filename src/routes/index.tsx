import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  GraduationCap,
  Map,
  MapPin,
  Sparkles,
  ChevronRight,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DATA_YEAR, platformStats } from "@/data/demo";
import { DemoBadge } from "@/components/site/ChanceBadge";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UniTopuz | Ballingiz bilan qayerga kira olasiz?" },
      {
        name: "description",
        content:
          "Davlat test ballingizni kiriting, o'tgan yilgi o'tish ballari asosida mos universitet va yo'nalishlarni toping.",
      },
      { property: "og:title", content: "UniTopuz | Ball va universitet tanlash platformasi" },
      {
        property: "og:description",
        content: "Ball tahlili, universitet bazasi va yo'nalishlar qidiruvi.",
      },
    ],
  }),
  component: Index,
});

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function RevealSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) blur(0)" : "translateY(32px) blur(4px)",
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useScrollReveal(0.3);

  useEffect(() => {
    if (!visible) return;
    const duration = 1600;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [visible, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString("uz-UZ")}
      {suffix}
    </span>
  );
}

function Index() {
  const { t } = useI18n();

  const features = [
    {
      icon: GraduationCap,
      title: t("feat.univ.title"),
      text: t("feat.univ.text"),
      to: "/universities",
      color: "from-primary/15 to-primary/5",
      iconColor: "text-primary",
      highlight: true,
    },
    {
      icon: BarChart3,
      title: t("feat.ball.title"),
      text: t("feat.ball.text"),
      to: "/calculator",
      color: "from-emerald-500/15 to-emerald-500/5",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: Map,
      title: t("feat.roadmap.title"),
      text: t("feat.roadmap.text"),
      to: "/roadmap",
      color: "from-violet-500/15 to-violet-500/5",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
  ] as const;

  const steps = [
    { num: "01", title: t("step.1.t"), desc: t("step.1.d") },
    { num: "02", title: t("step.2.t"), desc: t("step.2.d") },
    { num: "03", title: t("step.3.t"), desc: t("step.3.d") },
    { num: "04", title: t("step.4.t"), desc: t("step.4.d") },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center bg-navy text-navy-foreground">
        {/* Mesh gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -right-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/20 via-primary/5 to-transparent blur-3xl" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-500/15 via-emerald-500/5 to-transparent blur-3xl" />
          <div className="absolute top-[20%] right-[30%] w-[300px] h-[300px] rounded-full bg-gradient-to-bl from-amber-500/10 via-transparent to-transparent blur-2xl" />
        </div>

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32 w-full">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 max-w-2xl">
              <div
                style={{
                  opacity: 1,
                  animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both",
                }}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide">
                  <Sparkles className="size-3.5" />
                  {t("hero.badge", { year: DATA_YEAR })}
                </span>
              </div>

              <h1
                className="mt-8 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
                style={{
                  animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 100ms both",
                }}
              >
                {t("hero.h1p1")}{" "}
                <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                  {t("hero.h1hl")}
                </span>{" "}
                {t("hero.h1p2")}
              </h1>

              <p
                className="mt-6 max-w-xl text-base leading-relaxed text-navy-foreground/70 sm:text-lg"
                style={{
                  animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 200ms both",
                }}
              >
                {t("hero.desc")}
              </p>

              <div
                className="mt-10 flex flex-col gap-3 sm:flex-row"
                style={{
                  animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 300ms both",
                }}
              >
                <Button
                  asChild
                  size="lg"
                  className="group h-13 px-8 text-base font-semibold rounded-full bg-white text-navy hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10"
                >
                  <Link to="/calculator">
                    {t("hero.ctaScore")}
                    <span className="ml-2 inline-flex size-7 items-center justify-center rounded-full bg-navy/10 transition-transform group-hover:translate-x-0.5">
                      <ArrowRight className="size-3.5" />
                    </span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="h-13 px-8 text-base font-medium text-navy-foreground/80 hover:text-navy-foreground hover:bg-white/10 rounded-full transition-all duration-300"
                >
                  <Link to="/programs">
                    {t("hero.ctaPrograms")}
                    <ChevronRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right visual: steps preview */}
            <div
              className="hidden lg:block lg:col-span-5"
              style={{
                animation: "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 400ms both",
              }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-emerald-500/20 rounded-3xl blur-2xl scale-95 opacity-50" />
                <div className="relative bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-5">
                  {steps.map((step, i) => (
                    <div
                      key={step.num}
                      className="flex items-start gap-4 group"
                      style={{
                        animation: `fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${500 + i * 100}ms both`,
                      }}
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sm font-bold tracking-wider text-white/80 border border-white/10 transition-all duration-300 group-hover:bg-white/15 group-hover:scale-105">
                        {step.num}
                      </span>
                      <div className="pt-1">
                        <div className="text-sm font-semibold text-white/90">{step.title}</div>
                        <div className="text-xs text-white/50 mt-0.5">{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="mx-auto -mt-12 max-w-7xl px-4 sm:px-6 relative z-10">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((f, i) => (
            <RevealSection key={f.title} delay={i * 80}>
              <Link
                to={f.to}
                className={cn(
                  "group relative block h-full overflow-hidden rounded-2xl border p-6 shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:p-8",
                  f.highlight
                    ? "border-white/10 bg-gradient-to-br from-navy via-[oklch(0.31 0.07 250)] to-emerald-600 text-navy-foreground hover:border-white/20"
                    : "border-border/60 bg-card hover:border-border/30",
                )}
              >
                {f.highlight && (
                  <>
                    <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" />
                    <div className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-emerald-400/30 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-16 -left-16 size-44 rounded-full bg-white/10 blur-3xl" />
                  </>
                )}
                <div
                  className={cn(
                    "relative inline-flex size-12 items-center justify-center rounded-2xl border border-white/20 transition-transform duration-300 group-hover:scale-110",
                    f.highlight ? "bg-white/10" : `bg-gradient-to-br ${f.color}`,
                  )}
                >
                  <f.icon className={cn("size-5", f.highlight ? "text-white" : f.iconColor)} />
                </div>
                <h2
                  className={cn(
                    "relative mt-5 text-xl font-bold tracking-tight",
                    f.highlight && "text-white",
                  )}
                >
                  {f.title}
                </h2>
                <p
                  className={cn(
                    "relative mt-2 max-w-sm text-sm leading-relaxed",
                    f.highlight ? "text-white/70" : "text-muted-foreground",
                  )}
                >
                  {f.text}
                </p>
                <span
                  className={cn(
                    "relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-300 group-hover:gap-2.5",
                    f.highlight ? "text-white" : "text-primary",
                  )}
                >
                  {t("common.start")}
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* Stats */}
      <RevealSection className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-navy to-primary/20 p-8 sm:p-12 text-navy-foreground">
          <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:20px_20px]" />
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative grid grid-cols-3 gap-8">
            {[
              {
                label: t("stats.universities"),
                value: platformStats.universities,
                icon: GraduationCap,
              },
              { label: t("stats.programs"), value: platformStats.programs, icon: Target },
              { label: t("stats.regions"), value: platformStats.regions, icon: MapPin },
            ].map((s, i) => (
              <div key={s.label} className="text-center group">
                <div className="inline-flex size-10 items-center justify-center rounded-xl bg-white/10 border border-white/10 mb-3 transition-transform duration-300 group-hover:scale-110">
                  <s.icon className="size-4 text-white/70" />
                </div>
                <div className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  <AnimatedCounter target={s.value} />
                </div>
                <div className="mt-1 text-sm text-white/50 font-medium">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <DemoBadge />
          </div>
        </div>
      </RevealSection>

      {/* How it works */}
      <RevealSection className="mx-auto mt-24 max-w-7xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-muted-foreground">
            {t("how.label")}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t("how.title")}
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <RevealSection key={step.num} delay={i * 100}>
              <div className="group relative h-full p-6 rounded-2xl bg-card border border-border/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
                <span className="text-5xl font-extrabold text-primary/10 tracking-tighter">
                  {step.num}
                </span>
                <h3 className="mt-3 text-base font-bold tracking-tight">{step.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                {i < steps.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute top-1/2 -right-3 size-5 text-border z-10" />
                )}
              </div>
            </RevealSection>
          ))}
        </div>
      </RevealSection>

      {/* CTA */}
      <RevealSection className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 mb-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 p-8 sm:p-12 lg:p-16 text-primary-foreground">
          <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-navy/20 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                {t("cta.title")}
              </h2>
              <p className="mt-3 text-primary-foreground/75 text-base leading-relaxed max-w-lg">
                {t("cta.desc")}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row shrink-0">
              <Button
                asChild
                size="lg"
                className="group h-12 px-7 text-base font-semibold rounded-full bg-white text-primary hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/10"
              >
                <Link to="/roadmap">
                  {t("cta.roadmap")}
                  <span className="ml-2 inline-flex size-6 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="size-3.5" />
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="h-12 px-7 text-base font-medium text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 rounded-full transition-all duration-300"
              >
                <Link to="/universities">
                  {t("cta.universities")}
                  <ChevronRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </RevealSection>
    </div>
  );
}
