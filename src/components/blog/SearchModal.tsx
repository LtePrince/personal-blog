"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Command,
  Loader2,
  Tag,
  FileText,
  Layers,
} from "lucide-react";
import type { BlogPost } from "@/types/blog";
import type { ColumnItem } from "@/types/column";
import { parseTags } from "@/types/blog";
import { cn } from "@/lib/utils";
import { useLocale } from "@/contexts/LocaleContext";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface MergedTag {
  name: string;
  count: number;
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  /** Pre-select a tag when opened (e.g. from sidebar tag click). */
  initialTag?: string;
}

/* ------------------------------------------------------------------ */
/*  Hook: unified debounced search across posts + columns              */
/* ------------------------------------------------------------------ */

function useUnifiedSearch(
  query: string,
  selectedTags: string[],
  open: boolean,
) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [columns, setColumns] = useState<ColumnItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const hasQuery = query.trim().length > 0;
    const hasTags = selectedTags.length > 0;
    if (!hasQuery && !hasTags) {
      setPosts([]);
      setColumns([]);
      return;
    }

    setLoading(true);
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ page_no: "1", page_size: "10" });
        if (hasQuery) params.set("filter_title", query.trim());
        if (hasTags) params.set("filter_tag", selectedTags[0]);

        const [blogRes, colRes] = await Promise.all([
          fetch(`/api/blog?${params.toString()}`, { signal: controller.signal }),
          fetch(`/api/columns?${params.toString()}`, {
            signal: controller.signal,
          }),
        ]);
        const [blogBody, colBody] = await Promise.all([
          blogRes.json(),
          colRes.json(),
        ]);
        setPosts(blogBody.success ? (blogBody.data ?? []) : []);
        setColumns(colBody.success ? (colBody.data ?? []) : []);
      } catch {
        /* abort or network error — ignore */
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, selectedTags, open]);

  return { posts, columns, loading };
}

/* ------------------------------------------------------------------ */
/*  Hook: merged post + column tags                                    */
/* ------------------------------------------------------------------ */

function useMergedTags(open: boolean) {
  const [tags, setTags] = useState<MergedTag[]>([]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    (async () => {
      try {
        const [tRes, cRes] = await Promise.all([
          fetch("/api/tags"),
          fetch("/api/columns/tags"),
        ]);
        const [tBody, cBody] = await Promise.all([tRes.json(), cRes.json()]);

        const map = new Map<string, number>();
        if (tBody.success) {
          for (const t of tBody.data ?? []) {
            map.set(t.name, (map.get(t.name) ?? 0) + (t.postCount ?? 0));
          }
        }
        if (cBody.success) {
          for (const c of cBody.data ?? []) {
            map.set(c.name, (map.get(c.name) ?? 0) + (c.columnCount ?? 0));
          }
        }
        if (!cancelled) {
          setTags(
            [...map.entries()]
              .map(([name, count]) => ({ name, count }))
              .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
          );
        }
      } catch {
        /* ignore */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open]);

  return tags;
}

/* ------------------------------------------------------------------ */
/*  SearchModal                                                        */
/* ------------------------------------------------------------------ */

/**
 * Full-screen unified search overlay. One box searches both blog posts and
 * columns; results are grouped by type. Tag filters span both content types.
 */
export default function SearchModal({
  open,
  onClose,
  initialTag,
}: SearchModalProps) {
  const router = useRouter();
  const { t } = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialTag ? [initialTag] : [],
  );

  const { posts, columns, loading } = useUnifiedSearch(
    query,
    selectedTags,
    open,
  );
  const allTags = useMergedTags(open);

  /* Focus the input on mount (the modal is mounted fresh each time it opens). */
  useEffect(() => {
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, []);

  /* Escape to close */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = useCallback(
    (path: string) => {
      onClose();
      router.push(path);
    },
    [onClose, router],
  );

  const toggleTag = useCallback((name: string) => {
    setSelectedTags((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [name],
    );
  }, []);

  const hasInput = query.trim().length > 0 || selectedTags.length > 0;
  const noResults =
    !loading && hasInput && posts.length === 0 && columns.length === 0;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div className="glass-heavy relative z-10 w-full max-w-lg rounded-[var(--radius-lg)] p-4 shadow-2xl animate-fade-in-up">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-[var(--border-glass)] pb-3">
          <Search className="h-5 w-5 shrink-0 text-[var(--text-tertiary)]" />
          <div className="flex flex-1 flex-wrap items-center gap-1.5">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-medium text-white"
              >
                <Tag className="h-3 w-3" />
                {tag}
                <button
                  onClick={() => toggleTag(tag)}
                  className="ml-0.5 rounded-full hover:bg-white/20"
                  aria-label={`Remove tag ${tag}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t({
                en: "Search posts & columns…",
                "zh-CN": "搜索文章与专栏…",
              })}
              className="min-w-[120px] flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none"
            />
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--accent-subtle)] text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tag pills (merged post + column tags) */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 border-b border-[var(--border-glass)] py-2.5">
            {allTags.map((tag) => {
              const active = selectedTags.includes(tag.name);
              return (
                <button
                  key={tag.name}
                  onClick={() => toggleTag(tag.name)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                    active
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--accent-subtle)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white",
                  )}
                >
                  {tag.name}
                  <span
                    className={cn(
                      "text-[0.625rem]",
                      active ? "opacity-80" : "opacity-60",
                    )}
                  >
                    {tag.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Results */}
        <div className="mt-3 max-h-[44vh] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-[var(--text-tertiary)]">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t({ en: "Searching…", "zh-CN": "搜索中…" })}
            </div>
          )}

          {noResults && (
            <div className="py-6 text-center text-sm text-[var(--text-tertiary)]">
              {t({ en: "No results found.", "zh-CN": "没有找到结果。" })}
            </div>
          )}

          {/* Posts group */}
          {!loading && posts.length > 0 && (
            <section className="mb-2">
              <h4 className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
                <FileText className="h-3.5 w-3.5" />
                {t({ en: "Posts", "zh-CN": "文章" })}
              </h4>
              <ul>
                {posts.map((post) => {
                  const tags = parseTags(post.tags);
                  return (
                    <li key={`p-${post.id}`}>
                      <button
                        onClick={() => go(`/blog/${encodeURIComponent(post.id)}`)}
                        className="flex w-full flex-col gap-1 rounded-[var(--radius-sm)] px-3 py-2.5 text-left transition-colors hover:bg-[var(--accent-subtle)]"
                      >
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {post.title}
                        </span>
                        {post.summary && (
                          <span className="line-clamp-1 text-xs text-[var(--text-tertiary)]">
                            {post.summary}
                          </span>
                        )}
                        {tags.length > 0 && (
                          <div className="mt-0.5 flex flex-wrap gap-1">
                            {tags.map((tg) => (
                              <span
                                key={tg}
                                className="rounded-full bg-[var(--accent-subtle)] px-2 py-0.5 text-[0.625rem] text-[var(--accent)]"
                              >
                                {tg}
                              </span>
                            ))}
                          </div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* Columns group */}
          {!loading && columns.length > 0 && (
            <section>
              <h4 className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">
                <Layers className="h-3.5 w-3.5" />
                {t({ en: "Columns", "zh-CN": "专栏" })}
              </h4>
              <ul>
                {columns.map((col) => (
                  <li key={`c-${col.id}`}>
                    <button
                      onClick={() => go(`/column/${encodeURIComponent(col.slug)}`)}
                      className="flex w-full flex-col gap-1 rounded-[var(--radius-sm)] px-3 py-2.5 text-left transition-colors hover:bg-[var(--accent-subtle)]"
                    >
                      <span className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                        {col.title}
                        <span className="text-[0.625rem] font-normal text-[var(--text-tertiary)]">
                          {t({
                            en: `${col.chapterCount} ch.`,
                            "zh-CN": `${col.chapterCount} 章`,
                          })}
                        </span>
                      </span>
                      {col.summary && (
                        <span className="line-clamp-1 text-xs text-[var(--text-tertiary)]">
                          {col.summary}
                        </span>
                      )}
                      {col.tags.length > 0 && (
                        <div className="mt-0.5 flex flex-wrap gap-1">
                          {col.tags.map((tg) => (
                            <span
                              key={tg}
                              className="rounded-full bg-[var(--accent-subtle)] px-2 py-0.5 text-[0.625rem] text-[var(--accent)]"
                            >
                              {tg}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Trigger bar (visible on the Blog page)                             */
/* ------------------------------------------------------------------ */

interface SearchTriggerProps {
  onClick: () => void;
}

export function SearchTrigger({ onClick }: SearchTriggerProps) {
  const { t } = useLocale();
  return (
    <button
      onClick={onClick}
      className={cn(
        "glass flex w-full max-w-xl items-center gap-3 rounded-[var(--radius-md)] px-4 py-2.5",
        "text-sm text-[var(--text-tertiary)] transition-all hover:shadow-md",
        "cursor-text",
      )}
    >
      <Search className="h-4 w-4 shrink-0" />
      <span className="flex-1 text-left">
        {t({ en: "Search posts & columns…", "zh-CN": "搜索文章与专栏…" })}
      </span>
      <kbd className="hidden items-center gap-0.5 rounded-md border border-[var(--border-glass)] bg-[var(--bg-glass)] px-1.5 py-0.5 text-xs font-medium text-[var(--text-tertiary)] sm:inline-flex">
        <Command className="h-3 w-3" />K
      </kbd>
    </button>
  );
}
