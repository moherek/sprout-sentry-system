import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";
import { ScheduleCalendar } from "../irrigation/ScheduleCalendar";
import { getNextProgramExecution } from "@/lib/irrigation/program-utils";

interface CalendarScreenProps {
  hmi: IrrigationController;
}

export function CalendarScreen({ hmi }: CalendarScreenProps) {
  const nextExecution = getNextProgramExecution(hmi.programs);
  const enabledPrograms = hmi.programs.filter((p) => p.enabled);
  const totalWeeklyTime = enabledPrograms.reduce((sum, p) => {
    const occurrences = p.weekdays.length;
    const durationPerOccurrence = p.sections.filter((s) => s.enabled).reduce((d, s) => d + s.durationMin, 0);
    return sum + occurrences * durationPerOccurrence;
  }, 0);

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-2xl font-bold">Kalendarz podlewania</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6">
          <div className="text-sm text-muted-foreground mb-1">Następny start</div>
          {nextExecution ? (
            <>
              <div className="text-2xl font-bold mb-1">{nextExecution.startTime.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}</div>
              <div className="text-sm text-muted-foreground">
                {nextExecution.weekdayName} · {nextExecution.program.name}
              </div>
            </>
          ) : (
            <div className="text-lg text-muted-foreground">Brak zaplanowanych programów</div>
          )}
        </div>

        <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6">
          <div className="text-sm text-muted-foreground mb-1">Zaplanowane podlewanie na tydzień</div>
          <div className="text-2xl font-bold mb-1">{totalWeeklyTime} min</div>
          <div className="text-sm text-muted-foreground">{enabledPrograms.length} programów</div>
        </div>
      </div>

      {/* Calendar */}
      <ScheduleCalendar programs={hmi.programs} zones={hmi.zones} />

      {/* Info */}
      {enabledPrograms.length === 0 && (
        <div className="rounded-xl bg-primary/10 border border-primary/30 p-4 text-sm">
          <p className="text-foreground">📅 Brak włączonych programów podlewania. Utwórz lub włącz program na ekranie Harmonogramu.</p>
        </div>
      )}
    </div>
  );
}
