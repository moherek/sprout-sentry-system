import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";

export function DiagnosticsPanel({ hmi }: { hmi: IrrigationController }) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-5">
      <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">Komenda do Node-RED</h2>
        <div className="rounded-2xl bg-surface-deep border border-border p-4 font-mono text-sm text-primary min-h-16 break-all">
          {hmi.lastCommand}
        </div>
      </div>
      <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">Log zdarzeń</h2>
        <div className="space-y-2">
          {hmi.logs.map((log, i) => (
            <div
              key={i}
              className="rounded-xl bg-surface-deep border border-border px-3 py-2 text-sm text-foreground font-mono"
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
