"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { addPlayerToGroup } from "@/app/actions/groups";
import { PlayerInput } from "@/components/groups/player-input";
import { Plus, Trash2 } from "lucide-react";

interface Player {
  id: string;
  name: string;
  skill: number;
}

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar jugadores</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {players.map((player, index) => (
            <div key={index} className="flex items-start gap-2">
              <PlayerInput
                value={player}
                onChange={(value) => {
                  const newPlayers = [...players];
                  newPlayers[index] = value;
                  setPlayers(newPlayers);
                }}
              />
              {players.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={() => {
                    setPlayers(players.filter((_, i) => i !== index));
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
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
            disabled={loading || players.some((p) => !p.name)}
          >
            {loading ? "Guardando..." : "Guardar jugadores"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
