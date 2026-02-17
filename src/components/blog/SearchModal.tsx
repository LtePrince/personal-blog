"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Command } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  posts: BlogPost[];
  open: boolean;
  onClose: () => void;
}

/**
 * Full-screen search overlay triggered by Ctrl+K or the search bar.
 */
export default function SearchModal({ posts, open, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  const results = query.trim()
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.summary?.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  /* Focus input when opened */
  useEffect(() => {
    if (open) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

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
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none"
          />
          <button
            onClick={onClose}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--accent-subtle)] text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <ul className="mt-3 max-h-[40vh] overflow-y-auto">
          {query.trim() && results.length === 0 && (
            <li className="py-6 text-center text-sm text-[var(--text-tertiary)]">
              No results found.
            </li>
          )}
          {results.map((post) => (
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
              </button>
            </li>
          ))}
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
