import { Trash2, Edit } from "lucide-react";
import type { Program, Zone } from "@/lib/irrigation/types";
import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";
import { calculateTotalDuration, formatWeekdays } from "@/lib/irrigation/program-utils";

interface ProgramCardProps {
  program: Program;
  zones: Zone[];
  onEdit: (program: Program) => void;
  hmi: IrrigationController;
}

const PROGRAM_ICONS: Record<string, string> = {
  "program-a": "🌱",
  "program-b": "🌿",
  "program-c": "☀️",
};

const PROGRAM_COLORS: Record<string, string> = {
  "program-a": "from-cyan-500/20 to-cyan-500/5",
  "program-b": "from-emerald-500/20 to-emerald-500/5",
  "program-c": "from-amber-500/20 to-amber-500/5",
};

export function ProgramCard({ program, zones, onEdit, hmi }: ProgramCardProps) {
  const icon = PROGRAM_ICONS[program.id] || "📋";
  const colorClass = PROGRAM_COLORS[program.id] || "from-primary/20 to-primary/5";
  const totalDuration = calculateTotalDuration(program);
  const enabledSectionsCount = program.sections.filter((s) => s.enabled).length;
  const zoneName = zones.find((z) => z.id === program.sections[0]?.zoneId)?.name || "–";

  const handleDelete = () => {
    if (confirm(`Czy na pewno chcesz usunąć program "${program.name}"?`)) {
      hmi.deleteProgram(program.id);
    }
  };

  return (
    <div
      className={`rounded-2xl md:rounded-3xl bg-gradient-to-br ${colorClass} border border-border p-4 md:p-6 transition-all hover:border-primary/30`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="text-4xl flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold truncate">{program.name}</h3>
            {!program.enabled && <span className="text-xs px-2 py-1 rounded bg-white/10 text-muted-foreground">Wyłączony</span>}
          </div>
          <p className="text-sm text-muted-foreground truncate">{zoneName}</p>
        </div>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Dni</span>
          <span className="font-medium text-right">{formatWeekdays(program.weekdays)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Godzina startu</span>
          <span className="font-medium text-right">{program.startTimes.join(", ") || "–"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Sekcje</span>
          <span className="font-medium text-right">{enabledSectionsCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Łączny czas</span>
          <span className="font-medium text-right tabular-nums">{totalDuration} min</span>
        </div>
      </div>

      <div className="flex gap-2 pt-2 border-t border-border/50">
        <button
          onClick={() => onEdit(program)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition"
        >
          <Edit size={16} />
          Edytuj
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition"
          title="Usuń program"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
