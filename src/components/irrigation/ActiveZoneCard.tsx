import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";
import { Metric } from "./primitives";
import { formatTime } from "@/lib/irrigation/format";

export function ActiveZoneCard({ hmi }: { hmi: IrrigationController }) {
  return (
    <div className="lg:col-span-2 rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary/15 via-surface to-zone-cyan/10 border border-primary/30 p-4 md:p-6 shadow-2xl">
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="text-muted-foreground text-sm">Aktywna sekcja</p>
          <h2 className="text-3xl md:text-5xl font-semibold mt-2 tabular-nums">
            Sekcja {hmi.activeZone?.id}
          </h2>
          <p className="text-primary mt-3 text-lg">{hmi.activeZone?.name}</p>
        </div>
        <div className="text-5xl md:text-6xl text-primary">💧</div>
      </div>

      <div className="mt-5 md:mt-8 grid grid-cols-3 gap-2 md:gap-4">
        <Metric label="Pozostało" value={hmi.running ? formatTime(hmi.remainingSec) : "--:--"} />
        <Metric label="Przepływ" value={`${hmi.flow} l/min`} />
        <Metric label="Ciśnienie" value={`${hmi.pressure.toFixed(1)} bar`} />
      </div>
    </div>
  );
}
