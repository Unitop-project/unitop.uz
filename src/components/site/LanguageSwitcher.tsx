import { Check, Globe, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANGS, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex h-9 items-center gap-1 rounded-md px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground outline-none",
          className,
        )}
        aria-label="Language"
      >
        <Globe className="size-4" />
        <span className="text-xs font-bold">{LANGS.find((l) => l.code === lang)?.short}</span>
        <ChevronDown className="size-3 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuRadioGroup value={lang} onValueChange={(v) => setLang(v as typeof lang)}>
          {LANGS.map((l) => (
            <DropdownMenuRadioItem key={l.code} value={l.code}>
              <span className="flex items-center justify-between gap-2">
                {l.label}
                {lang === l.code && <Check className="size-3.5" />}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
