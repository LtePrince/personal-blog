import { NextRequest, NextResponse } from "next/server";
import type { DownstreamResponse } from "@/types/api";
import { toChapterView, type BackendChapterView } from "@/lib/columns";

interface GetChapterData {
  item: BackendChapterView;
}

/**
 * GET /api/columns/[slug]/chapters/[chapter]
 *
 * Proxies to backend GET /api/v1/columns/:slug/chapters/:chapter — the full
 * chapter reading view (body + chapter list + prev/next).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string; chapter: string }> },
) {
  try {
    const backendUrl = process.env.BLOG_BACKEND_URL;
    if (!backendUrl) {
      return NextResponse.json(
        { success: false, error: "Backend URL not configured" },
        { status: 500 },
      );
    }

    const { slug, chapter } = await params;
    const response = await fetch(
      `${backendUrl}/api/v1/columns/${encodeURIComponent(slug)}/chapters/${encodeURIComponent(chapter)}`,
      { cache: "no-store" },
    );
    const result: DownstreamResponse<GetChapterData> = await response.json();

    if (result.code === "OK" && result.data?.item) {
      return NextResponse.json({
        success: true,
        data: toChapterView(result.data.item),
      });
    }

    return NextResponse.json(
      { success: false, error: result.message || "Chapter not found" },
      { status: 404 },
    );
  } catch (error) {
    console.error("Failed to fetch chapter:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
