"use client";

import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { HelpCircle, X, Shuffle, Swords } from "lucide-react";
import { Zap } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createMatch } from "@/app/actions/matches";
import { useToast } from "@/hooks/use-toast";
import { Player, Match } from "@prisma/client";
import { LevelBadge } from "@/components/badges";
import { getTeamAverageSkill } from "@/lib/utils/format";

interface CreateMatchDialogProps {
  groupId: string;
  players: Player[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matches?: (Match & {
    teamAPlayers: Player[];
    teamBPlayers: Player[];
  })[];
}

export function CreateMatchDialog({
  groupId,
  players,
  open,
  onOpenChange,
  matches = [],
}: CreateMatchDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [teamA, setTeamA] = useState<string[]>([]);
  const [teamB, setTeamB] = useState<string[]>([]);
  const [winner, setWinner] = useState<"A" | "B" | "DRAW" | "">("");
  const [scoreDiff, setScoreDiff] = useState<string>("1");
  const [mvp, setMvp] = useState<string>("");

  const getPlayerMatches = (playerId: string) => {
    return matches.filter(
      (m) =>
        m.teamAPlayers.some((p) => p.id === playerId) ||
        m.teamBPlayers.some((p) => p.id === playerId)
    ).length;
  };

  const availablePlayers = players
    .filter((p) => !teamA.includes(p.id) && !teamB.includes(p.id))
    .sort((a, b) => getPlayerMatches(b.id) - getPlayerMatches(a.id));

  const resetForm = () => {
    setTeamA([]);
    setTeamB([]);
    setWinner("");
    setScoreDiff("1");
    setMvp("");
  };

  const handleAddToTeam = (playerId: string, team: "A" | "B") => {
    if (teamA.length >= 11 || teamB.length >= 11) {
      toast({
        title: "Límite alcanzado",
        description: "No se pueden agregar más de 11 jugadores por equipo",
        variant: "destructive",
      });
      return;
    }

    // Solo permitir agregar si los equipos quedarían balanceados
    const targetTeam = team === "A" ? teamA : teamB;
    const otherTeam = team === "A" ? teamB : teamA;
    if (targetTeam.length > otherTeam.length) {
      toast({
        title: "Equipos desbalanceados",
        description: "Primero agrega un jugador al otro equipo",
        variant: "destructive",
      });
      return;
    }

    if (team === "A") {
      setTeamA([...teamA, playerId]);
    } else {
      setTeamB([...teamB, playerId]);
    }
  };

  const handleRemoveFromTeam = (playerId: string, team: "A" | "B") => {
    if (team === "A") {
      setTeamA(teamA.filter((id) => id !== playerId));
    } else {
      setTeamB(teamB.filter((id) => id !== playerId));
    }
  };

  const handleSubmit = async () => {
    if (!winner) return;

    setLoading(true);
    try {
      await createMatch({
        groupId,
        teamAPlayers: teamA,
        teamBPlayers: teamB,
        winningTeam: winner === "DRAW" ? null : winner,
        scoreDiff: parseInt(scoreDiff),
        mvpId: mvp || undefined,
      });

      toast({
        title: "Partido registrado",
        description: "El partido se ha registrado correctamente",
      });

      resetForm();
      onOpenChange(false);
    } catch {
      toast({
        title: "Error",
        description: "No se pudo registrar el partido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderTeam = (team: "A" | "B") => {
    const teamPlayers = team === "A" ? teamA : teamB;
    const teamPlayerObjects = players.filter((p) => teamPlayers.includes(p.id));
    const avgSkill = getTeamAverageSkill(teamPlayerObjects);

    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Equipo {team}</h3>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">
              {teamPlayers.length}/11
            </span>
            {avgSkill > 0 && <LevelBadge level={avgSkill} showDecimals short />}
          </div>
        </div>
        <div className="min-h-[100px] rounded-lg border bg-muted/30 p-1.5 space-y-1">
          {teamPlayerObjects.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between gap-1 rounded-md px-1.5 py-0.5 text-sm"
            >
              <span className="truncate">{player.name}</span>
              <div className="flex items-center gap-1 shrink-0">
                <span className="inline-flex items-center text-[10px] font-medium">
                  <Zap className="h-2 w-2 text-muted-foreground mr-0.5" />
                  {player.skill}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleRemoveFromTeam(player.id, team)}
                >
                  <X className="h-2.5 w-2.5" />
                </Button>
              </div>
            </div>
          ))}
          {teamPlayers.length === 0 && (
            <div className="flex h-[80px] items-center justify-center text-xs text-muted-foreground">
              Sin jugadores
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Registrar partido"
      className="sm:max-w-[500px]"
    >
      <div className="space-y-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Equipos</h3>
            <span className="text-xs text-muted-foreground">
              (hasta 11vs11)
            </span>
          </div>
          {teamA.length > 0 && teamB.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="h-7"
              onClick={() => {
                const allPlayers = [...teamA, ...teamB];
                const shuffledPlayers = allPlayers.sort(
                  () => Math.random() - 0.5
                );
                const midPoint = Math.floor(shuffledPlayers.length / 2);
                setTeamA(shuffledPlayers.slice(0, midPoint));
                setTeamB(shuffledPlayers.slice(midPoint));
              }}
            >
              <Shuffle className="h-3.5 w-3.5 mr-1.5" />
              Auto-balancear
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {renderTeam("A")}
          {renderTeam("B")}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Jugadores disponibles</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availablePlayers.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between gap-2 rounded-md border px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    {player.name[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm">{player.name}</span>
                    <div className="flex items-center gap-1.5">
                      <LevelBadge level={player.skill} short />
                      <span className="text-xs text-muted-foreground">
                        {getPlayerMatches(player.id)} partidos
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 hover:border-blue-500/30 hover:bg-blue-50"
                    onClick={() => handleAddToTeam(player.id, "A")}
                    disabled={teamA.length >= 11}
                  >
                    <span className="text-xs font-medium">A</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 hover:border-blue-500/30 hover:bg-blue-50"
                    onClick={() => handleAddToTeam(player.id, "B")}
                    disabled={teamB.length >= 11}
                  >
                    <span className="text-xs font-medium">B</span>
                  </Button>
                </div>
              </div>
            ))}
            {availablePlayers.length === 0 && (
              <div className="col-span-2 flex h-20 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                No hay más jugadores disponibles
              </div>
            )}
          </div>
        </div>

        {teamA.length > 0 &&
          teamB.length > 0 &&
          teamA.length === teamB.length && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Resultado</h3>
                <Select
                  value={winner}
                  onValueChange={(value: "A" | "B" | "DRAW") => {
                    setWinner(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ganador">
                      {winner === "A"
                        ? "Ganó Equipo A"
                        : winner === "B"
                        ? "Ganó Equipo B"
                        : winner === "DRAW"
                        ? "Empate"
                        : "Seleccionar ganador"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Ganó Equipo A</SelectItem>
                    <SelectItem value="B">Ganó Equipo B</SelectItem>
                    <SelectItem value="DRAW">Empate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {winner && winner !== "DRAW" && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Diferencia de goles</h3>
                  <Select value={scoreDiff} onValueChange={setScoreDiff}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar diferencia">
                        {scoreDiff
                          ? `${scoreDiff} ${
                              parseInt(scoreDiff) === 1 ? "gol" : "goles"
                            }`
                          : "Seleccionar diferencia"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <SelectItem key={n} value={n.toString()}>
                          {n} {n === 1 ? "gol" : "goles"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {winner && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium">MVP (opcional)</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="text-muted-foreground">
                          <HelpCircle className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[250px]">
                          <p>
                            Most Valuable Player (MVP) - Jugador que tuvo el
                            mejor rendimiento o mayor impacto en el partido, ya
                            sea por goles, asistencias o juego en general.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select value={mvp} onValueChange={setMvp}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar jugador">
                        {players.find((p) => p.id === mvp)?.name}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {[...teamA, ...teamB].map((playerId) => {
                        const player = players.find((p) => p.id === playerId);
                        if (!player) return null;

                        const team = teamA.includes(playerId) ? "A" : "B";
                        return (
                          <SelectItem key={player.id} value={player.id}>
                            {player.name} (Equipo {team})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="sm:w-auto w-full"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              loading ||
              !winner ||
              teamA.length === 0 ||
              teamB.length === 0 ||
              teamA.length !== teamB.length ||
              (winner !== "DRAW" && !scoreDiff)
            }
            className="sm:w-auto w-full"
          >
            {loading ? "Guardando..." : "Guardar partido"}
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
}
