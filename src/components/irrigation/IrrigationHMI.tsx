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
         
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        <div className="xl:col-span-8">
          <SiteMap hmi={hmi} />
        </div>

        <div className="xl:col-span-4 flex flex-col gap-5">
           <div className="flex-1">
          <ControlPanel hmi={hmi} />  
        </div>
         <div className="flex-1">
          <SystemStatus hmi={hmi} />
        </div>
    
    </div>

    </div>
        <SettingsPanel hmi={hmi} />
        <ZoneCards hmi={hmi} />
        <SchedulePanel hmi={hmi} />
        <DiagnosticsPanel hmi={hmi} />
    </div>
    </main>
  );
}
