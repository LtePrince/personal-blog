import { NextRequest, NextResponse } from "next/server";
import type {
  DownstreamResponse,
  ListBlogsData,
} from "@/types/api";
import type { BlogPost } from "@/types/blog";

/**
 * GET /api/blog
 *
 * Proxies to backend GET /api/v1/blogs with pagination & filter support.
 * Query params forwarded: page_no, page_size, filter_title, order_by, order.
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
    const response = await fetch(
      `${backendUrl}/api/v1/blogs?${searchParams.toString()}`,
      { cache: "no-store" },
    );
    const result: DownstreamResponse<ListBlogsData> = await response.json();

    if (result.code === "OK" && result.data) {
      // Transform backend items to frontend BlogPost shape.
      const posts: BlogPost[] = result.data.item_list.map((item) => ({
        id: String(item.id),
        title: item.title,
        summary: item.summary,
        date: item.date,
        tags: item.tags && item.tags.length > 0 ? item.tags : undefined,
        cover: item.cover || undefined,
        author: item.author || undefined,
      }));

      return NextResponse.json({
        success: true,
        data: posts,
        total: result.data.total,
      });
    }

    return NextResponse.json(
      { success: false, error: result.message || "Failed to fetch blogs" },
      { status: 500 },
    );
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
