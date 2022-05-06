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
    REFRESH_STORED_CHAT_ROOM_CACHE: "server-refresh-stored-chat-room-cache",
  },
};

export interface I_RedisIdentifierProps {
  client_namespace: string;
  user_namespace: string;
  client_online_users_namespace: string;
  connected_chat_users_updates_subscription: string;
}
