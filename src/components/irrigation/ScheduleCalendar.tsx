import type { Program, Zone, Weekday } from "@/lib/irrigation/types";
import { calculateTotalDuration, getProgramsForWeekday } from "@/lib/irrigation/program-utils";

interface ScheduleCalendarProps {
  programs: Program[];
  zones: Zone[];
}

const DAYS: Array<{ name: string; weekday: Weekday }> = [
  { name: "Poniedziałek", weekday: "Mon" },
  { name: "Wtorek", weekday: "Tue" },
  { name: "Środa", weekday: "Wed" },
  { name: "Czwartek", weekday: "Thu" },
  { name: "Piątek", weekday: "Fri" },
  { name: "Sobota", weekday: "Sat" },
  { name: "Niedziela", weekday: "Sun" },
];

const HOURS = Array.from({ length: 17 }, (_, i) => i + 5); // 05:00 to 21:00
const START_HOUR = 5;
const END_HOUR = 22;

const PROGRAM_COLORS: Record<string, { bg: string; border: string }> = {
  "program-a": { bg: "bg-cyan-500/60", border: "border-cyan-400" },
  "program-b": { bg: "bg-emerald-500/60", border: "border-emerald-400" },
  "program-c": { bg: "bg-amber-500/60", border: "border-amber-400" },
};

interface TimeBlockPosition {
  programId: string;
  startHour: number;
  startMin: number;
  durationMin: number;
  sectionCount: number;
  sections: string[];
}

function parseTime(timeStr: string): { hour: number; min: number } {
  const [h, m] = timeStr.split(":").map(Number);
  return { hour: h || 0, min: m || 0 };
}

function getSectionLabels(program: Program): string[] {
  return program.sections
    .filter((s) => s.enabled)
    .map((s) => `${s.durationMin}m`)
    .slice(0, 3); // Show max 3 sections per block
}

function getTimeBlocksForDay(programs: Program[], weekday: Weekday): TimeBlockPosition[] {
  const dayPrograms = getProgramsForWeekday(programs, weekday);
  const blocks: TimeBlockPosition[] = [];

  dayPrograms.forEach((program) => {
    program.startTimes.forEach((startTime) => {
      const { hour, min } = parseTime(startTime);
      const durationMin = calculateTotalDuration(program);

      blocks.push({
        programId: program.id,
        startHour: hour,
        startMin: min,
        durationMin,
        sectionCount: program.sections.filter((s) => s.enabled).length,
        sections: getSectionLabels(program),
      });
    });
  });

  return blocks.sort((a, b) => a.startHour * 60 + a.startMin - (b.startHour * 60 + b.startMin));
}

export function ScheduleCalendar({ programs, zones }: ScheduleCalendarProps) {
  const hourWidth = 3; // 3rem per hour
  const totalWidth = HOURS.length * hourWidth;

  return (
    <div className="space-y-6">
      {/* Calendar grid */}
      <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6 overflow-x-auto">
        <div className="min-w-full" style={{ width: `${totalWidth * 16 + 200}px` }}>
          {/* Hour header */}
          <div className="flex mb-4 border-b border-border/50 pb-2">
            <div className="w-32 flex-shrink-0"></div>
            <div className="flex gap-0">
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="flex-shrink-0 text-xs text-muted-foreground text-center font-medium"
                  style={{ width: `${hourWidth}rem` }}
                >
                  {String(hour).padStart(2, "0")}:00
                </div>
              ))}
            </div>
          </div>

          {/* Days */}
          <div className="space-y-3">
            {DAYS.map(({ name, weekday }) => {
              const blocks = getTimeBlocksForDay(programs, weekday);

              return (
                <div key={weekday} className="flex gap-3 items-start">
                  <div className="w-32 flex-shrink-0">
                    <p className="text-sm font-medium">{name}</p>
                  </div>

                  <div className="relative flex-1 bg-white/[0.02] rounded-lg h-16 overflow-hidden border border-border/30">
                    {/* Grid lines (optional) */}
                    <div className="flex h-full absolute w-full">
                      {HOURS.map((hour) => (
                        <div
                          key={hour}
                          className="flex-shrink-0 border-r border-border/20"
                          style={{ width: `${hourWidth}rem` }}
                        />
                      ))}
                    </div>

                    {/* Program blocks */}
                    {blocks.map((block, idx) => {
                      if (block.startHour < START_HOUR || block.startHour >= END_HOUR) return null;

                      const colors = PROGRAM_COLORS[block.programId] || PROGRAM_COLORS["program-a"];
                      const offsetRem = (block.startHour - START_HOUR) * hourWidth + (block.startMin / 60) * hourWidth;
                      const widthRem = (block.durationMin / 60) * hourWidth;

                      return (
                        <div
                          key={`${block.programId}-${idx}`}
                          className={`absolute top-1 ${colors.bg} ${colors.border} border rounded px-2 py-1 text-xs font-medium text-white shadow-md overflow-hidden`}
                          style={{
                            left: `calc(${offsetRem}rem + 0.5rem)`,
                            width: `max(3rem, ${widthRem}rem - 0.5rem)`,
                            height: "calc(100% - 0.5rem)",
                          }}
                          title={`${block.programId.toUpperCase()}: ${block.durationMin}m`}
                        >
                          <div className="truncate font-bold">{block.programId.split("-")[1]?.toUpperCase()}</div>
                          {widthRem > 3 && (
                            <>
                              <div className="text-xs opacity-90 truncate">{block.sectionCount} sekcji</div>
                              <div className="text-xs opacity-75 truncate">{block.durationMin}m</div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      {programs.length > 0 && (
        <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6">
          <h3 className="text-lg font-semibold mb-4">Legenda programów</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map((program) => {
              const colors = PROGRAM_COLORS[program.id] || PROGRAM_COLORS["program-a"];
              const totalDuration = calculateTotalDuration(program);
              const firstZone = zones.find((z) => z.id === program.sections[0]?.zoneId)?.name || "–";

              return (
                <div key={program.id} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded flex-shrink-0 ${colors.bg} ${colors.border} border`}></div>
                  <div className="text-sm flex-1">
                    <div className="font-medium">{program.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {firstZone} · {totalDuration} min
                    </div>
                  </div>
                  {!program.enabled && <span className="text-xs px-2 py-1 rounded bg-white/10 text-muted-foreground">Wyłączony</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info */}
      {programs.filter((p) => p.enabled).length === 0 && (
        <div className="rounded-xl bg-primary/10 border border-primary/30 p-4 text-sm">
          <p className="text-foreground">📅 Brak włączonych programów do wyświetlenia.</p>
        </div>
      )}
    </div>
  );
}
