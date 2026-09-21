import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Menu,
  Home,
  Building2,
  Layers,
  Calculator,
  User,
  Map,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "@/components/site/Logo";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useTheme } from "next-themes";

const mainNav = [
  { to: "/", labelKey: "nav.home" as const, icon: Home },
  { to: "/universities", labelKey: "nav.universities" as const, icon: Building2 },
  { to: "/programs", labelKey: "nav.programs" as const, icon: Layers },
  { to: "/calculator", labelKey: "nav.calculator" as const, icon: Calculator },
] as const;

const extraNav = [
  { to: "/dashboard", labelKey: "nav.profile" as const, icon: User },
  { to: "/roadmap", labelKey: "footer.roadmap" as const, icon: Map },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();
  const { user, isAuthenticated, logout } = useAuth();

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
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
            className="hidden sm:flex"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isAuthenticated ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-lg border border-border/60 px-2 py-1.5 transition-colors hover:bg-secondary"
              >
                {user?.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user.name}
                    className="size-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                )}
                <span className="max-w-[100px] truncate text-sm font-medium">
                  {user?.name || "Profil"}
                </span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="size-8 text-muted-foreground hover:text-destructive"
                aria-label={t("auth.logout")}
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          ) : (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/login">{t("auth.login")}</Link>
            </Button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-label={t("nav.menu")}
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm overflow-y-auto">
              <SheetTitle className="px-1 text-base">{t("nav.menu")}</SheetTitle>
              <div className="mt-4 flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="justify-start"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label={t("nav.theme")}
                >
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="ml-3 text-sm font-medium">{t("nav.theme")}</span>
                </Button>

                {[...mainNav, ...extraNav].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                    activeProps={{ className: "bg-secondary text-foreground" }}
                  >
                    <item.icon className="size-4" />
                    {t(item.labelKey)}
                  </Link>
                ))}

                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="mt-2 flex items-center gap-3 rounded-lg bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground"
                    >
                      {user?.photoUrl ? (
                        <img
                          src={user.photoUrl}
                          alt={user.name}
                          className="size-6 rounded-full object-cover"
                        />
                      ) : (
                        <User className="size-4" />
                      )}
                      {user?.name || t("nav.profile")}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="size-4" />
                      {t("auth.logout")}
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="mt-2 flex items-center gap-3 rounded-lg bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground"
                  >
                    <User className="size-4" /> {t("auth.login")}
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function MobileTabBar() {
  const { t } = useI18n();
  const items = [
    { to: "/", labelKey: "mob.home" as const, icon: Home },
    { to: "/calculator", labelKey: "mob.score" as const, icon: Calculator },
    { to: "/universities", labelKey: "mob.unis" as const, icon: Building2 },
    { to: "/dashboard", labelKey: "mob.profile" as const, icon: User },
  ] as const;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground"
            activeProps={{ className: "text-primary" }}
            activeOptions={{ exact: item.to === "/" }}
          >
            <item.icon className="size-5" />
            {t(item.labelKey)}
          </Link>
        ))}
      </div>
    </nav>
  );
}
