import { PropsWithChildren, createContext, useContext, useEffect, useMemo } from "react";
import { useSocket } from "../hooks/useSocket";
import { Socket } from "socket.io-client";
import { useGameStore } from "@/stores/GameStore";

type SocketContextType = {
  socket: Socket | null;
  connectSocket: () => Socket;
  disconnectSocket: () => void;
};

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocketContext = () => {
  const currentSocketContext = useContext(SocketContext);
  if (!currentSocketContext) {
    throw new Error(
      "useSocketContext has to be used within <SocketContextProvider>"
    );
  }
  return currentSocketContext;
};

if (process.env.NEXT_PUBLIC_SERVER_URL === undefined) {
  throw new Error(
    "NEXT_PUBLIC_SERVER_URL is undefined. Please check your .env file"
  );
}

export const SocketContextProvider = ({ children }: PropsWithChildren) => {
  const { socket, connectSocket, disconnectSocket } = useSocket(
    process.env.NEXT_PUBLIC_SERVER_URL
  );
  const setPlayers = useGameStore((state) => state.setPlayers);

  useEffect(() => {
    const handleUpdatePlayers = (players: Record<string, Player>) => {
      setPlayers(players);
    }
    socket?.on("update-players", handleUpdatePlayers);
    return () => {
      socket?.off("update-players", handleUpdatePlayers);
    }
  }, [setPlayers, socket]);

  const socketContextValue = useMemo(() => ({
    socket, connectSocket, disconnectSocket
  }), [socket, connectSocket, disconnectSocket]);

  return (
    <SocketContext.Provider value={socketContextValue}>
      {children}
    </SocketContext.Provider>
  );
};
