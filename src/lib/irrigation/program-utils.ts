import type { Program, Weekday, Zone } from "./types";

const WEEKDAY_NAMES: Record<Weekday, string> = {
  Mon: "Poniedziałek",
  Tue: "Wtorek",
  Wed: "Środa",
  Thu: "Czwartek",
  Fri: "Piątek",
  Sat: "Sobota",
  Sun: "Niedziela",
};

const WEEKDAY_SHORT: Record<Weekday, string> = {
  Mon: "Pn",
  Tue: "Wt",
  Wed: "Śr",
  Thu: "Czw",
  Fri: "Pt",
  Sat: "So",
  Sun: "Nd",
};

/**
 * Calculate total duration of all sections in a program
 */
export function calculateTotalDuration(program: Program): number {
  return program.sections.reduce((total, section) => {
    return section.enabled ? total + section.durationMin : total;
  }, 0);
}

/**
 * Get enabled sections for a program
 */
export function getEnabledSections(program: Program) {
  return program.sections.filter((s) => s.enabled);
}

/**
 * Get zone IDs for all enabled sections in a program
 */
export function getSectionZoneIds(program: Program): number[] {
  return getEnabledSections(program).map((s) => s.zoneId);
}

/**
 * Get programs that run on a specific weekday
 */
export function getProgramsForWeekday(programs: Program[], weekday: Weekday): Program[] {
  return programs.filter((p) => p.enabled && p.weekdays.includes(weekday));
}

/**
 * Format weekdays as readable string (e.g., "Pn, Śr, Pt" or "Codziennie")
 */
export function formatWeekdays(weekdays: Weekday[]): string {
  if (weekdays.length === 7) {
    return "Codziennie";
  }
  if (weekdays.length === 0) {
    return "Brak";
  }
  return weekdays.map((d) => WEEKDAY_SHORT[d]).join(", ");
}

/**
 * Format weekdays as full names (for display)
 */
export function formatWeekdaysLong(weekdays: Weekday[]): string[] {
  return weekdays.map((d) => WEEKDAY_NAMES[d]);
}

/**
 * Get next program execution from now
 */
export function getNextProgramExecution(
  programs: Program[],
  now: Date = new Date()
): { program: Program; startTime: Date; weekdayName: string } | null {
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const currentWeekday = dayOfWeek === 0 ? "Sun" : (["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOfWeek - 1] as Weekday);
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeMinutes = currentHour * 60 + currentMinute;

  // Find next execution today
  const todayPrograms = getProgramsForWeekday(programs, currentWeekday);
  const futureToday = todayPrograms.find((p) => {
    const startMinutes = p.startTimes[0].split(":").map(Number);
    return startMinutes[0] * 60 + startMinutes[1] > currentTimeMinutes;
  });

  if (futureToday) {
    const [h, m] = futureToday.startTimes[0].split(":").map(Number);
    const nextStart = new Date(now);
    nextStart.setHours(h, m, 0, 0);
    return {
      program: futureToday,
      startTime: nextStart,
      weekdayName: WEEKDAY_NAMES[currentWeekday],
    };
  }

  // Find next execution in coming days
  for (let days = 1; days < 7; days++) {
    const futureDate = new Date(now);
    futureDate.setDate(futureDate.getDate() + days);
    const futureDayOfWeek = futureDate.getDay();
    const futureWeekday = futureDayOfWeek === 0 ? "Sun" : (["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][futureDayOfWeek - 1] as Weekday);

    const futurePrograms = getProgramsForWeekday(programs, futureWeekday);
    if (futurePrograms.length > 0) {
      const firstProgram = futurePrograms[0];
      const [h, m] = firstProgram.startTimes[0].split(":").map(Number);
      const nextStart = new Date(futureDate);
      nextStart.setHours(h, m, 0, 0);
      return {
        program: firstProgram,
        startTime: nextStart,
        weekdayName: WEEKDAY_NAMES[futureWeekday],
      };
    }
  }

  return null;
}

/**
 * Validate program data
 */
export function validateProgram(program: Partial<Program>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!program.name || program.name.trim() === "") {
    errors.push("Program name is required");
  }

  if (!program.weekdays || program.weekdays.length === 0) {
    errors.push("At least one weekday is required");
  }

  if (!program.startTimes || program.startTimes.length === 0) {
    errors.push("At least one start time is required");
  }

  if (!program.sections || program.sections.length === 0) {
    errors.push("At least one section is required");
  }

  const enabledSections = program.sections?.filter((s) => s.enabled) || [];
  if (enabledSections.length === 0) {
    errors.push("At least one enabled section is required");
  }

  // Validate time format HH:MM
  if (program.startTimes) {
    program.startTimes.forEach((time) => {
      if (!/^\d{2}:\d{2}$/.test(time)) {
        errors.push(`Invalid time format: "${time}" (must be HH:MM)`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Serialize programs to JSON for localStorage
 */
export function serializePrograms(programs: Program[]): string {
  return JSON.stringify(programs);
}

/**
 * Deserialize programs from JSON with validation
 */
export function deserializePrograms(json: string): Program[] {
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      return parsed.filter((p) => validateProgram(p).valid);
    }
  } catch {
    console.error("Failed to deserialize programs from localStorage");
  }
  return [];
}

/**
 * Generate a unique ID for a program
 */
export function generateProgramId(): string {
  return `program-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a unique ID for a section
 */
export function generateSectionId(): string {
  return `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get zone name by ID (fallback if zone not found)
 */
export function getZoneName(zoneId: number, zones: Zone[]): string {
  const zone = zones.find((z) => z.id === zoneId);
  return zone ? zone.name : `Zone ${zoneId}`;
}

/**
 * Find all programs using a specific zone
 */
export function findProgramsUsingZone(programs: Program[], zoneId: number): Program[] {
  return programs.filter((p) => p.sections.some((s) => s.zoneId === zoneId));
}
