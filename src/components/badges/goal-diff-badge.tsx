import { Target } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GoalDiffBadgeProps {
  diff: number;
  isWinner?: boolean;
  className?: string;
}

export function GoalDiffBadge({
  diff,
  isWinner = true,
  className,
}: GoalDiffBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <span
            className={cn(
              "flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-full",
              isWinner
                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                : "bg-rose-50 text-rose-700 border border-rose-200",
              className
            )}
          >
            <Target
              className={`h-3 w-3 ${
                isWinner ? "text-indigo-600" : "text-rose-600"
              }`}
            />
            <span>
              {isWinner ? "+" : "-"}
              {diff} GD
            </span>
          </span>
        </TooltipTrigger>
        <TooltipContent>Goles de diferencia</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
