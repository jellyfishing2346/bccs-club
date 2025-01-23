"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link'; // Import Link component
import EventSection from "@/app/ui/portal/events/EventSection";

export const runtime = 'edge';

export default function Page() {
  const searchParams = useSearchParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const eventParam = searchParams.get('info');
    if (eventParam) {
      try {
        setEvent(JSON.parse(decodeURIComponent(eventParam)));
      } catch (error) {
        console.error('Failed to parse event object:', error);
      }
    }
  }, [searchParams]);
  
  const router = useRouter();
  
  return (
    <main>
      {event != null && (
        <EventSection event={event} />
      )}
      <div className="mt-10 flex justify-center items-center gap-x-6">
        <Link
          href="/events"
          className="rounded-md px-3.5 py-2.5 text-sm font-semibold bg-transparent text-bc-red border border-bc-red hover:bg-bc-yellow hover:border-transparent"
        >
          Go Back to Events Calendar
        </Link>
      </div>
    </main>
  );
}
