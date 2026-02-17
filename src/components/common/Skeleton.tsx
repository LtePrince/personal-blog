import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

/**
 * Reusable shimmer skeleton block.
 *
 * The `.skeleton` class is defined globally in `globals.css`.
 */
export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("skeleton", className)} />;
}
