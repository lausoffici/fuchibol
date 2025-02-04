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
import { useState } from "react";

import { createMatch } from "@/app/actions/matches";
import { useToast } from "@/hooks/use-toast";
import { Player } from "@prisma/client";

interface CreateMatchDialogProps {
  groupId: string;
  players: Player[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMatchDialog({
  groupId,
  players,
  open,
  onOpenChange,
}: CreateMatchDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [teamA, setTeamA] = useState<string[]>(Array(5).fill(""));
  const [teamB, setTeamB] = useState<string[]>(Array(5).fill(""));
  const [winner, setWinner] = useState<"A" | "B" | "DRAW" | "">("");
  const [scoreDiff, setScoreDiff] = useState<string>("1");

  const availablePlayers = players.filter(
    (p) => !teamA.includes(p.id) && !teamB.includes(p.id)
  );

  const getPlayerName = (playerId: string) => {
    return players.find((p) => p.id === playerId)?.name;
  };

  const handleSubmit = async () => {
    if (!winner) return;

    setLoading(true);
    try {
      await createMatch({
        groupId,
        teamA: teamA.filter(Boolean),
        teamB: teamB.filter(Boolean),
        winner,
        scoreDiff: parseInt(scoreDiff),
      });

      toast({
        title: "Partido registrado",
        description: "El partido se ha registrado correctamente",
      });

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar partido</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <h3 className="font-medium">Equipo A</h3>
            {[0, 1, 2, 3, 4].map((index) => (
              <Select
                key={`teamA-${index}`}
                value={teamA[index] || undefined}
                onValueChange={(value) => {
                  const newTeam = [...teamA];
                  newTeam[index] = value;
                  setTeamA(newTeam);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar jugador">
                    {players.find((p) => p.id === teamA[index])?.name ||
                      "Seleccionar jugador"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availablePlayers.length > 0 ? (
                    availablePlayers.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="relative flex items-center justify-center py-6 text-sm text-muted-foreground">
                      No hay jugadores disponibles
                    </div>
                  )}
                </SelectContent>
              </Select>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Equipo B</h3>
            {[0, 1, 2, 3, 4].map((index) => (
              <Select
                key={`teamB-${index}`}
                value={teamB[index] || undefined}
                onValueChange={(value) => {
                  const newTeam = [...teamB];
                  newTeam[index] = value;
                  setTeamB(newTeam);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar jugador">
                    {players.find((p) => p.id === teamB[index])?.name ||
                      "Seleccionar jugador"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availablePlayers.length > 0 ? (
                    availablePlayers.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="relative flex items-center justify-center py-6 text-sm text-muted-foreground">
                      No hay jugadores disponibles
                    </div>
                  )}
                </SelectContent>
              </Select>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Resultado</h3>
              <Select
                value={winner}
                onValueChange={(value: "A" | "B" | "DRAW") => setWinner(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar resultado">
                    {winner === "A"
                      ? "Ganó Equipo A"
                      : winner === "B"
                      ? "Ganó Equipo B"
                      : winner === "DRAW"
                      ? "Empate"
                      : "Seleccionar resultado"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Ganó Equipo A</SelectItem>
                  <SelectItem value="B">Ganó Equipo B</SelectItem>
                  <SelectItem value="DRAW">Empate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {winner !== "DRAW" && (
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
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                loading ||
                !winner ||
                teamA.filter(Boolean).length === 0 ||
                teamB.filter(Boolean).length === 0 ||
                teamA.filter(Boolean).length !== teamB.filter(Boolean).length ||
                (winner !== "DRAW" && !scoreDiff)
              }
            >
              {loading ? "Guardando..." : "Guardar partido"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
