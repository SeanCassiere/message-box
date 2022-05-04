import { io } from "socket.io-client";
import { ISocketUserStatus } from "../interfaces/Socket.interfaces";
import { setOnlineUsersLookupList } from "../redux/slices/lookup/lookupSlice";
import { setAwakeDialogState } from "../redux/slices/user/userSlice";
import store from "../redux/store";

const SOCKET_URI = import.meta.env.VITE_APP_SOCKET_URI ?? "http://localhost:4000";
export const socket = io(SOCKET_URI, {
  autoConnect: false,
  withCredentials: true,
  auth: {
    token: "",
  },
});

export const EVENTS = {
  connection: "connection",
  disconnection: "disconnect",
  CLIENT: {
    FETCH_ONLINE_USERS: "client-fetch-online-users",
    PUBLISH_USER_STATUS: "client-publish-user-status",
    ACTIVATE_INACTIVITY_PROMPT: "client-activate-inactivity-prompt",
    JOIN_CHAT_ROOM: "client-join-chat-room",
    LEAVE_CHAT_ROOM: "client-leave-chat-room",
    SEND_CHAT_MESSAGE: "client-send-chat-message",
  },
  SERVER: {
    SEND_ONLINE_USERS: "server-send-online-users",
    OPEN_INACTIVITY_PROMPT: "server-open-inactivity-prompt",
    SEND_CHAT_MESSAGE: "server-send-chat-message",
  },
};

export function connectSocket(token: string) {
  socket.auth = (cb) => cb({ token });
  console.log("connecting socket...");
  socket.connect();

  socket.on("connect_error", (err) => {
    console.log("connection error to socket.io server");
    console.log(err);
    //
  });

  socket.on(EVENTS.connection, () => {
    console.log("Connecting to the socket.io instance");
  });
}

export const disconnectSocket = () => {
  socket.disconnect();
  console.log("Disconnecting from the socket.io instance");
};

export const socket_listenForOnlineUsers = () => {
  socket.on(EVENTS.SERVER.SEND_ONLINE_USERS, (users) => {
    const response = users as ISocketUserStatus[];
    store.dispatch(setOnlineUsersLookupList(response));
  });
};

export const socket_publishUserStatusChange = (status: string, color: string, kickedOut: boolean = false) => {
  socket.emit(EVENTS.CLIENT.PUBLISH_USER_STATUS, { status, color, kickedOut });
};

export const socket_activateInactivityPromptForUser = (userId: string, name: string) => {
  socket.emit(EVENTS.CLIENT.ACTIVATE_INACTIVITY_PROMPT, { userId, name });
};

export const socket_listenForInactivityPrompt = () => {
  socket.on(EVENTS.SERVER.OPEN_INACTIVITY_PROMPT, () => {
    store.dispatch(setAwakeDialogState(true));
  });
};

export const socket_joinChatRoom = (roomId: string, cb?: (data: any) => void) => {
  console.log(`Joining chat room ${roomId}`);
  socket.emit(EVENTS.CLIENT.JOIN_CHAT_ROOM, { roomId });
  socket.on(EVENTS.SERVER.SEND_CHAT_MESSAGE, (messageDto) => {
    if (messageDto.roomId === roomId) {
      if (cb) {
        cb(messageDto);
      }
    }
  });
};

export const socket_leaveChatRoom = (roomId: string) => {
  console.log(`Leaving chat room ${roomId}`);
  socket.emit(EVENTS.CLIENT.LEAVE_CHAT_ROOM, { roomId });
};

type ClientMessageSent = {
  type: string;
  content: string;
  senderId: string;
  senderName: string;
};

export const socket_sendNewMessage = (roomId: string, details: ClientMessageSent) => {
  console.log(`Sending new message to room ${roomId}`, { details });
  socket.emit(EVENTS.CLIENT.SEND_CHAT_MESSAGE, { roomId, details });
};
