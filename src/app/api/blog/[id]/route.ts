import { NextRequest, NextResponse } from "next/server";
import type {
  DownstreamResponse,
  GetBlogData,
} from "@/types/api";
import type { BlogPostDetail } from "@/types/blog";

/**
 * GET /api/blog/[id]
 *
 * Proxies to backend GET /api/v1/blogs/:id.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const backendUrl = process.env.BLOG_BACKEND_URL;
    if (!backendUrl) {
      return NextResponse.json(
        { success: false, error: "Backend URL not configured" },
        { status: 500 },
      );
    }

    const { id } = await params;
    const response = await fetch(`${backendUrl}/api/v1/blogs/${id}`, {
      cache: "no-store",
    });
    const result: DownstreamResponse<GetBlogData> = await response.json();

    if (result.code === "OK" && result.data?.item) {
      const item = result.data.item;
      const post: BlogPostDetail = {
        id: String(item.id),
        title: item.title,
        summary: item.summary,
        date: item.date,
        tags: item.tags ? item.tags.split(",").map((t) => t.trim()) : undefined,
        cover: item.cover || undefined,
        author: item.author || undefined,
        text: item.text,
      };

      return NextResponse.json({ success: true, data: post });
    }

    return NextResponse.json(
      { success: false, error: result.message || "Blog not found" },
      { status: 404 },
    );
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
