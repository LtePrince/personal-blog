import { NextRequest, NextResponse } from "next/server";
import type { DownstreamResponse } from "@/types/api";
import type { ColumnItem } from "@/types/column";
import { toColumnItem, type BackendColumnItem } from "@/lib/columns";

interface ListColumnsData {
  total: number;
  item_list: BackendColumnItem[];
}

/**
 * GET /api/columns
 *
 * Proxies to backend GET /api/v1/columns with pagination & filter support.
 * Query params forwarded: page_no, page_size, filter_title, filter_tag, order_by, order.
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
      `${backendUrl}/api/v1/columns?${searchParams.toString()}`,
      { cache: "no-store" },
    );
    const result: DownstreamResponse<ListColumnsData> = await response.json();

    if (result.code === "OK" && result.data) {
      const items: ColumnItem[] = result.data.item_list.map(toColumnItem);
      return NextResponse.json({
        success: true,
        data: items,
        total: result.data.total,
      });
    }

    return NextResponse.json(
      { success: false, error: result.message || "Failed to fetch columns" },
      { status: 500 },
    );
  } catch (error) {
    console.error("Failed to fetch columns:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
