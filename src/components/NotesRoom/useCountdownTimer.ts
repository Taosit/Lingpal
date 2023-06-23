import { useSocketContext } from "@/contexts/SocketContext";
import { useAuthStore } from "@/stores/AuthStore";
import { useGameStore } from "@/stores/GameStore";
import { useCallback, useEffect, useState } from "react";

export const useCountdownTimer = (
  allowedTime: number,
  deps: any | any[],
  callback: () => void
) => {
  const [time, setTime] = useState(allowedTime);
  const { socket } = useSocketContext();
  const players = useGameStore((state) => state.players);
  const user = useAuthStore((state) => state.user);

  const depsArray = Array.isArray(deps) ? deps : [deps];

  const isUserFirstPlayer = useCallback(() => {
    return Object.values(players).every(
      (p) => players[user!.id].order <= p.order
    );
  }, [players, user]);

  useEffect(() => {
    if (isUserFirstPlayer()) {
      socket?.emit("note-time", allowedTime);
    }
  }, [allowedTime, isUserFirstPlayer, socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("update-time", (updatedTime: number) => {
      setTime(updatedTime);
      if (updatedTime <= 0) {
        callback();
      }
    });

    return () => {
      socket.off("update-time");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, socket, ...depsArray]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds}`;
  };

  return formatTime(time);
};
