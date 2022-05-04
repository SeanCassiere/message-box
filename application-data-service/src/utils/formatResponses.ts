import axios from "axios";
import CalendarEvent from "#root/db/entities/CalendarEvent";
import ChatRoom from "#root/db/entities/ChatRoom";
import Task from "#root/db/entities/Task";
import { BaseUserFromAuthServer } from "#root/types/users";
import { log } from "#root/utils/logger";
import { AUTH_SERVICE_URI } from "./constants";

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

export interface ICalendarEventGuest {
  userId: string;
  name: string | null;
}

export interface IFormatCalendarEventResponse {
  event: CalendarEvent;
  guestUsers: ICalendarEventGuest[];
}

export function formatCalendarEventResponse({ event, guestUsers }: IFormatCalendarEventResponse) {
  const startDate = new Date(event.startDate).toISOString();
  const endDate = new Date(event.endDate).toISOString();

  const endOfStartDate = startDate.substring(11, 24);
  const endOfEndDate = endDate.substring(11, 24);

  const isAllDay = endOfStartDate === endOfEndDate;

  return {
    eventId: event.eventId,
    ownerId: event.ownerId,
    title: event.title,
    startDate: event.startDate,
    endDate: event.endDate,
    description: event.description,
    isAllDay: isAllDay,
    sharedWith: guestUsers.map((guest) => ({ userId: guest.userId, name: guest.name ?? "" })),
    updatedAt: event.updatedAt,
  };
}

interface IFormatChatRoomResponse {
  chatRoom: ChatRoom;
  participants: string[];
}
export async function formatChatRoomResponse({ chatRoom, participants }: IFormatChatRoomResponse) {
  let users: BaseUserFromAuthServer[] = [];

  if (participants.length > 0) {
    try {
      const { data: response } = await axios.post(`${AUTH_SERVICE_URI}/clients/getAllBaseUsersForClient`, {
        variables: {
          clientId: chatRoom.clientId,
        },
      });

      users = response.data;
    } catch (error) {
      log.error(`${AUTH_SERVICE_URI}/clients/getAllBaseUsersForClient FAILED FOR FORMAT_CHAT_ROOM_RESPONSE`);
    }
  }

  const filterParticipants: string[] = participants.map((participantId: string) => {
    const user = users.find((user) => user.userId === participantId);
    if (user) {
      return participantId;
    }
    return "NOT";
  });
  const readyParticipants = filterParticipants.filter((participantId: string) => participantId !== "NOT");

  return {
    roomId: `${chatRoom.roomId}`,
    clientId: chatRoom.clientId,
    roomName: chatRoom.roomName,
    participants: readyParticipants,
  };
}
