"use client";

interface IdeologyChartProps {
  scores: Record<string, number>;
  color?: string;
  size?: "sm" | "md" | "lg";
}

const AXIS_LABELS: Record<string, string> = {
  longevity: "Longevity",
  decentralization: "Decentral",
  builderCurator: "Builder",
  socialSolo: "Social",
  riskTolerance: "Risk",
};

export function IdeologyChart({
  scores,
  color = "#6366f1",
  size = "md",
}: IdeologyChartProps) {
  const dimensions = {
    sm: { width: 150, height: 130, fontSize: 9 },
    md: { width: 280, height: 240, fontSize: 11 },
    lg: { width: 380, height: 340, fontSize: 13 },
  };
  const { width, height, fontSize } = dimensions[size];
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.35;

  const entries = Object.entries(scores);
  const n = entries.length;

  // Compute polygon points for data and grid rings
  const angle = (i: number) => -Math.PI / 2 + (i / n) * 2 * Math.PI;

  const dataPoints = entries
    .map(([, v], i) => {
      const r = (radius * Math.max(0, Math.min(10, v))) / 10;
      return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
    })
    .map((p) => p.join(","))
    .join(" ");

  const ringFor = (frac: number) =>
    Array.from({ length: n })
      .map((_, i) => {
        const r = radius * frac;
        return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))].join(
          ","
        );
      })
      .join(" ");

  const labelOffset = radius + (size === "sm" ? 12 : 18);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon
          key={f}
          points={ringFor(f)}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={0.5}
        />
      ))}
      {/* Axes */}
      {entries.map(([k], i) => (
        <line
          key={k}
          x1={cx}
          y1={cy}
          x2={cx + radius * Math.cos(angle(i))}
          y2={cy + radius * Math.sin(angle(i))}
          stroke="hsl(var(--border))"
          strokeWidth={0.5}
        />
      ))}
      {/* Data polygon */}
      <polygon
        points={dataPoints}
        fill={color}
        fillOpacity={0.2}
        stroke={color}
        strokeWidth={2}
      />
      {/* Labels */}
      {entries.map(([k], i) => {
        const x = cx + labelOffset * Math.cos(angle(i));
        const y = cy + labelOffset * Math.sin(angle(i));
        return (
          <text
            key={k}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={fontSize}
            fill="hsl(var(--muted-foreground))"
          >
            {AXIS_LABELS[k] || k}
          </text>
        );
      })}
    </svg>
  );
}
