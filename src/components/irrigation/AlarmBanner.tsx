import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";

export function AlarmBanner({ hmi }: { hmi: IrrigationController }) {
  if (!hmi.alarm) return null;
  return (
    <div
      role="alert"
      className="rounded-2xl bg-destructive/15 border border-destructive/40 p-4 flex items-center justify-between"
    >
      <div>
        <p className="font-semibold text-destructive-foreground/90 text-sm tracking-wider">
          ALARM
        </p>
        <p className="text-foreground mt-0.5">{hmi.alarm}</p>
      </div>
      <button
        onClick={() => hmi.setAlarm(null)}
        className="rounded-xl bg-destructive px-4 py-2 font-semibold text-destructive-foreground hover:brightness-110 transition"
      >
        Kasuj
      </button>
    </div>
  );
}
