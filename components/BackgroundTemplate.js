import React from "react";
import { motion } from "framer-motion";
import { useSettingContext } from "../utils/contexts/SettingContext";
import Image from 'next/image'
import keyboardIcon from "../assets/keyboard.svg";
import microphoneIcon from "../assets/microphone.svg";

const BackgroundTemplate = ({ children, animateText, animateVoice }) => {
	const {
		settings: { mode, level, describer },
		updateSetting,
	} = useSettingContext();

	return (
		<div
			className={`gradient-background ${
				mode === "standard" ? "orange-gradient" : mode ? "blue-gradient" : ""
			} h-screen flex flex-row justify-center items-center`}
		>
			<motion.div
				className={`big-circle ${level === "easy" ? "show-decor" : ""}`}
			></motion.div>
			<motion.div
				className={`small-circle ${level === "easy" ? "show-decor" : ""}`}
			></motion.div>
			<motion.div
				className={`big-star ${level === "hard" ? "show-big-star" : ""}`}
			></motion.div>
			<motion.div
				className={`small-star ${level === "hard" ? "show-small-star" : ""}`}
			></motion.div>
			{describer && describer === "text" && (
				<>
					<div className={`corner ${animateText ? "glowing-corner" : ""}`}>
						<div className="img-container">
							<Image
								src={keyboardIcon}
								alt="a keyboard to indicate that chat is used"
								width={50}
								height={50}
							/>
						</div>
					</div>
				</>
			)}
			{describer && describer === "voice" && (
				<>
					<div className={`corner ${animateVoice ? "glowing-corner" : ""}`}>
						<div className="img-container">
							<Image
								src={microphoneIcon}
								alt="a microphone to indicate that voice is used"
								width={50}
								height={50}
							/>
						</div>
					</div>
				</>
			)}
			{children}
		</div>
	);
};

export default BackgroundTemplate;
