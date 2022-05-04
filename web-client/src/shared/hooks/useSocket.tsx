import React from "react";

import {
  connectSocket,
  disconnectSocket,
  socket_listenForOnlineUsers,
  socket_listenForInactivityPrompt,
  socket_publishUserStatusChange,
  socket_joinChatRoom,
  socket_leaveChatRoom,
  socket_sendNewMessage,
} from "../api/socket.service";

interface ISocketContext {
  connectSocket: typeof connectSocket;
  disconnectSocket: typeof disconnectSocket;
  socket_listenForOnlineUsers: typeof socket_listenForOnlineUsers;
  socket_listenForInactivityPrompt: typeof socket_listenForInactivityPrompt;
  socket_publishUserStatusChange: typeof socket_publishUserStatusChange;
  socket_joinChatRoom: typeof socket_joinChatRoom;
  socket_leaveChatRoom: typeof socket_leaveChatRoom;
  socket_sendNewMessage: typeof socket_sendNewMessage;
}

const initialValues: ISocketContext = {
  connectSocket,
  disconnectSocket,
  socket_listenForOnlineUsers: socket_listenForOnlineUsers,
  socket_listenForInactivityPrompt,
  socket_publishUserStatusChange,
  socket_joinChatRoom,
  socket_leaveChatRoom,
  socket_sendNewMessage,
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
