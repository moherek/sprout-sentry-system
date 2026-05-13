import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";
import type { Mode } from "@/lib/irrigation/types";
import { ActionButton } from "./primitives";
import { cn } from "@/lib/utils";

const MODES: Mode[] = ["AUTO", "MANUAL"];

export function ControlPanel({ hmi }: { hmi: IrrigationController }) {
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
