import React from "react";
import { useRouter } from 'next/router';
import Image from 'next/image'
import lingpalIcon from "../assets/lingpal.png";

const AuthTemplate = ({ children }) => {
	const router = useRouter()
	const pathname = router.pathname;
	const navigate = router.push;

	const authType = pathname.includes("signup")
		? "signUp"
		: pathname.includes("login")
		? "signIn"
		: "unknown";

	return (
		<div className="light-yellow h-screen relative flex justify-center items-center px-4">
			<div className="absolute top-0 z-10 w-full flex justify-start lg:justify-end">
				<div
					onClick={() => navigate("/")}
					className="cursor-pointer flex items-center m-2 sm:mx-8 sm:my-4"
				>
					<div className="w-12">
						<Image
							src={lingpalIcon}
							alt="Picture of the author"
							width={50}
							height={50}
						/>
					</div>
					<p className="pl-2 font-bold sm:text-xl md:text-2xl md:pl-4">
						Lingpal
					</p>
				</div>
			</div>
			<div className="auth-form w-full max-w-md h-500 md:h-700 lg:h-5/6 rounded-2xl md:rounded-3xl bg-white pt-4 md:mt-8 grid grid-rows-layout5">
				<div className="auth-separator mb-2 px-4 md:px-8">
					<button
						onClick={() => navigate("/signup")}
						className={`text-orange-500 text-xl p-2 font-semibold ${
							authType === "signUp" ? "border-b-2 border-b-orange-500" : ""
						}`}
					>
						Sign Up
					</button>
					<button
						onClick={() => navigate("/login")}
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
