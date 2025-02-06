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
        "space-y-2.5 p-4 rounded-lg border transition-all",
        isWinner
          ? "border-emerald-200/70 bg-emerald-50/80 shadow-[0_0_0_1px_rgba(16,185,129,0.1)] hover:shadow-[0_0_0_1px_rgba(16,185,129,0.2)]"
          : winningTeam === null
          ? "border-zinc-200/70 bg-zinc-50/80 hover:border-zinc-300/70"
          : "border-zinc-200/50 bg-zinc-100/50 hover:border-zinc-200/70"
      )}
    >
      <div className="flex items-center justify-between w-full">
        <h4 className="font-semibold text-base text-zinc-900">Equipo {team}</h4>
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
      <div className="space-y-1.5 mt-1">
        {players.map((player) => (
          <div
            key={player.id}
            className={cn(
              "text-sm flex items-center gap-2.5 px-2 py-1 -mx-2 rounded-md relative",
              mvp?.id === player.id && "font-medium"
            )}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-xs text-zinc-600 font-medium shrink-0">
              {player.name[0].toUpperCase()}
            </div>
            {player.name}
            {mvp?.id === player.id && <MvpBadge />}
          </div>
        ))}
      </div>
    </div>
  );
}
