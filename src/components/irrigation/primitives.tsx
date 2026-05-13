import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-black/25 p-3 md:p-4">
      <p className="text-muted-foreground text-xs md:text-sm">{label}</p>
      <p className="text-lg md:text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-black/20 p-3">
      <p className="text-muted-foreground/80 text-xs">{label}</p>
      <p className="font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export function StatusRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex justify-between items-center rounded-2xl bg-surface-deep border border-border p-3">
      <div className="flex items-center gap-3 text-muted-foreground">
        <span className="w-5 text-center text-lg">{icon}</span>
        <span>{label}</span>
      </div>
      <span className="font-semibold text-foreground tabular-nums">{value}</span>
    </div>
  );
}

export function SettingCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-deep border border-border p-4">
      <p className="text-muted-foreground text-sm">{title}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}

export function AreaBadge({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl md:rounded-2xl bg-surface-deep border border-border px-3 md:px-4 py-2 md:py-3">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="text-base md:text-lg font-semibold">{value}</p>
      <p className="text-muted-foreground/70 text-xs">{sub}</p>
    </div>
  );
}

type ActionVariant = "default" | "start" | "stop";

export function ActionButton({
  children,
  onClick,
  disabled = false,
  variant = "default",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: ActionVariant;
}) {
  const styles: Record<ActionVariant, string> = {
    start:
      "bg-primary text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/25",
    stop:
      "bg-destructive text-destructive-foreground hover:brightness-110 shadow-lg shadow-destructive/20",
    default:
      "bg-white/[0.06] text-foreground hover:bg-white/10 disabled:opacity-40",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
className={cn(
  "w-full rounded-xl py-2 text-sm font-medium flex justify-center items-center gap-2 transition disabled:cursor-not-allowed",
  styles[variant],
)}
    >
      {children}
    </button>
  );
}
