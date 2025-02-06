"use client";

import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { addPlayerToGroup } from "@/app/actions/groups";
import { PlayerInput } from "@/components/groups/player-input";
import { Plus } from "lucide-react";

interface AddPlayerDialogProps {
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPlayerDialog({
  groupId,
  open,
  onOpenChange,
}: AddPlayerDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<{ name: string; skill: number }[]>([
    { name: "", skill: 5 },
  ]);

  const handleSubmit = async () => {
    if (players.some((p) => !p.name)) return;

    setLoading(true);
    try {
      await Promise.all(
        players.map((player) =>
          addPlayerToGroup({
            groupId,
            name: player.name,
            skill: player.skill,
          })
        )
      );

      toast({
        title: "Jugadores agregados",
        description: "Los jugadores se han agregado correctamente",
      });

      onOpenChange(false);
      setPlayers([{ name: "", skill: 5 }]);
    } catch {
      toast({
        title: "Error",
        description: "No se pudieron agregar los jugadores",
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
      title="Agregar jugadores"
      className="sm:max-w-[500px]"
    >
      <div className="space-y-6 py-4 sm:py-6">
        <div className="space-y-4">
          {players.map((player, index) => (
            <PlayerInput
              key={index}
              value={player}
              onChange={(value) => {
                const newPlayers = [...players];
                newPlayers[index] = value;
                setPlayers(newPlayers);
              }}
              loading={loading}
              isLast={players.length === 1}
              onRemove={() => {
                setPlayers(players.filter((_, i) => i !== index));
              }}
              showLabels={index === 0}
            />
          ))}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setPlayers([...players, { name: "", skill: 5 }]);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar otro jugador
          </Button>
        </div>
        <div className="border-t" />
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
            disabled={loading || players.some((p) => !p.name)}
            className="sm:w-auto w-full"
          >
            {loading ? "Guardando..." : "Guardar jugadores"}
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
}
