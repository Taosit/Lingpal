import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundTemplate from "../components/BackgroundTemplate";
import { usePlayerContext } from "../contexts/PlayerContext";
import useWindowSize from "../hooks/useWindowSize";
import defaultAvatar from "../assets/default_avatar.png";
import timerIcon from "../assets/timer.png";
import ChatBox from "../components/ChatBox";
import Notes from "../components/Notes";

const GameRoom = () => {
	const { players, increasePlayerScore, round, setRound } = usePlayerContext();
	const windowSize = useWindowSize();

	const [describer, setDescriber] = useState(0);

	const client = 0;
	let { words, notes } = players[describer];

	const navigate = useNavigate();

	const timePerRound = 15;

	const getEndTime = timeValue => {
		let time = new Date();
		time.setSeconds(time.getSeconds() + parseInt(timeValue));
		return time.getTime();
	};

	const [inputText, setInputText] = useState("");
	const [messages, setMessages] = useState([]);
	const [display, setDisplay] = useState("chatbox");
	const [time, setTime] = useState(null);

	let timeInterval;

	useEffect(() => {
		if ((describer < 3 && time >= 0) || (describer === 3 && time >= 1)) return;
		setDisplay("chatbox");
		clearInterval(timeInterval);
		setMessages(prev => [
			...prev,
			{
				sender: null,
				isBot: true,
				isDescriber: null,
				text: `Time out... The correct word is ${words[round]}.`,
			},
			{
				sender: null,
				isBot: true,
				isDescriber: null,
				text:
					describer !== 3
						? `Now it's ${
								describer + 1 === client
									? "your"
									: `${players[(describer + 1) % 4].username}'s`
						  } turn.`
						: "The round ends",
			},
		]);
		endTurn();
	}, [time]);

	useEffect(() => {
		const endTimeResult = getEndTime(timePerRound);
		setTime(timePerRound);

		console.log({ word: words[round] });

		timeInterval = setInterval(() => {
			const updatedTime = Math.round(
				(endTimeResult - new Date().getTime()) / 1000
			);
			setTime(updatedTime);
			if (describer === 3 && updatedTime === 0) {
				clearInterval(timeInterval);
			}
		}, 1000);

		// handle describer change logic

		return () => {
			clearInterval(timeInterval);
		};
	}, [describer]);

	const endTurn = () => {
		if (round == 2 && describer === 3) {
			//Game over
		} else {
			if (describer === 3) {
				// New round
				setRound(prev => prev + 1);
				setTimeout(() => {
					navigate("/notes-room");
				}, 2000);
			} else {
				setDescriber(prev => prev + 1);
			}
		}
	};

	const appendMessage = text => {
		if (text.toLowerCase().includes(words[round])) {
			setMessages(prev => [
				...prev,
				{
					sender: players[client].username,
					isBot: false,
					isDescriber: describer === client,
					text,
				},
				{
					sender: null,
					isBot: true,
					isDescriber: null,
					text: `The correct word is ${words[round]}. You got it right! Well done!`,
				},
				{
					sender: null,
					isBot: true,
					isDescriber: null,
					text:
						describer !== 3
							? `Now it's ${
									describer + 1 === client
										? "your"
										: `${players[(describer + 1) % 4].username}'s`
							  } turn.`
							: "The round ends",
				},
			]);
			endTurn();
			increasePlayerScore(client, 1);
		} else {
			setMessages(prev => [
				...prev,
				{
					sender: players[client].username,
					isDescriber: describer === client,
					text,
				},
			]);
		}
	};

	const formatTime = time => {
		const minutes = Math.floor(time / 60);
		const seconds = time % 60;
		return `${minutes}:${seconds}`;
	};

	const leaveGame = () => {
		navigate("/dashboard");
	};

	return (
		<BackgroundTemplate>
			<div className="h-full w-full px-4 sm:px-8 py-8 grid grid-rows-layout6 gap-2 sm:gap-4">
				<div className="flex justify-between">
					{players &&
						players.map((player, i) => (
							<div
								key={i}
								className={`flex flex-col lg:flex-row items-center rounded z-10 ${
									i === describer
										? "outline outline-yellow-500 outline-offset-4 md:outline-offset-8"
										: ""
								}`}
							>
								<div className="h-10 w-10 sm:h-16 sm:w-16 rounded-full overflow-clip mr-1">
									<img
										className="object-cover"
										src={player.avatar || defaultAvatar}
										alt="avatar"
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
					{/* <div className={describer === client ? "" : "w-20 sm:w-24 h-2"}></div> */}
					<button
						onClick={() => leaveGame()}
						className="mr-4 py-1 px-2 rounded-lg bg-red-600 text-white font-semibold text-sm sm:text-base z-10"
					>
						Quit
					</button>
					<div className="flex items-center">
						<img src={timerIcon} alt="time ramaining" />
						<p className="ml-2 text-white font-semibold md:text-xl">
							{formatTime(time)}
						</p>
					</div>
					{describer === client ? (
						<div className="w-20 sm:w-24 h-2"></div>
					) : (
						<button className="py-1 px-2 rounded-lg bg-red-600 text-white font-semibold text-sm sm:text-base z-10">
							Rule Break
						</button>
					)}
				</div>
				{describer === client && windowSize.width >= 1024 ? (
					<div className="h-full w-full flex">
						<ChatBox
							inputText={inputText}
							setInputText={setInputText}
							messages={messages}
							appendMessage={appendMessage}
							clientIsDescriber={describer === client}
							setDisplay={setDisplay}
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
						appendMessage={appendMessage}
						clientIsDescriber={describer === client}
						setDisplay={setDisplay}
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
};

export default GameRoom;
