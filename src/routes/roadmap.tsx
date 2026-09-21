import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useEffect, useState } from "react";
import {
  User,
  Layers,
  Search,
  GitCompareArrows,
  Trophy,
  Send,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "UniTopuz | Yo'l xaritasi — Universitet tanlash safaringiz" },
      {
        name: "description",
        content:
          "Universitet tanlashning 6 bosqichi: profilingizni yarating, yo'nalishni tanlang, qidiring, taqqoslang, eng yaxshisini toping va ariza topshiring.",
      },
    ],
  }),
  component: RoadmapPage,
});

const milestones = [
  {
    num: 1,
    icon: User,
    titleKey: "rm.1",
    descKey: "rm.1.desc",
    color: "from-blue-500 to-blue-600",
    lightColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-600 dark:text-blue-400",
    route: "/dashboard",
  } as const,
  {
    num: 2,
    icon: Layers,
    titleKey: "rm.2",
    descKey: "rm.2.desc",
    color: "from-indigo-500 to-indigo-600",
    lightColor: "bg-indigo-50 dark:bg-indigo-950/30",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    route: "/programs",
  } as const,
  {
    num: 3,
    icon: Search,
    titleKey: "rm.3",
    descKey: "rm.3.desc",
    color: "from-violet-500 to-violet-600",
    lightColor: "bg-violet-50 dark:bg-violet-950/30",
    borderColor: "border-violet-200 dark:border-violet-800",
    iconColor: "text-violet-600 dark:text-violet-400",
    route: "/universities",
  } as const,
  {
    num: 4,
    icon: GitCompareArrows,
    titleKey: "rm.4",
    descKey: "rm.4.desc",
    color: "from-purple-500 to-purple-600",
    lightColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-800",
    iconColor: "text-purple-600 dark:text-purple-400",
    route: "/compare",
  } as const,
  {
    num: 5,
    icon: Trophy,
    titleKey: "rm.5",
    descKey: "rm.5.desc",
    color: "from-emerald-500 to-emerald-600",
    lightColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    route: "/calculator",
  } as const,
  {
    num: 6,
    icon: Send,
    titleKey: "rm.6",
    descKey: "rm.6.desc",
    color: "from-sky-500 to-sky-600",
    lightColor: "bg-sky-50 dark:bg-sky-950/30",
    borderColor: "border-sky-200 dark:border-sky-800",
    iconColor: "text-sky-600 dark:text-sky-400",
    route: "/roadmap",
  } as const,
];

function useInView(threshold = 0.2) {
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

function MilestoneRow({
  milestone,
  index,
}: {
  milestone: (typeof milestones)[number];
  index: number;
}) {
  const { ref, visible } = useInView(0.15);
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className="relative grid items-center grid-cols-[1fr_auto_1fr] gap-4 lg:gap-8"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 100}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 100}ms`,
      }}
    >
      {/* Left column */}
      <div className={`flex ${isLeft ? "justify-end" : "justify-end"}`}>
        {isLeft ? <Card milestone={milestone} /> : <div className="hidden lg:block" />}
        {!isLeft && (
          <div className="lg:hidden">
            <Card milestone={milestone} />
          </div>
        )}
      </div>

      {/* Center node */}
      <div className="flex flex-col items-center">
        <CenterNode milestone={milestone} visible={visible} index={index} />
      </div>

      {/* Right column */}
      <div className={`flex ${isLeft ? "justify-start" : "justify-start"}`}>
        {isLeft ? <div className="hidden lg:block" /> : <Card milestone={milestone} />}
        {isLeft && (
          <div className="lg:hidden">
            <Card milestone={milestone} />
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ milestone }: { milestone: (typeof milestones)[number] }) {
  const { t } = useI18n();
  return (
    <Link
      to={milestone.route}
      className={`group relative w-full max-w-md p-6 sm:p-7 rounded-2xl border transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] ${milestone.lightColor} ${milestone.borderColor} backdrop-blur-sm`}
    >
      <div className="absolute inset-0 rounded-2xl bg-white/40 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative">
        <div className="flex items-center gap-4">
          <span
            className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${milestone.color} text-white text-sm font-bold shadow-lg`}
          >
            {milestone.num}
          </span>
          <span
            className={`flex size-10 items-center justify-center rounded-xl border border-white/60 dark:border-white/10 bg-white/70 dark:bg-white/10 ${milestone.iconColor} transition-transform duration-300 group-hover:scale-110`}
          >
            <milestone.icon className="size-5" />
          </span>
        </div>

        <h3 className="mt-4 text-lg font-bold tracking-tight">{t(milestone.titleKey as never)}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {t(milestone.descKey as never)}
        </p>

        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
          {t("rm.start")}
          <ArrowRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}

function CenterNode({
  milestone,
  visible,
  index,
}: {
  milestone: (typeof milestones)[number];
  visible: boolean;
  index: number;
}) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Connecting line segment above */}
      {index > 0 && (
        <div
          className="absolute -top-12 sm:-top-16 lg:-top-20 w-0.5 h-12 sm:h-16 lg:h-20 bg-gradient-to-b from-primary/20 to-primary/40"
          style={{
            clipPath: visible ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
            transition: "clip-path 0.8s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      )}

      {/* Node circle */}
      <div
        className="relative z-10 flex size-14 sm:size-16 items-center justify-center rounded-full border-2 border-primary bg-white dark:bg-navy shadow-lg transition-all duration-500"
        style={{
          transitionDelay: visible ? `${200 + index * 100}ms` : "0ms",
          transform: visible ? "scale(1)" : "scale(0.5)",
          opacity: visible ? 1 : 0,
        }}
      >
        <span
          className={`flex size-10 sm:size-11 items-center justify-center rounded-full bg-gradient-to-br ${milestone.color} text-white shadow-md`}
        >
          <milestone.icon className="size-5" />
        </span>
      </div>

      {/* Connecting line segment below */}
      {index < 5 && (
        <div
          className="w-0.5 h-12 sm:h-16 lg:h-20 bg-gradient-to-b from-primary/40 to-primary/20"
          style={{
            clipPath: visible ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
            transition: "clip-path 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s",
          }}
        />
      )}
    </div>
  );
}

function RoadmapPage() {
  const { ref: heroRef, visible: heroVisible } = useInView(0.2);
  const { t } = useI18n();

  return (
    <div className="min-h-screen">
      {/* Hero header */}
      <section className="relative overflow-hidden bg-navy text-navy-foreground">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl" />
        </div>
        <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />

        <div
          ref={heroRef}
          className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(24px)",
            transition:
              "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="flex items-center gap-2 text-sm text-navy-foreground/60">
            <Link to="/" className="hover:text-navy-foreground transition-colors">
              {t("rm.home")}
            </Link>
            <span>/</span>
            <span className="text-navy-foreground/80">{t("rm.title")}</span>
          </div>

          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide">
              <MapPin className="size-3.5" />
              {t("rm.badge")}
            </span>

            <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              {t("rm.your")}{" "}
              <span className="bg-gradient-to-r from-sky-300 to-blue-200 bg-clip-text text-transparent">
                {t("rm.university")}
              </span>{" "}
              {t("rm.journey")}
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-navy-foreground/70 sm:text-lg">
              {t("rm.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Journey roadmap */}
      <section className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24 sm:px-6">
        <div className="space-y-6 lg:space-y-0">
          {milestones.map((m, i) => (
            <MilestoneRow key={m.num} milestone={m} index={i} />
          ))}
        </div>

        {/* Finish */}
        <div className="relative mt-16 flex justify-center">
          <FinishMarker />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <CTASection />
      </section>
    </div>
  );
}

function FinishMarker() {
  const { ref, visible } = useInView(0.3);
  const { t } = useI18n();

  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center text-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.9)",
        transition:
          "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-sky-400/30 rounded-full blur-2xl scale-150 opacity-40" />
        <div className="relative flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-500 text-white shadow-xl shadow-primary/20">
          <Trophy className="size-8" />
        </div>
      </div>
      <h3 className="mt-5 text-xl font-bold tracking-tight">{t("rm.finish")}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground leading-relaxed">
        {t("rm.finishDesc")}
      </p>
      <Link
        to="/calculator"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-[0.98]"
      >
        {t("rm.startNow")}
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}

function CTASection() {
  const { ref, visible } = useInView(0.2);
  const { t } = useI18n();

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-navy to-primary/20 p-8 sm:p-12"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition:
          "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:20px_20px]" />
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            {t("rm.ready")}
          </h2>
          <p className="mt-2 text-navy-foreground/70">{t("rm.readyDesc")}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row shrink-0">
          <Link
            to="/calculator"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-[0.98]"
          >
            {t("rm.checkMyScore")}
            <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/universities"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white/15"
          >
            {t("rm.viewUniversities")}
          </Link>
        </div>
      </div>
    </div>
  );
}
