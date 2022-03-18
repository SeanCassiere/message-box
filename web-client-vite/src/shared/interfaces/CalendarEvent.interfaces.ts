export interface ICalendarEventBase {
  title: string;
  ownerId: string;
  isAllDay: boolean;
  description: string;
  startDate: string;
  endDate: string;
  sharedWith: ICalendarEventGuestUser[];
}

export interface ICalendarEventApi extends ICalendarEventBase {
  eventId: string;
}

export interface ICalendarEventComponentDevExpress extends ICalendarEventBase {
  id: string;
}

export interface ICalendarEventGuestUser {
  userId: string;
  name: string;
}
