"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HelpCircle } from "lucide-react";
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
import { useEffect } from "react";

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
      teamAPlayers: Array(5).fill(""),
      teamBPlayers: Array(5).fill(""),
      winningTeam: "DRAW",
      scoreDiff: "1",
      mvpId: "",
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = form;

  // Actualizar valores cuando el diálogo se abre
  useEffect(() => {
    if (open && match) {
      reset({
        teamAPlayers: Array(5)
          .fill("")
          .map((_, i) => match.teamAPlayers[i]?.id || ""),
        teamBPlayers: Array(5)
          .fill("")
          .map((_, i) => match.teamBPlayers[i]?.id || ""),
        winningTeam: (match.winningTeam as "A" | "B") || "DRAW",
        scoreDiff: match.scoreDiff?.toString() || "1",
        mvpId: match.mvp?.id || "",
      });
    }
  }, [open, match, reset]);

  const teamA = watch("teamAPlayers") || Array(5).fill("");
  const teamB = watch("teamBPlayers") || Array(5).fill("");

  const availablePlayers = players.filter(
    (p) => !teamA.includes(p.id) && !teamB.includes(p.id)
  );

  const onSubmit = async (data: EditMatchFormValues) => {
    try {
      await updateMatch({
        matchId: match.id,
        groupId: match.groupId,
        teamAPlayers: data.teamAPlayers.filter(Boolean),
        teamBPlayers: data.teamBPlayers.filter(Boolean),
        winningTeam:
          data.winningTeam === "DRAW" ? null : (data.winningTeam as "A" | "B"),
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar partido</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Equipo A</h3>
              {[0, 1, 2, 3, 4].map((index) => (
                <Select
                  key={`teamA-${index}`}
                  value={teamA[index]}
                  onValueChange={(value) => {
                    const newTeam = [...teamA];
                    newTeam[index] = value;
                    setValue("teamAPlayers", newTeam);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar jugador">
                      {players.find((p) => p.id === teamA[index])?.name ||
                        "Seleccionar jugador"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlayers.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Equipo B</h3>
              {[0, 1, 2, 3, 4].map((index) => (
                <Select
                  key={`teamB-${index}`}
                  value={teamB[index]}
                  onValueChange={(value) => {
                    const newTeam = [...teamB];
                    newTeam[index] = value;
                    setValue("teamBPlayers", newTeam);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar jugador">
                      {players.find((p) => p.id === teamB[index])?.name ||
                        "Seleccionar jugador"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlayers.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
          </div>

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
                  {[...teamA, ...teamB].filter(Boolean).map((playerId) => {
                    const player = players.find((p) => p.id === playerId);
                    if (!player) return null;
                    return (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Guardar cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
