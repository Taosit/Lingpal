import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useSettingContext } from "../utils/contexts/SettingContext";
import BackgroundTemplate from "../components/BackgroundTemplate";
import { useGameContext } from "../utils/contexts/GameContext";

const optionVariants = {
  hidden: {
    translateX: 100,
    opacity: 0,
  },
  show: {
    translateX: 0,
    opacity: 1,
  },
};

export default function GameSettings() {
  const {
    settings: { mode, level, describer },
    updateSetting,
  } = useSettingContext();
  const { setInGame } = useGameContext();

  const [animateText, setAnimateText] = useState(false);
  const [animateVoice, setAnimateVoice] = useState(false);

  useEffect(() => {
    setInGame(true);
  }, []);

  useEffect(() => {
    if (!describer) return;
    if (describer === "text") {
      setAnimateText(true);
      setAnimateVoice(false);
    } else {
      setAnimateText(false);
      setAnimateVoice(true);
    }
  }, [describer]);

  const router = useRouter()
	const navigate = router.push;

  const play = () => {
    navigate("/wait_room");
  };

  return (
    <BackgroundTemplate animateText={animateText} animateVoice={animateVoice}>
      <div
        className={`w-4/5 max-w-2xl px-4 py-4 sm:px-16 sm:py-8 rounded-xl shadow-inner-light relative z-10
				${mode ? " bg-transparent-20" : "bg-transparent-20"} transition-all`}
      >
        <h1
          className={`text-white text-center mb-4 sm:mb-8 text-2xl md:text-4xl transition-all ${
            mode ? "" : "drop-shadow-xl"
          }`}
        >
          New Game
        </h1>
        <div className="grid grid-cols-2 gap-4">
          <button
            className="flex justify-center items-center hover:cursor-pointer"
            onClick={() => updateSetting("mode", "standard")}
          >
            <div
              className={`option-light ${
                mode === "standard" ? "glow" : "glimmer"
              }`}
            ></div>
            <p
              className={`text-white ml-4 sm:text-bg w-16 md:text-2xl md:w-24 transition-all ${
                mode === "standard" ? "font-semibold" : ""
              } ${!mode ? "drop-shadow-xl" : ""}`}
            >
              Standard
            </p>
          </button>
          <button
            className="flex justify-center items-center hover:cursor-pointer"
            onClick={() => updateSetting("mode", "relaxed")}
          >
            <div
              className={`option-light ${
                mode === "relaxed" ? "glow" : "glimmer"
              }`}
            ></div>
            <p
              className={`text-white ml-4 sm:text-bg w-16 md:text-2xl md:w-24 transition-all ${
                mode === "relaxed" ? "font-semibold" : ""
              } ${!mode ? "drop-shadow-xl" : ""}`}
            >
              Relaxed
            </p>
          </button>
          {mode ? (
            <>
              <motion.button
                variants={optionVariants}
                initial="hidden"
                animate="show"
                className="flex justify-center items-center hover:cursor-pointer"
                onClick={() => updateSetting("level", "easy")}
              >
                <div
                  className={`option-light ${
                    level === "easy" ? "glow" : "glimmer"
                  }`}
                ></div>
                <p
                  className={`text-white ml-4 sm:text-bg w-16 md:text-2xl md:w-24 ${
                    level === "easy" ? "font-semibold" : ""
                  }`}
                >
                  Easy
                </p>
              </motion.button>
              <motion.button
                variants={optionVariants}
                initial="hidden"
                animate="show"
                className="flex justify-center items-center hover:cursor-pointer"
                onClick={() => updateSetting("level", "hard")}
              >
                <div
                  className={`option-light ${
                    level === "hard" ? "glow" : "glimmer"
                  }`}
                ></div>
                <p
                  className={`text-white ml-4 sm:text-bg w-16 md:text-2xl md:w-24 ${
                    level === "hard" ? "font-semibold" : ""
                  }`}
                >
                  Hard
                </p>
              </motion.button>
            </>
          ) : (
            <>
              <div className="w-16 h-6 md:h-8"></div>
              <div className="w-16 h-6 md:h-8"></div>
            </>
          )}
          {level ? (
            <>
              <motion.button
                variants={optionVariants}
                initial="hidden"
                animate="show"
                className="flex justify-center items-center hover:cursor-pointer"
                onClick={() => updateSetting("describer", "text")}
              >
                <div
                  className={`option-light ${
                    describer === "text" ? "glow" : "glimmer"
                  }`}
                ></div>
                <p
                  className={`text-white ml-4 sm:text-bg w-16 md:text-2xl md:w-24 ${
                    describer === "text" ? "font-semibold" : ""
                  }`}
                >
                  Text
                </p>
              </motion.button>
              <motion.button
                variants={optionVariants}
                initial="hidden"
                animate="show"
                className="flex justify-center items-center hover:cursor-pointer"
                onClick={() => updateSetting("describer", "voice")}
              >
                <div
                  className={`option-light ${
                    describer === "voice" ? "glow" : "glimmer"
                  }`}
                ></div>
                <p
                  className={`text-white ml-4 sm:text-bg w-16 md:text-2xl md:w-24 ${
                    describer === "voice" ? "font-semibold" : ""
                  }`}
                >
                  Voice
                </p>
              </motion.button>
            </>
          ) : (
            <>
              <div className="w-16 h-6 md:h-8"></div>
              <div className="w-16 h-6 md:h-8"></div>
            </>
          )}
        </div>
        {describer ? (
          <motion.button
            variants={optionVariants}
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
};

GameSettings.requireAuth = true
