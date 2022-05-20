import axios from "axios";

import CalendarEvent from "#root/db/entities/CalendarEvent";
import ChatRoom from "#root/db/entities/ChatRoom";
import Task from "#root/db/entities/Task";
import DashboardWidget from "#root/db/entities/DashboardWidget";
import ChatMessage from "#root/db/entities/ChatMessage";

import { BaseUserFromAuthServer } from "#root/types/users";
import { log } from "#root/utils/logger";
import { AUTH_SERVICE_URI } from "./constants";
import { getUserIdsFromChatRoomName } from "./minorUtils";

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
  numberOfParticipants: number;
  resolveUsersInChatName?: BaseUserFromAuthServer[];
  currentUserId?: string;
}
export async function formatChatRoomResponse({
  chatRoom,
  participants,
  numberOfParticipants,
  currentUserId,
  resolveUsersInChatName,
}: IFormatChatRoomResponse) {
  let users: BaseUserFromAuthServer[] = [];
  let roomNameFormatted = chatRoom.roomName;
  let guestParticipantId: string | null = null;

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
    const checkArray = resolveUsersInChatName && resolveUsersInChatName?.length > 0 ? resolveUsersInChatName : users;
    const user = checkArray.find((user) => user.userId === participantId);
    if (user) {
      return participantId;
    }
    return "NOT";
  });
  const readyParticipants = filterParticipants.filter((participantId: string) => participantId !== "NOT");

  if (resolveUsersInChatName && resolveUsersInChatName.length > 0 && currentUserId) {
    const { userIds, restOfRootName } = getUserIdsFromChatRoomName(chatRoom.roomName);
    const idsWithoutCurrentUser = userIds.filter((id) => id !== currentUserId);
    if (idsWithoutCurrentUser.length === 1) {
      const findUser = resolveUsersInChatName.find((u) => u.userId === idsWithoutCurrentUser[0]);
      if (findUser) {
        roomNameFormatted = `${findUser.firstName} ${findUser.lastName}${restOfRootName}`;
        guestParticipantId = findUser.userId;
      }
    }
  }

  return {
    roomId: `${chatRoom.roomId}`,
    roomType: numberOfParticipants > 2 ? "group" : "private",
    roomName: roomNameFormatted,
    participants: readyParticipants,
    participantUserId: guestParticipantId,
  };
}

interface IFormatChatMessageResponse {
  messages: ChatMessage[];
  clientId: string;
}
export async function formatChatMessagesResponse({ messages, clientId }: IFormatChatMessageResponse) {
  let users: BaseUserFromAuthServer[] = [];
  if (messages.length > 0) {
    try {
      const { data: response } = await axios.post(`${AUTH_SERVICE_URI}/clients/getAllBaseUsersForClient`, {
        variables: {
          clientId: clientId,
        },
      });

      users = response.data;
    } catch (error) {
      log.error(`${AUTH_SERVICE_URI}/clients/getAllBaseUsersForClient FAILED FOR FORMAT_CHAT_ROOM_RESPONSE`);
    }
  }

  const readyMessages = messages.map((message) => {
    const findUser = users.find((user) => user.userId === message.senderId);
    const name = findUser ? `${findUser.firstName} ${findUser.lastName}` : "No Name";
    return {
      messageId: `${message.messageId}`,
      senderId: message.senderId,
      senderName: name,
      content: message.content,
      type: message.contentType,
      timestamp: message.createdAt.toISOString(),
    };
  });

  return readyMessages;
}

export function formatFullDbWidget({ widget }: { widget: DashboardWidget }) {
  const dto = {
    id: `${widget.id}`,
    widgetType: widget.type,
    widgetName: widget.name,
    widgetScale: widget.scale,
    isWidgetTall: widget.isTall,
    position: {
      x: widget.x,
      y: widget.y,
    },
    config: widget.config,
    variableOptions: widget.variableConfigOptions,
  };

  return dto;
}
