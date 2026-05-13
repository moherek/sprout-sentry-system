export type Screen = "dashboard" | "map" | "schedule" | "calendar" | "manual" | "alarms" | "history" | "settings";

interface SidebarProps {
  activeScreen?: Screen;
  onScreenChange?: (screen: Screen) => void;
}

const menuItems: Array<{ id: Screen; label: string; icon: string }> = [
  { id: "dashboard", label: "Pulpit", icon: "⌂" },
  { id: "map", label: "Mapa nawadniania", icon: "🗺" },
  { id: "schedule", label: "Harmonogram", icon: "📅" },
  { id: "calendar", label: "Kalendarz", icon: "📆" },
  { id: "manual", label: "Manual", icon: "ℹ" },
  { id: "alarms", label: "Alarmy", icon: "⚠" },
  { id: "history", label: "Historia", icon: "⏱" },
  { id: "settings", label: "Ustawienia", icon: "⚙" },
];

export function Sidebar({ activeScreen = "dashboard", onScreenChange }: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-80 flex-shrink-0 bg-surface border-r border-border">
      {/* Logo Section */}
      <div className="h-20 border-b border-border px-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-lg font-bold">
          🌱
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-primary">GARDEN CONTROL</span>
          <span className="text-xs text-muted-foreground">HMI</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onScreenChange?.(item.id)}
              className={`w-full relative px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                isActive
                  ? "text-foreground bg-white/[0.04]"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.02]"
              }`}
            >
              {/* Active Left Border */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md" />
              )}

              {/* Icon */}
              <span className="text-xl flex-shrink-0 w-5 h-5 flex items-center justify-center">
                {item.icon}
              </span>

              {/* Label */}
              <span className="text-sm font-medium text-left flex-1">
                {item.label}
              </span>

              {/* Active Indicator Dot */}
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Status Section */}
      <div className="px-4 py-4 border-t border-border space-y-3">
        {/* Status Items */}
        <div className="space-y-2 text-xs">
          {/* Online Status */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">Online</span>
          </div>

          {/* PLC Status */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">PLC: OK</span>
          </div>

          {/* Node-RED Status */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Node-RED: OK</span>
          </div>
        </div>

        {/* Close Menu Button */}
        <button className="w-full mt-4 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.04] flex items-center gap-2 transition-all">
          <span>◀</span>
          <span>Zwiń menu</span>
        </button>
      </div>
    </aside>
  );
}
