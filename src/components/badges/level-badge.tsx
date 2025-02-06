import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  level: number;
  className?: string;
  showDecimals?: boolean;
  short?: boolean;
}

export function LevelBadge({
  level,
  className,
  showDecimals = false,
  short,
}: LevelBadgeProps) {
  const getSkillColor = (skill: number) => {
    if (skill >= 7)
      return "bg-teal-50 text-teal-700 border-teal-200 [&_svg]:text-teal-600";
    if (skill >= 4)
      return "bg-yellow-50 text-yellow-700 border-yellow-200 [&_svg]:text-yellow-600";
    return "bg-rose-50 text-rose-700 border-rose-200 [&_svg]:text-rose-600";
  };

  return (
    <span
      className={cn(
        "flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-full border",
        getSkillColor(level),
        className
      )}
    >
      <Zap className="h-3 w-3" />
      <span className="text-[10px] uppercase font-semibold tracking-wider">
        {!short && "Nivel "}
      </span>
      <span className="font-semibold">
        {showDecimals ? level.toFixed(1) : Math.round(level)}
      </span>
    </span>
  );
}
