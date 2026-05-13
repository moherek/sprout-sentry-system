import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";

interface HistoryScreenProps {
  hmi: IrrigationController;
}

export function HistoryScreen({ hmi }: HistoryScreenProps) {
  // Mock watering history
  const wateringHistory = [
    { id: 1, date: "2025-05-13", program: "Program A", zones: "Trawnik", duration: "65 min", amount: "1250 L" },
    { id: 2, date: "2025-05-12", program: "Program B", zones: "Rabaty", duration: "15 min", amount: "180 L" },
    { id: 3, date: "2025-05-12", program: "Program A", zones: "Trawnik", duration: "65 min", amount: "1250 L" },
    { id: 4, date: "2025-05-11", program: "Program C", zones: "Trawa", duration: "40 min", amount: "800 L" },
    { id: 5, date: "2025-05-11", program: "Program A", zones: "Trawnik", duration: "65 min", amount: "1250 L" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Last Command */}
      <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">Ostatnie polecenie</h2>
        <p className="text-lg text-foreground">{hmi.lastCommand}</p>
        <p className="text-xs text-muted-foreground mt-2">Teraz</p>
      </div>

      {/* System Logs */}
      <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">Logi systemowe</h2>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {hmi.logs.map((log, index) => (
            <div key={index} className="p-2 rounded bg-white/[0.02] border border-border text-xs text-muted-foreground">
              <span className="text-primary">[{new Date().toLocaleTimeString()}]</span> {log}
            </div>
          ))}
        </div>
      </div>

      {/* Watering History */}
      <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">Historia podlewania</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Data</th>
                <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Program</th>
                <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Sekcje</th>
                <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Czas</th>
                <th className="text-left py-2 px-2 text-xs text-muted-foreground font-medium">Woda</th>
              </tr>
            </thead>
            <tbody>
              {wateringHistory.map((history) => (
                <tr key={history.id} className="border-b border-border/50 hover:bg-white/[0.02] transition">
                  <td className="py-3 px-2 text-xs">{history.date}</td>
                  <td className="py-3 px-2 text-xs">{history.program}</td>
                  <td className="py-3 px-2 text-xs">{history.zones}</td>
                  <td className="py-3 px-2 text-xs">{history.duration}</td>
                  <td className="py-3 px-2 text-xs text-primary font-medium">{history.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
