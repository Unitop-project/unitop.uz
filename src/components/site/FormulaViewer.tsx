import { useState } from "react";
import { Sigma } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { FormulaSection } from "@/data/types";

interface FormulaViewerProps {
  title: string;
  description?: string;
  sections: FormulaSection[];
  trigger?: React.ReactNode;
}

export function FormulaViewer({ title, description, sections, trigger }: FormulaViewerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <div onClick={() => setOpen(true)} className="contents">
          {trigger}
        </div>
      ) : (
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Sigma className="size-4" />
          Ko'rish
        </Button>
      )}
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sigma className="size-5 text-primary" />
            {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="overflow-y-auto pr-2 -mr-2 mt-2 space-y-5">
          {sections.map((section, i) => (
            <div key={i}>
              <h3 className="mb-2 text-sm font-bold text-primary uppercase tracking-wide">
                {section.title}
              </h3>
              <div className="rounded-lg border bg-muted/50 p-4">
                <ul className="space-y-1.5">
                  {section.items.map((formula, j) => (
                    <li key={j} className="font-mono text-sm leading-relaxed text-foreground">
                      {formula}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
