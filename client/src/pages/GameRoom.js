import React, { useState, useEffect } from "react";
import { Image } from "cloudinary-react";
import { useNavigate } from "react-router-dom";
import BackgroundTemplate from "../components/BackgroundTemplate";
import { usePlayerContext } from "../contexts/PlayerContext";
import useWindowSize from "../hooks/useWindowSize";
import timerIcon from "../assets/timer.png";
import ChatBox from "../components/ChatBox";
import Notes from "../components/Notes";
import { useSocketContext } from "../contexts/SocketContext";
import { useAuthContext } from "../contexts/AuthContext";

const GameRoom = () => {
	const { players, setPlayers, increasePlayerScore, round, setRound, roomId } =
		usePlayerContext();
	const { socket } = useSocketContext();
	const { user } = useAuthContext();
	const windowSize = useWindowSize();

	const [describerIndex, setDescriberIndex] = useState(0);

	const playerArray = Object.values(players).sort(
		(player1, player2) => player1.order - player2.order
	);

	const playerNumber = playerArray.length;

	const describer = playerArray.find(p => p.order === describerIndex);

	const getNextDescriber = () => {
		const nextTurn = (describerIndex + 1) % 4;
		const nextDescriber = playerArray.find(p => p.order === nextTurn);
		return nextDescriber.username;
	};

	const userIndex = players[user._id].order;
	let { words, notes } = players[describer._id];

	const navigate = useNavigate();

	const [inputText, setInputText] = useState("");
	const [messages, setMessages] = useState([]);
	const [display, setDisplay] = useState("chatbox");
	const [time, setTime] = useState(null);

	const userIsDescriber = () => {
		return describer._id === user._id;
	};

	useEffect(() => {
		console.log({ players });
		socket.on("time-update", time => {
			setTime(time);
		});
	}, []);

	useEffect(() => {
		console.log("use effect", { describerIndex, playerNumber, time });
		if (time === null || time > 0) return;
		setDisplay("chatbox");
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
					describerIndex !== playerNumber - 1
						? `Now it's ${
								describerIndex + 1 === userIndex
									? "your"
									: `${getNextDescriber()}'s`
						  } turn.`
						: `The ${round < 2 ? "round" : "game"} ends`,
			},
		]);

		setTimeout(
			() => {
				endTurn();
			},
			describerIndex === playerNumber - 1 ? 3000 : 1000
		);
	}, [time]);

	useEffect(() => {
		socket.on("player-left", players => {
			setPlayers(players);
		});
	}, []);

	const endTurn = () => {
		console.log("turn ended");
		if (round == 2 && describerIndex === playerNumber - 1) {
			//Game over
		} else {
			if (describerIndex === playerNumber - 1) {
				// New round
				setRound(prev => prev + 1);
				navigate("/notes-room");
			} else {
				if (!players[user._id].order) {
					console.log("emitting new turn");
					socket.emit("set-timer", (roomId, 12));
				}
				console.log("increasing des index");
				setDescriberIndex(prev => prev + 1);
			}
		}
	};

	const appendMessage = text => {
		if (text.toLowerCase().includes(words[round])) {
			setMessages(prev => [
				...prev,
				{
					sender: user.username,
					isBot: false,
					isDescriber: userIsDescriber(),
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
						describerIndex !== playerNumber - 1
							? `Now it's ${
									describerIndex + 1 === userIndex
										? "your"
										: `${getNextDescriber()}'s`
							  } turn.`
							: "The round ends",
				},
			]);
			endTurn();
			increasePlayerScore(user._id, 1);
		} else {
			setMessages(prev => [
				...prev,
				{
					sender: user.username,
					isDescriber: userIsDescriber(),
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
		socket.emit("quit-game", { user, roomId });
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
									i === describerIndex
										? "outline outline-yellow-500 outline-offset-4 md:outline-offset-8"
										: ""
								}`}
							>
								<div className="h-10 w-10 sm:h-16 sm:w-16 rounded-full overflow-clip mr-1">
									<Image
										className="rounded-full object-contain object-center"
										cloudName={process.env.REACT_APP_CLOUDINARY_NAME}
										publicId={player.avatar}
										width="300"
										crop="scale"
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
						<img src={timerIcon} alt="time ramaining" />
						<p className="ml-2 text-white font-semibold md:text-xl">
							{formatTime(time)}
						</p>
					</div>
					{userIsDescriber() ? (
						<div className="w-20 sm:w-24 h-2"></div>
					) : (
						<button className="py-1 px-2 rounded-lg bg-red-600 text-white font-semibold text-sm sm:text-base z-10">
							Rule Break
						</button>
					)}
				</div>
				{userIsDescriber() && windowSize.width >= 1024 ? (
					<div className="h-full w-full flex">
						<ChatBox
							inputText={inputText}
							setInputText={setInputText}
							messages={messages}
							appendMessage={appendMessage}
							clientIsDescriber={userIsDescriber()}
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
						clientIsDescriber={userIsDescriber()}
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
