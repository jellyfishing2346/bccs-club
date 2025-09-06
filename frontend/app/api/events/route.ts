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
  rrule?: any; // pass-through string or object supported by FullCalendar
  startTime: string;
  endTime: string;
  duration?: string;
  exdate?: string[];
};

function toEvent(e: any): Event | null {
  const rawRrule = e.rrule ?? e.RRULE;
  const rrule = typeof rawRrule === 'string'
    ? rawRrule
    : rawRrule
    ? {
        freq: rawRrule.freq ?? rawRrule.FREQ,
        interval: rawRrule.interval ?? rawRrule.INTERVAL,
        byweekday: rawRrule.byweekday ?? rawRrule.BYDAY,
        dtstart: rawRrule.dtstart ?? rawRrule.DTSTART,
        until: rawRrule.until ?? rawRrule.UNTIL,
      }
    : undefined;

  const start = e.startTime || e.start_time || e.start || (typeof rrule === 'object' ? rrule?.dtstart : undefined) || "";
  const end = e.endTime || e.end_time || e.end || "";
  const slug = e.slug || e.Slug || (e.title ? e.title.toLowerCase().replace(/\s+/g, "-") : undefined);
  const id = e.id ?? e._id ?? slug ?? `${e.title ?? "event"}-${start}`;
  const isActive = typeof e.isActive === "boolean" ? e.isActive : (e.status ? String(e.status).toLowerCase() !== "disabled" : true);

  if (!start && !rrule) return null;

  return {
    id,
    title: e.title ?? e.name ?? "Untitled Event",
    description: e.description ?? "",
    location: e.location ?? "",
    slug: slug ?? String(id),
    isActive,
    rsvpLink: e.rsvpLink ?? e.rsvp_link ?? null,
    rrule,
    startTime: start,
    endTime: end || start,
    duration: e.duration,
    exdate: e.exdate ?? e.exdates,
  };
}

export async function GET(req: Request) {
  try {
    const origin = new URL(req.url).origin;
    const res = await fetch("https://api.bccs.club/v1/calendar/events", {
      headers: {
        Accept: "application/json",
        "User-Agent": "bccs-club-pages-function/1.0 (+https://bccs.club)",
        Origin: origin,
        Referer: `${origin}/events`,
      },
      cache: "no-store",
      redirect: "follow",
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
