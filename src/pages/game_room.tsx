import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CldImage } from "next-cloudinary";
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
import ChatBox from "@/components/ChatBox";
import Notes from "@/components/Notes";
import { useSocketContext } from "@/contexts/SocketContext";
import { useAuthStore } from "@/stores/AuthStore";
import { useSettingStore } from "@/stores/SettingStore";
import useWindowSize from "@/hooks/useWindowSize";
import useAuthAxios from "@/hooks/useAuthAxios";
import { useCountdownTimer } from "@/components/NotesRoom/useCountdownTimer";
import { emitSocketEvent } from "@/utils/helpers";
import { useRegisterSocketListener } from "@/hooks/useRegisterSocketListener";

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

  const [inputText, setInputText] = useState("");
  const [display, setDisplay] = useState("chatbox");
  const [showFeedbackField, setShowFeedbackField] = useState(false);

  const windowSize = useWindowSize();
  const authAxios = useAuthAxios();

  const { formattedTime, startTimer } = useCountdownTimer(
    TURN_TIME,
    players,
    () => endTurn()
  );

  const playerArray = Object.values(players).sort(
    (player1, player2) => player1.order - player2.order
  );

  const describer = playerArray.find((p) => p.order === describerIndex);
  if (!describer) throw new Error("describer not found");
  let { words, notes } = players[describer.id];

  const isUserDescriber = useMemo(() => {
    return players[user!.id].isDescriber;
  }, [players, user]);

  const isFirstPlayerDescribing = useMemo(() => {
    return playerArray.every((p) => describer.order <= p.order);
  }, [describer.order, playerArray]);

  const updateRoundAndDescriber = useCallback(
    (nextDesc: number, nextRound: number) => {
      if (nextRound === round) {
        setDescriberIndex(nextDesc);
        setTimeout(() => {
          startTimer();
        }, 1000);
      } else {
        setTimeout(() => {
          setRound(nextRound);
          setDescriberIndex(nextDesc);
          router.push("/notes_room");
        }, 3000);
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
        resolve(null);
      }, FEEDBACK_TIME * 1000);
    });
  }, [isUserDescriber, socket]);

  const endTurn = useCallback(async () => {
    setDisplay("chatbox");
    if (mode === "relaxed") {
      await askForFeedback();
    }

    setShowFeedbackField(false);
    if (isUserDescriber) {
      emitSocketEvent(socket, "update-turn");
    }
  }, [askForFeedback, isUserDescriber, mode, socket]);

  useEffect(() => {
    if (isFirstPlayerDescribing) {
      startTimer();
    }
  }, [isFirstPlayerDescribing, startTimer]);

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
      if (Object.keys(remainingPlayers).length === 1) {
        socket?.disconnect();
        setTimeout(() => router.push("/dashboard"), 3000);
        return;
      }
      if (nextDesc !== undefined && nextRound !== undefined) {
        updateRoundAndDescriber(nextDesc, nextRound);
      }
      setPlayers(remainingPlayers);
    },
    [router, setPlayers, socket, updateRoundAndDescriber]
  );
  useRegisterSocketListener("player-left", playerLeftListener);

  const gameOverListener = useCallback(
    (players: SocketEvent["game-over"]) => {
      const { win } = players[user!.id];

      const advanced = level === "hard";
      const data = { win, advanced };

      if (mode === "standard") {
        authAxios
          .post("/api/update_stats", {
            data,
          })
          .then((response) => {
            if (response.status === 200) {
              if (!user) return;
              const userCopy = { ...user };
              userCopy.total++;
              win && userCopy.win++;
              advanced && userCopy.advanced++;
              setUser(userCopy);
            } else {
              console.log("Something went wrong");
            }
          });
      }

      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    },
    [authAxios, level, mode, router, setUser, user]
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
      <div className="h-full w-full px-4 sm:px-8 py-8 grid grid-rows-layout6 gap-2 sm:gap-4">
        <div className="flex justify-between">
          {players &&
            playerArray.map((player, i) => (
              <div
                key={i}
                className={`flex flex-col lg:flex-row items-center rounded z-10 ${
                  player.id === describer.id
                    ? "outline outline-yellow-500 outline-offset-4 md:outline-offset-8"
                    : ""
                }`}
              >
                <div className="h-10 w-10 sm:h-16 sm:w-16 rounded-full overflow-clip mr-1">
                  <CldImage
                    className="rounded-full object-contain object-center"
                    width="100"
                    height="100"
                    src={player.avatar}
                    alt="player avatar"
                  />
                </div>
                <div className="flex flex-col items-center lg:items-start lg:pl-4">
                  <p className="sm:text-lg md:text-xl lg:text-2xl">
                    {player.username}
                  </p>
                  <p className="text-bold text-lg md:text-xl">
                    {windowSize.width && windowSize.width >= 1024
                      ? `Score: ${player.score}`
                      : player.score}
                  </p>
                </div>
              </div>
            ))}
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={() => leaveGame()}
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
          {/* {userIsDescriber() ? (
            <div className="w-20 sm:w-24 h-2"></div>
          ) : (
            <button className="py-1 px-2 rounded-lg bg-red-600 text-white font-semibold text-sm sm:text-base z-10">
              Rule Break
            </button>
          )} */}
          <div className="w-20 sm:w-24 h-2"></div>
        </div>
        {isUserDescriber && windowSize.width && windowSize.width >= 1024 ? (
          <div className="h-full w-full flex">
            <ChatBox
              inputText={inputText}
              setInputText={setInputText}
              setDisplay={setDisplay}
              showFeedbackField={showFeedbackField}
            />
            <Notes
              word={words?.[round] || "loading"}
              notes={notes!}
              setDisplay={setDisplay}
              setInputText={setInputText}
            />
          </div>
        ) : display === "chatbox" ? (
          <ChatBox
            inputText={inputText}
            setInputText={setInputText}
            setDisplay={setDisplay}
            showFeedbackField={showFeedbackField}
          />
        ) : (
          <Notes
            word={words?.[round] || "loading"}
            notes={notes!}
            setDisplay={setDisplay}
            setInputText={setInputText}
          />
        )}
      </div>
    </BackgroundTemplate>
  );
}

GameRoom.requireAuth = true;
