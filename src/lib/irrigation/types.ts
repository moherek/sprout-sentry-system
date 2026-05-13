export type ZoneColor = "emerald" | "cyan" | "amber" | "violet";
export type Mode = "AUTO" | "MANUAL";

export interface Zone {
  id: number;
  name: string;
  enabled: boolean;
  durationMin: number;
  valveOpen: boolean;
  color: ZoneColor;
}

export const DEFAULT_ZONES: Zone[] = [
  { id: 1, name: "Trawnik przy domu", enabled: true, durationMin: 25, valveOpen: false, color: "cyan" },
  { id: 2, name: "Ogród główny", enabled: true, durationMin: 20, valveOpen: false, color: "emerald" },
  { id: 3, name: "Rabaty / dół ogrodu", enabled: true, durationMin: 15, valveOpen: false, color: "amber" },
  { id: 4, name: "Podjazd / front", enabled: true, durationMin: 20, valveOpen: false, color: "violet" },
];
