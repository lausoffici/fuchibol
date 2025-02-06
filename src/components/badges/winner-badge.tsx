import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  className?: string;
}

export function WinnerBadge({ className }: BadgeProps) {
  return (
    <span
      className={cn(
        "flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200",
        className
      )}
    >
      <Trophy className="h-3.5 w-3.5 text-amber-500" />
      <span className="text-xs font-medium">Ganador</span>
    </span>
  );
}
