import { useSocketContext } from "@/contexts/SocketContext";
import { useAuthStore } from "@/stores/AuthStore";
import { useGameStore } from "@/stores/GameStore";
import { emitSocketEvent } from "@/utils/helpers";
import { useCallback, useEffect, useMemo, useState } from "react";

export const useCountdownTimer = (
  allowedTime: number,
  deps: any | any[],
  callback: () => void,
  autoStart = false
) => {
  const [time, setTime] = useState(allowedTime);
  const { socket } = useSocketContext();
  const players = useGameStore((state) => state.players);
  const user = useAuthStore((state) => state.user);

  const depsArray = Array.isArray(deps) ? deps : [deps];

  const isUserDescriber = useMemo(() => {
    if (!players || !user) return false;
    return players[user.id]?.isDescriber;
  }, [players, user]);

  const startTimer = useCallback(() => {
    if (isUserDescriber) {
      emitSocketEvent(socket, "set-timer", allowedTime);
    }
  }, [allowedTime, isUserDescriber, socket]);

  useEffect(() => {
    if (!autoStart) return;
    startTimer();
  }, [autoStart, startTimer]);

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

  return {
    time,
    formattedTime: formatTime(time),
    startTimer,
  };
};
