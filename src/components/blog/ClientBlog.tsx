"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { BlogPost } from "@/types/blog";
import type { ColumnItem } from "@/types/column";
import { cn } from "@/lib/utils";
import { useLocale } from "@/contexts/LocaleContext";
import Navbar from "@/components/layout/Navbar";
import BlogList from "@/components/blog/BlogList";
import ColumnList from "@/components/column/ColumnList";
import BlogSidebar from "@/components/blog/BlogSidebar";
import Pagination from "@/components/blog/Pagination";
import SearchModal, { SearchTrigger } from "@/components/blog/SearchModal";

const PAGE_SIZE = 10;

type View = "posts" | "columns";

const VIEW_LABEL: Record<View, Record<"en" | "zh-CN", string>> = {
  posts: { en: "Blogs", "zh-CN": "文章" },
  columns: { en: "Columns", "zh-CN": "专栏" },
};

/**
 * Blog page client shell.
 *
 * Owns the post pagination, the posts/columns view toggle (pure client-side
 * switch over two pre-fetched datasets), the search-modal state and Ctrl+K.
 */
export default function ClientBlog() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLocale();

  const initialPage = Math.max(1, Number(searchParams.get("page")) || 1);

  const [view, setView] = useState<View>("posts");

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(true);

  const [columns, setColumns] = useState<ColumnItem[]>([]);
  const [columnsLoading, setColumnsLoading] = useState(true);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTag, setSearchTag] = useState<string | undefined>(undefined);

  /* Fetch a page of posts */
  const fetchPage = useCallback(async (pageNo: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page_no: String(pageNo),
        page_size: String(PAGE_SIZE),
      });
      const res = await fetch(`/api/blog?${params.toString()}`);
      const body = await res.json();
      if (body.success) {
        setPosts(body.data ?? []);
        setTotal(body.total ?? 0);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* Fetch all columns once */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/columns?page_size=100");
        const body = await res.json();
        if (body.success) setColumns(body.data ?? []);
      } catch (err) {
        console.error("Failed to fetch columns:", err);
      } finally {
        setColumnsLoading(false);
      }
    })();
  }, []);

  /* Handle page change: update state + URL */
  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      const url = newPage === 1 ? "/blog" : `/blog?page=${newPage}`;
      router.push(url, { scroll: false });
    },
    [router],
  );

  /* Initial fetch + refetch on page change */
  useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  /* Global Ctrl/Cmd + K shortcut */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setSearchTag(undefined);
  }, []);

  /** Open search modal with an optional pre-selected tag. */
  const openSearchWithTag = useCallback((tag: string) => {
    setSearchTag(tag);
    setSearchOpen(true);
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const count =
    view === "posts"
      ? t({ en: `${total} posts`, "zh-CN": `${total} 篇` })
      : t({ en: `${columns.length} columns`, "zh-CN": `${columns.length} 个专栏` });

  return (
    <>
      <Navbar />
      <div className="h-24" />

      <div className="mx-auto max-w-6xl px-5 py-8">
        {/* Search trigger bar */}
        <div className="mb-6 flex justify-center">
          <SearchTrigger onClick={() => setSearchOpen(true)} />
        </div>

        {/* View toggle row — above the grid, so the sidebar aligns with the
            list cards rather than with the toggle. */}
        <div className="mb-4 flex items-center justify-between">
          <div className="inline-flex rounded-full border border-[var(--border-glass)] bg-[var(--bg-glass)] p-0.5">
            {(["posts", "columns"] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  view === v
                    ? "bg-[var(--accent)] text-white"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                )}
              >
                {t(VIEW_LABEL[v])}
              </button>
            ))}
          </div>
          <span className="text-sm text-[var(--text-tertiary)]">{count}</span>
        </div>

        {/* Two-column: main list + sidebar */}
        <div className="grid gap-6 md:grid-cols-[1fr_260px]">
          <div className="flex flex-col gap-6">
            {view === "posts" ? (
              <>
                <BlogList posts={posts} loading={loading} />
                {totalPages > 1 && (
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <ColumnList columns={columns} loading={columnsLoading} />
            )}
          </div>
          <div className="sticky top-24 self-start">
            <BlogSidebar onTagClick={openSearchWithTag} />
          </div>
        </div>
      </div>

      {/* Search overlay — mounted only while open so it resets each time. */}
      {searchOpen && (
        <SearchModal open onClose={closeSearch} initialTag={searchTag} />
      )}
    </>
  );
}
