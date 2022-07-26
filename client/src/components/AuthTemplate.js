import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import lingpalIcon from "../assets/lingpal.png";

const AuthTemplate = ({ children }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const pathname = location.pathname;

	const authType = pathname.includes("sign-up")
		? "signUp"
		: pathname.includes("sign-in")
		? "signIn"
		: "unknown";

	return (
		<div className="light-yellow h-screen relative flex justify-center items-center px-4">
			<div className="absolute top-0 z-10 w-full flex justify-start lg:justify-end">
				<div
					onClick={() => navigate("/")}
					className="cursor-pointer flex items-center m-2 sm:mx-8 sm:my-4"
				>
					<div className="w-12 sm:w-16 md:w-20">
						<img src={lingpalIcon} alt="Langpal" />
					</div>
					<p className="pl-2 font-bold sm:text-xl md:text-2xl md:pl-4">
						Lingpal
					</p>
				</div>
			</div>
			<div className="auth-form w-full max-w-md h-500 md:h-700 lg:h-5/6 rounded-2xl md:rounded-3xl bg-white pt-4 md:mt-8 grid grid-rows-layout5">
				<div className="auth-separator mb-2 px-4 md:px-8">
					<button
						onClick={() => navigate("/sign-up")}
						className={`text-orange-500 text-xl p-2 font-semibold ${
							authType === "signUp" ? "border-b-2 border-b-orange-500" : ""
						}`}
					>
						Sign Up
					</button>
					<button
						onClick={() => navigate("/sign-in")}
						className={`text-orange-500 text-xl p-2 font-semibold ml-4 ${
							authType === "signIn" ? "border-b-2 border-b-orange-500" : ""
						}`}
					>
						Log In
					</button>
				</div>
				{children}
			</div>
		</div>
	);
};

export default AuthTemplate;
