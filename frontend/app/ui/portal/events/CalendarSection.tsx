import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule"; // Import rrule plugin
import { Event } from "@/app/utils/types";

const Calendar = ({
  handleEventClick,
  events,
}: {
  handleEventClick: (event: Event) => void;
  events: Event[];
}) => {
  // Debug logging
  console.log("CalendarSection received events:", events.length);
  const sept2025Events = events.filter(event => 
    event.startTime && event.startTime.startsWith('2025-09')
  );
  console.log("September 2025 events for calendar:", sept2025Events.length, sept2025Events.slice(0, 3));

  return (
    <div className="mx-auto max-w-4xl px-6 lg:px-8 py-8">
      <div className="overflow-hidden shadow-lg rounded-lg">
        <div className="px-4 py-6">
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              rrulePlugin,
            ]}
            initialView="dayGridMonth"
            initialDate="2025-09-01"
            events={events
              .map((event) => {
                console.log(`CalendarSection mapping event ${event.id}: ${event.title} on ${event.startTime}, isActive: ${event.isActive}`);
                const { endTime: end, startTime: start, id, ...rest } = event;
                return {
                ...rest,
                id: String(id), // Convert id to string for FullCalendar compatibility
                title: event.title,
                start,
                end,
                rrule: event.rrule,
                extendedProps: {
                  description: event.description,
                  isActive: event.isActive,
                  rsvpLink: event.rsvpLink,
                  location: event.location,
                  originalId: event.id,
                  slug: event.slug
                },
              };
            })}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth timeGridWeek timeGridDay",
            }}
            height="auto"
            contentHeight="auto"
            aspectRatio={1.5}
            eventContent={(eventInfo) => (
              <button className="w-full">
                <span className="break-words text-wrap text-sm leading-6">
                  {eventInfo.event.title}
                </span>
              </button>
            )}
            eventClick={(a) => {
              const { description, location } = a.event.extendedProps;
              const { start, title, end } = a.event;
              const startTime = start && start.toString();
              const endTime = end && end.toString();
              handleEventClick({
                rsvpLink: a.event.extendedProps.rsvpLink,
                id: a.event.extendedProps.id,
                isActive: a.event.extendedProps.isActive,
                slug: a.event.extendedProps.slug,
                ...a.event.extendedProps,
                title,
                description,
                location,
                startTime: startTime ? startTime : "",
                endTime: endTime ? endTime : startTime ?? "",
              });
            }} // Attach the event click handler
            dayHeaderClassNames="bg-gray-50 text-sm font-semibold leading-6 text-gray-900"
            dayCellClassNames="text-sm text-gray-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
