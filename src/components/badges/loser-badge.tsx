import { Medal } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  className?: string;
}

export function LoserBadge({ className }: BadgeProps) {
  return (
    <span
      className={cn(
        "flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-zinc-50 text-zinc-700 border border-zinc-200",
        className
      )}
    >
      <Medal className="h-3.5 w-3.5 text-zinc-600" />
      <span className="text-xs font-medium">Perdedor</span>
    </span>
  );
}
