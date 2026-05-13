import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";
import type { Zone } from "@/lib/irrigation/types";
import { MiniMetric } from "./primitives";
import { cn } from "@/lib/utils";

function ZoneCard({ zone, hmi }: { zone: Zone; hmi: IrrigationController }) {
  const selected = hmi.activeZoneId === zone.id;
  const active = zone.valveOpen;

  return (
    <button
      onClick={() => hmi.selectZone(zone.id)}
      className={cn(
        "text-left rounded-2xl md:rounded-3xl border p-3 md:p-5 transition shadow-xl",
        active
          ? "bg-primary/10 border-primary/45"
          : selected
            ? "bg-white/[0.08] border-primary/50"
            : "bg-surface border-border hover:bg-white/[0.06]",
      )}
    >
      <div className="flex justify-between items-center">
        <div
          className={cn(
            "w-3 h-3 rounded-full",
            active ? "bg-primary shadow-[0_0_10px_currentColor]" : "bg-white/20",
          )}
        />
        <span
          className={cn(
            "text-xs font-semibold px-3 py-1 rounded-full tracking-wider",
            active
              ? "bg-primary text-primary-foreground"
              : "bg-white/[0.06] text-muted-foreground",
          )}
        >
          {active ? "ON" : "OFF"}
        </span>
      </div>
      <h3 className="text-base md:text-xl font-semibold mt-3 md:mt-5">Sekcja {zone.id}</h3>
      <p className="text-muted-foreground mt-1 text-sm md:text-base">{zone.name}</p>
      <div className="mt-3 md:mt-5 grid grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm">
        <MiniMetric label="Czas" value={`${zone.durationMin} min`} />
        <MiniMetric label="Flow" value={active ? "22 l/min" : "0 l/min"} />
      </div>
      <div className="mt-3 md:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
        <span
          className={cn(
            "text-center rounded-xl py-2 text-sm",
            zone.enabled ? "bg-primary/15 text-primary" : "bg-white/[0.06] text-muted-foreground",
          )}
        >
          {zone.enabled ? "W AUTO" : "Wyłączona"}
        </span>
        <span
          onClick={(e) => {
            e.stopPropagation();
            hmi.toggleManualValve(zone.id);
          }}
          className="text-center rounded-xl py-2 text-sm bg-white/[0.06] hover:bg-white/10 cursor-pointer"
        >
          Manual
        </span>
      </div>
    </button>
  );
}

export function ZoneCards({ hmi }: { hmi: IrrigationController }) {
  return (
    <section className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5">
      {hmi.zones.map((zone) => (
        <ZoneCard key={zone.id} zone={zone} hmi={hmi} />
      ))}
    </section>
  );
}
