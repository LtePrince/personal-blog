import { NextResponse } from "next/server";
import type { DownstreamResponse } from "@/types/api";

interface BackendColumnTagItem {
  id: number;
  name: string;
  column_count: number;
}

interface BackendColumnTagsData {
  items: BackendColumnTagItem[];
}

/**
 * GET /api/columns/tags
 *
 * Proxies to backend GET /api/v1/columns/tags — all column tags with counts.
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

    const response = await fetch(`${backendUrl}/api/v1/columns/tags`, {
      cache: "no-store",
    });
    const result: DownstreamResponse<BackendColumnTagsData> =
      await response.json();

    if (result.code === "OK" && result.data) {
      const tags = result.data.items.map((t) => ({
        id: t.id,
        name: t.name,
        columnCount: t.column_count,
      }));
      return NextResponse.json({ success: true, data: tags });
    }

    return NextResponse.json(
      { success: false, error: result.message || "Failed to fetch column tags" },
      { status: 500 },
    );
  } catch (error) {
    console.error("Failed to fetch column tags:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
