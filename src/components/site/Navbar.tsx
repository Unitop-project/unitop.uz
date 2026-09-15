import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Menu,
  GraduationCap,
  Home,
  Building2,
  Layers,
  Calculator,
  FileText,
  BookOpen,
  User,
  Heart,
  Map,
  Trophy,
  Scale,
  ShieldCheck,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "@/components/site/Logo";
import { openUniTopChat } from "@/lib/chat";

const mainNav = [
  { to: "/", label: "Bosh sahifa", icon: Home },
  { to: "/universities", label: "Universitetlar", icon: Building2 },
  { to: "/programs", label: "Yo'nalishlar", icon: Layers },
  { to: "/calculator", label: "Ballimni tekshirish", icon: Calculator },
  { to: "/tests", label: "Testlar", icon: FileText },
  { to: "/materials", label: "Materiallar", icon: BookOpen },
] as const;

const extraNav = [
  { to: "/dashboard", label: "Kabinet", icon: User },
  { to: "/saved", label: "Mening universitetlarim", icon: Heart },
  { to: "/compare", label: "Taqqoslash", icon: Scale },
  { to: "/roadmap", label: "Yo'l xaritasi", icon: Map },
  { to: "/leaderboard", label: "Reyting", icon: Trophy },
  { to: "/admin", label: "Admin panel", icon: ShieldCheck },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <Logo size="md" />
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {mainNav.slice(1).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => openUniTopChat()}
            className="flex items-center gap-1.5 border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 text-xs sm:text-sm font-medium"
          >
            <Bot className="size-4 text-emerald-600 dark:text-emerald-400" />
            <span>AI Konsultant</span>
          </Button>

          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/auth">Kirish</Link>
          </Button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/dashboard">Profil</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Menyu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm overflow-y-auto">
              <SheetTitle className="px-1 text-base">Menyu</SheetTitle>
              <div className="mt-4 flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    openUniTopChat();
                  }}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/15 transition text-left"
                >
                  <Bot className="size-4 text-emerald-600 dark:text-emerald-400" />
                  UniTop AI Maslahatchi
                </button>

                {[...mainNav, ...extraNav].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                    activeProps={{ className: "bg-secondary text-foreground" }}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="mt-2 flex items-center gap-3 rounded-lg bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground"
                >
                  <User className="size-4" /> Kirish / Ro'yxatdan o'tish
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function MobileTabBar() {
  const items = [
    { to: "/", label: "Bosh", icon: Home },
    { to: "/calculator", label: "Ball", icon: Calculator },
    { to: "/tests", label: "Testlar", icon: FileText },
    { to: "/universities", label: "OTM", icon: Building2 },
    { to: "/dashboard", label: "Profil", icon: User },
  ] as const;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground"
            activeProps={{ className: "text-primary" }}
            activeOptions={{ exact: item.to === "/" }}
          >
            <item.icon className="size-5" />
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
