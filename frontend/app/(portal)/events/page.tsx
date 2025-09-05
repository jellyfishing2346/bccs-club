"use client"; // This makes it a Client Component

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // For navigation
import HeroSection from "@/app/ui/portal/events/HeroSection";
import CalendarSection from "@/app/ui/portal/events/CalendarSection";
import { Event } from "@/app/utils/types";
import getEventAction from "@/app/lib/actions/getEventsAction";


export const runtime = 'edge';

export default function Page() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter(); // Initialize useRouter for navigation

  useEffect(() => {
    // Fetch events from the backend
    const eventFn = async () => {
      console.log("Starting to fetch events...");
      setLoading(true);
      const event = await getEventAction();
      console.log("Received events:", event);
      
      if(!event) {
        console.log("No events received, setting empty array");
        setEvents([])
      } else {
        const activeEvents = event.filter(k => k.isActive);
        console.log("Active events:", activeEvents.length, "out of", event.length);
        setEvents(activeEvents);
      }
      setLoading(false);
    };
    eventFn();
  }, []);

  // Event click handler to navigate to the specific event page
  const handleEventClick = (a: Event) => {
    router.push(`/events/${a.slug}`);
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