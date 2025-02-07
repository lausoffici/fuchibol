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
import { HelpCircle, X, Shuffle, Swords, Zap } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useForm } from "react-hook-form";
import { updateMatch } from "@/app/actions/matches";
import { useToast } from "@/hooks/use-toast";
import { Player, Match } from "@prisma/client";
import { LevelBadge } from "@/components/badges";
import { getTeamAverageSkill } from "@/lib/utils/format";
import React from "react";

interface EditMatchFormValues {
  teamAPlayers: string[];
  teamBPlayers: string[];
  winningTeam: "A" | "B" | "DRAW";
  scoreDiff: string;
  mvpId: string;
}

interface EditMatchDialogProps {
  match: Match & {
    teamAPlayers: Player[];
    teamBPlayers: Player[];
    mvp: Player | null;
  };
  players: Player[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditMatchDialog({
  match,
  players,
  open,
  onOpenChange,
}: EditMatchDialogProps) {
  const { toast } = useToast();

  const form = useForm<EditMatchFormValues>({
    defaultValues: {
      teamAPlayers: match?.teamAPlayers.map((p) => p.id) || [],
      teamBPlayers: match?.teamBPlayers.map((p) => p.id) || [],
      winningTeam: (match?.winningTeam as "A" | "B") || "DRAW",
      scoreDiff: match?.scoreDiff?.toString() || "1",
      mvpId: match?.mvp?.id || "",
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = form;

  // Actualizar valores cuando el match cambia
  React.useEffect(() => {
    if (match) {
      reset({
        teamAPlayers: match.teamAPlayers.map((p) => p.id),
        teamBPlayers: match.teamBPlayers.map((p) => p.id),
        winningTeam: (match.winningTeam as "A" | "B") || "DRAW",
        scoreDiff: match.scoreDiff?.toString() || "1",
        mvpId: match.mvp?.id || "",
      });
    }
  }, [match, reset]);

  const teamA = watch("teamAPlayers") || [];
  const teamB = watch("teamBPlayers") || [];

  const availablePlayers = players.filter(
    (p) => !teamA.includes(p.id) && !teamB.includes(p.id)
  );

  const handleAddToTeam = (playerId: string, team: "A" | "B") => {
    if (team === "A" && teamA.length >= 11) {
      toast({
        title: "Límite alcanzado",
        description: "No se pueden agregar más de 11 jugadores por equipo",
        variant: "destructive",
      });
      return;
    }
    if (team === "B" && teamB.length >= 11) {
      toast({
        title: "Límite alcanzado",
        description: "No se pueden agregar más de 11 jugadores por equipo",
        variant: "destructive",
      });
      return;
    }

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

    setValue(team === "A" ? "teamAPlayers" : "teamBPlayers", [
      ...(team === "A" ? teamA : teamB),
      playerId,
    ]);
  };

  const handleRemoveFromTeam = (playerId: string, team: "A" | "B") => {
    setValue(
      team === "A" ? "teamAPlayers" : "teamBPlayers",
      (team === "A" ? teamA : teamB).filter((id) => id !== playerId)
    );
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
              className="flex items-center justify-between gap-1 bg-white/50 rounded-md px-1.5 py-0.5 text-sm"
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

  const onSubmit = async (data: EditMatchFormValues) => {
    try {
      await updateMatch({
        matchId: match.id,
        groupId: match.groupId,
        teamAPlayers: data.teamAPlayers,
        teamBPlayers: data.teamBPlayers,
        winningTeam: data.winningTeam === "DRAW" ? null : data.winningTeam,
        scoreDiff: parseInt(data.scoreDiff),
        mvpId: data.mvpId || undefined,
      });

      toast({
        title: "Partido actualizado",
        description: "El partido se ha actualizado correctamente",
      });

      onOpenChange(false);
    } catch {
      toast({
        title: "Error",
        description: "No se pudo actualizar el partido",
        variant: "destructive",
      });
    }
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Editar partido"
      className="sm:max-w-[500px]"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
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
              type="button"
              variant="outline"
              size="sm"
              className="h-7"
              onClick={() => {
                const allPlayers = [...teamA, ...teamB];
                const shuffledPlayers = allPlayers.sort(
                  () => Math.random() - 0.5
                );
                const midPoint = Math.floor(shuffledPlayers.length / 2);
                setValue("teamAPlayers", shuffledPlayers.slice(0, midPoint));
                setValue("teamBPlayers", shuffledPlayers.slice(midPoint));
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
                    <LevelBadge level={player.skill} short />
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 hover:border-blue-500/30 hover:bg-blue-50"
                    onClick={() => handleAddToTeam(player.id, "A")}
                    disabled={teamA.length >= 11}
                  >
                    <span className="text-xs font-medium">A</span>
                  </Button>
                  <Button
                    type="button"
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
                  value={watch("winningTeam")}
                  onValueChange={(value: "A" | "B" | "DRAW") => {
                    setValue("winningTeam", value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Ganó Equipo A</SelectItem>
                    <SelectItem value="B">Ganó Equipo B</SelectItem>
                    <SelectItem value="DRAW">Empate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {watch("winningTeam") !== "DRAW" && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Diferencia de goles</h3>
                  <Select
                    value={watch("scoreDiff")}
                    onValueChange={(value) => setValue("scoreDiff", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
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

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium">MVP (opcional)</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Most Valuable Player - Jugador más destacado del partido
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  value={watch("mvpId")}
                  onValueChange={(value) => setValue("mvpId", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...teamA, ...teamB].map((playerId) => {
                      const player = players.find((p) => p.id === playerId);
                      if (!player) return null;
                      return (
                        <SelectItem key={player.id} value={player.id}>
                          {player.name} (Equipo{" "}
                          {teamA.includes(playerId) ? "A" : "B"})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="sm:w-auto w-full"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="sm:w-auto w-full"
          >
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </ResponsiveDialog>
  );
}
