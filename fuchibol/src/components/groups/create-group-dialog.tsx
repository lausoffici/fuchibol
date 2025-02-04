"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { PlayerInput } from "@/components/groups/player-input";
import { createGroup } from "@/app/actions/groups";
import { useToast } from "@/hooks/use-toast";

interface Player {
  name: string;
  skill: number;
}

export function CreateGroupDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [players, setPlayers] = useState<Player[]>([
    { name: "", skill: 5 },
    { name: "", skill: 5 },
  ]);

  const handleAddPlayer = () => {
    setPlayers([...players, { name: "", skill: 5 }]);
  };

  const handlePlayerChange = (index: number, player: Player) => {
    const newPlayers = [...players];
    newPlayers[index] = player;
    setPlayers(newPlayers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createGroup({
        name: groupName,
        players: players.filter((p) => p.name.trim() !== ""),
      });

      toast({
        title: "Grupo creado",
        description: "El grupo se ha creado correctamente",
      });

      onOpenChange(false);
    } catch {
      toast({
        title: "Error",
        description: "No se pudo crear el grupo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear nuevo grupo</DialogTitle>
            <DialogDescription>
              Crea un grupo y agrega jugadores con su nivel de habilidad
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del grupo</Label>
              <Input
                id="name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="ej. Fútbol de los jueves"
                disabled={loading}
              />
            </div>

            <div className="space-y-4">
              <Label>Jugadores</Label>
              {players.map((player, index) => (
                <PlayerInput
                  key={index}
                  player={player}
                  onChange={(player) => handlePlayerChange(index, player)}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleAddPlayer}
                disabled={loading}
              >
                Agregar jugador
              </Button>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear grupo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
