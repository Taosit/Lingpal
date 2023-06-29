import NextImage from "next/image";
import { CldImage } from "next-cloudinary";
import CheckmarkIcon from "./checkmark.png";

type Props = {
  player: Player | null;
};

export const Player = ({ player }: Props) => {
  return (
    <div className="player-card">
      <div className="w-1/3 relative">
        {player?.isReady && (
          <div className="absolute top-0 -right-5 w-6 h-6 opacity-50">
            <NextImage
              src={CheckmarkIcon}
              alt="Player is ready"
              width={50}
              height={50}
            />
          </div>
        )}
        <div className="h-10 w-10 md:h-16 md:w-16 rounded-full overflow-clip mr-1">
          <CldImage
            className={`rounded-full object-contain object-center ${
              player ? "" : "blur-sm opacity-50"
            }`}
            width="100"
            height="100"
            src={player?.avatar || "nruwutqaihxyl7sq6ilm"}
            alt="player avatar"
          />
        </div>
      </div>
      {player ? (
        <div className="flex w-2/3 flex-col justify-center items-center">
          <h5 className="font-semibold md:text-xl">{player.username}</h5>
          <p className="text-sm sm:text-base">{`Win: ${(!player.total
            ? 0
            : (player.win * 100) / player.total
          ).toFixed(1)}%`}</p>
        </div>
      ) : (
        <div className="flex w-2/3 justify-center items-center">
          <p className="font-bold text-lg sm:text-xl">?</p>
        </div>
      )}
    </div>
  );
};
