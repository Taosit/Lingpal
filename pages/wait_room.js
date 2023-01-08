import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import BackgroundTemplate from "../components/BackgroundTemplate";
import { CldImage } from "next-cloudinary"
import NextImage from 'next/image'
import checkmarkIcon from "../assets/checkmark.png";
import { useGameContext } from "../utils/contexts/GameContext";
import WhiteboardTemplate from "../components/WhiteboardTemplate";
import { useSettingContext } from "../utils/contexts/SettingContext";
import { useSocketContext } from "../utils/contexts/SocketContext";
import { useAuthContext } from "../utils/contexts/AuthContext";

export default function WaitRoom() {
  const { players, setPlayers, setInGame, setRoomId } = useGameContext();
  const { settings } = useSettingContext();
  const { socket } = useSocketContext();
  const { user } = useAuthContext();

  useEffect(() => {
    console.log("emiting join-room");
    socket.emit("join-room", { settings, user });
    socket.on("game-start", ({ players, roomId }) => {
      setPlayers(players);
      setRoomId(roomId);
      navigate("/notes_room");
    });

    // return () => socket.emit("leave-room", { settings, user });
  }, []);

  const router = useRouter()
	const navigate = router.push;

  const leaveRoom = () => {
    console.log("leave room");
    setInGame(false);
    navigate("/dashboard");
  };

  const setReady = () => {
    const newReadyState = !players[user._id].isReady;
    socket.emit("player-ready", { user, settings, isReady: newReadyState });
  };

  const getPlayerArray = () => {
    const playerArr = [...Object.values(players), null, null, null, null];
    return playerArr.slice(0, 4);
  };

  return (
    <BackgroundTemplate>
      <WhiteboardTemplate>
        <div className="h-full grid gap-6 grid-rows-layout1">
          <div className="w-full flex flex-col justify-between items-center sm:flex-row">
            <div className="font-semibold md:text-lg py-1">
              Waiting for other players to join...
            </div>
            <button
              className="text-lg font-semibold md:text-xl text-red-800 hover:cursor-pointer py-1"
              onClick={leaveRoom}
            >
              Leave Room
            </button>
          </div>
          <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2">
            {getPlayerArray().map((player, i) => (
              <div key={i} className="player-card">
                <div className="w-1/3 relative">
                  {player?.isReady && (
                    <div className="absolute top-0 -right-5 w-6 h-6 opacity-50">
                      <NextImage
                        src={checkmarkIcon}
                        alt="Player is ready"
                        width={50}
                        height={50}
                      />
                    </div>
                  )}
                  <div className="h-10 w-10 md:h-16 md:w-16 rounded-full overflow-clip mr-1">
                    <CldImage
                      className={`rounded-full object-contain object-center ${
                        player ? "" : "blur-sm opacity-50"
                      }`}
                      width="100"
                      height="100" 
                      src={player?.avatar || "nruwutqaihxyl7sq6ilm"}
                      alt="player avatar"
                    />
                  </div>
                </div>
                {player ? (
                  <div className="flex w-2/3 flex-col justify-center items-center">
                    <h5 className="font-semibold md:text-xl">
                      {player.username}
                    </h5>
                    <p className="text-sm sm:text-base">{`Win: ${(!player.total
                      ? 0
                      : (player.win * 100) / player.total
                    ).toFixed(1)}%`}</p>
                  </div>
                ) : (
                  <div className="flex w-2/3 justify-center items-center">
                    <p className="font-bold text-lg sm:text-xl">?</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="w-full min-h-0 overflow-auto px-4 md:px-8 py-4 bg-transparent-50 rounded-lg">
            <h3 className="pb-2 text-lg sm:text-xl text-center font-semibold">
              Rules
            </h3>
            <ol className="list-decimal list-inside">
              <li>Stick to your target language.</li>
              <li>Don’t say the target word, nor any of its derivations.</li>
              <li>
                Press the rule break button if a player fails to obey the rules.
              </li>
            </ol>
          </div>
          <div className="py-2 flex justify-center">
            {Object.keys(players).length > 1 && (
              <button
                className={`${
                  players[user._id].isReady
                    ? "ready-button-pressed"
                    : "ready-button"
                } rounded-xl px-8 py-1 text-lg text-red-800 font-semibold`}
                onClick={setReady}
              >
                Ready
              </button>
            )}
          </div>
        </div>
      </WhiteboardTemplate>
    </BackgroundTemplate>
  );
};

WaitRoom.requireAuth = true
