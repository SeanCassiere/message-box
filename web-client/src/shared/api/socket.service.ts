import { io } from "socket.io-client";
import { ISocketUserStatus } from "../interfaces/Socket.interfaces";
import { setOnlineUsersLookupList } from "../redux/slices/lookup/lookupSlice";
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
  },
  SERVER: {
    SEND_ONLINE_USERS: "server-send-online-users",
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

export const listenForOnlineUsers = () => {
  socket.on(EVENTS.SERVER.SEND_ONLINE_USERS, (users) => {
    const response = JSON.parse(users) as ISocketUserStatus[];
    store.dispatch(setOnlineUsersLookupList(response));
  });
};
