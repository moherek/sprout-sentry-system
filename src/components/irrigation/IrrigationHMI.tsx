import { useState } from "react";
import { useIrrigationController } from "@/lib/irrigation/use-irrigation-controller";
import { Sidebar, type Screen } from "../Sidebar";
import { Header } from "./Header";
import { PulpitScreen } from "../screens/PulpitScreen";
import { MapScreen } from "../screens/MapScreen";
import { ScheduleScreen } from "../screens/ScheduleScreen";
import { CalendarScreen } from "../screens/CalendarScreen";
import { ManualScreen } from "../screens/ManualScreen";
import { AlarmsScreen } from "../screens/AlarmsScreen";
import { HistoryScreen } from "../screens/HistoryScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { AlarmBanner } from "./AlarmBanner";

export function IrrigationHMI() {
  const hmi = useIrrigationController();
  const [activeScreen, setActiveScreen] = useState<Screen>("dashboard");

  const screenTitles: Record<Screen, { title: string; subtitle: string }> = {
    dashboard: {
      title: "Pulpit",
      subtitle: "Główny widok operatorski",
    },
    map: {
      title: "Mapa nawadniania",
      subtitle: "Rzut działki i strefy podlewania",
    },
    schedule: {
      title: "Harmonogram podlewania",
      subtitle: "Programy, dni tygodnia i godziny startu",
    },
    calendar: {
      title: "Kalendarz podlewania",
      subtitle: "Widok tygodniowy z harmonogramem",
    },
    manual: {
      title: "Sterowanie ręczne",
      subtitle: "Ręczne otwieranie zaworów i testy",
    },
    alarms: {
      title: "Alarmy",
      subtitle: "Aktywne alarmy i historia zdarzeń",
    },
    history: {
      title: "Historia",
      subtitle: "Logi systemowe i historia podlewania",
    },
    settings: {
      title: "Ustawienia",
      subtitle: "Konfiguracja systemu i diagnostyka",
    },
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case "dashboard":
        return <PulpitScreen hmi={hmi} />;
      case "map":
        return <MapScreen hmi={hmi} />;
      case "schedule":
        return <ScheduleScreen hmi={hmi} />;
      case "calendar":
        return <CalendarScreen hmi={hmi} />;
      case "manual":
        return <ManualScreen hmi={hmi} />;
      case "alarms":
        return <AlarmsScreen hmi={hmi} />;
      case "history":
        return <HistoryScreen hmi={hmi} />;
      case "settings":
        return <SettingsScreen hmi={hmi} />;
      default:
        return <PulpitScreen hmi={hmi} />;
    }
  };

  const currentScreen = screenTitles[activeScreen];

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Sidebar */}
      <Sidebar activeScreen={activeScreen} onScreenChange={setActiveScreen} />

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="w-full space-y-4 md:space-y-6 p-4 md:p-6">
          <Header hmi={hmi} screenTitle={currentScreen.title} screenSubtitle={currentScreen.subtitle} />
          <AlarmBanner hmi={hmi} />
          {renderScreen()}
        </div>
      </main>
    </div>
  );
}
