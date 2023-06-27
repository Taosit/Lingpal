import { useRegisterSocketListener } from "@/hooks/useRegisterSocketListener";
import { useCallback, useMemo, useState } from "react";
import { useInputTextContext } from "../InputTextContext";
import { emitSocketEvent } from "@/utils/helpers";
import { useSocketContext } from "@/contexts/SocketContext";
import { useGameStore } from "@/stores/GameStore";
import { useAuthStore } from "@/stores/AuthStore";

export const useMessages = () => {
  const { socket } = useSocketContext();
  const { inputText, setInputText } = useInputTextContext();
  const { players, round, describerIndex } = useGameStore();
  const user = useAuthStore((state) => state.user);

  const [messages, setMessages] = useState<Message[]>([]);

  const describer = Object.values(players).find(
    (p) => p.order === describerIndex
  );

  const isUserDescriber = useMemo(() => {
    return describer?.id === user?.id;
  }, [describer?.id, user?.id]);

  const targetWord = useMemo(() => {
    if (!describer || !describer.words) return "";
    return describer.words[round];
  }, [describer, round]);

  const receiveMessageListener = useCallback(
    (message: SocketEvent["receive-message"]) => {
      setMessages((prev) => [...prev, message]);
    },
    [setMessages]
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
