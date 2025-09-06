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

export default function Page() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter(); // Initialize useRouter for navigation

  useEffect(() => {
    // Fetch events from the same-origin proxy to avoid CORS differences
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/events', { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const apiEvents: Event[] = await response.json();
        const activeEvents = apiEvents.filter((event: Event) => event.isActive);
        setEvents(activeEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        // Always use a safe fallback in production to keep UX working
        setEvents(FALLBACK_EVENTS);
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