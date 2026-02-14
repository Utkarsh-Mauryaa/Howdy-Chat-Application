import { createContext, useContext, useMemo } from "react";
import io from "socket.io-client";
import { server } from "./config";

const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const socket = useMemo(
    () => io(server, { withCredentials: true }), // though in react 19, it is automatically memoized, so we don't need to write useMemo
    [],
  );

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export {getSocket, SocketProvider}
