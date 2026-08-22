import type { Metadata } from "next";
import type { BlogPost } from "@/types/blog";
import type { ColumnItem, ColumnDetail } from "@/types/column";
import type { FeedItem } from "@/types/feed";
import type { Moment } from "@/types/moment";
import { apiFetch } from "@/lib/api";
import { buildFeed } from "@/lib/feed";
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

const LATEST_LIMIT = 5;

/**
 * Build the latest feed: recent blog posts merged with every column chapter,
 * newest first. Each source degrades to empty when its API is unreachable, so
 * one being down still leaves the other on the page.
 */
async function getLatestFeed(): Promise<FeedItem[]> {
  const [posts, columns] = await Promise.all([
    apiFetch<BlogPost[]>(`blog/recent?limit=${LATEST_LIMIT}`, { cache: "no-store" }),
    apiFetch<ColumnItem[]>("columns?page_size=100", { cache: "no-store" }),
  ]);

  // The list endpoint carries chapter counts, not the chapters themselves, so
  // each column needs its detail fetched to expand into per-chapter entries.
  const details = await Promise.all(
    (columns ?? []).map((c) =>
      apiFetch<ColumnDetail>(`columns/${encodeURIComponent(c.slug)}`, {
        cache: "no-store",
      }),
    ),
  );

  return buildFeed(
    Array.isArray(posts) ? posts : [],
    details.filter((d): d is ColumnDetail => d !== null),
    LATEST_LIMIT,
  );
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
  const [feed, moments] = await Promise.all([
    getLatestFeed(),
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
          <LatestPosts items={feed} />
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
