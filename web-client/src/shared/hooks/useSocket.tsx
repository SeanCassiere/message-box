import React from "react";

import {
  connectSocket,
  disconnectSocket,
  socket_listenForOnlineUsers,
  socket_listenForInactivityPrompt,
  socket_publishUserStatusChange,
  socket_joinChatRoom,
  socket_leaveChatRoom,
} from "../api/socket.service";

interface ISocketContext {
  connectSocket: typeof connectSocket;
  disconnectSocket: typeof disconnectSocket;
  socket_listenForOnlineUsers: typeof socket_listenForOnlineUsers;
  socket_listenForInactivityPrompt: typeof socket_listenForInactivityPrompt;
  socket_publishUserStatusChange: typeof socket_publishUserStatusChange;
  socket_joinChatRoom: typeof socket_joinChatRoom;
  socket_leaveChatRoom: typeof socket_leaveChatRoom;
}

const initialValues: ISocketContext = {
  connectSocket,
  disconnectSocket,
  socket_listenForOnlineUsers: socket_listenForOnlineUsers,
  socket_listenForInactivityPrompt,
  socket_publishUserStatusChange,
  socket_joinChatRoom,
  socket_leaveChatRoom,
};

const SocketContext = React.createContext<ISocketContext>(initialValues);

export const SocketProvider: React.FC = ({ children }) => {
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

export const useSocket = () => React.useContext(SocketContext);
