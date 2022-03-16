export interface ICalendarEvent {
  title: string;
  ownerId: string;
  isAllDay: boolean;
  description: string;
  startDate: string;
  endDate: string;
  sharedWith: ICalendarEventGuestUser[];
}

export interface ICalendarEventGuestUser {
  userId: string;
  name: string;
}
