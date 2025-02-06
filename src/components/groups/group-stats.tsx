import { Swords } from "lucide-react";
import { WinnerBadge, LoserBadge, MvpBadge } from "../badges";
import { GroupWithDetails } from "../../types";
import { getPlayerStats } from "../../lib/utils/stats";
import { StatSection } from "./stat-section";
import React from "react";

export function GroupStats({ group }: { group: GroupWithDetails }) {
  const stats = getPlayerStats(group);

  return (
    <div className="border-t pt-8">
      <h2 className="text-2xl font-bold tracking-tight mb-6">Estadísticas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatSection
          icon={<Swords className="h-5 w-5 text-muted-foreground" />}
          title="Partidos jugados"
          stats={stats.mostMatches}
          getValue={(stat) => stat.matches}
          pluralizeLabel={{ single: "partido", plural: "partidos" }}
        />
        <StatSection
          icon={<MvpBadge className="scale-90" />}
          title="MVPs"
          stats={stats.mostMvps}
          getValue={(stat) => stat.mvps}
          pluralizeLabel={{ single: "MVP", plural: "MVPs" }}
        />
        <StatSection
          icon={<WinnerBadge className="scale-90" />}
          title="Victorias"
          stats={stats.mostWins}
          getValue={(stat) => stat.wins}
          pluralizeLabel={{ single: "victoria", plural: "victorias" }}
        />
        <StatSection
          icon={<LoserBadge className="scale-90" />}
          title="Derrotas"
          stats={stats.mostLosses}
          getValue={(stat) => stat.losses}
          pluralizeLabel={{ single: "derrota", plural: "derrotas" }}
        />
      </div>
    </div>
  );
}
