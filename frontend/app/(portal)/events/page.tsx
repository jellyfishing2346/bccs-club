"use client"; // This makes it a Client Component

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // For navigation
import HeroSection from "@/app/ui/portal/events/HeroSection";
import CalendarSection from "@/app/ui/portal/events/CalendarSection";
import { Event } from "@/app/utils/types";

// Lightweight fallback used when API fails (works in prod and dev)
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
    rsvpLink: "https://forms.gle/example1",
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
    rsvpLink: "https://forms.gle/example2",
  },
];

function withTimeout(input: RequestInfo, init: RequestInit & { timeout?: number } = {}) {
  const { timeout = 5000, ...rest } = init;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  return fetch(input, { ...rest, signal: controller.signal }).finally(() => clearTimeout(id));
}

export default function Page() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter(); // Initialize useRouter for navigation

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // 1) Try same-origin API (Edge Function)
        const res = await withTimeout('/api/events', { cache: 'no-store', timeout: 5000 });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const apiEvents: Event[] = await res.json();
        const activeEvents = apiEvents.filter((e) => e.isActive);
        setEvents(activeEvents);
      } catch (err) {
        console.error('Failed to fetch /api/events:', err);
        try {
          // 2) Fallback to direct public API (CORS should allow GET)
          const res2 = await withTimeout('https://api.bccs.club/v1/calendar/events', { cache: 'no-store', timeout: 5000 });
          if (!res2.ok) throw new Error(`HTTP ${res2.status}`);
          const apiEvents: Event[] = await res2.json();
          const activeEvents = apiEvents.filter((e) => e.isActive);
          setEvents(activeEvents);
        } catch (err2) {
          console.error('Failed to fetch public API:', err2);
          // 3) Final local fallback
          setEvents(FALLBACK_EVENTS);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Event click handler to navigate to the specific event page
  const handleEventClick = (event: Event) => {
    router.push(`/events/${event.slug}`);
  };

  if (loading) {
    return (
      <main>
        <HeroSection />
        <div className="mx-auto max-w-4xl px-6 lg:px-8 py-8">
          <div className="text-center">Loading events...</div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <HeroSection />
      <CalendarSection handleEventClick={handleEventClick} events={events} />
    </main>
  );
}