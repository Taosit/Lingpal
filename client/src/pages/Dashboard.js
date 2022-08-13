import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "cloudinary-react";
import Compressor from "compressorjs";
import { useAuthContext } from "../contexts/AuthContext";
import useAuthAxios from "../hooks/useAuthAxios";
import lingpalIcon from "../assets/lingpal.png";
import notesIcon from "../assets/notes.png";
import recordingsIcon from "../assets/recordings.png";
import uploadIcon from "../assets/upload-image.png";
import { useGameContext } from "../contexts/GameContext";

const Dashboard = () => {
	const { setPlayers, setInGame, setRoomId, setRound, setDescriberIndex } =
		useGameContext();
	const { user, setUser } = useAuthContext();
	const authAxios = useAuthAxios();

	const win = !user.total ? 0 : ((user.win * 100) / user.total).toFixed(1);
	const hardPlayer = !user.total
		? 0
		: ((user.advanced * 100) / user.total).toFixed(1);

	const navigate = useNavigate();

	const compress = (file, options) => {
		return new Promise((resolve, reject) => {
			new Compressor(file, {
				...options,
				success(result) {
					resolve(result);
				},
				error(err) {
					reject(err);
				},
			});
		});
	};

	const uploadImage = async imageFile => {
		console.log("uploading");
		if (!imageFile) return;
		const allowedType = ["image/jpeg", "image/jpg", "image/png"];
		if (!allowedType.includes(imageFile.type)) {
			console.log("file not supported");
			return;
		}
		if (imageFile.size > 100000) {
			imageFile = await compress(imageFile, { maxWidth: 500 });
		}
		const reader = new FileReader();
		reader.readAsDataURL(imageFile);
		reader.onloadend = () => {
			authAxios
				.post("/upload-image", {
					data: reader.result,
				})
				.then(response => {
					setUser(prev => ({ ...prev, avatar: response.data.id }));
				});
		};
	};

	const play = () => {
		initializeSettings();
		navigate("/game-settings");
	};

	const initializeSettings = () => {
		setRound(0);
		setDescriberIndex(0);
		setPlayers({});
		setInGame(false);
		setRoomId(null);
	};

	const logout = () => {
		fetch("http://localhost:5000/logout", {
			credentials: "include",
		}).then(() => setUser(null));
	};

	return (
		<div className="light-yellow h-screen overflow-hidden">
			<div className="relative top-0 z-10 w-full flex justify-start">
				<div className="flex items-center m-2 sm:ml-8 sm:mt-4">
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
								<div className="relative">
									<div
										className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-red-300 overflow-hidden`}
									>
										<Image
											className="rounded-full object-contain object-center"
											cloudName={process.env.REACT_APP_CLOUDINARY_NAME}
											publicId={user.avatar || "nruwutqaihxyl7sq6ilm"}
											width="300"
											crop="scale"
										/>
									</div>
									<label className="absolute bottom-0 -right-2 cursor-pointer">
										<span>
											<img
												className="w-5 h-5"
												src={uploadIcon}
												alt="upload image"
											/>
										</span>
										<input
											onChange={e => uploadImage(e.target.files[0])}
											type="file"
											className="hidden"
										/>
									</label>
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
