import { NextRequest, NextResponse } from "next/server";
import type { DownstreamResponse } from "@/types/api";
import { toColumnDetail, type BackendColumnDetail } from "@/lib/columns";

interface GetColumnData {
  item: BackendColumnDetail;
}

/**
 * GET /api/columns/[slug]
 *
 * Proxies to backend GET /api/v1/columns/:slug (column detail + chapter list).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const backendUrl = process.env.BLOG_BACKEND_URL;
    if (!backendUrl) {
      return NextResponse.json(
        { success: false, error: "Backend URL not configured" },
        { status: 500 },
      );
    }

    const { slug } = await params;
    const response = await fetch(
      `${backendUrl}/api/v1/columns/${encodeURIComponent(slug)}`,
      { cache: "no-store" },
    );
    const result: DownstreamResponse<GetColumnData> = await response.json();

    if (result.code === "OK" && result.data?.item) {
      return NextResponse.json({
        success: true,
        data: toColumnDetail(result.data.item),
      });
    }

    return NextResponse.json(
      { success: false, error: result.message || "Column not found" },
      { status: 404 },
    );
  } catch (error) {
    console.error("Failed to fetch column:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
