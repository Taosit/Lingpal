import React from "react";
import { useNavigate } from "react-router-dom";
import lingpalIcon from "../assets/lingpal.png";
import coverImage from "../assets/coverImage.png";

const Landing = () => {
	const navigate = useNavigate();
	return (
		<div className="landing w-screen overflow-x-hidden overflow-y-auto">
			<div className="h-screen w-full relative">
				<div className="relative z-10 w-full flex justify-start lg:justify-end lg:absolute">
					<div className="flex items-center m-2 sm:mx-8 sm:my-4">
						<div className="w-12 sm:w-16 md:w-20">
							<img src={lingpalIcon} alt="Langpal" />
						</div>
						<p className="pl-2 font-bold sm:text-xl md:text-2xl md:pl-4">
							Lingpal
						</p>
					</div>
				</div>
				<div className="orange-circle"></div>
				<div className="green-circle"></div>
				<div className="relative z-10 h-3/5 p-4 sm:p-8 flex flex-col justify-around text-center text-white lg:h-2/3 lg:aspect-[5/3]">
					<h1 className="text-3xl tracking-wide mb-4 sm:text-4xl md:text-5xl sm:leading-normal md:leading-relaxed lg:text-4xl lg:leading-normal lg:pt-0 xl:text-6xl xl:leading-normal">
						Practicing languages can be easy and fun
					</h1>
					<p className="text-lg sm:text-xl md:text-3xl lg:text-xl xl:text-2xl sm:leading-relaxed">
						Meet other learners through interactive games that get you started
						with speaking right away
					</p>
					<div className="flex justify-evenly pt-2">
						<button
							onClick={() => navigate("/sign-up")}
							className="sign-up-button sm:text-2xl md:text-3xl lg:text-2xl px-4 py-2 font-semibold border-2 border-white rounded outline-1 outline outline-offset-1 hover:underline active:outline-none"
						>
							Sign up
						</button>
						<button
							onClick={() => navigate("/sign-in")}
							className="sm:text-2xl md:text-3xl lg:text-2xl font-semibold hover:underline"
						>
							Log In
						</button>
					</div>
				</div>
				<div className="absolute bottom-0 right-0 w-2/3 flex justify-end sm:h-1/3 lg:h-3/5 p-2 md:p-4">
					<img src={coverImage} alt="woman playing game" />
				</div>
			</div>
			<div className="w-full h-screen px-2 md:px-4 pt-8 pb-2">
				<div className="h-5/6 w-full grid grid-rows-3 gap-2 md:gap-0">
					<div className="grid grid-cols-1 md:grid-cols-2">
						<article className="bg-orange-500 rounded-2xl text-center p-4 flex flex-col justify-evenly">
							<h3 className="text-white text-xl sm:2xl">
								Improve Language Level
							</h3>
							<p className="text-white">
								It’s a game, but it can be more educational than competitive.
								Featuring notetaking, recording and peer evaluation, Lingpal
								aims to bring your language skills to the next level.
							</p>
						</article>
						<article className="landing-image star-image"></article>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2">
						<article className="landing-image arrow-image"></article>
						<article className="bg-transparent border-2 border-orange-500 md:bg-orange-500 rounded-2xl  text-center p-4 flex flex-col justify-evenly">
							<h3 className="text-orange-700 md:text-white text-xl sm:2xl">
								Build Precision
							</h3>
							<p className="text-orange-700 md:text-white">
								In a conversation, we skip details because they take time to
								explain. Lingpal trains your precision with a selection of
								nuanced words and plenty of time to work on your explanations.
							</p>
						</article>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2">
						<article className="bg-orange-500 rounded-2xl text-center p-4 flex flex-col justify-evenly">
							<h3 className="text-white text-xl sm:2xl">Practice Right Away</h3>
							<p className="text-white">
								Finding a topic is not always easy, but don’t let it hold you
								back from speaking. Lingpal spares you the topic-searching part
								so that you can jump straight into practice.
							</p>
						</article>
						<article className="landing-image girl-image"></article>
					</div>
				</div>
				<div className="h-1/6 w-full flex justify-center items-center">
					<button
						onClick={() => navigate("/sign-up")}
						className="border-2 border-orange-500 rounded-md px-6 py-1 text-orange-500 font-bold text-xl hover:underline md:text-2xl md:px-8 md:py-2 md:border-4"
					>
						Sign Up
					</button>
				</div>
			</div>
		</div>
	);
};

export default Landing;
