import { useIrrigationController } from "@/lib/irrigation/use-irrigation-controller";
import { Header } from "./Header";
import { AlarmBanner } from "./AlarmBanner";
import { SiteMap } from "./SiteMap";
import { ActiveZoneCard } from "./ActiveZoneCard";
import { ControlPanel } from "./ControlPanel";
import { SystemStatus } from "./SystemStatus";
import { SettingsPanel } from "./SettingsPanel";
import { ZoneCards } from "./ZoneCards";
import { SchedulePanel } from "./SchedulePanel";
import { DiagnosticsPanel } from "./DiagnosticsPanel";

export function IrrigationHMI() {
  const hmi = useIrrigationController();

  return (
    <main className="min-h-screen bg-background text-foreground p-3 md:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        <Header hmi={hmi} />
        <AlarmBanner hmi={hmi} />
        <SiteMap hmi={hmi} />

        <section className="grid grid-cols-1 lg:grid-cols-4 gap-3 md:gap-5">
          <ActiveZoneCard hmi={hmi} />
          <ControlPanel hmi={hmi} />
          <SystemStatus hmi={hmi} />
        </section>

        <SettingsPanel hmi={hmi} />
        <ZoneCards hmi={hmi} />
        <SchedulePanel hmi={hmi} />
        <DiagnosticsPanel hmi={hmi} />
      </div>
    </main>
  );
}
