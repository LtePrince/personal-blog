import type { Metadata } from "next";
import type { BlogPost } from "@/types/blog";
import type { Moment } from "@/types/moment";
import { apiFetch } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import LatestPosts from "@/components/home/LatestPosts";
import Moments from "@/components/home/Moments";
import ProfileCard from "@/components/home/ProfileCard";
import AnnouncementCard from "@/components/home/AnnouncementCard";
import SiteStats from "@/components/home/SiteStats";

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

/** Fetch the one-line personal moments timeline (newest first). */
async function getMoments(): Promise<Moment[]> {
  const data = await apiFetch<Moment[]>("moments?limit=5", {
    cache: "no-store",
  });
  return Array.isArray(data) ? data : [];
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function HomePage() {
  const [posts, moments] = await Promise.all([
    getLatestPosts(),
    getMoments(),
  ]);

  return (
    <>
      <Navbar />

      {/* Spacer for fixed navbar */}
      <div className="h-24" />

      <main className="mx-auto grid max-w-6xl gap-6 px-5 py-8 md:grid-cols-[1fr_280px]">
        {/* ---- Main column: Latest Posts + Moments ---- */}
        <div className="flex flex-col gap-6">
          <LatestPosts posts={posts} />
          <Moments items={moments} />
        </div>

        {/* ---- Right sidebar ---- */}
        <div className="sticky top-24 flex flex-col gap-6 self-start">
          <ProfileCard />
          <AnnouncementCard />
          <SiteStats />
        </div>
      </main>
    </>
  );
}
