import { Server, Socket } from "socket.io";

import { redis } from "../redis";
import { log } from "#root/utils/logger";
import { EVENTS, I_RedisIdentifierProps } from "./allEvents";
import { REDIS_CONSTANTS } from "../redis/constants";
import { createActivityLog } from "#root/utils/createActivityLog";

type ClientMessageSent = {
  roomId: string;
  details: { type: string; content: string; senderId: string; senderName: string };
};

export async function setupChatRoomSockets(namespaceValues: I_RedisIdentifierProps, io: Server, socket: Socket) {
  socket.on(EVENTS.CLIENT.JOIN_CHAT_ROOM, async ({ roomId }) => {
    socket.join(`${namespaceValues.client_namespace}:room:${roomId}`);
    log.error(`${socket.handshake.auth.userId} joined room ${roomId}`);
  });

  socket.on(EVENTS.CLIENT.LEAVE_CHAT_ROOM, async ({ roomId }) => {
    socket.leave(`${namespaceValues.client_namespace}:room:${roomId}`);
    log.error(`${socket.handshake.auth.userId} left room ${roomId}`);
  });

  socket.on(EVENTS.CLIENT.SEND_CHAT_MESSAGE, async ({ roomId, details }: ClientMessageSent) => {
    log.error(`${socket.handshake.auth.userId} sent message to room ${roomId}`);
    const message = {
      ...details,
      roomId,
      timestamp: new Date().toISOString(),
      messageId: `${new Date().toISOString()}`,
      message: `${details.content}`,
    };
    io.to(`${namespaceValues.client_namespace}:room:${roomId}`).emit(EVENTS.SERVER.SEND_CHAT_MESSAGE, message);
  });
}
