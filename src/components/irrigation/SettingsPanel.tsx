import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";
import { SettingCard } from "./primitives";

export function SettingsPanel({ hmi }: { hmi: IrrigationController }) {
  if (!hmi.settingsOpen) return null;
  return (
    <section className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold">Ustawienia systemu</h2>
        <button
          onClick={() => hmi.setSettingsOpen(false)}
          className="rounded-xl bg-white/[0.06] px-4 py-2 hover:bg-white/10 transition"
        >
          Zamknij
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <SettingCard title="Watchdog PLC" value="5 s" />
        <SettingCard title="Max czas zaworu" value="180 min" />
        <SettingCard title="Po restarcie" value="Wszystko OFF" />
      </div>
    </section>
  );
}
