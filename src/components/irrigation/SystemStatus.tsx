import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";
import { StatusRow } from "./primitives";

export function SystemStatus({ hmi }: { hmi: IrrigationController }) {
  return (
    <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-3">
      <p className="text-muted-foreground text-sm mb-2">System</p>

      <div className="space-y-2 text-sm">
        <StatusRow icon="⏻" label="Zasilanie" value="OK" />
        <StatusRow icon="≋" label="Pompa" value={hmi.openZone ? "Praca" : "Gotowa"} />
        <StatusRow icon="◷" label="Program" value={`${hmi.totalEnabledTime} min`} />
        <StatusRow icon="⚠" label="Alarmy" value={hmi.alarm ? "1" : "0"} />
      </div>
    </div>
  );
}
