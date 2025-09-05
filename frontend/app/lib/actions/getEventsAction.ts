"use server";

import { Event } from "../../utils/types";

export default async function getEventAction(): Promise<Event[] | null> {
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
        startTime: "2025-09-10T18:00:00",
        endTime: "2025-09-10T20:00:00",
        isActive: true,
        rsvpLink: "https://forms.gle/example1"
      },
      {
        id: "2", 
        slug: "game-jam-2025",
        title: "Game Jam 2025",
        description: "Our annual game development competition! Form teams and create amazing games in just 48 hours. Prizes will be awarded for creativity, technical implementation, and overall fun factor.",
        location: "Brooklyn College - Ingersoll Hall",
        startTime: "2025-09-20T09:00:00",
        endTime: "2025-09-22T17:00:00",
        isActive: true,
        rsvpLink: "https://forms.gle/example2"
      },
      {
        id: "3",
        slug: "tech-workshop",
        title: "React Workshop",
        description: "Learn the fundamentals of React.js and build your first interactive web application. Perfect for beginners!",
        location: "Brooklyn College - Boylan Hall 2420",
        startTime: "2025-09-15T14:00:00",
        endTime: "2025-09-15T16:00:00",
        isActive: true,
        rsvpLink: "https://forms.gle/example3"
      }
    ];
  }
}



