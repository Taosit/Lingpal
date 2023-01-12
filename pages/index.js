import React from "react";
import { useRouter } from "next/router";
import Image from 'next/image'
import lingpalIcon from "../assets/lingpal.png";
import coverImage from "../assets/coverImage.png";

const Page = () => {
	const router = useRouter()
	const navigate = router.push;
	return (
		<div className="landing w-screen overflow-x-hidden overflow-y-auto">
			<div className="h-screen w-full relative">
				<div className="relative z-10 w-full flex justify-start lg:justify-end lg:absolute">
					<div className="flex items-center m-2 sm:mx-8 sm:my-4">
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
				<div className="orange-circle"></div>
				<div className="green-circle">
					<div className="text-inside flex flex-col justify-around items-center text-center text-white">
						<h1 className="max-w-xl lg:max-w-2xl md:w-11/12 text-3xl tracking-wide sm:text-4xl sm:leading-normal md:leading-relaxed lg:leading-normal lg:pt-0 xl:text-5xl xl:leading-normal">
							Practicing languages can be easy and fun
						</h1>
						<p className="mt-4 text-lg sm:text-xl xl:text-2xl sm:leading-relaxed">
							Meet other learners through interactive games that get you started
							with speaking right away
						</p>
						<div className="mt-8 w-full flex justify-evenly pt-2">
							<button
								onClick={() => navigate("/signup")}
								className="signup-button sm:text-2xl px-4 py-2 font-semibold border-2 border-white rounded outline-1 outline outline-offset-1 hover:underline active:outline-none"
							>
								Sign up
							</button>
							<button
								onClick={() => navigate("/login")}
								className="sm:text-2xl font-semibold hover:underline"
							>
								Log In
							</button>
						</div>
					</div>
				</div>
				<div className="absolute bottom-0 right-0 w-screen md:w-auto lg:w-screen flex justify-end">
					<Image className="w-5/6 md:w-[32rem] lg:w-1/3 max-w-xl"  src={coverImage}
						alt="woman playing game"
						width={400}
						height={300} />
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
						onClick={() => navigate("/signup")}
						className="border-2 border-orange-500 rounded-md px-6 py-1 text-orange-500 font-bold text-xl hover:underline md:text-2xl md:px-8 md:py-2 md:border-4"
					>
						Sign Up
					</button>
				</div>
			</div>
		</div>
	);
};

export default Page;
