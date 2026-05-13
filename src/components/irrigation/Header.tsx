import { useEffect, useState } from "react";
import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";
import { cn } from "@/lib/utils";

interface HeaderProps {
  hmi: IrrigationController;
  screenTitle?: string;
  screenSubtitle?: string;
}

export function Header({ hmi, screenTitle, screenSubtitle }: HeaderProps) {

    const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const date = now.toLocaleDateString("pl-PL");
return (
  <header className="flex items-start justify-between gap-4">
    <div>
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
        {screenTitle || "Sterowanie nawadnianiem"}
      </h1>

      <p className="text-muted-foreground mt-1 text-sm md:text-base">
        {screenSubtitle || "Panel operatorski · Node-RED / PLC / Web"}
      </p>
    </div>

    <div className="flex items-center gap-3">
      <div className="text-right min-w-[105px]">
        <div className="text-xs text-muted-foreground">{date}</div>
        <div className="text-lg font-semibold tabular-nums">{time}</div>
      </div>

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
