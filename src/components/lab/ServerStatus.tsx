"use client";

import { Cpu, MemoryStick, HardDrive, Monitor } from "lucide-react";
import type { ServerStats } from "@/types/lab";
import { cn } from "@/lib/utils";
import { useLocale } from "@/contexts/LocaleContext";

interface ServerStatusProps {
  stats: ServerStats;
}

const gauges = [
  { key: "cpu" as const, label: "CPU", icon: Cpu },
  { key: "memory" as const, label: "Memory", icon: MemoryStick },
  { key: "disk" as const, label: "Disk", icon: HardDrive },
];

function barColor(pct: number): string {
  if (pct < 50) return "bg-emerald-500";
  if (pct < 80) return "bg-amber-500";
  return "bg-red-500";
}

/**
 * Server health gauges – CPU / Memory / Disk usage bars.
 */
export default function ServerStatus({ stats }: ServerStatusProps) {
  const { t } = useLocale();

  return (
    <section className="glass rounded-[var(--radius-lg)] px-6 py-6">
      <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-[var(--text-primary)]">
        <Monitor className="h-5 w-5 text-[var(--accent)]" />
        {t({ en: "Server Status", "zh-CN": "服务器状态" })}
      </h2>

      <div className="flex flex-col gap-4">
        {gauges.map(({ key, label, icon: Icon }) => {
          const pct = stats[key];
          return (
            <div key={key} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2 text-[var(--text-secondary)]">
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
                <span className="font-medium text-[var(--text-primary)]">
                  {pct}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border-glass)]">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    barColor(pct),
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
