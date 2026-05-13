import type { IrrigationController } from "@/lib/irrigation/use-irrigation-controller";
import { AreaBadge } from "./primitives";
import { IrrigationZone, ZONE_SHAPES } from "./IrrigationZone";

function Shrubs() {
  const top = Array.from({ length: 24 }, (_, i) => ({
    x: 120 + i * 38,
    y: 72 + Math.sin(i) * 3,
    r: 7 + (i % 4),
  }));
  const right = Array.from({ length: 9 }, (_, i) => ({
    x: 1058,
    y: 88 + i * 33,
    r: 7 + (i % 3),
  }));
  const bottom = Array.from({ length: 18 }, (_, i) => ({
    x: 500 + i * 31,
    y: 368 + Math.sin(i) * 5,
    r: 6 + (i % 3),
  }));
  const left = Array.from({ length: 10 }, (_, i) => ({
    x: 112,
    y: 88 + i * 29,
    r: 7 + (i % 4),
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
          strokeWidth="2"
        />
      ))}
    </g>
  );
}

export function SiteMap({ hmi }: { hmi: IrrigationController }) {
  const isActive = (id: number) =>
    hmi.activeZoneId === id || !!hmi.zones.find((z) => z.id === id)?.valveOpen;

  return (
    <section className="rounded-2xl md:rounded-3xl bg-surface border border-border p-3 md:p-5 shadow-2xl overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 mb-4">
        <div>
          <p className="text-primary text-xs md:text-sm font-semibold tracking-widest uppercase">
            Mapa nawadniania
          </p>
          <h2 className="text-xl md:text-2xl font-semibold mt-1">
            Rzut działki i strefy podlewania
          </h2>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Kliknij strefę na mapie, żeby wybrać sekcję. Na telefonie przesuń mapę palcem w bok.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 md:gap-3 text-xs md:text-sm w-full lg:w-auto">
          <AreaBadge label="Działka" value="17 a" sub="1700 m²" />
          <AreaBadge label="Ogród" value="ok. 12 a" sub="1200 m²" />
          <AreaBadge label="Dom" value="101 m²" sub="z rzutu" />
        </div>
      </div>

      <div className="relative rounded-2xl md:rounded-3xl bg-surface-deep border border-border p-2 md:p-4 overflow-x-auto overflow-y-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(143,214,173,0.10),transparent_42%)]" />

        <svg viewBox="0 0 1200 500" className="relative w-[920px] max-w-none md:w-full h-auto select-none">
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

          <g transform="translate(48 42)">
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
            <text x="292" y="165" fill="rgba(245,245,247,0.95)" fontSize="28" fontWeight="800" textAnchor="middle">
              Dom
            </text>

            <rect x="370" y="160" width="58" height="60" rx="6" fill="rgba(130,92,58,0.62)" stroke="rgba(217,189,124,0.35)" />
            <text x="399" y="195" fill="rgba(240,221,169,0.90)" fontSize="14" textAnchor="middle">
              taras
            </text>
            <rect x="520" y="265" width="86" height="68" rx="5" fill="rgba(14,20,28,0.98)" stroke="rgba(245,245,247,0.88)" strokeWidth="3" />

            <text x="260" y="303" fill="rgba(245,245,247,0.90)" fontSize="25" fontWeight="800" textAnchor="middle">
              Podjazd
            </text>
            <text x="805" y="150" fill="rgba(201,242,216,0.92)" fontSize="34" fontWeight="800" textAnchor="middle">
              Ogród
            </text>
            <Shrubs />
          </g>
        </svg>
      </div>
    </section>
  );
}
