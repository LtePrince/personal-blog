"use client";

import { Megaphone } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

/**
 * Announcement card – supports bilingual title & content.
 */
export default function AnnouncementCard() {
  const { t } = useLocale();

  return (
    <aside className="glass rounded-[var(--radius-lg)] px-5 py-5">
      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
        <Megaphone className="h-4 w-4 text-[var(--accent)]" />
        {t({ en: "Announcement", "zh-CN": "公告" })}
      </h3>
      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
        {t({
          en: "Welcome to my blog! This site is under active development.",
          "zh-CN": "欢迎来到我的博客！本站正在积极开发中。",
        })}
      </p>
    </aside>
  );
}
