import { cn } from "@/lib/utils";

interface BadgeProps {
  className?: string;
}

export function MvpBadge({ className }: BadgeProps) {
  return (
    <span
      className={cn(
        "flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200",
        className
      )}
    >
      <span className="text-base leading-none">🔥</span>
      <span className="text-[10px] uppercase font-semibold tracking-wider">
        MVP
      </span>
    </span>
  );
}
