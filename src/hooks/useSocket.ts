import { useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (serverPath: string | undefined) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const connectSocket = useCallback(() => {
    if (!serverPath) {
      throw new Error("Please provide a server path in .env");
    }
    if (socket && socket.connected) return socket;
    const socketTemp: Socket = io(serverPath);
    setSocket(socketTemp);
    return socketTemp;
  }, [serverPath, socket]);

  const disconnectSocket = useCallback(() => {
    socket?.disconnect();
  }, [socket]);

  return {
    socket,
    connectSocket,
    disconnectSocket,
  };
};
