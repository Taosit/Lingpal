import { useEffect, useRef } from "react";
import useWindowSize from "../../../hooks/useWindowSize";
import { useMessages } from "./useMessages";
import { useInputTextContext } from "../InputTextContext";
import { RatingArea } from "./RatingArea/RatingArea";
import { Message } from "./Message/Message";
import { useIsUserDescriber } from "@/hooks/useIsUserDescriber";
import { useSettingStore } from "@/stores/SettingStore";
import { VoicePanel } from "./VoicePanel/VoicePanel";

type Props = {
  setDisplay: (display: "notes" | "chatbox") => void;
  showFeedbackField: boolean;
  isLoading: boolean;
  isMuted: boolean;
  isGameOver: boolean;
  mute: () => void;
  unmute: () => void;
};

const ChatBox = ({
  setDisplay,
  showFeedbackField,
  isMuted,
  isLoading,
  isGameOver,
  mute,
  unmute,
}: Props) => {
  const { inputText, setInputText } = useInputTextContext();

  const { messages, sendMessage } = useMessages();
  const isUserDescriber = useIsUserDescriber();
  const describerMethod = useSettingStore((store) => store.settings.describer);

  const windowSize = useWindowSize();

  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const messageLength = useRef(0);

  useEffect(() => {
    if (!lastMessageRef.current) return;
    if (messageLength.current === messages.length) {
      lastMessageRef.current.scrollIntoView();
    } else {
      messageLength.current = messages.length;
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  const isSameSender = (index: number) => {
    return index > 0 && messages[index].sender === messages[index - 1]?.sender;
  };

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
        {messages.map((message, i) =>
          i === messages.length - 1 ? (
            <Message
              key={i}
              ref={lastMessageRef}
              isSameSender={isSameSender(i)}
              message={message}
            />
          ) : (
            <Message key={i} isSameSender={isSameSender(i)} message={message} />
          )
        )}
      </div>
      {showFeedbackField ? (
        <RatingArea />
      ) : (
        <>
          {describerMethod === "voice" && (
            <VoicePanel
              isMuted={isMuted}
              isLoading={isLoading}
              isGameOver={isGameOver}
              mute={mute}
              unmute={unmute}
            />
          )}
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
              onClick={sendMessage}
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
