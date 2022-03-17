import CalendarEvent from "#root/db/entities/CalendarEvent";
import Task from "#root/db/entities/Task";

export function formatTaskResponseWithUsers({ task, userIds }: { task: Task; userIds: string[] }) {
  const isTaskOverdue = task.isCompleted === false && task.dueDate && task.dueDate < new Date();
  return {
    taskId: task.taskId,
    ownerId: task.ownerId,
    title: task.title,
    content: task.content,
    sharedWith: userIds,
    bgColor: task.bgColor,
    dueDate: task.dueDate,
    completedDate: task.completedDate,
    isCompleted: task.isCompleted,
    isOverDue: isTaskOverdue,
    updatedAt: task.updatedAt,
  };
}

export interface IFormatCalendarEventResponse {
  event: CalendarEvent;
  guestUsers: { userId: string; name: string | null }[];
}

export function formatCalendarEventResponse({ event, guestUsers }: IFormatCalendarEventResponse) {
  const startDate = new Date(event.endDate).toISOString();
  const endDate = new Date(event.endDate).toISOString();

  const endOfStartDate = startDate.substring(17, 24);
  const endOfEndDate = endDate.substring(17, 24);

  const comparisonString = "00.000Z";

  const isAllDay = endOfStartDate === comparisonString && endOfEndDate === comparisonString;

  return {
    eventId: event.eventId,
    ownerId: event.ownerId,
    title: event.title,
    // startDate: startDate,
    startDate: event.startDate,
    // endDate: endDate,
    endDate: event.endDate,
    isAllDay: isAllDay,
    guests: guestUsers.map((guest) => ({ userId: guest.userId, name: guest.name ?? "" })),
    updatedAt: event.updatedAt,
  };
}
