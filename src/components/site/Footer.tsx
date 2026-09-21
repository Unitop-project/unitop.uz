import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/site/Logo";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-16 border-t border-border/70 bg-card/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-md">
            <Logo size="md" />
            <p className="mt-2 text-lg font-semibold text-foreground">{t("footer.question")}</p>

            <div className="mt-6 space-y-4 text-sm text-muted-foreground">
              <a
                href="tel:+998905066644"
                className="flex items-center gap-3 hover:text-foreground transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-muted-foreground"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                +998 90 506 66 44
              </a>
              <a
                href="mailto:info@unitop.uz"
                className="flex items-center gap-3 hover:text-foreground transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-muted-foreground"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                unitop.support@gmail.com
              </a>
              <a
                href="https://t.me/unitopuz_support"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:text-foreground transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0 text-muted-foreground"
                >
                  <path
                    d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.664 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
                    fill="currentColor"
                  />
                </svg>
                Telegram: @unitopuz_support
              </a>
              <div className="flex items-start gap-3">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-muted-foreground mt-0.5"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>O'zbekiston, Fargʻona shahar Ilgʻor MFY Mustaqillik shoh koʻchasi 1e-uy</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-16 gap-y-6 text-sm font-medium text-muted-foreground md:gap-x-20">
            <div className="flex flex-col gap-4">
              <Link to="/calculator" className="hover:text-foreground transition-colors">
                {t("footer.calc")}
              </Link>
              <Link to="/universities" className="hover:text-foreground transition-colors">
                {t("footer.universities")}
              </Link>
              <Link to="/programs" className="hover:text-foreground transition-colors">
                {t("footer.programs")}
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <Link to="/roadmap" className="hover:text-foreground transition-colors">
                {t("footer.roadmap")}
              </Link>
              <Link to="/dashboard" className="hover:text-foreground transition-colors">
                {t("footer.profile")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
