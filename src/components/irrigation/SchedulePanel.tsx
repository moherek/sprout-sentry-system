import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";
import type { Zone } from "@/lib/irrigation/types";
import { cn } from "@/lib/utils";

function SchedulePreview({ zones }: { zones: Zone[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {zones.map((zone) => (
        <div key={zone.id} className="rounded-2xl bg-surface-deep border border-border p-4">
          <p className="font-semibold">{zone.name}</p>
          <p className="text-muted-foreground text-sm mt-1 tabular-nums">
            Start 06:00 · {zone.durationMin} min
          </p>
          <div className="h-2 bg-white/[0.06] rounded-full mt-4 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                zone.valveOpen
                  ? "bg-primary w-2/3"
                  : zone.enabled
                    ? "bg-white/30 w-1/3"
                    : "bg-white/10 w-0",
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ScheduleEditor({ hmi }: { hmi: IrrigationController }) {
  if (!hmi.scheduleOpen) return null;
  return (
    <div className="mt-6 rounded-2xl bg-surface-deep border border-border overflow-hidden">
      {hmi.zones.map((zone) => (
        <div
          key={zone.id}
          className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-4 border-b border-border last:border-b-0"
        >
          <div className="md:col-span-4">
            <input
              value={zone.name}
              onChange={(e) => hmi.updateZone(zone.id, "name", e.target.value)}
              className="w-full rounded-xl bg-surface border border-border px-3 py-2 outline-none focus:border-primary"
            />
          </div>
          <div className="md:col-span-3 flex items-center gap-3">
            <span className="text-muted-foreground text-sm">Czas</span>
            <input
              type="number"
              min={1}
              max={180}
              value={zone.durationMin}
              onChange={(e) => hmi.updateZone(zone.id, "durationMin", e.target.value)}
              className="w-24 rounded-xl bg-surface border border-border px-3 py-2 outline-none focus:border-primary tabular-nums"
            />
            <span className="text-muted-foreground text-sm">min</span>
          </div>
          <div className="md:col-span-3 flex items-center gap-3">
            <input
              type="checkbox"
              checked={zone.enabled}
              onChange={(e) => hmi.updateZone(zone.id, "enabled", e.target.checked)}
              className="w-5 h-5 accent-primary"
            />
            <span className="text-sm text-foreground">Aktywna w AUTO</span>
          </div>
          <div className="md:col-span-2 text-right">
            <button
              onClick={() => hmi.toggleManualValve(zone.id)}
              className="rounded-xl bg-white/[0.06] px-4 py-2 text-sm hover:bg-white/10 transition"
            >
              Test zaworu
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SchedulePanel({ hmi }: { hmi: IrrigationController }) {
  return (
    <section className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <h2 className="text-xl font-semibold">Harmonogram podlewania</h2>
        <div className="flex gap-3">
          <button
            onClick={() => hmi.setScheduleOpen((v) => !v)}
            className="rounded-xl bg-white/[0.06] px-4 py-2 text-sm hover:bg-white/10 transition"
          >
            {hmi.scheduleOpen ? "Ukryj edycję" : "Edytuj"}
          </button>
          <button
            onClick={hmi.saveSchedule}
            className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:brightness-110 transition"
          >
            Zapisz do Node-RED
          </button>
        </div>
      </div>
      <SchedulePreview zones={hmi.zones} />
      <ScheduleEditor hmi={hmi} />
    </section>
  );
}
