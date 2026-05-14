export type ZoneColor = "emerald" | "cyan" | "amber" | "violet";
export type Mode = "AUTO" | "MANUAL";
export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface Zone {
  id: number;
  name: string;
  enabled: boolean;
  durationMin: number;
  valveOpen: boolean;
  color: ZoneColor;
}

export interface Section {
  id: string;
  zoneId: number;
  durationMin: number;
  enabled: boolean;
}

export interface Program {
  id: string;
  name: string;
  enabled: boolean;
  weekdays: Weekday[];
  startTimes: string[]; // "HH:MM" format
  sections: Section[];
  createdAt: number;
  updatedAt: number;
}

export interface ProgramExecution {
  programId: string | null;
  startTime?: string;
  currentSectionIndex: number;
  remainingSec: number;
  status: "idle" | "running" | "paused";
}

export const DEFAULT_ZONES: Zone[] = [
  { id: 1, name: "Trawnik przy domu", enabled: true, durationMin: 25, valveOpen: false, color: "cyan" },
  { id: 2, name: "Ogród główny", enabled: true, durationMin: 20, valveOpen: false, color: "emerald" },
  { id: 3, name: "Rabaty / dół ogrodu", enabled: true, durationMin: 15, valveOpen: false, color: "amber" },
  { id: 4, name: "Podjazd / front", enabled: true, durationMin: 20, valveOpen: false, color: "violet" },
];
