import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";
import { SettingsPanel } from "../irrigation/SettingsPanel";
import { DiagnosticsPanel } from "../irrigation/DiagnosticsPanel";

interface SettingsScreenProps {
  hmi: IrrigationController;
}

export function SettingsScreen({ hmi }: SettingsScreenProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      <SettingsPanel hmi={hmi} />
      <DiagnosticsPanel hmi={hmi} />

      {/* Connection Settings */}
      <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-6">Połączenia</h2>

        <div className="space-y-4">
          {/* Node-RED */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-border">
            <div>
              <p className="font-medium">Node-RED</p>
              <p className="text-xs text-muted-foreground mt-1">localhost:1880</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-sm text-muted-foreground">Połączono</span>
            </div>
          </div>

          {/* PLC */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-border">
            <div>
              <p className="font-medium">PLC</p>
              <p className="text-xs text-muted-foreground mt-1">192.168.1.100</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-sm text-muted-foreground">OK</span>
            </div>
          </div>

          {/* API */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-border">
            <div>
              <p className="font-medium">API</p>
              <p className="text-xs text-muted-foreground mt-1">ws://localhost:8080</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Połączenie...</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-6">Ustawienia systemu</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] transition">
            <div>
              <p className="text-sm font-medium">Jednostka przepływu</p>
              <p className="text-xs text-muted-foreground">L/min</p>
            </div>
            <select className="bg-surface border border-border rounded-lg px-2 py-1 text-xs">
              <option>L/min</option>
              <option>gal/min</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] transition">
            <div>
              <p className="text-sm font-medium">Język</p>
              <p className="text-xs text-muted-foreground">Interfejs użytkownika</p>
            </div>
            <select className="bg-surface border border-border rounded-lg px-2 py-1 text-xs">
              <option>Polski</option>
              <option>English</option>
              <option>Deutsch</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] transition">
            <div>
              <p className="text-sm font-medium">Automatyczne logowanie</p>
              <p className="text-xs text-muted-foreground">Zapisuj akcje w logu</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] transition">
            <div>
              <p className="text-sm font-medium">Powiadomienia</p>
              <p className="text-xs text-muted-foreground">Ostrzeżenia o błędach</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl md:rounded-3xl bg-red-500/10 border border-red-500/30 p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-100">Strefa zagrożenia</h2>

        <div className="space-y-3">
          <button className="w-full rounded-lg bg-red-500/30 hover:bg-red-500/40 px-4 py-2 text-sm font-medium transition text-red-100">
            Zresetuj wszystkie ustawienia
          </button>
          <button className="w-full rounded-lg bg-red-500/30 hover:bg-red-500/40 px-4 py-2 text-sm font-medium transition text-red-100">
            Restart systemu
          </button>
        </div>
      </div>
    </div>
  );
}
