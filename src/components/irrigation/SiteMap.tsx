import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";
import { IrrigationZone, ZONE_SHAPES } from "./IrrigationZone";

function Shrubs() {
  const top = Array.from({ length: 24 }, (_, i) => ({
    x: 120 + i * 38,
    y: 72 + Math.sin(i) * 3,
    r: 4.5 + (i % 3),
  }));
  const right = Array.from({ length: 9 }, (_, i) => ({
    x: 1058,
    y: 88 + i * 33,
    r: 4.5 + (i % 2),
  }));
  const bottom = Array.from({ length: 18 }, (_, i) => ({
    x: 500 + i * 31,
    y: 368 + Math.sin(i) * 5,
    r: 4 + (i % 2),
  }));
  const left = Array.from({ length: 10 }, (_, i) => ({
    x: 112,
    y: 88 + i * 29,
    r: 4.5 + (i % 3),
  }));
  const all = [...top, ...right, ...bottom, ...left];
  return (
    <g pointerEvents="none">
      {all.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill="rgba(143,214,173,0.34)"
          stroke="rgba(143,214,173,0.56)"
          strokeWidth="1.5"
        />
      ))}
    </g>
  );
}

export function SiteMap({ hmi }: { hmi: IrrigationController }) {
  const isActive = (id: number) =>
    hmi.activeZoneId === id;
 const isWatering = (id: number) =>
  !!hmi.zones.find((z) => z.id === id)?.valveOpen;

  return (
    <section className="rounded-2xl md:rounded-3xl bg-surface border border-border p-2 md:p-3 shadow-2xl overflow-hidden">
      <div className="relative w-full aspect-[14/5] rounded-2xl md:rounded-3xl bg-surface-deep border border-border overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(143,214,173,0.10),transparent_42%)]" />

        <svg
          viewBox="100 65 1080 370"
          className="absolute inset-0 w-full h-full select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <pattern id="grass" width="18" height="18" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="4" r="1.1" fill="rgba(143,214,173,0.13)" />
              <circle cx="13" cy="11" r="1" fill="rgba(142,197,232,0.10)" />
            </pattern>
            <pattern id="paving" width="18" height="18" patternUnits="userSpaceOnUse">
              <path d="M0 9 H18 M9 0 V18" stroke="rgba(168,176,186,0.20)" strokeWidth="1" />
            </pattern>
            <filter id="plotGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#8fd6ad" floodOpacity="0.45" />
            </filter>
            <filter id="emeraldGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#8fd6ad" floodOpacity="0.75" />
            </filter>
            <filter id="cyanGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#8ec5e8" floodOpacity="0.48" />
            </filter>
            <filter id="amberGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#d9bd7c" floodOpacity="0.48" />
            </filter>
            <filter id="violetGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#b8a4d8" floodOpacity="0.48" />
            </filter>
          </defs>

          <g>
            <rect
              x="95"
              y="55"
              width="980"
              height="330"
              fill="rgba(15,23,32,0.96)"
              stroke="rgba(143,214,173,0.88)"
              strokeWidth="5"
              filter="url(#plotGlow)"
            />
            <rect x="95" y="55" width="980" height="330" fill="url(#grass)" opacity="0.78" />

            {ZONE_SHAPES.map((shape) => (
              <IrrigationZone
                key={shape.id}
                shape={shape}
                active={isActive(shape.id)}
                watering={isWatering(shape.id)}
                onSelect={() => hmi.selectZone(shape.id)}
              />
            ))}

            <rect x="95" y="255" width="415" height="72" fill="url(#paving)" opacity="0.58" />
            <rect x="240" y="155" width="150" height="100" fill="url(#paving)" opacity="0.42" />
            <rect x="95" y="245" width="70" height="140" fill="url(#paving)" opacity="0.38" />

            <path
              d="M210 105 H370 V200 H310 V225 H255 V200 H210 Z"
              fill="rgba(14,20,28,0.98)"
              stroke="rgba(245,245,247,0.92)"
              strokeWidth="4"
            />
            <text x="292" y="165" fill="rgba(245,245,247,0.95)" fontSize="20" fontWeight="800" textAnchor="middle">
              Dom
            </text>

            <rect x="370" y="160" width="58" height="60" rx="6" fill="rgba(130,92,58,0.62)" stroke="rgba(217,189,124,0.35)" />
            <text x="399" y="195" fill="rgba(240,221,169,0.90)" fontSize="14" textAnchor="middle">
              taras
            </text>
            <rect x="520" y="265" width="86" height="68" rx="5" fill="rgba(14,20,28,0.98)" stroke="rgba(245,245,247,0.88)" strokeWidth="3" />
            <Shrubs />
          </g>
        </svg>
      </div>
    </section>
  );
}
