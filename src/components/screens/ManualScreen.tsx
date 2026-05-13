import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";

interface ManualScreenProps {
  hmi: IrrigationController;
}

export function ManualScreen({ hmi }: ManualScreenProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Warning Banner */}
      <div className="rounded-2xl bg-amber-500/20 border border-amber-500/50 p-4">
        <div className="flex gap-3">
          <div className="text-2xl">⚠️</div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Tryb ręczny</h3>
            <p className="text-sm text-muted-foreground">
              W trybie ręcznym zawory mogą być otwierane bezpośrednio. Upewnij się, że wiesz, co robisz.
            </p>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6">
          <p className="text-xs text-muted-foreground mb-2">Pompa</p>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <p className="text-lg font-semibold">OK</p>
          </div>
          <button className="w-full rounded-lg bg-white/[0.06] px-4 py-2 text-sm hover:bg-white/10 transition">
            Włącz test
          </button>
        </div>

        <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6">
          <p className="text-xs text-muted-foreground mb-2">Przepływ</p>
          <p className="text-2xl font-bold mb-4">{hmi.flow.toFixed(1)} L/min</p>
          <div className="text-xs text-muted-foreground">Bieżący przepływ</div>
        </div>

        <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6">
          <p className="text-xs text-muted-foreground mb-2">Ciśnienie</p>
          <p className="text-2xl font-bold mb-4">{hmi.pressure.toFixed(1)} bar</p>
          <div className="text-xs text-muted-foreground">Bieżące ciśnienie</div>
        </div>
      </div>

      {/* Manual Valve Control */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Ręczne sterowanie zaworami</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hmi.zones.map((zone) => (
            <div key={zone.id} className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">{zone.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      zone.valveOpen ? "bg-primary animate-pulse" : "bg-white/30"
                    }`}
                  />
                  <p className="text-sm text-muted-foreground">
                    {zone.valveOpen ? "Otwarta" : "Zamknięta"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => hmi.toggleManualValve(zone.id)}
                  className={`w-full rounded-lg px-3 py-2 text-sm font-medium transition ${
                    zone.valveOpen
                      ? "bg-red-500/30 text-red-100 hover:bg-red-500/40"
                      : "bg-primary text-primary-foreground hover:brightness-110"
                  }`}
                >
                  {zone.valveOpen ? "Zamknij zawór" : "Otwórz zawór"}
                </button>

                <button className="w-full rounded-lg bg-white/[0.06] px-3 py-2 text-sm hover:bg-white/10 transition">
                  Test (10 sek)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 p-4 text-sm">
        <p className="text-foreground">
          ℹ️ Test zaworu otworzy zawór na 10 sekund. Przed otwarciem sprawd
ź, czy wszystko jest podłączone.
        </p>
      </div>
    </div>
  );
}
