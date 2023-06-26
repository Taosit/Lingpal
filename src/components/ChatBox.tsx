import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import StarRatings from "react-star-ratings";
import { useAuthStore } from "../stores/AuthStore";
import { useSocketContext } from "../contexts/SocketContext";
import useWindowSize from "../hooks/useWindowSize";
import { useGameStore } from "@/stores/GameStore";
import { emitSocketEvent } from "@/utils/helpers";
import { useRegisterSocketListener } from "@/hooks/useRegisterSocketListener";

type Props = {
  inputText: string;
  setInputText: (text: string) => void;
  setDisplay: (display: "notes" | "chatbox") => void;
  showFeedbackField: boolean;
};

const ChatBox = ({
  inputText,
  setInputText,
  setDisplay,
  showFeedbackField,
}: Props) => {
  const { socket } = useSocketContext();
  const { players, round, describerIndex } = useGameStore();
  const user = useAuthStore((state) => state.user);

  const [rating, setRating] = useState(0);
  const [finalRating, setFinalRating] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);

  const windowSize = useWindowSize();
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const messageLength = useRef(0);

  const describer = Object.values(players).find(
    (p) => p.order === describerIndex
  );

  const isUserDescriber = useMemo(() => {
    return players[user!.id].isDescriber;
  }, [players, user]);

  const targetWord = useMemo(() => {
    if (!describer || !describer.words) return "";
    return describer.words[round];
  }, [describer, round]);

  const sendBotMessage = useCallback(
    (text: string) => {
      const message: BotMessage = {
        sender: null,
        isBot: true,
        isDescriber: null,
        text,
      };
      setMessages((prev) => [...prev, message]);
    },
    [setMessages]
  );

  const receiveMessageListener = useCallback(
    (message: SocketEvent["receive-message"]) => {
      setMessages((prev) => [...prev, message]);
    },
    [setMessages]
  );
  useRegisterSocketListener("receive-message", receiveMessageListener);

  const turnUpdateListener = useCallback(
    ({ nextRound, nextDesc, players }: SocketEvent["turn-updated"]) => {
      if (nextRound !== round) return;
      const newDescriber = Object.values(players).find(
        (p) => p.order === nextDesc
      );
      if (!newDescriber) throw new Error("describer not found");
      const newDescriberLabel =
        newDescriber.id === user?.id
          ? "You are"
          : `${newDescriber.username.replace(
              newDescriber.username[0],
              newDescriber.username[0].toUpperCase()
            )} is`;
      sendBotMessage(`${newDescriberLabel} describing now.`);
    },
    [round, sendBotMessage, user?.id]
  );
  useRegisterSocketListener("turn-updated", turnUpdateListener);

  const playerLeftListener = useCallback(
    ({
      disconnectingPlayer,
      nextDesc,
      nextRound,
    }: SocketEvent["player-left"]) => {
      const { [disconnectingPlayer.id]: _, ...remainingPlayers } = players;

      let messageText = `${disconnectingPlayer.username} left the game.`;
      if (Object.keys(remainingPlayers).length === 1) {
        messageText += ` There aren't enough players to continue the game.`;
        sendBotMessage(messageText);
        return;
      }
      if (nextDesc !== undefined && nextRound !== undefined) {
        messageText += `It's ${
          isUserDescriber ? "your" : `${describer?.username || "Player"}'s`
        } turn to describe.`;
      }
      sendBotMessage(messageText);
    },
    [describer?.username, isUserDescriber, players, sendBotMessage]
  );
  useRegisterSocketListener("player-left", playerLeftListener);

  const ratingUpdateListener = useCallback(
    (averageRating: SocketEvent["rating-update"]) => {
      setFinalRating(averageRating);
    },
    []
  );
  useRegisterSocketListener("rating-update", ratingUpdateListener);

  const gameOverListener = useCallback(
    async (players: SocketEvent["game-over"]) => {
      const { win, rank } = players[user!.id];

      const messageText = `Game is over. Your rank is ${rank}.${
        win ? " Well done!" : ""
      }`;
      sendBotMessage(messageText);
    },
    [sendBotMessage, user]
  );
  useRegisterSocketListener("game-over", gameOverListener);

  const sendMessage = () => {
    if (!inputText) return;
    if (inputText.includes(targetWord) && isUserDescriber) {
      const message: BotMessage = {
        sender: null,
        isBot: true,
        isDescriber: null,
        text: "This message cannot be sent. You should not include the target word in your description.",
      };
      setMessages((prev) => [...prev, message]);
      return;
    }
    const message = {
      sender: user,
      isBot: null,
      isDescriber: isUserDescriber,
      text: inputText,
    };
    socket?.emit("send-message", { message, targetWord });
    setInputText("");
  };

  const isSameSender = (index: number) => {
    return index > 0 && messages[index].sender === messages[index - 1]?.sender;
  };

  const rate = (value: number) => {
    setRating(value);
    emitSocketEvent(socket, "send-rating", value);
    setTimeout(() => {
      setRating(10);
    }, 1000);
  };

  useEffect(() => {
    if (!lastMessageRef.current) return;
    if (messageLength.current === messages.length) {
      lastMessageRef.current.scrollIntoView();
    } else {
      messageLength.current = messages.length;
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  return (
    <div
      className={`w-full h-full ${
        isUserDescriber ? "lg:w-3/4 lg:mr-4" : ""
      } bg-transparent-50 rounded p-2 flex flex-col relative z-10`}
    >
      <div
        className={`scrollbar w-full ${
          isUserDescriber ? "h-2/3" : "h-full"
        } my-2 p-2 bg-white overflow-y-auto flex flex-col`}
      >
        {messages.map((message, i) => (
          <div
            key={i}
            className={`${isSameSender(i) ? "mb-1" : "my-1"} flex flex-col ${
              message.isBot
                ? "self-center"
                : message.isDescriber
                ? "items-start self-start"
                : "items-end self-end"
            }`}
          >
            {!message.isBot && !isSameSender(i) && (
              <p className={message.isDescriber ? "ml-1" : "mr-1"}>
                {message.sender.id === user!.id
                  ? "You"
                  : message.sender.username}
              </p>
            )}

            {i === messages.length - 1 ? (
              <div
                ref={lastMessageRef}
                className={`p-2 rounded-xl  ${
                  message.isBot
                    ? "bg-slate-100 border-2 border-yellow-200"
                    : message.isDescriber
                    ? "bg-orange-600 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {message.text}
              </div>
            ) : (
              <div
                className={`p-2 rounded-xl  ${
                  message.isBot
                    ? "bg-slate-100 border-2 border-yellow-200"
                    : message.isDescriber
                    ? "bg-orange-600 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>
        ))}
      </div>
      {showFeedbackField ? (
        <div className="w-full h-1/3 my-2 p-2 bg-white">
          {isUserDescriber ? (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <>
                {!finalRating ? (
                  <p className="text-lg font-semibold text-red-900">
                    Please wait for your rating to show up
                  </p>
                ) : (
                  <p className="text-lg font-semibold text-red-900">
                    Your description is rated {finalRating}
                  </p>
                )}
                <StarRatings
                  rating={finalRating}
                  numberOfStars={5}
                  starRatedColor="yellow"
                />
              </>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center">
              {rating === 10 ? (
                <p className="text-lg font-semibold text-red-900">
                  Thank you for your feedback!
                </p>
              ) : (
                <>
                  <p className="font-semibold text-red-900">
                    How would you rate {describer?.username ?? "player"}&apos;s
                    description?
                  </p>
                  <StarRatings
                    rating={rating}
                    changeRating={rate}
                    numberOfStars={5}
                    starRatedColor="yellow"
                    starHoverColor="yellow"
                  />
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          <textarea
            value={inputText}
            onChange={(e) => {
              !(e.target.value === "\n" && !inputText) &&
                setInputText(e.target.value);
            }}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="scrollbar w-full h-1/3 my-2 p-2 bg-white overflow-y-auto focus:outline-yellow-300 resize-none"
          />
          <div className="w-full flex justify-around items-center">
            {isUserDescriber && windowSize.width && windowSize.width < 1024 && (
              <button
                className="mb-2 px-6 py-1 rounded-xl bg-yellow-500 text-white sm:text-xl"
                onClick={() => setDisplay("notes")}
              >
                Choose Notes
              </button>
            )}
            <button
              className="mb-2 px-6 py-1 rounded-xl bg-blue-500 text-white sm:text-xl disabled:bg-blue-200"
              onClick={() => sendMessage()}
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBox;
