import { ICalendarEventApi, ICalendarEventComponentDevExpress } from "../interfaces/CalendarEvent.interfaces";

export function remapCalendarEventsForApplication(events: ICalendarEventApi[]): ICalendarEventComponentDevExpress[] {
  const remappedEvents: ICalendarEventComponentDevExpress[] = [];

  for (const calendarEvent of events) {
    const { eventId: id, ...rest } = calendarEvent;
    remappedEvents.push({ id, ...rest });
  }

  return remappedEvents;
}
