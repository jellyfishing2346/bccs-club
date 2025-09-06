import { NextResponse } from "next/server";

// Run this API route on the Edge runtime for Cloudflare Pages Functions
export const runtime = "edge";

// Optional upstream configuration via environment variables for a permanent fix
// Set these in Cloudflare Pages Project > Settings > Environment Variables
const UPSTREAM_URL = process.env.EVENTS_API_URL ?? "https://api.bccs.club/v1/calendar/events";
const AUTH_BEARER = process.env.EVENTS_API_BEARER; // e.g. "eyJhbGciOi..."
const API_KEY = process.env.EVENTS_API_KEY; // e.g. for x-api-key
const BASIC_USER = process.env.EVENTS_API_BASIC_USER;
const BASIC_PASS = process.env.EVENTS_API_BASIC_PASS;
const EXTRA_HEADERS_JSON = process.env.EVENTS_API_EXTRA_HEADERS; // JSON string of additional headers

function buildUpstreamHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "User-Agent": "bccs-club-pages-function/1.0 (+https://bccs.club)",
  };

  if (AUTH_BEARER) headers["Authorization"] = `Bearer ${AUTH_BEARER}`;
  if (API_KEY) headers["x-api-key"] = API_KEY;
  if (BASIC_USER && BASIC_PASS && !headers["Authorization"]) {
    // Edge runtime provides btoa
    const token = btoa(`${BASIC_USER}:${BASIC_PASS}`);
    headers["Authorization"] = `Basic ${token}`;
  }
  if (EXTRA_HEADERS_JSON) {
    try {
      const extra = JSON.parse(EXTRA_HEADERS_JSON);
      for (const [k, v] of Object.entries(extra)) {
        if (typeof v === "string" && v) headers[k] = v;
      }
    } catch {
      // ignore malformed EXTRA_HEADERS_JSON
    }
  }
  return headers;
}

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

// Minimal production-safe fallback so calendar isn't empty during upstream outages.
const FALLBACK_EVENTS: Event[] = [
  {
    id: "1",
    slug: "coffee-and-code-night",
    title: "Coffee and Code Night",
    description: "Join us for an evening of coding, collaboration, and coffee!",
    location: "Brooklyn College Library - Room 213",
    startTime: "2025-09-10T18:00:00",
    endTime: "2025-09-10T20:00:00",
    isActive: true,
    rsvpLink: null,
  },
  {
    id: "2",
    slug: "game-jam-2025",
    title: "Game Jam 2025",
    description: "Our annual game development competition!",
    location: "Brooklyn College - Ingersoll Hall",
    startTime: "2025-09-20T09:00:00",
    endTime: "2025-09-22T17:00:00",
    isActive: true,
    rsvpLink: null,
  },
];

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

async function fetchWithRetry(url: string, init: RequestInit, attempts = 2): Promise<Response> {
  let lastErr: any;
  for (let i = 0; i <= attempts; i++) {
    try {
      const res = await fetch(url, init);
      return res;
    } catch (err) {
      lastErr = err;
      // small backoff
      await new Promise((r) => setTimeout(r, 150 * (i + 1)));
    }
  }
  throw lastErr;
}

export async function GET() {
  try {
    const headers = buildUpstreamHeaders();
    const res = await fetchWithRetry(UPSTREAM_URL, {
      headers,
      cache: "no-store",
      redirect: "follow",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      // Serve fallback so UI keeps working
      return new NextResponse(JSON.stringify(FALLBACK_EVENTS), {
        status: 200,
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store",
          "x-upstream-url": UPSTREAM_URL,
          "x-upstream-status": String(res.status),
          "x-upstream-body": text?.slice(0, 200) || "",
          "x-fallback": "true",
        },
      });
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
    // Network or DNS error: also serve fallback
    return new NextResponse(JSON.stringify(FALLBACK_EVENTS), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
        "x-upstream-url": UPSTREAM_URL,
        "x-error": String(err?.message ?? err),
        "x-fallback": "true",
      },
    });
  }
}
