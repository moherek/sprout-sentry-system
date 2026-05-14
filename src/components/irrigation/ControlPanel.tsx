import { useState } from "react";
import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";
import type { Mode } from "@/lib/irrigation/types";
import { ActionButton } from "./primitives";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const MODES: Mode[] = ["AUTO", "MANUAL"];

export function ControlPanel({ hmi }: { hmi: IrrigationController }) {
  const [selectedProgramId, setSelectedProgramId] = useState<string>("");
  const enabledPrograms = hmi.programs.filter((p) => p.enabled);

  const handleStartProgram = () => {
    if (selectedProgramId) {
      hmi.executeProgram(selectedProgramId);
      setSelectedProgramId("");
    }
  };

  return (
    <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-3">
      <p className="text-muted-foreground text-sm mb-2">Tryb pracy</p>

      <div className="grid grid-cols-2 gap-2">
        {MODES.map((m) => (
          <button
            key={m}
            onClick={() => hmi.changeMode(m)}
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-semibold transition",
              hmi.mode === m
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-white/[0.06] text-foreground hover:bg-white/10",
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-2">
        {/* Standard AUTO START */}
        <ActionButton onClick={hmi.startCycle} variant="start">
          ▶ Start cyklu
        </ActionButton>

        {/* Program selector (if programs exist) */}
        {enabledPrograms.length > 0 && (
          <>
            <Select value={selectedProgramId} onValueChange={setSelectedProgramId}>
              <SelectTrigger className="h-auto bg-white/[0.06] border-none text-sm">
                <SelectValue placeholder="Wybierz program..." />
              </SelectTrigger>
              <SelectContent>
                {enabledPrograms.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedProgramId && (
              <ActionButton onClick={handleStartProgram} variant="start">
                ▶ Uruchom program
              </ActionButton>
            )}
          </>
        )}

        <ActionButton onClick={hmi.programExecution.programId ? hmi.goNextProgramSection : hmi.goNextZone} disabled={!hmi.running}>
          Następna sekcja
        </ActionButton>
        <ActionButton onClick={hmi.stopAll} variant="stop">
          ■ Stop
        </ActionButton>
      </div>
    </div>
  );
}
