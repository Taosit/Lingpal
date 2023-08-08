import { useState, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import timerIcon from "../assets/timer.png";
import { useGameStore } from "@/stores/GameStore";
import {
  FEEDBACK_TIME,
  TURN_TIME_RELAXED,
  TURN_TIME_STANDARD,
} from "@/utils/constants";
import BackgroundTemplate from "@/components/BackgroundTemplate";
import ChatBox from "@/components/GameRoom/ChatBox/ChatBox";
import Notes from "@/components/GameRoom/Notes/Notes";
import { useSocketContext } from "@/contexts/SocketContext";
import { useAuthStore } from "@/stores/AuthStore";
import { useSettingStore } from "@/stores/SettingStore";
import useWindowSize from "@/hooks/useWindowSize";
import { useCountdownTimer } from "@/components/NotesRoom/useCountdownTimer";
import { emitSocketEvent } from "@/utils/helpers";
import { InputTextContextProvider } from "@/components/GameRoom/InputTextContext";
import { Players } from "@/components/GameRoom/Players/Players";
import { shallow } from "zustand/shallow";
import { useRegisterGameRoomListeners } from "@/hooks/useRegisterGameRoomListeners";
import { useVoiceDescriber } from "@/hooks/useVoiceDescriber";

export default function GameRoom() {
  const { socket } = useSocketContext();

  const { players, round, describerOrder, addMessage, clearMessages } =
    useGameStore(
      (store) => ({
        players: store.players,
        round: store.round,
        describerOrder: store.describerOrder,
        addMessage: store.addMessage,
        clearMessages: store.clearMessages,
      }),
      shallow
    );

  const { loading, user, setUser, updateUserScore } = useAuthStore(
    (store) => ({
      loading: store.loading,
      user: store.user,
      setUser: store.setUser,
      updateUserScore: store.updateUserScore,
    }),
    shallow
  );

  const router = useRouter();

  const mode = useSettingStore((store) => store.settings.mode);
  const TURN_TIME =
    mode === "standard" ? TURN_TIME_STANDARD : TURN_TIME_RELAXED;

  const [display, setDisplay] = useState("chatbox");
  const [showFeedbackField, setShowFeedbackField] = useState(false);

  const windowSize = useWindowSize();
  const {
    mute,
    unmute,
    isMuted,
    initiatePeerConnection,
    acceptPeerConnection,
    destroyPeerConnection,
    destroyPlayerPeerConnection,
  } = useVoiceDescriber();

  const playerArray = useMemo(
    () =>
      Object.values(players).sort(
        (player1, player2) => player1.order - player2.order
      ),
    [players]
  );

  const describer = playerArray.find((p) => p.order === describerOrder);
  const isUserDescriber = !!describer && !!user && describer.id === user.id;

  const words = describer?.words ?? [];

  const endTurn = useCallback(async () => {
    setDisplay("chatbox");
    if (mode === "relaxed") {
      setShowFeedbackField(true);
      await new Promise((res) => setTimeout(res, FEEDBACK_TIME * 1000));
      if (isUserDescriber) {
        emitSocketEvent(socket, "clear-ratings");
      }
      setShowFeedbackField(false);
    }

    if (isUserDescriber) {
      await new Promise((res) => setTimeout(res, 3000));
      emitSocketEvent(socket, "update-turn");
    }
  }, [isUserDescriber, mode, socket]);

  const { formattedTime, startTimer } = useCountdownTimer(
    TURN_TIME,
    players,
    () => {
      endTurn();
      if (isUserDescriber) {
        emitSocketEvent(socket, "time-out", words?.[round]);
      }
    }
  );

  useRegisterGameRoomListeners({
    startTimer,
    endTurn,
    initiatePeerConnection,
    acceptPeerConnection,
    destroyPeerConnection,
    destroyPlayerPeerConnection,
  });

  useEffect(() => {
    if (Object.keys(players).length === 0) {
      addMessage({
        sender: null,
        isBot: true,
        isDescriber: null,
        text: "You were disconnected. Redirecting you to the dashboard...",
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    }
  }, [addMessage, players, router]);

  const leaveGame = () => {
    socket?.disconnect();
    destroyPeerConnection();
    clearMessages();
    if (!user) return;
    const userCopy = { ...user };
    if (mode === "standard") {
      updateUserScore({ total: 1 });
    }
    router.push("/dashboard");
  };

  if (loading) return <div>Loading</div>;

  return (
    <BackgroundTemplate>
      <InputTextContextProvider>
        <div className="h-full w-full px-4 sm:px-8 py-8 grid grid-rows-layout6 gap-2 sm:gap-4">
          <Players />
          <div className="flex justify-between items-center">
            <button
              onClick={leaveGame}
              className="mr-4 py-1 px-2 rounded-lg bg-red-700 text-white font-semibold text-sm sm:text-base z-10"
            >
              Quit
            </button>
            <div className="flex items-center">
              <Image
                src={timerIcon}
                alt="time ramaining"
                width={24}
                height={24}
              />
              <p className="ml-2 text-white font-semibold md:text-xl">
                {formattedTime}
              </p>
            </div>
            <div className="w-20 sm:w-24 h-2"></div>
          </div>
          {isUserDescriber && windowSize.width && windowSize.width >= 1024 ? (
            <div className="h-full w-full flex">
              <ChatBox
                setDisplay={setDisplay}
                showFeedbackField={showFeedbackField}
                isMuted={isMuted}
                mute={mute}
                unmute={unmute}
              />
              <Notes setDisplay={setDisplay} />
            </div>
          ) : display === "chatbox" ? (
            <ChatBox
              setDisplay={setDisplay}
              showFeedbackField={showFeedbackField}
              isMuted={isMuted}
              mute={mute}
              unmute={unmute}
            />
          ) : (
            <Notes setDisplay={setDisplay} />
          )}
        </div>
      </InputTextContextProvider>
    </BackgroundTemplate>
  );
}

GameRoom.requireAuth = true;
