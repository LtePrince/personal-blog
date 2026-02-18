"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Command, Loader2, Tag } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import { parseTags } from "@/types/blog";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface TagItem {
  id: number;
  name: string;
  postCount: number;
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  /** Pre-select a tag when opened (e.g. from sidebar tag click). */
  initialTag?: string;
}

/* ------------------------------------------------------------------ */
/*  Custom hook: debounced backend search                              */
/* ------------------------------------------------------------------ */

function useSearch(query: string, selectedTags: string[], open: boolean) {
  const [results, setResults] = useState<BlogPost[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const hasQuery = query.trim().length > 0;
    const hasTags = selectedTags.length > 0;

    // Nothing to search — clear results.
    if (!hasQuery && !hasTags) {
      setResults([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          page_no: "1",
          page_size: "20",
        });
        if (hasQuery) params.set("filter_title", query.trim());
        if (hasTags) params.set("filter_tag", selectedTags[0]);

        const res = await fetch(`/api/blog?${params.toString()}`, {
          signal: controller.signal,
        });
        const body = await res.json();
        if (body.success) {
          setResults(body.data ?? []);
          setTotal(body.total ?? 0);
        }
      } catch {
        /* abort or network error — ignore */
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, selectedTags, open]);

  return { results, total, loading };
}

/* ------------------------------------------------------------------ */
/*  Custom hook: fetch available tags                                   */
/* ------------------------------------------------------------------ */

function useTags(open: boolean) {
  const [tags, setTags] = useState<TagItem[]>([]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/tags");
        const body = await res.json();
        if (!cancelled && body.success) {
          setTags(body.data ?? []);
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
/*  SearchModal component                                              */
/* ------------------------------------------------------------------ */

/**
 * Full-screen search overlay with backend-powered title search and
 * clickable tag filters. Triggered by Ctrl+K or the search bar.
 */
export default function SearchModal({
  open,
  onClose,
  initialTag,
}: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { results, total, loading } = useSearch(query, selectedTags, open);
  const allTags = useTags(open);

  /* Reset state when modal opens; apply initialTag if provided */
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedTags(initialTag ? [initialTag] : []);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open, initialTag]);

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
    (id: string) => {
      onClose();
      router.push(`/blog/${encodeURIComponent(id)}`);
    },
    [onClose, router],
  );

  const toggleTag = useCallback((name: string) => {
    setSelectedTags((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [name],
    );
  }, []);

  const hasInput = query.trim().length > 0 || selectedTags.length > 0;

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
            {/* Selected tag chips inside the input area */}
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
              placeholder={
                selectedTags.length > 0
                  ? "Filter by title…"
                  : "Search posts…"
              }
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

        {/* Tag pills – always visible when tags exist */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 border-b border-[var(--border-glass)] py-2.5">
            {allTags.map((tag) => {
              const active = selectedTags.includes(tag.name);
              return (
                <button
                  key={tag.id}
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
                    {tag.postCount}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Results */}
        <ul className="mt-3 max-h-[40vh] overflow-y-auto">
          {/* Loading */}
          {loading && (
            <li className="flex items-center justify-center gap-2 py-6 text-sm text-[var(--text-tertiary)]">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching…
            </li>
          )}

          {/* No results */}
          {!loading && hasInput && results.length === 0 && (
            <li className="py-6 text-center text-sm text-[var(--text-tertiary)]">
              No results found.
            </li>
          )}

          {/* Result list */}
          {!loading &&
            results.map((post) => {
              const postTags = parseTags(post.tags);
              return (
                <li key={post.id}>
                  <button
                    onClick={() => go(post.id)}
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
                    {postTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {postTags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-[var(--accent-subtle)] px-2 py-0.5 text-[0.625rem] text-[var(--accent)]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                </li>
              );
            })}

          {/* Result count hint */}
          {!loading && results.length > 0 && total > results.length && (
            <li className="py-2 text-center text-xs text-[var(--text-tertiary)]">
              Showing {results.length} of {total} results
            </li>
          )}
        </ul>
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
      <span className="flex-1 text-left">Search posts…</span>
      <kbd className="hidden items-center gap-0.5 rounded-md border border-[var(--border-glass)] bg-[var(--bg-glass)] px-1.5 py-0.5 text-xs font-medium text-[var(--text-tertiary)] sm:inline-flex">
        <Command className="h-3 w-3" />K
      </kbd>
    </button>
  );
}
