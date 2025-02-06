import { GroupWithDetails } from "../../types";
import { PlayerStats } from "../../types/stats";

export function getPlayerStats(group: GroupWithDetails): PlayerStats {
  const stats = group.players.map((player) => {
    const matches =
      group.matches?.filter(
        (m) =>
          m.teamAPlayers.some((p) => p.id === player.id) ||
          m.teamBPlayers.some((p) => p.id === player.id)
      ).length ?? 0;

    const wins =
      group.matches?.filter((m) => {
        const isTeamA = m.teamAPlayers.some((p) => p.id === player.id);
        return (
          (isTeamA && m.winningTeam === "A") ||
          (!isTeamA && m.winningTeam === "B")
        );
      }).length ?? 0;

    const losses =
      group.matches?.filter((m) => {
        const isTeamA = m.teamAPlayers.some((p) => p.id === player.id);
        return (
          (isTeamA && m.winningTeam === "B") ||
          (!isTeamA && m.winningTeam === "A")
        );
      }).length ?? 0;

    const mvps =
      group.matches?.filter((m) => m.mvp?.id === player.id).length ?? 0;

    return { player, matches, mvps, wins, losses };
  });

  return {
    mostMatches: [...stats].sort((a, b) => b.matches - a.matches).slice(0, 3),
    mostMvps: [...stats].sort((a, b) => b.mvps - b.mvps).slice(0, 3),
    mostWins: [...stats].sort((a, b) => b.wins - b.wins).slice(0, 3),
    mostLosses: [...stats].sort((a, b) => b.losses - b.losses).slice(0, 3),
  };
}
