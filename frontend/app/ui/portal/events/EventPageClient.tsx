"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import EventSection from "@/app/ui/portal/events/EventSection";
import Link from "next/link";
import { Event } from "@/app/utils/types";

export default function EventPageClient() {
  const { event: eventName } = useParams() as { event: string };
  const [event, setEvent] = useState<Event | null>(null);
  const [state, setState] = useState<"error" | "success" | "loading">("loading");

  useEffect(() => {
    const fetchEvent = async () => {
      if (typeof eventName !== "string") return;
      
      try {
        // Use same-origin proxy to avoid CORS and upstream differences
        const response = await fetch('/api/events');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const events: Event[] = await response.json();
        const foundEvent = events.find((e: Event) => e.slug === eventName);
        
        if (!foundEvent) {
          setState("error");
          setEvent({
            id: "404",
            slug: "404",
            isActive: false,
            rsvpLink: "N/A",
            title: "Event Not Found",
            description: "The event you are looking for does not exist.",
            location: "N/A",
            startTime: "",
            endTime: "",
          });
          return;
        }
        
        setEvent(foundEvent);
        setState("success");
      } catch (error) {
        console.error('Failed to fetch event:', error);
        setState("error");
        setEvent({
          id: "404",
          slug: "404",
          isActive: false,
          rsvpLink: "N/A",
          title: "Event Not Found",
          description: "The event you are looking for does not exist.",
          location: "N/A",
          startTime: "",
          endTime: "",
        });
      }
    };
    
    fetchEvent();
  }, [eventName]);

  if (state === "loading") return <div>Loading...</div>;

  return (
    <main>
      {event != null && <EventSection event={event} />}
      <div className="mt-5 flex justify-center items-center gap-x-6">
        <Link
          href="/events"
          rel="noopener noreferrer"
          className="rounded-md px-3.5 py-2.5 text-sm font-semibold bg-transparent text-bc-red border border-bc-red hover:bg-bc-yellow hover:border-transparent"
        >
          Go Back to Events Calendar
        </Link>
      </div>
    </main>
  );
}
