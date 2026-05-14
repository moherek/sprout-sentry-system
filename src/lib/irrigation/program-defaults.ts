import type { Program } from "./types";

export const DEFAULT_PROGRAMS: Program[] = [
  {
    id: "program-a",
    name: "Program A",
    enabled: true,
    weekdays: ["Mon", "Wed", "Fri"],
    startTimes: ["06:00"],
    sections: [
      { id: "a-1", zoneId: 1, durationMin: 25, enabled: true }, // Trawnik przy domu
      { id: "a-2", zoneId: 2, durationMin: 20, enabled: true }, // Ogród główny
      { id: "a-3", zoneId: 4, durationMin: 20, enabled: true }, // Podjazd / front
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "program-b",
    name: "Program B",
    enabled: true,
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    startTimes: ["20:00"],
    sections: [
      { id: "b-1", zoneId: 2, durationMin: 10, enabled: true }, // Ogród główny
      { id: "b-2", zoneId: 3, durationMin: 5, enabled: true }, // Rabaty / dół ogrodu
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "program-c",
    name: "Program C",
    enabled: true,
    weekdays: ["Tue", "Thu", "Sat"],
    startTimes: ["06:00"],
    sections: [
      { id: "c-1", zoneId: 1, durationMin: 25, enabled: true }, // Trawnik przy domu
      { id: "c-2", zoneId: 3, durationMin: 15, enabled: true }, // Rabaty / dół ogrodu
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];
