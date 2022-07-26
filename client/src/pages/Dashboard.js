import React from "react";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../assets/default_avatar.png";
import { useAuthContext } from "../contexts/AuthContext";
import lingpalIcon from "../assets/lingpal.png";
import notesIcon from "../assets/notes.png";
import recordingsIcon from "../assets/recordings.png";

const Dashboard = () => {
	const { user, setUser } = useAuthContext();

	const win = (user.total ? user.win / user.total : 0).toFixed(3) * 100;
	const hardPlayer =
		(user.total ? user.advanced / user.total : 0).toFixed(3) * 100;

	const navigate = useNavigate();

	const play = () => {
		navigate("/game-settings");
	};

	const refreshToken = () => {
		fetch("http://localhost:5000/refresh-token", {
			credentials: "include",
		}).then(() => {});
	};

	const logout = () => {
		fetch("http://localhost:5000/logout").then(() => setUser(null));
	};

	return (
		<div className="light-yellow h-screen overflow-hidden">
			<div className="relative top-0 z-10 w-full flex justify-start">
				<div
					onClick={() => navigate("/")}
					className="cursor-pointer flex items-center m-2 sm:ml-8 sm:mt-4"
				>
					<div className="w-12 sm:w-12 md:w-16">
						<img src={lingpalIcon} alt="Langpal" />
					</div>
					<p className="pl-2 font-bold sm:text-xl md:text-2xl md:pl-4">
						Lingpal
					</p>
				</div>
			</div>
			<div className="h-2/3 sm:h-5/6 w-5/6 md:w-2/3 max-w-4xl mx-auto">
				<h1
					data-text="Dashboard"
					className="mb-8 text-3xl md:text-4xl text-orange-700 font-semibold text-center"
				>
					Dashboard
				</h1>
				<div className="bg-transparent-50 w-full p-4 rounded-2xl flex items-center border-orange-700 border-2">
					<div className="w-full flex justify-center items-center">
						<div className="flex flex-col items-start">
							<div className="flex justify-center items-center">
								<div
									className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-red-300 overflow-hidden`}
								>
									<img
										className="rounded-full object-contain object-center"
										src={user.avatar || defaultAvatar}
									/>
								</div>
								<p className="pl-2 sm:pl-4 md:text-xl font-bold">
									{user.username}
								</p>
							</div>
							<p className="pt-4 text-sm sm:text-base md:text-lg">
								Learning <span className="font-semibold">English</span>
							</p>
						</div>
					</div>
					<div className="w-full h-full flex justify-center items-center">
						<div className="flex flex-col items-start">
							<div className="text-sm py-1 sm:text-base md:text-lg">
								<span className="font-semibold">Played</span>:{" "}
								{` ${user.total}`}
							</div>
							<div className="text-sm py-1 sm:text-base md:text-lg">
								<span className="font-semibold">Win</span>: {` ${win}%`}
							</div>
							<div className="text-sm py-1 sm:text-base md:text-lg">
								<span className="font-semibold">Hard Player</span>:{" "}
								{` ${hardPlayer}%`}
							</div>
						</div>
					</div>
				</div>
				<div className="w-full flex justify-end">
					<p
						onClick={refreshToken}
						className="mt-2 cursor-pointer text-red-700 font-semibold"
					>
						refresh token
					</p>
					<p
						onClick={logout}
						className="mt-2 cursor-pointer text-red-700 font-semibold"
					>
						Logout
					</p>
				</div>
				<div className="w-full my-4 md:my-8 grid grid-cols-1 gap-2 md:grid-cols-2">
					<div className="p-4 cursor-pointer flex justify-center items-center rounded-xl bg-orange-300">
						<div className="w-12 aspect-square">
							<img className="w-full" src={notesIcon} alt="notes" />
						</div>
						<h3 className="ml-2 text-lg sm:text-xl">Notes</h3>
					</div>
					<div className="p-4 cursor-pointer flex justify-center items-center rounded-xl bg-green-300">
						<div className="w-12 aspect-square">
							<img className="w-full" src={recordingsIcon} alt="recordings" />
						</div>
						<h3 className="ml-2 text-lg sm:text-xl">Recordings</h3>
					</div>
				</div>

				<div className="w-full pb-8 flex flex-col">
					<button className="play-button self-center" onClick={play}>
						Play
					</button>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
