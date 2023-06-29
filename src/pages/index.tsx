import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import lingpalIcon from "../assets/logo.svg";
import coverImage from "../assets/cover-image.png";
import starImage from "../assets/star.svg";
import arrowImage from "../assets/up-arrows.svg";
import conversationImage from "../assets/conversation.svg";

const Page = () => {
  const router = useRouter();
  const navigate = router.push;
  return (
    <div className="cyan-gradient landing w-screen overflow-x-hidden overflow-y-auto">
      <div className="h-screen w-full relative">
        <div className="relative z-10 w-full flex justify-start lg:justify-end lg:absolute">
          <div className="flex items-center m-2 sm:mx-8 sm:my-4">
            <Image
              className="w-12 md:w-20"
              src={lingpalIcon}
              alt="logo"
              width={50}
              height={50}
            />
            <p className="pl-2 font-bold sm:text-xl md:text-2xl md:pl-4">
              Lingpal
            </p>
          </div>
        </div>
        <div className="outer-circle"></div>
        <div className="inner-circle">
          <div className="text-inside relative flex flex-col justify-around items-center text-center text-white">
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
                className="signup-button text-color1-dark bg-white sm:text-2xl px-4 py-2 font-semibold rounded hover:underline"
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
        <Image
          className="landing-image"
          src={coverImage}
          alt="woman playing game"
          width={400}
          height={300}
        />
      </div>
      <div className="w-full px-2 md:px-4 pt-12 pb-8 flex flex-col justify-around items-center gap-8 md:gap-12 relative overflow-hidden">
        <div className="bottom-small-cricle"></div>
        <div className="bottom-big-cricle"></div>
        <div className="h-5/6 max-h-[48rem] text-center md:text-left md:w-5/6 max-w-4xl flex flex-col justify-between gap-4 md:gap-8">
          <div className="relative">
            <Image
              className="card-image"
              src={starImage}
              alt="star"
              width={100}
              height={100}
            />
            <article className="rounded-2xl p-4 flex flex-col items-center">
              <div className="md:w-2/3 max-w-3xl">
                <h3 className="text-white text-xl sm:2xl mb-2">
                  Improve Language Level
                </h3>
                <p className="text-white">
                  It’s a game, but it can be more educational than competitive.
                  Featuring notetaking, recording and peer evaluation, Lingpal
                  aims to bring your language skills to the next level.
                </p>
              </div>
            </article>
          </div>
          <div className="relative">
            <Image
              className="card-image"
              src={arrowImage}
              alt="up arrows"
              width={100}
              height={100}
            />
            <article className="rounded-2xl p-4 flex flex-col items-center">
              <div className="md:w-2/3 max-w-3xl">
                <h3 className="text-white text-xl sm:2xl mb-2">
                  Build Precision
                </h3>
                <p className="text-white">
                  In a conversation, we skip details because they take time to
                  explain. Lingpal trains your precision with a selection of
                  nuanced words and plenty of time to work on your explanations.
                </p>
              </div>
            </article>
          </div>
          <div className="relative">
            <Image
              className="card-image"
              src={conversationImage}
              alt="conversation in a globe"
              width={100}
              height={100}
            />
            <article className="rounded-2xl p-4 flex flex-col items-center">
              <div className="md:w-2/3 max-w-3xl">
                <h3 className="text-white text-xl sm:2xl mb-2">
                  Practice Right Away
                </h3>
                <p className="text-white">
                  Finding a topic is not always easy, but don’t let it hold you
                  back from speaking. Lingpal spares you the topic-searching
                  part so that you can jump straight into practice.
                </p>
              </div>
            </article>
          </div>
        </div>
        <div className="h-1/6 w-full flex justify-center items-center z-10">
          <button
            onClick={() => navigate("/signup")}
            className="rounded-md px-6 py-1 text-color1-dark bg-white font-semibold text-xl hover:underline md:text-2xl md:px-8 md:py-2"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
