import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { TURN_TIME } from "../utils/constants";
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
		playerLeftNoteRoom,
		setPlayerLeftNoteRoom,
	} = useGameContext();

	const { socket } = useSocketContext();
	const { user, setUser } = useAuthContext();
	const { settings } = useSettingContext();

	const windowSize = useWindowSize();
	const authAxios = useAuthAxios();

	const playerArray = Object.values(players).sort(
		(player1, player2) => player1.order - player2.order
	);

	useEffect(() => {
		if (playerLeftNoteRoom.length > 0) {
			playerLeftNoteRoom.forEach(player => {
				socket.emit("someone-left", { player, roomId });
				if (player.order === describerIndex) {
					const nextPlayer = playerArray.find(
						p => !playerLeftNoteRoom.some(pl => pl._id === p._id)
					);
					setDescriberIndex(nextPlayer.order);
				}
			});
		}
		setPlayerLeftNoteRoom([]);
	}, []);

	const describer = playerArray.find(p => p.order === describerIndex);
	let { words, notes } = players[describer._id];

	const navigate = useNavigate();

	const [inputText, setInputText] = useState("");
	const [messages, setMessages] = useState([]);
	const [display, setDisplay] = useState("chatbox");
	const [time, setTime] = useState(TURN_TIME);
	const [oldRound, setOldRound] = useState(false);

	const userIsDescriber = () => {
		return describer._id === user._id && !oldRound;
	};

	const isUserFirstPlayer = () => {
		return playerArray.every(p => players[user._id].order <= p.order);
	};

	const isLastPlayerDescribing = () => {
		return playerArray.every(p => describer.order >= p.order);
	};

	const isFirstPlayerDescribing = () => {
		return playerArray.every(p => describer.order <= p.order);
	};

	const formatTime = time => {
		const minutes = Math.floor(time / 60);
		const seconds = time % 60;
		return `${minutes}:${seconds}`;
	};

	const sendBotMessage = text => {
		const message = {
			sender: null,
			isBot: true,
			isDescriber: null,
			text,
		};
		setMessages(prev => [...prev, message]);
	};

	const endTurn = () => {
		console.log(players[user._id].order, "should emit update-turn");
		if (isUserFirstPlayer()) {
			console.log("emit update-turn");
			socket.emit("update-turn", { roomId });
		}
	};

	useEffect(() => {
		socket.on("update-time", time => {
			setTime(time);
		});

		return () => {
			socket.off("update-time");
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
		console.log({ playerArray });
		socket.on("correct-answer", players => {
			setPlayers(players);
			endTurn();
		});

		return () => {
			console.log({ playerArray });
			socket.off("correct-answer");
		};
	}, [socket, playerArray.length]);

	useEffect(() => {
		socket.on("turn-updated", newDescriberIndex => {
			console.log("turn updated to", newDescriberIndex);
			setDescriberIndex(newDescriberIndex);
			socket.off("update-time");
			setTimeout(() => {
				setTime(TURN_TIME);
				socket.on("update-time", time => {
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
				socket.on("update-time", time => {
					setTime(time);
				});
				setOldRound(false);
				navigate("/notes-room");
			}, 3000);
		});

		return () => {
			socket.off("round-updated");
		};
	}, [socket, playerArray.length]);

	useEffect(() => {
		socket.on("player-left", disconnectingPlayer => {
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
					p => players[user._id].order <= p.order
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
		socket.on("game-over", async players => {
			const { win, rank } = players[user._id];

			const messageText = `Game is over. Your rank is ${rank}.${
				win ? " Well done!" : ""
			}`;
			sendBotMessage(messageText);

			const advanced = settings.level === "hard";
			const data = { win, advanced };

			authAxios
				.post("/update-stats", {
					data,
				})
				.then(response => {
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
			if (isUserFirstPlayer()) {
				console.log("emitted turn-time");
				socket.emit("turn-time", { roomId, time: TURN_TIME });
			}
		}
	}, [describerIndex]);

	useEffect(() => {
		console.log({ time });
		if (time === null || time > 0) return;
		setDisplay("chatbox");

		const messageText = `Time out... ${
			userIsDescriber()
				? "The word seems a bit tricky"
				: `The correct word is ${words[round]}`
		}.`;
		sendBotMessage(messageText);

		setTimeout(() => endTurn(), isLastPlayerDescribing() ? 3000 : 1000);
	}, [time]);

	const leaveGame = () => {
		socket.disconnect();
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
							userIsDescriber={userIsDescriber}
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
						userIsDescriber={userIsDescriber}
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
