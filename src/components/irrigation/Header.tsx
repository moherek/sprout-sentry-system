import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";
import { cn } from "@/lib/utils";

export function Header({ hmi }: { hmi: IrrigationController }) {
  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
          Garden Control · HMI
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mt-1">
          Sterowanie nawadnianiem
        </h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Panel operatorski · Node-RED / PLC / Web
        </p>
      </div>

      <div className="flex flex-wrap gap-2 md:gap-3">
        <button
          onClick={hmi.testConnection}
          className="rounded-2xl bg-surface border border-border px-4 py-3 flex items-center gap-2 hover:bg-white/10 transition"
        >
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              hmi.connectionOk
                ? "bg-success shadow-[0_0_10px_currentColor]"
                : "bg-destructive",
            )}
          />
          <span className="text-sm font-medium">
            {hmi.connectionOk ? "Online" : "Offline"}
          </span>
        </button>
        <button
          onClick={() => hmi.setSettingsOpen((v) => !v)}
          className="rounded-2xl bg-surface border border-border px-4 py-3 hover:bg-white/10 transition"
          aria-label="Ustawienia"
        >
          <span className="text-xl">⚙</span>
        </button>
      </div>
    </header>
  );
}
