import axios from "axios";
import { Server, Socket } from "socket.io";

import { log } from "#root/utils/logger";
import { EVENTS, I_RedisIdentifierProps } from "./allEvents";
import { APP_DATA_SERVICE_URI } from "#root/constants";
import { createActivityLog } from "#root/utils/createActivityLog";

type ClientMessageSent = {
  roomId: string;
  details: { type: string; content: string; senderId: string; senderName: string };
};

export async function setupChatRoomSockets(namespaceValues: I_RedisIdentifierProps, io: Server, socket: Socket) {
  socket.on(EVENTS.CLIENT.JOIN_CHAT_ROOM, async ({ roomId }) => {
    socket.join(`${namespaceValues.client_namespace}:room:${roomId}`);
    log.info(`${socket.handshake.auth.userId} joined room ${roomId}`);

    createActivityLog({
      clientId: socket.handshake.auth.clientId,
      userId: socket.handshake.auth.userId,
      action: "chat-room-join",
      description: `Joined chat room, where roomId:${roomId}`,
    }).then(() => {
      log.info(`Activity log created for userId: ${socket.handshake.auth.userId}`);
    });
  });

  socket.on(EVENTS.CLIENT.LEAVE_CHAT_ROOM, async ({ roomId }) => {
    socket.leave(`${namespaceValues.client_namespace}:room:${roomId}`);
    log.error(`${socket.handshake.auth.userId} left room ${roomId}`);
    createActivityLog({
      clientId: socket.handshake.auth.clientId,
      userId: socket.handshake.auth.userId,
      action: "chat-room-leave",
      description: `Left chat room, where roomId:${roomId}`,
    }).then(() => {
      log.info(`Activity log created for userId: ${socket.handshake.auth.userId}`);
    });
  });

  socket.on(EVENTS.CLIENT.SEND_CHAT_MESSAGE, async ({ roomId, details }: ClientMessageSent) => {
    log.info(`${socket.handshake.auth.userId} sent message to room ${roomId}`);
    const message = {
      ...details,
      roomId,
      timestamp: new Date().toISOString(),
      message: `${details.content}`,
    };

    axios
      .post(`${APP_DATA_SERVICE_URI}/chat/createMessageForChatRoom`, {
        variables: {
          clientId: socket.handshake.auth.clientId,
          userId: socket.handshake.auth.userId,
          roomId,
          sendResponse: false,
        },
        body: {
          content: message.message,
          type: message.type,
          senderId: message.senderId,
        },
      })
      .then((res) => {
        if (res.status !== 200) {
          log.error(
            `Sending message failed for Room ID ${roomId} by ${socket.handshake.auth.userId}, Status Code: ${res.status}`
          );
        } else {
          io.to(`${namespaceValues.client_namespace}:room:${roomId}`).emit(EVENTS.SERVER.SEND_CHAT_MESSAGE, {
            ...message,
            messageId: res.data?.data?.messageId,
          });
          log.info("new message Id is ", res.data?.data?.messageId);
        }
      })
      .catch((err) => {
        log.error(`Sending message failed for Room ID ${roomId} by ${socket.handshake.auth.userId}`, err);
      });
  });
}
