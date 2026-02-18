import { NextResponse } from "next/server";
import type { DownstreamResponse } from "@/types/api";

interface BackendTagItem {
  id: number;
  name: string;
  post_count: number;
}

interface BackendTagsData {
  items: BackendTagItem[];
}

/**
 * GET /api/tags
 *
 * Proxies to backend GET /api/v1/tags and returns all tags with post counts.
 */
export async function GET() {
  try {
    const backendUrl = process.env.BLOG_BACKEND_URL;
    if (!backendUrl) {
      return NextResponse.json(
        { success: false, error: "Backend URL not configured" },
        { status: 500 },
      );
    }

    const response = await fetch(`${backendUrl}/api/v1/tags`, {
      cache: "no-store",
    });
    const result: DownstreamResponse<BackendTagsData> = await response.json();

    if (result.code === "OK" && result.data) {
      const tags = result.data.items.map((item) => ({
        id: item.id,
        name: item.name,
        postCount: item.post_count,
      }));

      return NextResponse.json({ success: true, data: tags });
    }

    return NextResponse.json(
      { success: false, error: result.message || "Failed to fetch tags" },
      { status: 500 },
    );
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
