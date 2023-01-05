import React, { useState } from "react";
import Link from "next/link";
import Image from 'next/image'
import chevronLeftIcon from "../assets/chevron-left.png";
import chevronRightIcon from "../assets/chevron-right.png";

export default function About () {
  const [page, setPage] = useState(0);

  const getContent = () => {
    if (page === 0) {
      return (
        <>
          <p className="pt-2">
            Lingpal is multiplayer game where you can practice your target
            language in a fun and interactive way.
          </p>
          <p className="pt-2">
            A game can start with 2-4 players. When there are fewer than 4
            players, all players need to be ready before the game can start. A
            player can leave at any point of the game without interrupting the
            rest of the players. However, if there is only one player left, the
            game ends. Players who leave a game will only have their game count
            increased.
          </p>
          <p className="pt-2">
            A game has 2 rounds. Each round begins by giving each player their
            secret word and some time to take notes. The notes will be
            accessible to them later in the game. The player who first gets the
            secret word wins the turn and gets 2 points. The describer also gets
            one point. A turn ends when a player gets the correct word or when
            it times out. In the latter case, no player earns any points.
          </p>
        </>
      );
    } else {
      return (
        <>
          <p>There are a few settings to choose from:</p>
          <ul className="list-disc pt-2">
            <li className="ml-5">
              Mode: How competitive the game is. In the standard mode, players
              are not asked to rate the description and the players&apo;s statistics
              are updated after each game. In the relaxed more, a turn may last
              longer and the description will be rated, but neither the rating
              nor the score will affect the players&apo;s statistics.
            </li>
            <li className="ml-5">
              Level: How hard the words are. The easy level has more concrete
              objects that are straight-forward to describe, while words in the
              hard mode can be more abstract and therefore requires more
              thoughtful descriptions.
            </li>
            <li className="ml-5">
              Describer: How is a word described. Text means that the describer
              uses the chat box to send the description. Voice means that the
              describer speaks to other players in real time. All other players
              always use the chatbox.
            </li>
          </ul>
        </>
      );
    }
  };

  return (
    <div className="text-orange-800 sm:text-lg lg:text-md light-yellow min-h-screen">
      <div className="h-screen w-5/6 md:w-2/3 max-w-4xl mx-auto py-4 relative">
        <Link className="absolute left-0 top-4" href="/dashboard">
          Back
        </Link>
        <h1 className="text-xl md:text-3xl text-center font-bold my-4 sm:my-6 text-orange-700">
          about Lingpal
        </h1>
        {getContent()}
        <div className="absolute bottom-0 my-4 md:my-8 w-full flex justify-between md:justify-evenly items-center">
          <div
            className={`flex items-center cursor-pointer ${
              page === 1 ? "visible" : "invisible"
            }`}
            onClick={() => setPage(0)}
          >
            <div className="h-6 w-6 rounded-full bg-transparent-50 flex justify-center items-center">
              <Image
                src={chevronLeftIcon}
                alt="Previous"
                width={24}
                height={24}
              />
            </div>
            <p className="pl-1 text-lg md:text-xl font-semibold">General</p>
          </div>
          <p className="text-lg md:text-xl">
            Page <span className="font-semibold">{page + 1}</span> of{" "}
            <span className="font-semibold">2</span>
          </p>
          <div
            className={`flex items-center cursor-pointer ${
              page === 0 ? "visible" : "invisible"
            }`}
            onClick={() => setPage(1)}
          >
            <p className="pr-1 text-lg md:text-xl font-semibold">Settings</p>
            <div className="h-6 w-6 rounded-full bg-transparent-50 flex justify-center items-center">
              <Image
                src={chevronRightIcon}
                alt="Previous"
                width={24}
                height={24}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
