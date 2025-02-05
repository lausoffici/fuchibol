import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  level: number;
  showBadge?: boolean;
  className?: string;
  showDecimals?: boolean;
}

export function LevelBadge({
  level,
  showBadge = true,
  className,
  showDecimals = false,
}: LevelBadgeProps) {
  const getSkillColor = (skill: number) => {
    if (skill >= 7) return "bg-green-500/20 text-green-700";
    if (skill >= 4) return "bg-yellow-500/20 text-yellow-700";
    return "bg-red-500/20 text-red-700";
  };

  return (
    <span
      className={cn(
        "text-xs flex items-center gap-1",
        showBadge && "px-2 py-0.5 rounded-full",
        showBadge && getSkillColor(level),
        className
      )}
    >
      <Zap className="h-3 w-3" />
      <span className="text-[10px] uppercase font-semibold tracking-wider">
        Nivel
      </span>
      <span className="font-semibold">
        {showDecimals ? level.toFixed(1) : Math.round(level)}
      </span>
    </span>
  );
}
