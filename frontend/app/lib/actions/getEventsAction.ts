"use server";

import { Event } from "../../utils/types";

export default async function getEventAction(): Promise<Event[] | null> {
  const BACKEND_URL = process.env.BACKEND_URL || "https://api.bccs.club";
  
  try {
    console.log("Fetching events from:", `${BACKEND_URL}/v1/calendar/events`);
    
    const response = await fetch(`${BACKEND_URL}/v1/calendar/events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("API Response not OK:", response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const events: Event[] = await response.json();
    console.log("Successfully fetched", events.length, "events from API");
    return events;
  } catch (error) {
    console.error("Error fetching events from API:", error);
    console.log("Using mock data fallback");
    // Return mock data as fallback for development/demo purposes
    return [
      {
        id: "1",
        slug: "coffee-and-code-night",
        title: "Coffee and Code Night",
        description: "Join us for an evening of coding, collaboration, and coffee! Whether you're working on personal projects, homework, or just want to learn something new, this is the perfect opportunity to connect with fellow computer science students.",
        location: "Brooklyn College Library - Room 213",
        startTime: "2025-02-15T18:00:00",
        endTime: "2025-02-15T20:00:00",
        isActive: true,
        rsvpLink: "https://forms.gle/example1"
      },
      {
        id: "2", 
        slug: "game-jam-2025",
        title: "Game Jam 2025",
        description: "Our annual game development competition! Form teams and create amazing games in just 48 hours. Prizes will be awarded for creativity, technical implementation, and overall fun factor.",
        location: "Brooklyn College - Ingersoll Hall",
        startTime: "2025-03-01T09:00:00",
        endTime: "2025-03-03T17:00:00",
        isActive: true,
        rsvpLink: "https://forms.gle/example2"
      }
    ];
  }
}



