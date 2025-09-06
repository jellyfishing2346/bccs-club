import { NextResponse } from "next/server";

// Run this API route on the Edge runtime for Cloudflare Pages Functions
export const runtime = "edge";

type Event = {
  id: string | number;
  title: string;
  description: string;
  location: string;
  slug: string;
  isActive: boolean;
  rsvpLink: string | null;
  rrule?: {
    freq?: string;
    interval?: number;
    byweekday?: string | string[];
    dtstart?: string;
    until?: string;
  };
  startTime: string;
  endTime: string;
  duration?: string;
  exdate?: string[];
};

function toEvent(e: any): Event | null {
  const rrule = e.rrule || e.RRULE || undefined;
  const start = e.startTime || e.start_time || e.start || rrule?.dtstart || "";
  const end = e.endTime || e.end_time || e.end || "";
  const slug = e.slug || e.Slug || (e.title ? e.title.toLowerCase().replace(/\s+/g, "-") : undefined);
  const id = e.id ?? e._id ?? slug ?? `${e.title ?? "event"}-${start}`;
  const isActive = typeof e.isActive === "boolean" ? e.isActive : (e.status ? String(e.status).toLowerCase() !== "disabled" : true);

  // If neither start nor rrule present, skip
  if (!start && !rrule) return null;

  return {
    id,
    title: e.title ?? e.name ?? "Untitled Event",
    description: e.description ?? "",
    location: e.location ?? "",
    slug: slug ?? String(id),
    isActive,
    rsvpLink: e.rsvpLink ?? e.rsvp_link ?? null,
    rrule: rrule ? {
      freq: rrule.freq ?? rrule.FREQ,
      interval: rrule.interval ?? rrule.INTERVAL,
      byweekday: rrule.byweekday ?? rrule.BYDAY,
      dtstart: rrule.dtstart ?? rrule.DTSTART ?? start,
      until: rrule.until ?? rrule.UNTIL,
    } : undefined,
    startTime: start,
    endTime: end || start,
    duration: e.duration,
    exdate: e.exdate ?? e.exdates,
  };
}

export async function GET() {
  try {
    const res = await fetch("https://api.bccs.club/v1/calendar/events", {
      headers: {
        Accept: "application/json",
        "User-Agent": "bccs-club-pages-function/1.0 (+https://bccs.club)",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { error: "Upstream API error", status: res.status, body: text?.slice(0, 500) },
        { status: res.status }
      );
    }

    const data = await res.json();
    const mapped = Array.isArray(data)
      ? data.map(toEvent).filter((e: Event | null): e is Event => !!e)
      : [];

    return new NextResponse(JSON.stringify(mapped), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        // Cache at the edge for 5 minutes, allow stale for a day
        "cache-control": "public, s-maxage=300, stale-while-revalidate=86400",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch events from upstream", message: String(err?.message ?? err) },
      { status: 502 }
    );
  }
}
