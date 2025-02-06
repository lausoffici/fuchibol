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
        "inline-flex items-center text-xs font-medium px-1.5 py-0.5 rounded-full border justify-center",
        getSkillColor(level),
        className
      )}
    >
      <Zap className="h-[10px] w-[10px] shrink-0 mr-0.5" />
      <span className="text-[10px] uppercase font-semibold tracking-wider flex items-center">
        {!short && <span>Nivel</span>}
        <span
          className={cn(
            "inline-block text-center",
            showDecimals ? "w-4.5" : "w-3"
          )}
        >
          {showDecimals ? level.toFixed(1) : Math.round(level)}
        </span>
      </span>
    </span>
  );
}
