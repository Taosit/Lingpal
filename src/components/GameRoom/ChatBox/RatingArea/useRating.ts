import { useSocketContext } from "@/contexts/SocketContext";
import { useRegisterSocketListener } from "@/hooks/useRegisterSocketListener";
import { emitSocketEvent } from "@/utils/helpers";
import { useCallback, useState } from "react";

export const useRating = () => {
  const { socket } = useSocketContext();

  const [rating, setRating] = useState(0);
  const [finalRating, setFinalRating] = useState(0);

  const ratingUpdateListener = useCallback(
    (averageRating: SocketEvent["rating-update"]) => {
      setFinalRating(averageRating);
    },
    []
  );
  useRegisterSocketListener("rating-update", ratingUpdateListener);

  const rate = (value: number) => {
    setRating(value);
    emitSocketEvent(socket, "send-rating", value);
    setTimeout(() => {
      setRating(10);
    }, 1000);
  };

  return {
    rating,
    finalRating,
    rate,
  };
};
