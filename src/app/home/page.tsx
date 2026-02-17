import type { Metadata } from "next";
import type { BlogPost } from "@/types/blog";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import LatestPosts from "@/components/home/LatestPosts";
import ProfileCard from "@/components/home/ProfileCard";
import AnnouncementCard from "@/components/home/AnnouncementCard";

export const metadata: Metadata = {
  title: "Home",
};

/** SSR – keep content fresh on every request. */
export const dynamic = "force-dynamic";

/**
 * Fetch the 5 most recent blog posts from the backend.
 * Returns an empty array when the API is unreachable.
 */
async function getLatestPosts(): Promise<BlogPost[]> {
  const data = await apiFetch<BlogPost[]>("blog/recent?limit=5", {
    cache: "no-store",
  });
  if (!Array.isArray(data)) return [];
  return data;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function HomePage() {
  const posts = await getLatestPosts();

  return (
    <>
      <Navbar />

      {/* Spacer for fixed navbar */}
      <div className="h-24" />

      <main className="mx-auto grid max-w-6xl gap-6 px-5 py-8 md:grid-cols-[1fr_280px]">
        {/* ---- Main column: Latest Posts ---- */}
        <LatestPosts posts={posts} />

        {/* ---- Right sidebar ---- */}
        <div className="flex flex-col gap-6">
          <ProfileCard />
          <AnnouncementCard />
        </div>
      </main>
    </>
  );
}
