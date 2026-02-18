import { NextResponse } from "next/server";
import type { DownstreamResponse } from "@/types/api";

interface BackendStatsData {
  post_count: number;
  tag_count: number;
}

/**
 * GET /api/stats
 *
 * Proxies to backend GET /api/v1/stats and returns site statistics.
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

    const response = await fetch(`${backendUrl}/api/v1/stats`, {
      cache: "no-store",
    });
    const result: DownstreamResponse<BackendStatsData> = await response.json();

    if (result.code === "OK" && result.data) {
      return NextResponse.json({
        success: true,
        data: {
          postCount: result.data.post_count,
          tagCount: result.data.tag_count,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: result.message || "Failed to fetch stats" },
      { status: 500 },
    );
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
