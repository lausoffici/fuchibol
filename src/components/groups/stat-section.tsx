import { type ReactNode } from "react";
import { StatCard } from "./stat-card";
import { PlayerStat } from "../../types/stats";
import React from "react";

interface StatSectionProps {
  icon: ReactNode;
  title: string;
  stats: PlayerStat[];
  getValue: (stat: PlayerStat) => number;
  pluralizeLabel: {
    single: string;
    plural: string;
  };
}

export function StatSection({
  icon,
  title,
  stats,
  getValue,
  pluralizeLabel,
}: StatSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
        {icon}
        {title}
      </h3>
      <div className="space-y-2">
        {stats.map((stat, i) => (
          <StatCard
            key={stat.player.id}
            player={stat.player}
            index={i}
            value={getValue(stat)}
            pluralizeLabel={pluralizeLabel}
          />
        ))}
      </div>
    </div>
  );
}
