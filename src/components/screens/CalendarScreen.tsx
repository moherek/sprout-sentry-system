import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";

interface CalendarScreenProps {
  hmi: IrrigationController;
}

const DAYS = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"];
const HOURS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

export function CalendarScreen({ hmi }: CalendarScreenProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-2xl font-bold">Kalendarz podlewania</h1>

      <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6 overflow-x-auto">
        {/* Calendar Grid */}
        <div className="min-w-full">
          {/* Time Header */}
          <div className="flex mb-4">
            <div className="w-32 flex-shrink-0"></div>
            <div className="flex gap-1">
              {HOURS.map((hour) => (
                <div key={hour} className="w-12 flex-shrink-0 text-xs text-muted-foreground text-center">
                  {hour}
                </div>
              ))}
            </div>
          </div>

          {/* Days */}
          <div className="space-y-3">
            {DAYS.map((day) => (
              <div key={day} className="flex gap-3 items-start">
                <div className="w-32 flex-shrink-0">
                  <p className="text-sm font-medium">{day}</p>
                </div>

                <div className="flex-1 bg-white/[0.02] rounded-lg h-12 relative overflow-hidden">
                  {/* Program A: 06:00-07:05 */}
                  <div className="absolute top-1 left-[25%] w-12 h-4 bg-primary/60 rounded text-xs text-white px-1 flex items-center">
                    A
                  </div>

                  {/* Program B: 20:00-20:15 */}
                  <div className="absolute top-7 left-[83.3%] w-3 h-4 bg-primary/40 rounded text-xs text-white px-1 flex items-center">
                    B
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4">Legenda programów</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-primary/60 rounded"></div>
            <span className="text-sm">Program A - Trawnik (06:00, 65 min)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-primary/40 rounded"></div>
            <span className="text-sm">Program B - Rabaty (20:00, 15 min)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-primary/20 rounded"></div>
            <span className="text-sm">Program C - Trawa (06:00, 40 min)</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl bg-primary/10 border border-primary/30 p-4 text-sm">
        <p className="text-foreground">
          📅 Kalendarz pokazuje zaplanowane programy na bieżący tydzień. Kolory wskazują różne programy podlewania.
        </p>
      </div>
    </div>
  );
}
