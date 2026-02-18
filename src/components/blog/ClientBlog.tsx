"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { BlogPost } from "@/types/blog";
import Navbar from "@/components/layout/Navbar";
import BlogList from "@/components/blog/BlogList";
import BlogSidebar from "@/components/blog/BlogSidebar";
import Pagination from "@/components/blog/Pagination";
import SearchModal, { SearchTrigger } from "@/components/blog/SearchModal";

const PAGE_SIZE = 10;

/**
 * Blog page client shell.
 *
 * Owns pagination state, search-modal state, and the Ctrl+K shortcut.
 * Page number is synced to the URL search param `?page=N` so that
 * browser back navigation restores the correct page.
 */
export default function ClientBlog() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPage = Math.max(1, Number(searchParams.get("page")) || 1);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(true);
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

  return (
    <>
      <Navbar />
      <div className="h-24" />

      <div className="mx-auto max-w-6xl px-5 py-8">
        {/* Search trigger bar */}
        <div className="mb-6 flex justify-center">
          <SearchTrigger onClick={() => setSearchOpen(true)} />
        </div>

        {/* Two-column: main list + sidebar */}
        <div className="grid gap-6 md:grid-cols-[1fr_260px]">
          <div className="flex flex-col gap-6">
            <BlogList posts={posts} loading={loading} />
            {totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
          <div className="sticky top-24 self-start">
            <BlogSidebar onTagClick={openSearchWithTag} />
          </div>
        </div>
      </div>

      {/* Search overlay */}
      <SearchModal
        open={searchOpen}
        onClose={closeSearch}
        initialTag={searchTag}
      />
    </>
  );
}
