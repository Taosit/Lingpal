import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { useRegisterSocketListener } from "@/hooks/useRegisterSocketListener";
import { InputTextContextProvider } from "@/components/GameRoom/InputTextContext";
import { Players } from "@/components/GameRoom/Players/Players";
import { useUpdateStats } from "@/components/GameRoom/useUpdateStats";

export default function GameRoom() {
  const {
    players,
    setPlayers,
    round,
    setRound,
    describerIndex,
    setDescriberIndex,
  } = useGameStore();

  const { socket } = useSocketContext();
  const { loading, user, setUser } = useAuthStore();
  const {
    settings: { mode, level, describer: describerInput },
  } = useSettingStore();

  const router = useRouter();

  const TURN_TIME =
    mode === "standard" ? TURN_TIME_STANDARD : TURN_TIME_RELAXED;

  const [display, setDisplay] = useState("chatbox");
  const [showFeedbackField, setShowFeedbackField] = useState(false);

  const playerArray = Object.values(players).sort(
    (player1, player2) => player1.order - player2.order
  );

  const describer = playerArray.find((p) => p.order === describerIndex);
  // if (!describer) throw new Error("describer not found");
  const words = useMemo(() => {
    if (!describer) return [];
    return describer.words as string[];
  }, [describer]);

  const isUserDescriber = useMemo(() => {
    if (!describer || !user) return false;
    return describer.id === user?.id;
  }, [describer, user]);

  const isFirstPlayerDescribing = useMemo(() => {
    if (!describer) return false;
    return playerArray.every((p) => describer.order <= p.order);
  }, [describer, playerArray]);

  const windowSize = useWindowSize();
  const updateStats = useUpdateStats();

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

  const updateRoundAndDescriber = useCallback(
    (nextDesc: number, nextRound: number) => {
      if (nextRound === round) {
        setDescriberIndex(nextDesc);
        startTimer();
      } else {
        setRound(nextRound);
        setDescriberIndex(nextDesc);
        router.push("/notes-room");
      }
    },
    [round, router, setDescriberIndex, setRound, startTimer]
  );

  const askForFeedback = useCallback(() => {
    return new Promise((resolve) => {
      setShowFeedbackField(true);
      setTimeout(() => {
        if (isUserDescriber) {
          emitSocketEvent(socket, "clear-ratings");
        }
        setShowFeedbackField(false);
        resolve(null);
      }, FEEDBACK_TIME * 1000);
    });
  }, [isUserDescriber, socket]);

  const endTurn = useCallback(async () => {
    setDisplay("chatbox");
    if (mode === "relaxed") {
      await askForFeedback();
    }

    if (isUserDescriber) {
      setTimeout(() => {
        emitSocketEvent(socket, "update-turn");
      }, 3000);
    }
  }, [askForFeedback, isUserDescriber, mode, socket]);

  useEffect(() => {
    if (isFirstPlayerDescribing) {
      startTimer();
      emitSocketEvent(socket, "start-round");
    }
  }, [isFirstPlayerDescribing, socket, startTimer]);

  const correctAnswerListener = useCallback(
    (players: SocketEvent["correct-answer"]) => {
      setPlayers(players);
      endTurn();
    },
    [endTurn, setPlayers]
  );
  useRegisterSocketListener("correct-answer", correctAnswerListener);

  const turnUpdatedListener = useCallback(
    ({ nextRound, nextDesc }: SocketEvent["turn-updated"]) => {
      updateRoundAndDescriber(nextDesc, nextRound);
    },
    [updateRoundAndDescriber]
  );
  useRegisterSocketListener("turn-updated", turnUpdatedListener);

  const playerLeftListener = useCallback(
    ({ nextDesc, nextRound, remainingPlayers }: SocketEvent["player-left"]) => {
      if (nextDesc !== undefined && nextRound !== undefined) {
        updateRoundAndDescriber(nextDesc, nextRound);
      }
      setPlayers(remainingPlayers);
    },
    [setPlayers, updateRoundAndDescriber]
  );
  useRegisterSocketListener("player-left", playerLeftListener);

  const gameOverListener = useCallback(
    (players: SocketEvent["game-over"]) => {
      const win = players[user!.id].rank <= Object.keys(players).length / 2;
      const advanced = level === "hard";
      const data = { win, advanced };

      if (mode === "standard") {
        updateStats(data);
      }
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    },
    [level, mode, router, updateStats, user]
  );
  useRegisterSocketListener("game-over", gameOverListener);

  const leaveGame = () => {
    socket?.disconnect();
    if (!user) return;
    const userCopy = { ...user };
    setUser({ ...userCopy, total: userCopy.total + 1 });
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
              className="mr-4 py-1 px-2 rounded-lg bg-red-600 text-white font-semibold text-sm sm:text-base z-10"
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
              />
              <Notes setDisplay={setDisplay} />
            </div>
          ) : display === "chatbox" ? (
            <ChatBox
              setDisplay={setDisplay}
              showFeedbackField={showFeedbackField}
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
