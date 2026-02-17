"use client";

import { useState, useEffect, useCallback } from "react";
import type { BlogPost } from "@/types/blog";
import Navbar from "@/components/layout/Navbar";
import BlogList from "@/components/blog/BlogList";
import BlogSidebar from "@/components/blog/BlogSidebar";
import SearchModal, { SearchTrigger } from "@/components/blog/SearchModal";

interface ClientBlogProps {
  posts: BlogPost[];
}

/**
 * Blog page client shell.
 *
 * Owns the search-modal state and the Ctrl+K global shortcut.
 */
export default function ClientBlog({ posts }: ClientBlogProps) {
  const [searchOpen, setSearchOpen] = useState(false);

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

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <>
      <Navbar />
      <div className="h-16" />

      <div className="mx-auto max-w-6xl px-5 py-8">
        {/* Search trigger bar */}
        <div className="mb-6 flex justify-center">
          <SearchTrigger onClick={() => setSearchOpen(true)} />
        </div>

        {/* Two-column: main list + sidebar */}
        <div className="grid gap-6 md:grid-cols-[1fr_260px]">
          <BlogList posts={posts} />
          <BlogSidebar />
        </div>
      </div>

      {/* Search overlay */}
      <SearchModal posts={posts} open={searchOpen} onClose={closeSearch} />
    </>
  );
}
