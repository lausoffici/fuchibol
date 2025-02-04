"use client";

import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface Player {
  name: string;
  skill: number;
}

interface PlayerInputProps {
  player: Player;
  onChange: (player: Player) => void;
}

export function PlayerInput({ player, onChange }: PlayerInputProps) {
  return (
    <div className="flex items-center gap-4">
      <Input
        value={player.name}
        onChange={(e) => onChange({ ...player, name: e.target.value })}
        placeholder="Nombre del jugador"
        className="flex-1"
      />
      <div className="flex w-32 flex-col gap-1.5">
        <Slider
          value={[player.skill]}
          onValueChange={([skill]) => onChange({ ...player, skill })}
          min={1}
          max={10}
          step={1}
        />
        <span className="text-center text-xs text-muted-foreground">
          Nivel: {player.skill}
        </span>
      </div>
    </div>
  );
}
