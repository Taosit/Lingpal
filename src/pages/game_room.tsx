import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { useRouter } from "next/router";
import BackgroundTemplate from "../../components/BackgroundTemplate";
import ChatBox from "../../components/ChatBox";
import Notes from "../../components/Notes";
import { useGameContext } from "../../utils/contexts/GameContext";
import { useSocketContext } from "../../utils/contexts/SocketContext";
import { useAuthContext } from "../../utils/contexts/AuthContext";
import { useSettingContext } from "../../utils/contexts/SettingContext";
import useWindowSize from "../../utils/hooks/useWindowSize";
import useAuthAxios from "../../utils/hooks/useAuthAxios";
import timerIcon from "../assets/timer.png";
import {
  FEEDBACK_TIME,
  TURN_TIME_STANDARD,
  TURN_TIME_RELAXED,
} from "../../utils/constants";

export default function GameRoom() {
  const {
    players,
    setPlayers,
    round,
    setRound,
    describerIndex,
    setDescriberIndex,
    roomId,
    playerLeftNoteRoom,
    setPlayerLeftNoteRoom,
  } = useGameContext();

  const { socket } = useSocketContext();
  const { loading, user, setUser } = useAuthContext();
  const {
    settings: { mode, level, describer: describerInput },
  } = useSettingContext();

  const router = useRouter();
  const navigate = router.push;

  const TURN_TIME =
    mode === "standard" ? TURN_TIME_STANDARD : TURN_TIME_RELAXED;

  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [display, setDisplay] = useState("chatbox");
  const [time, setTime] = useState(TURN_TIME);
  const [oldRound, setOldRound] = useState(false);
  const [showFeedbackField, setShowFeedbackField] = useState(false);

  const windowSize = useWindowSize();
  const authAxios = useAuthAxios();

  const playerArray = Object.values(players).sort(
    (player1, player2) => player1.order - player2.order
  );

  useEffect(() => {
    if (playerLeftNoteRoom?.length > 0) {
      console.log("in use effect - some players left");
      playerLeftNoteRoom.forEach((player) => {
        socket.emit("someone-left", { player, roomId });
      });
    }
    setPlayerLeftNoteRoom(null);
  }, [playerLeftNoteRoom, roomId, setPlayerLeftNoteRoom, socket]);

  useEffect(() => {
    socket.on("update-time", (time) => {
      setTime(time);
    });

    return () => {
      socket.off("update-time");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("correct-answer", (players) => {
      setPlayers(players);
      endTurn();
    });

    return () => {
      console.log({ playerArray });
      socket.off("correct-answer");
    };
  }, [socket, playerArray.length]);

  useEffect(() => {
    socket.on("turn-updated", (newDescriberIndex) => {
      console.log("turn updated to", newDescriberIndex);
      setDescriberIndex(newDescriberIndex);
      socket.off("update-time");
      setTimeout(() => {
        setTime(TURN_TIME);
        socket.on("update-time", (time) => {
          setTime(time);
        });
        console.log("should emit turn-time");
        if (isUserFirstPlayer()) {
          console.log("emitted turn-time");
          socket.emit("turn-time", { roomId, time: TURN_TIME });
        }
      }, 1000);
    });

    return () => {
      socket.off("turn-updated");
    };
  }, [socket, playerArray.length]);

  useEffect(() => {
    socket.on("round-updated", ({ nextRound, nextDesc }) => {
      console.log("round updated to", nextRound);
      socket.off("update-time");
      setRound(nextRound);
      setDescriberIndex(nextDesc);
      setOldRound(true);
      setTimeout(() => {
        socket.on("update-time", (time) => {
          setTime(time);
        });
        setOldRound(false);
        navigate("/notes_room");
      }, 3000);
    });

    return () => {
      socket.off("round-updated");
    };
  }, [socket, playerArray.length]);

  useEffect(() => {
    socket.on("player-left", (disconnectingPlayer) => {
      console.log("on player-left");
      console.log({ players, disconnectingPlayer });
      const playersCopy = { ...players };
      delete playersCopy[disconnectingPlayer._id];

      let messageText = `${disconnectingPlayer.username} left the game.`;
      if (Object.keys(playersCopy).length === 1) {
        messageText += ` There aren't enough players to continue the game.`;
        sendBotMessage(messageText);
        socket.disconnect();
        setTimeout(() => navigate("/dashboard"), 3000);
        return;
      }

      sendBotMessage(messageText);
      console.log("sent messages");
      if (disconnectingPlayer.order === describerIndex) {
        console.log("disconnection player is the describer");
        const currentPlayers = Object.values(playersCopy);
        const isFirstAvailablePlayer = currentPlayers.every(
          (p) => players[user._id].order <= p.order
        );
        if (isFirstAvailablePlayer) {
          console.log("emit update-turn");
          socket.emit("update-turn", { roomId, players: playersCopy });
        }
        return;
      }
      setPlayers(playersCopy);
    });

    return () => {
      socket.off("player-left");
    };
  }, [socket, describerIndex, Object.values(players).length]);

  useEffect(() => {
    socket.on("game-over", async (players) => {
      const { win, rank } = players[user._id];

      const messageText = `Game is over. Your rank is ${rank}.${
        win ? " Well done!" : ""
      }`;
      sendBotMessage(messageText);

      const advanced = level === "hard";
      const data = { win, advanced };

      if (mode === "standard") {
        authAxios
          .post("/api/update_stats", {
            data,
          })
          .then((response) => {
            if (response.status === 200) {
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
        navigate("/dashboard");
      }, 3000);
    });
    return () => {
      socket.off("game-over");
    };
  }, [socket]);

  useEffect(() => {
    if (!isLastPlayerDescribing() && !oldRound) {
      const messageText = `It's ${
        userIsDescriber() ? "your" : `${describer.username}'s`
      } turn to describe.`;
      sendBotMessage(messageText);
    }
    if (isFirstPlayerDescribing()) {
      console.log("should emit turn-time");
      console.log({ players });
      if (isUserFirstPlayer()) {
        console.log("emitted turn-time");
        socket.emit("turn-time", { roomId, time: TURN_TIME });
      }
    }
  }, [describerIndex]);

  useEffect(() => {
    if (time === null || time > 0) return;

    const messageText = `Time out... ${
      userIsDescriber()
        ? "The word seems a bit tricky"
        : `The correct word is ${words[round]}`
    }.`;
    sendBotMessage(messageText);

    setTimeout(() => endTurn(), isLastPlayerDescribing() ? 3000 : 1000);
  }, [time]);

  if (loading) return <div>Loading</div>;

  const describer = playerArray.find((p) => p.order === describerIndex);
  let { words, notes } = players[describer._id];

  const userIsDescriber = () => {
    return describer._id === user._id && !oldRound;
  };

  const isUserFirstPlayer = () => {
    return playerArray.every((p) => players[user._id].order <= p.order);
  };

  const isLastPlayerDescribing = () => {
    return playerArray.every((p) => describer.order >= p.order);
  };

  const isFirstPlayerDescribing = () => {
    return playerArray.every((p) => describer.order <= p.order);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds}`;
  };

  const sendBotMessage = (text) => {
    const message = {
      sender: null,
      isBot: true,
      isDescriber: null,
      text,
    };
    setMessages((prev) => [...prev, message]);
  };

  const askForFeedback = () => {
    return new Promise((resolve, reject) => {
      setShowFeedbackField(true);
      setTimeout(() => {
        if (userIsDescriber()) {
          socket.emit("clear-ratings", roomId);
        }
        resolve();
      }, FEEDBACK_TIME * 1000);
    });
  };

  const endTurn = async () => {
    setDisplay("chatbox");
    if (mode === "relaxed") {
      await askForFeedback();
    }

    setShowFeedbackField(false);
    console.log(players[user._id].order, "should emit update-turn");
    if (isUserFirstPlayer()) {
      console.log("emit update-turn");
      socket.emit("update-turn", { roomId });
    }
  };

  const leaveGame = () => {
    socket.disconnect();
    setUser((prev) => ({ ...prev, total: prev.total + 1 }));
    navigate("/dashboard");
  };

  return (
    <BackgroundTemplate>
      <div className="h-full w-full px-4 sm:px-8 py-8 grid grid-rows-layout6 gap-2 sm:gap-4">
        <div className="flex justify-between">
          {players &&
            playerArray.map((player, i) => (
              <div
                key={i}
                className={`flex flex-col lg:flex-row items-center rounded z-10 ${
                  player._id === describer._id
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
                    {windowSize.width >= 1024
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
              {formatTime(time)}
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
        {userIsDescriber() && windowSize.width >= 1024 ? (
          <div className="h-full w-full flex">
            <ChatBox
              inputText={inputText}
              setInputText={setInputText}
              messages={messages}
              setMessages={setMessages}
              word={words[round]}
              userIsDescriber={userIsDescriber}
              setDisplay={setDisplay}
              showFeedbackField={showFeedbackField}
            />
            <Notes
              word={words[round]}
              notes={notes}
              setDisplay={setDisplay}
              setInputText={setInputText}
            />
          </div>
        ) : display === "chatbox" ? (
          <ChatBox
            inputText={inputText}
            setInputText={setInputText}
            messages={messages}
            setMessages={setMessages}
            word={words[round]}
            userIsDescriber={userIsDescriber}
            setDisplay={setDisplay}
            showFeedbackField={showFeedbackField}
          />
        ) : (
          <Notes
            word={words[round]}
            notes={notes}
            setDisplay={setDisplay}
            setInputText={setInputText}
          />
        )}
      </div>
    </BackgroundTemplate>
  );
}

GameRoom.requireAuth = true;
