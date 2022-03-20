import { FC, createContext, useContext } from "react";

import { connectSocket, disconnectSocket, listenForOnlineUsers } from "../api/socket.service";

interface ISocketContext {
  connectSocket: typeof connectSocket;
  disconnectSocket: typeof disconnectSocket;
  listenForOnlineUsers: typeof listenForOnlineUsers;
}

const initialValues: ISocketContext = {
  connectSocket,
  disconnectSocket,
  listenForOnlineUsers,
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
