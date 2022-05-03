export const EVENTS = {
  connection: "connection",
  disconnection: "disconnect",
  CLIENT: {
    FETCH_ONLINE_USERS: "client-fetch-online-users",
    PUBLISH_USER_STATUS: "client-publish-user-status",
  },
  SERVER: {
    SEND_ONLINE_USERS: "server-send-online-users",
  },
};

export interface I_RedisIdentifierProps {
  client_namespace: string;
  user_namespace: string;
  client_online_users_namespace: string;
}
