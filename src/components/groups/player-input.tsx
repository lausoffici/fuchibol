"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlayerInputProps {
  value?: {
    name: string;
    skill: number;
  };
  onChange: (value: { name: string; skill: number }) => void;
  loading?: boolean;
}

export function PlayerInput({
  value = { name: "", skill: 5 },
  onChange,
  loading,
}: PlayerInputProps) {
  return (
    <div className="flex gap-2 w-full">
      <Input
        placeholder="Nombre del jugador"
        value={value.name}
        onChange={(e) =>
          onChange({
            ...value,
            name: e.target.value,
          })
        }
        disabled={loading}
      />
      <Select
        value={value.skill.toString()}
        onValueChange={(newValue) =>
          onChange({
            ...value,
            skill: parseInt(newValue),
          })
        }
        disabled={loading}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Nivel" />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <SelectItem key={n} value={n.toString()}>
              {n}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
