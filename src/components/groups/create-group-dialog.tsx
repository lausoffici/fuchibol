"use client";

import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
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
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Crear nuevo grupo"
      className="sm:max-w-[500px]"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Crea un grupo y agrega jugadores con su nivel de habilidad
        </p>

        <div className="space-y-6">
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
                value={player}
                onChange={(player) => handlePlayerChange(index, player)}
                loading={loading}
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

        <div className="flex justify-end gap-2">
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
        </div>
      </form>
    </ResponsiveDialog>
  );
}
