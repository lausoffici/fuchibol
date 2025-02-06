"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Zap } from "lucide-react";

interface PlayerInputProps {
  value?: {
    name: string;
    skill: number;
  };
  onChange: (value: { name: string; skill: number }) => void;
  loading?: boolean;
  onRemove?: () => void;
  isLast?: boolean;
}

export function PlayerInput({
  value = { name: "", skill: 5 },
  onChange,
  loading,
  onRemove,
  isLast,
}: PlayerInputProps) {
  const handleClearOrRemove = () => {
    if (isLast) {
      onChange({ ...value, name: "" });
    } else {
      onRemove?.();
    }
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
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
          className="pr-8"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
          onClick={handleClearOrRemove}
          disabled={loading}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
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
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="0" className="pl-0" />
        </SelectTrigger>
        <SelectContent>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <SelectItem key={n} value={n.toString()}>
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{n}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
