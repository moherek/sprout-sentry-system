import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";
import { SchedulePanel } from "../irrigation/SchedulePanel";

interface ScheduleScreenProps {
  hmi: IrrigationController;
}

export function ScheduleScreen({ hmi }: ScheduleScreenProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      <SchedulePanel hmi={hmi} />

      {/* Program Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* Program A */}
        <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-4xl">🌱</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Program A</h3>
              <p className="text-sm text-muted-foreground">Trawnik przy domu</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dni</span>
              <span className="font-medium">Pn, Sr, Pt</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Godzina startu</span>
              <span className="font-medium">06:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sekcje</span>
              <span className="font-medium">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Łączny czas</span>
              <span className="font-medium">65 min</span>
            </div>
          </div>

          <button className="w-full mt-4 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition">
            Edytuj program
          </button>
        </div>

        {/* Program B */}
        <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-4xl">🌿</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Program B</h3>
              <p className="text-sm text-muted-foreground">Rabaty</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dni</span>
              <span className="font-medium">Codziennie</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Godzina startu</span>
              <span className="font-medium">20:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sekcje</span>
              <span className="font-medium">2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Łączny czas</span>
              <span className="font-medium">15 min</span>
            </div>
          </div>

          <button className="w-full mt-4 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition">
            Edytuj program
          </button>
        </div>

        {/* Program C */}
        <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-4xl">☀️</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Program C</h3>
              <p className="text-sm text-muted-foreground">Trawa zwykła</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dni</span>
              <span className="font-medium">Wt, Czw, So</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Godzina startu</span>
              <span className="font-medium">06:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sekcje</span>
              <span className="font-medium">4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Łączny czas</span>
              <span className="font-medium">40 min</span>
            </div>
          </div>

          <button className="w-full mt-4 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition">
            Edytuj program
          </button>
        </div>
      </div>
    </div>
  );
}
