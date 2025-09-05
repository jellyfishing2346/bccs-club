"use server";

import { Event } from "../../utils/types";

export async function getEventsAction(): Promise<Event[] | null> {
  try {
    // Use the working API endpoint directly
    const apiUrl = "https://api.bccs.club/v1/calendar/events";
    console.log("Fetching events from:", apiUrl);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const events: Event[] = await response.json();
    console.log("Successfully fetched", events.length, "events from API");
    return events;



