import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import BackgroundTemplate from "../components/BackgroundTemplate";
import { useSettingStore } from "@/stores/SettingStore";
import { useSocketContext } from "@/contexts/SocketContext";
import { motionVariant } from "@/utils/constants";
import { SettingButtons } from "@/components/Settings/SettingButtons/SettingButtons";
import { useAuthStore } from "@/stores/AuthStore";
import { useGameStore } from "@/stores/GameStore";
import { emitSocketEvent } from "@/utils/helpers";

export default function GameSettings() {
  const settings = useSettingStore((state) => state.settings);
  const user = useAuthStore((state) => state.user);
  const setRoomId = useGameStore((state) => state.setRoomId);

  const { connectSocket } = useSocketContext();

  const [animateText, setAnimateText] = useState(false);
  const [animateVoice, setAnimateVoice] = useState(false);

  const animateTextDescriber = () => {
    setAnimateText(true);
    setAnimateVoice(false);
  };

  const animateVoiceDescriber = () => {
    setAnimateText(false);
    setAnimateVoice(true);
  };

  const router = useRouter();
  const navigate = router.push;

  const play = () => {
    const socket = connectSocket();
    socket.emit("join-room", { settings, player: user! }, (roomId: string) => {
      setRoomId(roomId);
      navigate("/wait_room");
    });
  };

  return (
    <BackgroundTemplate animateText={animateText} animateVoice={animateVoice}>
      <div
        className={`w-4/5 max-w-2xl px-4 py-4 sm:px-16 sm:py-8 rounded-xl shadow-inner-light relative z-10
				${settings.mode ? " bg-transparent-20" : "bg-transparent-20"} transition-all`}
      >
        <h1
          className={`text-white text-center mb-4 sm:mb-8 text-2xl md:text-4xl transition-all ${
            settings.mode ? "" : "drop-shadow-xl"
          }`}
        >
          New Game
        </h1>
        <SettingButtons
          animateTextDescriber={animateTextDescriber}
          animateVoiceDescriber={animateVoiceDescriber}
        />
        {settings.describer ? (
          <motion.button
            variants={motionVariant}
            onClick={play}
            initial="hide"
            animate="show"
            className="w-full text-right text-white mt-2 md:text-2xl font-semibold"
          >
            <motion.p
              whileHover={{ scale: 1.05 }}
              style={{ originX: "80%" }}
              className="hover:cursor-pointer"
            >
              {">> Play"}
            </motion.p>
          </motion.button>
        ) : (
          <div className="w-16 h-8 md:h-10"></div>
        )}
      </div>
    </BackgroundTemplate>
  );
}

GameSettings.requireAuth = true;
