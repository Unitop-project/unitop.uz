import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Calculator as CalcIcon, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { DATA_YEAR, regions } from "@/data/demo";
import { DEFAULT_PREFERENCES, combinations, type CalculatorPreferences } from "@/lib/admission";
import { useLocalState } from "@/lib/store";
import { Disclaimer } from "@/components/site/ChanceBadge";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Ballingizni tekshiring | UniTopuz" },
      {
        name: "description",
        content:
          "Davlat test ballingizni kiriting va fanlar majmuasi, ta'lim tili, shakli bo'yicha mos yo'nalishlarni toping.",
      },
      { property: "og:title", content: "Ballingizni tekshiring | UniTopuz" },
      {
        property: "og:description",
        content: "Ball kalkulyatori: ballingizga mos universitet va yo'nalishlarni aniqlang.",
      },
    ],
  }),
  component: CalculatorPage,
});

function CalculatorPage() {
  const navigate = useNavigate();
  const [saved, setSaved] = useLocalState<CalculatorPreferences>("ut_prefs", DEFAULT_PREFERENCES);
  const [form, setForm] = useState<CalculatorPreferences>(saved);

  const set = <K extends keyof CalculatorPreferences>(k: K, v: CalculatorPreferences[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(form);
    navigate({ to: "/results" });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <CalcIcon className="size-5" />
        </span>
        <div>
          <h1 className="text-3xl font-extrabold">Ballingizni tekshiring</h1>
          <p className="text-sm text-muted-foreground">
            {DATA_YEAR}-yilgi o'tish ballari bilan taqqoslash
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="surface-card mt-8 space-y-7 p-6 sm:p-8">
        <div>
          <Label htmlFor="score" className="text-base font-semibold">
            To'plagan ball
          </Label>
          <div className="mt-3 flex items-center gap-4">
            <Input
              id="score"
              type="number"
              min={0}
              max={189}
              step={0.1}
              value={form.score}
              onChange={(e) => set("score", Number(e.target.value))}
              className="h-14 w-36 text-2xl font-bold"
            />
            <div className="flex-1">
              <Slider
                value={[form.score]}
                min={0}
                max={189}
                step={0.1}
                onValueChange={(v) => set("score", v[0] ?? 0)}
              />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>Maksimal 189.0</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Fanlar majmuasi">
            <Select value={form.combination} onValueChange={(v) => set("combination", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                {combinations.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Ta'lim tili">
            <Select value={form.language} onValueChange={(v) => set("language", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                <SelectItem value="uzbek">O'zbek</SelectItem>
                <SelectItem value="rus">Rus</SelectItem>
                <SelectItem value="ingliz">Ingliz</SelectItem>
                <SelectItem value="qoraqalpoq">Qoraqalpoq</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Ta'lim shakli">
            <Select value={form.format} onValueChange={(v) => set("format", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                <SelectItem value="kunduzgi">Kunduzgi</SelectItem>
                <SelectItem value="sirtqi">Sirtqi</SelectItem>
                <SelectItem value="kechki">Kechki</SelectItem>
                <SelectItem value="masofaviy">Masofaviy</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Hudud">
            <Select value={form.region} onValueChange={(v) => set("region", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                {regions.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Grant / Kontrakt">
            <Select value={form.admissionType} onValueChange={(v) => set("admissionType", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                <SelectItem value="grant">Grant</SelectItem>
                <SelectItem value="kontrakt">Kontrakt</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Universitet turi">
            <Select value={form.universityType} onValueChange={(v) => set("universityType", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barchasi</SelectItem>
                <SelectItem value="davlat">Davlat</SelectItem>
                <SelectItem value="xususiy">Xususiy</SelectItem>
                <SelectItem value="xorijiy">Xorijiy</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Button type="submit" size="lg" className="h-12 w-full text-base">
          Universitetlarni topish
        </Button>

        <div className="flex items-start gap-2 rounded-lg bg-muted p-4">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <Disclaimer />
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  );
}
