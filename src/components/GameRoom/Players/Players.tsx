import useWindowSize from "@/hooks/useWindowSize";
import { useGameStore } from "@/stores/GameStore";
import { CldImage } from "next-cloudinary";

export const Players = () => {
  const { players, describerIndex } = useGameStore();

  const windowSize = useWindowSize();

  const playerArray = Object.values(players).sort(
    (player1, player2) => player1.order - player2.order
  );

  const describer = playerArray.find((p) => p.order === describerIndex);

  return (
    <div className="flex justify-between">
      {players &&
        playerArray.map((player, i) => (
          <div
            key={i}
            className={`flex flex-col lg:flex-row items-center rounded z-10 ${
              player.id === describer?.id
                ? "outline outline-yellow-500 outline-offset-4 md:outline-offset-8"
                : ""
            }`}
          >
            <div className="h-10 w-10 sm:h-16 sm:w-16 rounded-full overflow-clip mr-1">
              <CldImage
                className="rounded-full object-contain object-center"
                width="100"
                height="100"
                src={player.avatar}
                alt="player avatar"
              />
            </div>
            <div className="flex flex-col items-center lg:items-start lg:pl-4">
              <p className="sm:text-lg md:text-xl lg:text-2xl">
                {player.username}
              </p>
              <p className="text-bold text-lg md:text-xl">
                {windowSize.width && windowSize.width >= 1024
                  ? `Score: ${player.score}`
                  : player.score}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};
