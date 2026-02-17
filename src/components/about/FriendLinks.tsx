"use client";

import { Link2 } from "lucide-react";
import type { FriendLink } from "@/types/about";
import { useLocale } from "@/contexts/LocaleContext";

interface FriendLinksProps {
  links: FriendLink[];
}

export default function FriendLinks({ links }: FriendLinksProps) {
  const { t } = useLocale();

  return (
    <section className="glass rounded-[var(--radius-lg)] px-6 py-6">
      <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-[var(--text-primary)]">
        <Link2 className="h-5 w-5 text-[var(--accent)]" />
        {t({ en: "Friend Links", "zh-CN": "友情链接" })}
      </h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border-glass)] px-4 py-3 transition-all hover:bg-[var(--accent-subtle)] hover:shadow-sm"
          >
            {/* Avatar or initial */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent-subtle)] text-sm font-bold text-[var(--accent)]">
              {link.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={link.avatar}
                  alt={link.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                link.name.charAt(0).toUpperCase()
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
                {link.name}
              </p>
              {link.description && (
                <p className="truncate text-xs text-[var(--text-tertiary)]">
                  {link.description}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
