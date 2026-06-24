import { NextResponse } from "next/server";
import type { DownstreamResponse } from "@/types/api";
import type { Moment } from "@/types/moment";

interface MomentsData {
  items: Moment[];
}

/**
 * GET /api/moments
 *
 * Proxies to backend GET /api/v1/moments and returns the timeline entries
 * (already sorted newest-first by the backend).
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

    const response = await fetch(`${backendUrl}/api/v1/moments`, {
      cache: "no-store",
    });
    const result: DownstreamResponse<MomentsData> = await response.json();

    if (result.code === "OK" && result.data) {
      return NextResponse.json({ success: true, data: result.data.items });
    }

    return NextResponse.json(
      { success: false, error: result.message || "Failed to fetch moments" },
      { status: 500 },
    );
  } catch (error) {
    console.error("Failed to fetch moments:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
