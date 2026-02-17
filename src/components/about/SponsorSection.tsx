"use client";

import { useState } from "react";
import { Heart, X } from "lucide-react";
import type { SponsorQR } from "@/types/about";
import { cn } from "@/lib/utils";
import { useLocale } from "@/contexts/LocaleContext";

interface SponsorSectionProps {
  qrCodes: SponsorQR[];
}

/**
 * Elegant sponsor section with a collapsible modal overlay.
 */
export default function SponsorSection({ qrCodes }: SponsorSectionProps) {
  const [open, setOpen] = useState(false);
  const { t } = useLocale();

  return (
    <>
      {/* Trigger */}
      <section className="glass rounded-[var(--radius-lg)] px-6 py-6 text-center">
        <h2 className="mb-3 flex items-center justify-center gap-2 text-base font-semibold text-[var(--text-primary)]">
          <Heart className="h-5 w-5 text-rose-500" />
          {t({ en: "Sponsor", "zh-CN": "赞助" })}
        </h2>
        <p className="mb-4 text-sm text-[var(--text-secondary)]">
          {t({ en: "If you enjoy my work, consider buying me a coffee ☕", "zh-CN": "如果你喜欢我的作品，可以请我喝杯咖啡 ☕" })}
        </p>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-[var(--accent-hover)] hover:shadow-md"
        >
          <Heart className="h-4 w-4" />
          {t({ en: "Support Me", "zh-CN": "支持我" })}
        </button>
      </section>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          {/* Content */}
          <div className="glass-heavy relative z-10 w-full max-w-md rounded-[var(--radius-lg)] p-6 shadow-2xl animate-fade-in-up">
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-tertiary)] transition-colors hover:bg-[var(--accent-subtle)] hover:text-[var(--text-primary)]"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="mb-5 text-center text-lg font-semibold text-[var(--text-primary)]">
              💝 {t({ en: "Thank you for your support!", "zh-CN": "感谢你的支持！" })}
            </h3>

            <div
              className={cn(
                "grid gap-4",
                qrCodes.length === 1 ? "grid-cols-1" : "grid-cols-2",
              )}
            >
              {qrCodes.map((qr) => (
                <div key={qr.label} className="flex flex-col items-center gap-2">
                  <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-glass)] bg-white p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qr.src}
                      alt={qr.label}
                      className="h-40 w-40 object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium text-[var(--text-secondary)]">
                    {qr.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
