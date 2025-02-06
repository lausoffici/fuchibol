import { cn } from "@/lib/utils";
import { Player } from "@prisma/client";
import {
  WinnerBadge,
  LoserBadge,
  GoalDiffBadge,
  DrawBadge,
  MvpBadge,
  LevelBadge,
} from "../badges";
import { getTeamAverageSkill } from "@/lib/utils/format";

interface TeamCardProps {
  team: "A" | "B";
  players: Player[];
  winningTeam: string | null;
  scoreDiff?: number | null;
  mvp?: Player | null;
}

export function TeamCard({
  team,
  players,
  winningTeam,
  scoreDiff,
  mvp,
}: TeamCardProps) {
  const isWinner = winningTeam === team;
  const isLoser = winningTeam !== null && winningTeam !== team;

  return (
    <div
      className={cn(
        "space-y-2 p-3 rounded-lg",
        isWinner
          ? "bg-emerald-100 border-2 border-emerald-300 shadow-sm"
          : winningTeam === null
          ? "bg-zinc-50 border-2 border-zinc-200"
          : "bg-muted/50"
      )}
    >
      <div className="flex items-center justify-between w-full">
        <h4 className="font-medium">Equipo {team}</h4>
        <div className="flex items-center gap-1.5">
          {winningTeam === null && <DrawBadge />}
          {isWinner && <WinnerBadge />}
          {isLoser && <LoserBadge />}
          {scoreDiff && winningTeam === team && (
            <GoalDiffBadge diff={scoreDiff} isWinner={true} />
          )}
          {scoreDiff && winningTeam !== team && winningTeam !== null && (
            <GoalDiffBadge diff={scoreDiff} isWinner={false} />
          )}
          <LevelBadge level={getTeamAverageSkill(players)} showDecimals short />
        </div>
      </div>
      <div className="space-y-1">
        {players.map((player) => (
          <div
            key={player.id}
            className={cn(
              "text-sm flex items-center gap-1.5",
              mvp?.id === player.id && "font-medium"
            )}
          >
            {player.name}
            {mvp?.id === player.id && <MvpBadge />}
          </div>
        ))}
      </div>
    </div>
  );
}
