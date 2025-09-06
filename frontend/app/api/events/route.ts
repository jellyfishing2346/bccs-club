import { NextResponse } from "next/server";

// Run this API route on the Edge runtime for Cloudflare Pages Functions
export const runtime = "edge";

export async function GET() {
  try {
    const res = await fetch("https://api.bccs.club/v1/calendar/events", {
      // Avoid caching at the browser; cache at the edge for a short time
      headers: { Accept: "application/json" },
      // Let Cloudflare cache at the edge (configured via response headers below)
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream API error", status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();

    return new NextResponse(JSON.stringify(data), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        // Cache at the edge for 5 minutes, allow stale for a day
        "cache-control": "public, s-maxage=300, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch events from upstream" },
      { status: 502 }
    );
  }
}
