import EventPageClient from "@/app/ui/portal/events/EventPageClient";

// Avoid build-time fetching of upstream by disabling static params generation
// and letting the client/server fetch at runtime instead.
export const dynamic = "force-dynamic";
export const runtime = "edge";

export default function Page() {
  return <EventPageClient />;
}
