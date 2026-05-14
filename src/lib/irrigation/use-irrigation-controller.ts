import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_ZONES, type Mode, type Zone, type Program, type ProgramExecution } from "./types";
import { DEFAULT_PROGRAMS } from "./program-defaults";
import {
  calculateTotalDuration,
  deserializePrograms,
  generateProgramId,
  generateSectionId,
  serializePrograms,
  validateProgram,
} from "./program-utils";

export interface IrrigationController {
  zones: Zone[];
  programs: Program[];
  programExecution: ProgramExecution;
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
  goNextProgramSection: () => void;
  changeMode: (mode: Mode) => void;
  selectZone: (zoneId: number) => void;
  toggleManualValve: (zoneId: number) => void;
  updateZone: (zoneId: number, field: keyof Zone, value: string | number | boolean) => void;
  saveSchedule: () => void;
  testConnection: () => void;
  addProgram: (program: Program) => void;
  updateProgram: (programId: string, updates: Partial<Program>) => void;
  deleteProgram: (programId: string) => void;
  executeProgram: (programId: string, startTimeOverride?: string) => void;
  stopProgram: () => void;
  savePrograms: () => void;
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

  // Programs state with localStorage persistence
  const [programs, setPrograms] = useState<Program[]>(() => {
    try {
      const stored = localStorage.getItem("irrigation-programs");
      if (stored) {
        const deserialized = deserializePrograms(stored);
        return deserialized.length > 0 ? deserialized : DEFAULT_PROGRAMS;
      }
    } catch {
      console.error("Failed to load programs from localStorage");
    }
    return DEFAULT_PROGRAMS;
  });

  const [programExecution, setProgramExecution] = useState<ProgramExecution>({
    programId: null,
    currentSectionIndex: 0,
    remainingSec: 0,
    status: "idle",
  });

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

  // Persist programs to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem("irrigation-programs", serializePrograms(programs));
    } catch {
      console.error("Failed to save programs to localStorage");
    }
  }, [programs]);

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
       prev.map((item) =>
        item.id === zoneId
       ? { ...item, valveOpen: shouldOpen }
         : item
          )
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

  // Program management methods
  const addProgram = useCallback(
    (newProgram: Program) => {
      const program: Program = {
        ...newProgram,
        id: newProgram.id || generateProgramId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const validation = validateProgram(program);
      if (!validation.valid) {
        setAlarm(`Błąd programu: ${validation.errors[0]}`);
        addLog(`ERROR: Invalid program - ${validation.errors[0]}`);
        return;
      }

      setPrograms((prev) => [...prev, program]);
      addLog(`Program "${program.name}" dodany`);
    },
    [addLog],
  );

  const updateProgram = useCallback(
    (programId: string, updates: Partial<Program>) => {
      setPrograms((prev) =>
        prev.map((p) => {
          if (p.id !== programId) return p;
          const updated: Program = { ...p, ...updates, updatedAt: Date.now() };

          const validation = validateProgram(updated);
          if (!validation.valid) {
            setAlarm(`Błąd programu: ${validation.errors[0]}`);
            addLog(`ERROR: Invalid program update - ${validation.errors[0]}`);
            return p;
          }

          addLog(`Program "${updated.name}" zaktualizowany`);
          return updated;
        }),
      );
    },
    [addLog],
  );

  const deleteProgram = useCallback(
    (programId: string) => {
      setPrograms((prev) => {
        const program = prev.find((p) => p.id === programId);
        const updated = prev.filter((p) => p.id !== programId);
        if (program) {
          addLog(`Program "${program.name}" usunięty`);
        }
        return updated;
      });

      // If deleted program was running, stop it
      if (programExecution.programId === programId) {
        stopProgram();
      }
    },
    [programExecution.programId, addLog],
  );

  const executeProgram = useCallback(
    (programId: string, startTimeOverride?: string) => {
      const program = programs.find((p) => p.id === programId);
      if (!program) {
        setAlarm("Program nie znaleziony");
        return;
      }

      if (!program.enabled) {
        setAlarm("Program jest wyłączony");
        return;
      }

      const enabledSections = program.sections.filter((s) => s.enabled);
      if (enabledSections.length === 0) {
        setAlarm("Program nie ma włączonych sekcji");
        return;
      }

      // Start the program execution
      const startTime = startTimeOverride || program.startTimes[0] || "00:00";
      setProgramExecution({
        programId: program.id,
        startTime,
        currentSectionIndex: 0,
        remainingSec: calculateTotalDuration(program) * 60,
        status: "running",
      });

      setMode("AUTO");
      setRunning(true);
      setAlarm(null);

      // Open first section's zone
      const firstSection = enabledSections[0];
      openOnlyZone(firstSection.zoneId);

      sendCommand("EXECUTE_PROGRAM", {
        programId: program.id,
        programName: program.name,
        totalSections: enabledSections.length,
        totalDurationMin: calculateTotalDuration(program),
      });

      addLog(`Program "${program.name}" uruchomiony (${enabledSections.length} sekcji, ${calculateTotalDuration(program)} min)`);
    },
    [programs, openOnlyZone, sendCommand, addLog],
  );

  const stopProgram = useCallback(() => {
    if (programExecution.programId) {
      const program = programs.find((p) => p.id === programExecution.programId);
      if (program) {
        addLog(`Program "${program.name}" zatrzymany`);
      }
    }

    setProgramExecution({
      programId: null,
      currentSectionIndex: 0,
      remainingSec: 0,
      status: "idle",
    });

    setRunning(false);
    setRemainingSec(0);
    closeAllValves();
    sendCommand("STOP_PROGRAM");
  }, [programExecution.programId, programs, closeAllValves, sendCommand, addLog]);

  const goNextProgramSection = useCallback(() => {
    if (!programExecution.programId) {
      // No program running, fall back to regular zone advancement
      goNextZone();
      return;
    }

    const program = programs.find((p) => p.id === programExecution.programId);
    if (!program) {
      setAlarm("Program nie znaleziony podczas wykonywania");
      stopProgram();
      return;
    }

    const enabledSections = program.sections.filter((s) => s.enabled);
    const nextSectionIndex = programExecution.currentSectionIndex + 1;

    if (nextSectionIndex >= enabledSections.length) {
      // Program finished
      addLog(`Program "${program.name}" zakończony`);
      stopProgram();
      return;
    }

    // Advance to next section
    const nextSection = enabledSections[nextSectionIndex];
    setProgramExecution((prev) => ({
      ...prev,
      currentSectionIndex: nextSectionIndex,
    }));

    setActiveZoneId(nextSection.zoneId);
    setRemainingSec(nextSection.durationMin * 60);
    openOnlyZone(nextSection.zoneId);

    sendCommand("PROGRAM_NEXT_SECTION", {
      programId: program.id,
      sectionIndex: nextSectionIndex,
      zoneId: nextSection.zoneId,
      durationMin: nextSection.durationMin,
    });

    addLog(`Program "${program.name}": sekcja ${nextSectionIndex + 1}/${enabledSections.length} (${nextSection.durationMin} min)`);
  }, [programExecution, programs, goNextZone, setAlarm, stopProgram, setActiveZoneId, setRemainingSec, openOnlyZone, sendCommand, addLog]);

  const savePrograms = useCallback(() => {
    sendCommand("SAVE_PROGRAMS", {
      programs: programs.map((p) => ({
        id: p.id,
        name: p.name,
        enabled: p.enabled,
        weekdays: p.weekdays,
        startTimes: p.startTimes,
        sectionCount: p.sections.length,
        totalDurationMin: calculateTotalDuration(p),
      })),
    });
    addLog("Programy zsynchronizowane z Node-RED");
  }, [programs, sendCommand, addLog]);

  return {
    zones,
    programs,
    programExecution,
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
    goNextProgramSection,
    changeMode,
    selectZone,
    toggleManualValve,
    updateZone,
    saveSchedule,
    testConnection,
    addProgram,
    updateProgram,
    deleteProgram,
    executeProgram,
    stopProgram,
    savePrograms,
  };
}
