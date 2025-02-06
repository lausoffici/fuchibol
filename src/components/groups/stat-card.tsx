import React from "react";
import { cn } from "../../lib/utils";
import { pluralize } from "../../lib/utils/format";

interface StatCardProps {
  player: {
    id: string;
    name: string;
  };
  index: number;
  value: number;
  pluralizeLabel: {
    single: string;
    plural: string;
  };
}

export function StatCard({
  player,
  index,
  value,
  pluralizeLabel,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border bg-card relative",
        index === 0 && "border-amber-500/30 bg-amber-50/30 shadow-sm",
        index === 1 && "border-zinc-400/30 bg-zinc-50/30",
        index === 2 && "border-orange-500/30 bg-orange-50/30"
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg mr-2">
          {index === 0 && "🥇"}
          {index === 1 && "🥈"}
          {index === 2 && "🥉"}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
          {player.name[0].toUpperCase()}
        </div>
        <span className="font-medium">{player.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-muted-foreground",
            index === 0 && "text-amber-700 font-medium"
          )}
        >
          {value}{" "}
          {pluralize(value, pluralizeLabel.single, pluralizeLabel.plural)}
        </span>
      </div>
    </div>
  );
}
