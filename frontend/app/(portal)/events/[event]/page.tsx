import EventPageClient from "@/app/ui/portal/events/EventPageClient";
import { Event } from "@/app/utils/types";

// Generate static params for all event slugs
export async function generateStaticParams() {
  try {
    const response = await fetch('https://api.bccs.club/v1/calendar/events');
    if (!response.ok) {
      return [];
    }
    
    const events = await response.json();
    const activeEvents = events.filter((event: Event) => event.isActive);
    
    return activeEvents.map((event: Event) => ({
      event: event.slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

export default function Page() {
  return <EventPageClient />;
}
