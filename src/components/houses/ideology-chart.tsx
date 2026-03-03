"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
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
  const data = Object.entries(scores).map(([key, value]) => ({
    axis: AXIS_LABELS[key] || key,
    value,
    fullMark: 10,
  }));

  const dimensions = {
    sm: { width: 150, height: 120 },
    md: { width: 300, height: 250 },
    lg: { width: 400, height: 350 },
  };

  const { width, height } = dimensions[size];

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: size === "sm" ? 10 : 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 10]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Ideology"
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
