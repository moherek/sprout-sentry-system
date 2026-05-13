import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";
import { AlarmBanner } from "../irrigation/AlarmBanner";

interface AlarmsScreenProps {
  hmi: IrrigationController;
}

export function AlarmsScreen({ hmi }: AlarmsScreenProps) {
  // Mock alarm history
  const alarmHistory = [
    { id: 1, time: "14:32", type: "Ostrzeżenie", message: "Ciśnienie poniżej normy", resolved: true },
    { id: 2, time: "14:15", type: "Błąd", message: "Timeout Node-RED", resolved: true },
    { id: 3, time: "13:45", type: "Ostrzeżenie", message: "Przepływ poniżej normy", resolved: true },
    { id: 4, time: "12:00", type: "Info", message: "System uruchomiony", resolved: true },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Active Alarms Banner */}
      <AlarmBanner hmi={hmi} />

      {/* Active Alarms */}
      {hmi.alarm && (
        <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-4">Aktywne alarmy</h2>

          <div className="space-y-3">
            <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-red-100">{hmi.alarm}</p>
                  <p className="text-xs text-red-200 mt-1">Czas: teraz</p>
                </div>
                <button className="px-3 py-1 rounded-lg text-xs font-medium bg-red-500/30 hover:bg-red-500/40 transition text-red-100">
                  Potwierdź
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alarm History */}
      <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">Historia alarmów</h2>

        <div className="space-y-2">
          {alarmHistory.map((alarm) => (
            <div
              key={alarm.id}
              className={`p-3 rounded-lg border flex items-center justify-between ${
                alarm.resolved
                  ? "bg-white/[0.02] border-border"
                  : "bg-red-500/10 border-red-500/30"
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{alarm.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {alarm.time} • {alarm.type}
                </p>
              </div>
              {alarm.resolved && (
                <div className="ml-2 flex-shrink-0 text-xs font-medium text-primary">
                  Rozwiązane
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Clear Alarms Button */}
      {hmi.alarm && (
        <button className="w-full rounded-lg bg-red-500/30 hover:bg-red-500/40 px-4 py-2 text-sm font-semibold transition text-red-100">
          Zresetuj wszystkie alarmy
        </button>
      )}
    </div>
  );
}
