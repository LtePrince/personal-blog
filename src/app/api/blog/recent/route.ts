import { NextRequest, NextResponse } from "next/server";
import type {
  DownstreamResponse,
  RecentBlogsData,
} from "@/types/api";
import type { BlogPost } from "@/types/blog";

/**
 * GET /api/blog/recent
 *
 * Proxies to backend GET /api/v1/blogs/recent.
 * Query params forwarded: limit.
 */
export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.BLOG_BACKEND_URL;
    if (!backendUrl) {
      return NextResponse.json(
        { success: false, error: "Backend URL not configured" },
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "5";
    const response = await fetch(
      `${backendUrl}/api/v1/blogs/recent?limit=${limit}`,
      { cache: "no-store" },
    );
    const result: DownstreamResponse<RecentBlogsData> = await response.json();

    if (result.code === "OK" && result.data) {
      const posts: BlogPost[] = result.data.item_list.map((item) => ({
        id: String(item.id),
        title: item.title,
        summary: item.summary,
        date: item.date,
        tags: item.tags ? item.tags.split(",").map((t) => t.trim()) : undefined,
        cover: item.cover || undefined,
        author: item.author || undefined,
      }));

      return NextResponse.json({ success: true, data: posts });
    }

    return NextResponse.json(
      { success: false, error: result.message || "Failed to fetch recent blogs" },
      { status: 500 },
    );
  } catch (error) {
    console.error("Failed to fetch recent blogs:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
