import { CHANCE_LABEL, type ChanceLevel } from "@/lib/admission";
import { cn } from "@/lib/utils";

const styles: Record<ChanceLevel, string> = {
  high: "bg-success/12 text-success border-success/30",
  real: "bg-warning/15 text-warning-foreground border-warning/40",
  tough: "bg-destructive/10 text-destructive border-destructive/30",
};

export function ChanceBadge({ level, className }: { level: ChanceLevel; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        styles[level],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {CHANCE_LABEL[level]}
    </span>
  );
}

export function DemoBadge({ className }: { className?: string }) {
  return null;
}

export function Disclaimer({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>
      Natijalar o'tgan yillardagi ma'lumotlar asosida taxminiy hisoblanadi. O'tish ballari har yili
      o'zgarishi mumkin.
    </p>
  );
}
