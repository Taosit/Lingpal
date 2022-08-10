import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundTemplate from "../components/BackgroundTemplate";
import { Image } from "cloudinary-react";
import avatar4 from "../assets/avatar4.jpg";
import { usePlayerContext } from "../contexts/PlayerContext";
import WhiteboardTemplate from "../components/WhiteboardTemplate";
import { useSettingContext } from "../contexts/SettingContext";
import { useSocketContext } from "../contexts/SocketContext";
import { useAuthContext } from "../contexts/AuthContext";

const Waitroom = () => {
	const { players, setPlayers, setInGame, setRoomId } = usePlayerContext();
	const { settings } = useSettingContext();
	const { socket } = useSocketContext();
	const { user } = useAuthContext();

	useEffect(() => {
		console.log("emiting join-room");
		socket.emit("join-room", { settings, user });
		socket.on("note-time", ({ players, roomId }) => {
			setPlayers(players);
			setRoomId(roomId);
			navigate("/notes-room");
		});

		// return () => socket.emit("leave-room", { settings, user });
	}, []);

	const navigate = useNavigate();

	const leaveRoom = () => {
		navigate("/dashboard");
		console.log("leave room");
		socket.emit("leave-room", { settings, user });
		setTimeout(() => setInGame(false), 0);
	};

	const play = () => {
		// TODO: manual game start
	};

	return (
		<BackgroundTemplate>
			<WhiteboardTemplate>
				<div className="h-full grid gap-6 grid-rows-layout1">
					<div className="w-full flex flex-col justify-between items-center sm:flex-row">
						<div className="font-semibold md:text-lg py-1">
							Waiting for other players to join...
						</div>
						<div
							className="text-lg font-semibold md:text-xl text-red-800 hover:cursor-pointer py-1"
							onClick={leaveRoom}
						>
							Leave Room
						</div>
					</div>
					<div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2">
						{Object.values(players).map((player, i) => (
							<div key={i} className="player-card">
								<div className="w-1/3">
									<div className="h-10 w-10 md:h-16 md:w-16 rounded-full overflow-clip mr-1">
										<Image
											className="rounded-full object-contain object-center"
											cloudName={process.env.REACT_APP_CLOUDINARY_NAME}
											publicId={player.avatar}
											width="300"
											crop="scale"
										/>
									</div>
								</div>
								{player ? (
									<div className="flex w-2/3 flex-col justify-center items-center">
										<h5 className="font-semibold md:text-xl">
											{player.username}
										</h5>
										<p className="text-sm sm:text-base">{`Win: ${player.win}%`}</p>
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
						<button
							className="bg-yellow-300 rounded-xl px-8 py-1 text-semibold"
							onClick={play}
						>
							Play
						</button>
					</div>
				</div>
			</WhiteboardTemplate>
		</BackgroundTemplate>
	);
};

export default Waitroom;
