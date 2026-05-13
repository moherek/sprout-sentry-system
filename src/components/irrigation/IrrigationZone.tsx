import type { ZoneColor } from "@/lib/irrigation/types";

const PALETTE: Record<
  ZoneColor,
  { fill: string; activeFill: string; stroke: string; text: string; filter: string }
> = {
  cyan: {
    fill: "rgba(142,197,232,0.16)",
    activeFill: "rgba(142,197,232,0.28)",
    stroke: "#8ec5e8",
    text: "#c6e1f3",
    filter: "url(#cyanGlow)",
  },
  emerald: {
    fill: "rgba(143,214,173,0.16)",
    activeFill: "rgba(143,214,173,0.30)",
    stroke: "#8fd6ad",
    text: "#c9f2d8",
    filter: "url(#emeraldGlow)",
  },
  amber: {
    fill: "rgba(217,189,124,0.16)",
    activeFill: "rgba(217,189,124,0.28)",
    stroke: "#d9bd7c",
    text: "#f0dda9",
    filter: "url(#amberGlow)",
  },
  violet: {
    fill: "rgba(184,164,216,0.16)",
    activeFill: "rgba(184,164,216,0.28)",
    stroke: "#b8a4d8",
    text: "#e0d5ef",
    filter: "url(#violetGlow)",
  },
};

interface ZoneShape {
  id: number;
  color: ZoneColor;
  d: string;
  labelX: number;
  labelY: number;
  label: string;
  bigLabel?: string;
}

const SHAPES: ZoneShape[] = [
  {
    id: 1,
    color: "cyan",
    d: "M380 55 H565 V170 C535 198 480 205 405 198 L405 145 H380 Z",
    labelX: 475,
    labelY: 130,
    label: "Sekcja 1",
  },
  {
    id: 2,
    color: "emerald",
    d: "M565 55 H1075 V305 H920 C820 305 745 275 640 260 C570 250 530 235 520 205 C545 195 560 178 565 155 Z",
    labelX: 805,
    labelY: 165,
    label: "Sekcja 2",
  },
  {
    id: 3,
    color: "amber",
    d: "M520 260 C600 260 680 290 775 310 C850 326 945 330 1075 325 V385 H570 V335 H520 Z",
    labelX: 730,
    labelY: 335,
    label: "Sekcja 3",
  },
  {
    id: 4,
    color: "violet",
    d: "M95 240 H410 C445 240 470 255 475 290 L520 305 V335 H570 V385 H95 Z",
    labelX: 260,
    labelY: 325,
    label: "Sekcja 4",
  },
];

export function IrrigationZone({
  shape,
  active,
  watering,
  onSelect,
}: {
  shape: ZoneShape;
  active: boolean;
  watering: boolean;
  onSelect: () => void;
}) {
  const p = PALETTE[shape.color];
  const { d, labelX, labelY, label, bigLabel } = shape;

  return (
    <g onClick={onSelect} className="cursor-pointer">
{watering && (
  <g pointerEvents="none">
    <circle
      cx={labelX}
      cy={labelY - 44}
      r="18"
      fill="none"
      stroke="#38bdf8"
      strokeWidth="4"
      opacity="0.9"
    >
      <animate
        attributeName="r"
        values="18;70"
        dur="1.5s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        values="0.9;0"
        dur="1.5s"
        repeatCount="indefinite"
      />
    </circle>

        <text
      x={labelX}
      y={labelY - 36}
      fontSize="30"
      fontWeight="800"
      textAnchor="middle"
    >
      💧

      <animate
        attributeName="font-size"
        values="26;34;26"
        dur="1.6s"
        repeatCount="indefinite"
      />
    </text>
  </g>
)}

      <path
        d={d}
        fill={active ? p.activeFill : p.fill}
        stroke={p.stroke}
        strokeWidth={active ? 5 : 3}
        strokeDasharray="12 9"
        opacity={active ? 1 : 0.78}
        filter={active ? p.filter : undefined}
      />

      {bigLabel && (
        <text x={labelX} y={labelY - 2} fill={p.text} fontSize="30" fontWeight="800" textAnchor="middle">
          {bigLabel}
        </text>
      )}
      <text
        x={labelX}
        y={bigLabel ? labelY + 34 : labelY}
        fill={p.text}
        fontSize={active ? 25 : 23}
        fontWeight="700"
        textAnchor="middle"
      >
        {label}
      </text>

      {active && (
        <g pointerEvents="none">
          <rect
            x={labelX - 55}
            y={bigLabel ? labelY + 45 : labelY + 12}
            width="110"
            height="34"
            rx="17"
            fill="rgba(143,214,173,0.16)"
            stroke={p.stroke}
            strokeWidth="2"
          />
          <text
            x={labelX}
            y={bigLabel ? labelY + 68 : labelY + 35}
            fill={p.text}
            fontSize="16"
            fontWeight="800"
            textAnchor="middle"
          >
            WYBRANA
          </text>
        </g>
      )}
    </g>
  );
}

export { SHAPES as ZONE_SHAPES };
