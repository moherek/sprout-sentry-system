import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";
import { SiteMap } from "../irrigation/SiteMap";
import { ControlPanel } from "../irrigation/ControlPanel";
import { SystemStatus } from "../irrigation/SystemStatus";
import { ZoneCards } from "../irrigation/ZoneCards";

interface PulpitScreenProps {
  hmi: IrrigationController;
}

export function PulpitScreen({ hmi }: PulpitScreenProps) {
  return (
    <div className="space-y-4 md:space-y-6">
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

      <ZoneCards hmi={hmi} />
    </div>
  );
}
