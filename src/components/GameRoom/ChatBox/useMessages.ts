import { useRegisterSocketListener } from "@/hooks/useRegisterSocketListener";
import { useCallback, useMemo } from "react";
import { useInputTextContext } from "../InputTextContext";
import { emitSocketEvent } from "@/utils/helpers";
import { useSocketContext } from "@/contexts/SocketContext";
import { useGameStore } from "@/stores/GameStore";
import { useAuthStore } from "@/stores/AuthStore";
import { shallow } from "zustand/shallow";

export const useMessages = () => {
  const { socket } = useSocketContext();
  const { inputText, setInputText } = useInputTextContext();
  const { players, round, messages, describerOrder, addMessage } = useGameStore(
    (store) => ({
      players: store.players,
      round: store.round,
      describerOrder: store.describerOrder,
      messages: store.messages,
      addMessage: store.addMessage,
    }),
    shallow
  );
  const user = useAuthStore((state) => state.user);

  const describer = Object.values(players).find(
    (p) => p.order === describerOrder
  );
  const isUserDescriber = !!describer && describer?.id === user?.id;

  const targetWord = useMemo(() => {
    if (!describer || !describer.words) return "";
    return describer.words[round];
  }, [describer, round]);

  const receiveMessageListener = useCallback(
    (message: SocketEvent["receive-message"]) => {
      addMessage(message);
    },
    [addMessage]
  );
  useRegisterSocketListener("receive-message", receiveMessageListener);

  const sendMessage = () => {
    if (!inputText) return;
    const message = {
      sender: user!,
      isBot: false as const,
      isDescriber: isUserDescriber,
      text: inputText,
    };
    emitSocketEvent(socket, "send-message", { message, targetWord });
    setInputText("");
  };

  return {
    messages,
    sendMessage,
  };
};
