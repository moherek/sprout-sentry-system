import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";
import type { Mode } from "@/lib/irrigation/types";
import { ActionButton } from "./primitives";
import { cn } from "@/lib/utils";

const MODES: Mode[] = ["AUTO", "MANUAL"];

export function ControlPanel({ hmi }: { hmi: IrrigationController }) {
  return (
    <div className="rounded-2xl md:rounded-3xl bg-surface border border-border p-4 md:p-6">
      <p className="text-muted-foreground text-sm mb-4">Tryb pracy</p>
      <div className="grid grid-cols-2 gap-3">
        {MODES.map((m) => (
          <button
            key={m}
            onClick={() => hmi.changeMode(m)}
            className={cn(
              "rounded-2xl p-3 md:p-4 font-semibold transition",
              hmi.mode === m
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-white/[0.06] text-foreground hover:bg-white/10",
            )}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="mt-5 md:mt-6 space-y-3">
        <ActionButton onClick={hmi.startCycle} variant="start">
          ▶ Start cyklu
        </ActionButton>
        <ActionButton onClick={hmi.goNextZone} disabled={!hmi.running}>
          Następna sekcja
        </ActionButton>
        <ActionButton onClick={hmi.stopAll} variant="stop">
          ■ Stop
        </ActionButton>
      </div>
    </div>
  );
}
