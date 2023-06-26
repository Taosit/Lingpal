import { useSocketContext } from "@/contexts/SocketContext";
import { useEffect } from "react";

export const useRegisterSocketListener = <
  Event extends keyof ReceivingSocketEvent
>(
  event: Event,
  callback: (data: ReceivingSocketEvent[Event]) => void
) => {
  const { socket } = useSocketContext();

  useEffect(() => {
    socket?.on(event, (data: ReceivingSocketEvent[Event]) => {
      console.log("--Receiving:", event, data);
      callback(data);
    });
    return () => {
      socket?.off(event);
    };
  }, [event, callback, socket]);
};
