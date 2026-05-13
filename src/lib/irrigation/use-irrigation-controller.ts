import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_ZONES, type Mode, type Zone } from "./types";

export interface IrrigationController {
  zones: Zone[];
  mode: Mode;
  running: boolean;
  activeZoneId: number;
  remainingSec: number;
  settingsOpen: boolean;
  scheduleOpen: boolean;
  alarm: string | null;
  connectionOk: boolean;
  lastCommand: string;
  logs: string[];
  activeZone: Zone;
  openZone: Zone | undefined;
  totalEnabledTime: number;
  flow: number;
  pressure: number;
  setSettingsOpen: (updater: boolean | ((prev: boolean) => boolean)) => void;
  setScheduleOpen: (updater: boolean | ((prev: boolean) => boolean)) => void;
  setAlarm: (alarm: string | null) => void;
  startCycle: () => void;
  stopAll: () => void;
  goNextZone: () => void;
  changeMode: (mode: Mode) => void;
  selectZone: (zoneId: number) => void;
  toggleManualValve: (zoneId: number) => void;
  updateZone: (zoneId: number, field: keyof Zone, value: string | number | boolean) => void;
  saveSchedule: () => void;
  testConnection: () => void;
}

export function useIrrigationController(): IrrigationController {
  const [zones, setZones] = useState<Zone[]>(DEFAULT_ZONES);
  const [mode, setMode] = useState<Mode>("AUTO");
  const [running, setRunning] = useState(false);
  const [activeZoneId, setActiveZoneId] = useState<number>(2);
  const [remainingSec, setRemainingSec] = useState(20 * 60);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [alarm, setAlarm] = useState<string | null>(null);
  const [connectionOk, setConnectionOk] = useState(true);
  const [lastCommand, setLastCommand] = useState("System gotowy");
  const [logs, setLogs] = useState<string[]>([
    "System uruchomiony",
    "Połączenie z Node-RED: OK",
  ]);

  const activeZone = zones.find((z) => z.id === activeZoneId) ?? zones[0];
  const openZone = zones.find((z) => z.valveOpen);
  const totalEnabledTime = useMemo(
    () => zones.filter((z) => z.enabled).reduce((sum, z) => sum + Number(z.durationMin || 0), 0),
    [zones],
  );

  const addLog = useCallback((text: string) => {
    const time = new Date().toLocaleTimeString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLogs((prev) => [`${time}  ${text}`, ...prev].slice(0, 6));
  }, []);

  const sendCommand = useCallback(
    (command: string, payload: Record<string, unknown> = {}) => {
      const body = Object.keys(payload).length ? JSON.stringify(payload) : "";
      const message = `${command} ${body}`.trim();
      setLastCommand(message);
      addLog(`TX → Node-RED: ${message}`);
    },
    [addLog],
  );

  const openOnlyZone = useCallback((zoneId: number) => {
    setZones((prev) => prev.map((z) => ({ ...z, valveOpen: z.id === zoneId })));
  }, []);

  const closeAllValves = useCallback(() => {
    setZones((prev) => prev.map((z) => ({ ...z, valveOpen: false })));
  }, []);

  const goNextZone = useCallback(() => {
    const enabled = zones.filter((z) => z.enabled);
    const idx = enabled.findIndex((z) => z.id === activeZoneId);
    const next = enabled[idx + 1];
    if (!next) {
      setRunning(false);
      setRemainingSec(0);
      closeAllValves();
      sendCommand("AUTO_FINISHED");
      addLog("Cykl AUTO zakończony");
      return;
    }
    setActiveZoneId(next.id);
    setRemainingSec(next.durationMin * 60);
    openOnlyZone(next.id);
    sendCommand("NEXT_ZONE", { zone: next.id, durationMin: next.durationMin });
  }, [zones, activeZoneId, closeAllValves, openOnlyZone, sendCommand, addLog]);

  useEffect(() => {
    if (!running || mode !== "AUTO") return;
    const timer = setInterval(() => {
      setRemainingSec((prev) => {
        if (prev > 1) return prev - 1;
        goNextZone();
        return 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running, mode, goNextZone]);

  const startCycle = useCallback(() => {
    const first = zones.find((z) => z.enabled);
    if (!first) {
      setAlarm("Brak aktywnych sekcji w harmonogramie");
      addLog("ALARM: brak aktywnych sekcji");
      return;
    }
    setMode("AUTO");
    setRunning(true);
    setAlarm(null);
    setActiveZoneId(first.id);
    setRemainingSec(first.durationMin * 60);
    openOnlyZone(first.id);
    sendCommand("AUTO_START", { zone: first.id, durationMin: first.durationMin });
  }, [zones, openOnlyZone, sendCommand, addLog]);

  const stopAll = useCallback(() => {
    setRunning(false);
    setRemainingSec(0);
    closeAllValves();
    sendCommand("STOP_ALL");
  }, [closeAllValves, sendCommand]);

  const changeMode = useCallback(
    (next: Mode) => {
      setMode(next);
      setRunning(false);
      setRemainingSec(0);
      closeAllValves();
      sendCommand("MODE_CHANGE", { mode: next });
    },
    [closeAllValves, sendCommand],
  );

  const selectZone = useCallback(
    (zoneId: number) => {
      const zone = zones.find((z) => z.id === zoneId);
      setActiveZoneId(zoneId);
      if (zone && !running) setRemainingSec(zone.durationMin * 60);
    },
    [zones, running],
  );

  const toggleManualValve = useCallback(
    (zoneId: number) => {
      if (mode !== "MANUAL") {
        setAlarm("Ręczne sterowanie dostępne tylko w trybie MANUAL");
        return;
      }
      const zone = zones.find((z) => z.id === zoneId);
      const shouldOpen = !zone?.valveOpen;
      setRunning(false);
      setRemainingSec(0);
      setActiveZoneId(zoneId);
      setZones((prev) =>
        prev.map((item) => ({ ...item, valveOpen: item.id === zoneId ? shouldOpen : false })),
      );
      sendCommand(shouldOpen ? "VALVE_OPEN" : "VALVE_CLOSE", { zone: zoneId });
    },
    [mode, zones, sendCommand],
  );

  const updateZone = useCallback(
    (zoneId: number, field: keyof Zone, value: string | number | boolean) => {
      setZones((prev) =>
        prev.map((zone) => {
          if (zone.id !== zoneId) return zone;
          if (field === "durationMin") {
            const duration = Math.max(1, Math.min(180, Number(value || 1)));
            return { ...zone, durationMin: duration };
          }
          return { ...zone, [field]: value } as Zone;
        }),
      );
    },
    [],
  );

  const saveSchedule = useCallback(() => {
    sendCommand("SAVE_SCHEDULE", {
      zones: zones.map((z) => ({
        id: z.id,
        name: z.name,
        enabled: z.enabled,
        durationMin: z.durationMin,
      })),
    });
    setScheduleOpen(false);
  }, [zones, sendCommand]);

  const testConnection = useCallback(() => {
    setConnectionOk((prev) => {
      const next = !prev;
      addLog(`Połączenie Node-RED: ${next ? "OK" : "OFFLINE"}`);
      return next;
    });
  }, [addLog]);

  return {
    zones,
    mode,
    running,
    activeZoneId,
    remainingSec,
    settingsOpen,
    scheduleOpen,
    alarm,
    connectionOk,
    lastCommand,
    logs,
    activeZone,
    openZone,
    totalEnabledTime,
    flow: openZone ? 22 : 0,
    pressure: openZone ? 3.1 : 0,
    setSettingsOpen,
    setScheduleOpen,
    setAlarm,
    startCycle,
    stopAll,
    goNextZone,
    changeMode,
    selectZone,
    toggleManualValve,
    updateZone,
    saveSchedule,
    testConnection,
  };
}
