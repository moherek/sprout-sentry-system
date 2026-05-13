import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";
import { SiteMap } from "../irrigation/SiteMap";

interface MapScreenProps {
  hmi: IrrigationController;
}

export function MapScreen({ hmi }: MapScreenProps) {
  const selectedZone = hmi.activeZone;

  return (
    <div className="space-y-2 md:space-y-3">
      {/* Full-width Map */}
      <div className="h-auto">
        <SiteMap hmi={hmi} />
      </div>

      {/* Section Details and Controls - Below Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {/* Section Status Card */}
        <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Sekcja</h3>
          <p className="text-2xl font-bold mb-2">{selectedZone.name}</p>
          
          <div className="mt-4 pt-4 border-t border-border space-y-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  selectedZone.valveOpen ? "bg-primary animate-pulse" : "bg-white/30"
                }`}
              />
              <span className="text-sm">
                {selectedZone.valveOpen ? "Otwarta" : "Zamknięta"}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {selectedZone.enabled ? "✓ Aktywna w AUTO" : "○ Nieaktywna"}
            </div>
          </div>
        </div>

        {/* Flow Card */}
        <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Przepływ</h3>
          <p className="text-3xl font-bold text-primary">{hmi.flow.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground mt-1">L/min</p>
        </div>

        {/* Pressure Card */}
        <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Ciśnienie</h3>
          <p className="text-3xl font-bold text-primary">{hmi.pressure.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground mt-1">bar</p>
        </div>

        {/* Duration Card */}
        <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Czas podlewania</h3>
          <p className="text-2xl font-bold">{selectedZone.durationMin}</p>
          <p className="text-xs text-muted-foreground mt-1">minut</p>
        </div>

        {/* Status Card */}
        <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Program</h3>
          <p className="text-lg font-semibold">{selectedZone.enabled ? "Włączony" : "Wyłączony"}</p>
          <p className="text-xs text-muted-foreground mt-2">w harmonogramie AUTO</p>
        </div>

        {/* Empty card for layout balance on larger screens */}
        <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-3 md:hidden lg:block">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Info</h3>
          <p className="text-xs text-muted-foreground">Kliknij strefę na mapie, aby zmienić zaznaczenie</p>
        </div>
      </div>

      {/* Manual Control Buttons */}
      <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-4">Sterowanie ręczne</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => hmi.toggleManualValve(selectedZone.id)}
            className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
              selectedZone.valveOpen
                ? "bg-red-500/30 hover:bg-red-500/40 text-red-100"
                : "bg-primary text-primary-foreground hover:brightness-110"
            }`}
          >
            {selectedZone.valveOpen ? "Zamknij zawór" : "Otwórz zawór"}
          </button>
          
          <button
            onClick={() => hmi.toggleManualValve(selectedZone.id)}
            className="rounded-xl bg-white/[0.06] hover:bg-white/10 px-4 py-3 text-sm font-medium transition"
          >
            Test zaworu
          </button>

          <button className="rounded-xl bg-white/[0.06] hover:bg-white/10 px-4 py-3 text-sm font-medium transition">
            Historia sekcji
          </button>
        </div>
      </div>
    </div>
  );
}
