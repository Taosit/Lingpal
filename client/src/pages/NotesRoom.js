import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundTemplate from "../components/BackgroundTemplate";
import WhiteboardTemplate from "../components/WhiteboardTemplate";
import { useAuthContext } from "../contexts/AuthContext";
import { usePlayerContext } from "../contexts/PlayerContext";
import { useSocketContext } from "../contexts/SocketContext";

const NotesRoom = () => {
	const { players, updatePlayerNotes, round, roomId } = usePlayerContext();

	const { socket } = useSocketContext();
	const { user } = useAuthContext();

	const [activeNote, setActiveNote] = useState(null);
	const [word, setWord] = useState(null);
	const [notes, setNotes] = useState(["", "", "", ""]);
	const [time, setTime] = useState(30);

	const navigate = useNavigate();

	const capitalize = word => {
		return word.replace(word[0], word[0].toUpperCase());
	};

	const formatTime = time => {
		const minutes = Math.floor(time / 60);
		const seconds = time % 60;
		return `${minutes}:${seconds}`;
	};

	useEffect(() => {
		console.log({ round });

		if (!players[user._id].order) {
			console.log("emitting new turn");
			socket.emit("set-timer", (roomId, 10));
		}

		socket.on("time-update", updatedTime => {
			setTime(updatedTime);
		});
		return () => socket.off("time-update");
	}, []);

	useEffect(() => {
		if (time > 0) return;
		play();
	}, [time]);

	useEffect(() => {
		console.log({ players });
		if (players[user._id].words) {
			setWord(players[user._id].words[round]);
		}
	}, [players]);

	const play = () => {
		const writtenNotes = notes.filter(note => note !== "");
		updatePlayerNotes(user._id, writtenNotes);
		console.log({ user });
		if (!players[user._id].order) {
			console.log("emitting new turn");
			socket.emit("set-timer", (roomId, 12));
		}
		navigate("/game-room");
	};

	return (
		<BackgroundTemplate>
			<WhiteboardTemplate>
				<div className="grid h-full w-full gap-6 grid-rows-layout2">
					<div>
						<h2 className="uppercase text-center text-white md:text-lg">
							Your Word
						</h2>
						{word && (
							<h1 className="my-2 text-2xl md:text-4xl text-white drop-shadow-2xl text-center font-semibold">
								{capitalize(word)}
							</h1>
						)}
					</div>
					<div className="w-full grid grid-rows-layout5 gap-4">
						<p className="lg:text-lg">
							Before the game starts, take some time to write notes.
						</p>
						{notes && activeNote !== null ? (
							<div className="w-full grid gap-2 grid-rows-layout3 h-full items-center">
								<textarea
									className="resize-none h-full bg-yellow-50 w-full focus:outline-yellow-400 rounded-lg px-4 py-2 lg:text-lg"
									value={notes[activeNote]}
									onChange={e =>
										setNotes(prev =>
											prev.map((note, i) =>
												i === activeNote ? e.target.value : note
											)
										)
									}
								/>
								<div className="flex flex-col">
									<button
										className="bg-yellow-300 rounded-xl px-8 py-1 text-semibold self-center"
										onClick={() => setActiveNote(null)}
									>
										OK
									</button>
								</div>
							</div>
						) : (
							notes && (
								<div className="h-full min-h-0 grid sm:grid-cols-2 sm:grid-rows-layout4 gap-4 md:gap-8 place-items-center">
									{notes.map((note, i) => {
										if (!note) {
											return (
												<div
													key={i}
													className="w-full h-full max-h-24 sm:max-h-full border-2 border-dashed border-white flex justify-center items-center cursor-pointer"
													onClick={() => setActiveNote(i)}
												>
													<p className="text-2xl text-white">+</p>
												</div>
											);
										}
										return (
											<div
												key={i}
												className="w-full h-full max-h-24 sm:max-h-full px-4 py-2 bg-yellow-200 cursor-pointer drop-shadow-md text-sm md:text-base"
												onClick={() => setActiveNote(i)}
											>
												{note.length > 100 ? `${note.slice(0, 100)}...` : note}
											</div>
										);
									})}
								</div>
							)
						)}
					</div>
					<div className="w-full">
						<p className="text-center md:text-lg">
							Game starts in {formatTime(time)}
							<span className="bg-yellow-300 rounded px-8" onClick={play}>
								Start
							</span>
						</p>
					</div>
				</div>
			</WhiteboardTemplate>
		</BackgroundTemplate>
	);
};

export default NotesRoom;
