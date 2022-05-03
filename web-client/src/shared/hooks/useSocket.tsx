import { FC, createContext, useContext } from "react";

import {
  connectSocket,
  disconnectSocket,
  listenForOnlineUsers,
  socket_listenForInactivityPrompt,
} from "../api/socket.service";

interface ISocketContext {
  connectSocket: typeof connectSocket;
  disconnectSocket: typeof disconnectSocket;
  listenForOnlineUsers: typeof listenForOnlineUsers;
  socket_listenForInactivityPrompt: typeof socket_listenForInactivityPrompt;
}

const initialValues: ISocketContext = {
  connectSocket,
  disconnectSocket,
  listenForOnlineUsers,
  socket_listenForInactivityPrompt,
};

const SocketContext = createContext<ISocketContext>(initialValues);

export const SocketProvider: FC = ({ children }) => {
  return (
    <SocketContext.Provider
      value={{
        ...initialValues,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
