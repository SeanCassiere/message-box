export const EVENTS = {
  connection: "connection",
  disconnection: "disconnect",
  CLIENT: {
    FETCH_ONLINE_USERS: "client-fetch-online-users",
    PUBLISH_USER_STATUS: "client-publish-user-status",
    ACTIVATE_INACTIVITY_PROMPT: "client-activate-inactivity-prompt",
  },
  SERVER: {
    SEND_ONLINE_USERS: "server-send-online-users",
    OPEN_INACTIVITY_PROMPT: "server-open-inactivity-prompt",
  },
};

export interface I_RedisIdentifierProps {
  client_namespace: string;
  user_namespace: string;
  client_online_users_namespace: string;
}
