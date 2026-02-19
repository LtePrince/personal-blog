import { NextResponse } from "next/server";
import type { DownstreamResponse } from "@/types/api";
import { ServerStats } from "@/types/lab";

interface SystemStatus {
  status: ServerStats;
}

/**
 * GET /api/system/stats
 *
 * Proxies to backend GET /api/v1/system/stats and returns system statistics.
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

    const response = await fetch(`${backendUrl}/api/v1/system/stats`, {
      cache: "no-store",
    });
    const result: DownstreamResponse<SystemStatus> = await response.json();

    if (result.code === "OK" && result.data) {
      return NextResponse.json({
        success: true,
        data: {
          cpu: result.data.status.cpu,
          memory: result.data.status.memory,
          disk: result.data.status.disk,
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
