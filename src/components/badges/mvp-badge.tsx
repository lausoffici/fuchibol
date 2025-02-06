import { cn } from "@/lib/utils";
import { Flame } from "lucide-react";

interface BadgeProps {
  className?: string;
}

export function MvpBadge({ className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 h-[22px]",
        className
      )}
    >
      <Flame className="h-[10px] w-[10px] text-red-600" />
      <span className="text-[10px] uppercase font-semibold tracking-wider">
        MVP
      </span>
    </span>
  );
}
