import React from "react";
import { useNavigate } from "react-router-dom";
import avatar from "../assets/avatar.jpg";

const Dashboard = () => {
	const navigate = useNavigate();

	const play = () => {
		navigate("/game-settings");
	};

	return (
		<div className="h-screen overflow-hidden bg-slate-300">
			<div className="h-2/3 sm:h-5/6 w-full flex flex-col justify-between items-center">
				<div className="relative h-36 w-full">
					<h1 data-text="Dashboard" className="dashboard-title">
						Dashboard
					</h1>
				</div>
				<div className="bg-transparent-50 w-5/6 md:w-2/3 max-w-2xl mx-auto px-2 sm:px-12 py-8 rounded-2xl flex items-center border-red-700 border-2">
					<div className="w-full flex justify-center items-center">
						<div className="flex flex-col items-start">
							<div className="flex justify-center items-center">
								<div
									className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-red-300 overflow-hidden`}
								>
									<img
										className="rounded-full object-contain object-center"
										src={avatar}
									/>
								</div>
								<p className="pl-2 sm:pl-4 md:text-xl font-bold">Taosit</p>
							</div>
							<p className="pt-4 text-sm sm:text-base md:text-lg">
								Learning <span className="font-semibold">English</span>
							</p>
						</div>
					</div>
					<div className="w-full h-full flex justify-center items-center">
						<div className="flex flex-col items-start">
							<div className="text-sm py-1 sm:text-base md:text-lg">
								<span className="font-semibold">Played</span>: 27
							</div>
							<div className="text-sm py-1 sm:text-base md:text-lg">
								<span className="font-semibold">Win</span>: 64%
							</div>
							<div className="text-sm py-1 sm:text-base md:text-lg">
								<span className="font-semibold">Hard Player</span>: 73%
							</div>
						</div>
					</div>
				</div>
				<div className="py-8">
					<button className="play-button" onClick={play}>
						Play
					</button>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
