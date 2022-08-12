import React, { useState, useEffect } from "react";
import { Image } from "cloudinary-react";
import { useNavigate } from "react-router-dom";
import BackgroundTemplate from "../components/BackgroundTemplate";
import { useGameContext } from "../contexts/GameContext";
import useWindowSize from "../hooks/useWindowSize";
import timerIcon from "../assets/timer.png";
import ChatBox from "../components/ChatBox";
import Notes from "../components/Notes";
import { useSocketContext } from "../contexts/SocketContext";
import { useAuthContext } from "../contexts/AuthContext";
import { NOTE_TIME, ROUND_NUMBER, TURN_TIME } from "../utils/constants";
import { useSettingContext } from "../contexts/SettingContext";
import useAuthAxios from "../hooks/useAuthAxios";

const GameRoom = () => {
	const {
		players,
		setPlayers,
		round,
		setRound,
		describerIndex,
		setDescriberIndex,
		roomId,
	} = useGameContext();

	const { socket } = useSocketContext();
	const { user } = useAuthContext();
	const { settings } = useSettingContext();

	const windowSize = useWindowSize();
	const authAxios = useAuthAxios();

	const playerArray = Object.values(players).sort(
		(player1, player2) => player1.order - player2.order
	);

	const describer = playerArray.find(p => p.order === describerIndex);

	let { words, notes } = players[describer._id];

	const navigate = useNavigate();

	const [inputText, setInputText] = useState("");
	const [messages, setMessages] = useState([]);
	const [display, setDisplay] = useState("chatbox");
	const [time, setTime] = useState(TURN_TIME);

	const userIsDescriber = () => {
		return describer._id === user._id;
	};

	useEffect(() => {
		socket.on("time-update", time => {
			setTime(time);
		});

		return () => {
			socket.off("time-update");
		};
	}, [socket]);

	useEffect(() => {
		socket.on("receive-message", message => {
			setMessages(prev => [...prev, message]);
		});

		return () => {
			socket.off("receive-message");
		};
	}, [socket]);

	useEffect(() => {
		socket.on("correct-answer", players => {
			setPlayers(players);
			console.log("on correct-answer");
			endTurn();
		});

		return () => {
			socket.off("correct-answer");
		};
	}, [socket]);

	useEffect(() => {
		socket.on("turn-updated", newDescriberIndex => {
			console.log("turn updated to", newDescriberIndex);
			setDescriberIndex(newDescriberIndex);
			socket.off("time-update");
			setTimeout(() => {
				setTime(TURN_TIME);
				socket.on("time-update", time => {
					setTime(time);
				});
				if (players[user._id].order === 0) {
					console.log("emitting turn-time");
					socket.emit("turn-time", { roomId, time: TURN_TIME });
				}
			}, 1000);
		});

		return () => {
			socket.off("turn-updated");
		};
	}, [socket]);

	useEffect(() => {
		socket.on("round-updated", ({ nextRound, nextDesc }) => {
			console.log("round updated to", nextRound);
			socket.off("time-update");
			setTimeout(() => {
				socket.on("time-update", time => {
					setTime(time);
				});
				setRound(nextRound);
				setDescriberIndex(nextDesc);
				navigate("/notes-room");
			}, 3000);
		});

		return () => {
			socket.off("round-updated");
		};
	}, [socket]);

	useEffect(() => {
		socket.on("player-left", (room, user) => {
			setPlayers(players);
		});

		return () => {
			socket.off("player-left");
		};
	}, [socket]);

	useEffect(() => {
		socket.on("game-over", async () => {
			const userScore = players[user._id].score;
			const userRank = playerArray.reduce((rank, player) => {
				if (userScore < player._score) return rank + 1;
				return rank;
			}, 1);
			const userWon = userRank <= playerArray.length / 2;

			const message = {
				sender: null,
				isBot: true,
				isDescriber: null,
				text: `Game is over. Your rank is ${userRank}.${
					userWon ? " Well done!" : ""
				}`,
			};

			setMessages(prev => [...prev, message]);

			const data = { win: userWon, advanced: settings.level === "hard" };

			authAxios
				.post("/update-stats", {
					data,
				})
				.then(response => {
					if (response.status === 200) {
						console.log("User stats updated");
					} else {
						console.log("Something went wrong");
					}
				});

			setTimeout(() => {
				navigate("/wait-room");
			}, 3000);
		});

		return () => {
			socket.off("game-over");
		};
	}, [socket]);

	useEffect(() => {
		const message = {
			sender: null,
			isBot: true,
			isDescriber: null,
			text: `It's ${
				userIsDescriber() ? "your" : `${describer.username}'s`
			} turn to describe.`,
		};
		setMessages(prev => [...prev, message]);
		if (describerIndex) return;
		if (players[user._id].order === 0) {
			console.log("emitting turn-time");
			socket.emit("turn-time", { roomId, time: TURN_TIME });
		}
	}, [describerIndex]);

	useEffect(() => {
		console.log("use effect", { time });
		if (time === null || time > 0) return;
		setDisplay("chatbox");
		setMessages(prev => [
			...prev,
			{
				sender: null,
				isBot: true,
				isDescriber: null,
				text: `Time out... ${
					userIsDescriber()
						? "The word seems a bit tricky"
						: `The correct word is ${words[round]}`
				}.`,
			},
		]);

		setTimeout(() => endTurn(), isLastPlayer() ? 3000 : 1000);
	}, [time]);

	const isLastPlayer = () => {
		return !playerArray.some(p => p.order > describer.order);
	};

	const endTurn = () => {
		console.log("turn ended");
		if (players[user._id].order === 0) {
			socket.emit("update-turn", roomId);
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
							word={words[round]}
							describerId={describer._id}
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
						word={words[round]}
						describerId={describer._id}
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
