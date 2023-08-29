import { useIsUserDescriber } from "@/hooks/useIsUserDescriber";
import { useGameStore } from "@/stores/GameStore";

type Props = {
  isLoading: boolean;
  isMuted: boolean;
  isGameOver: boolean;
  mute: () => void;
  unmute: () => void;
};

export const VoicePanel = ({
  isLoading,
  isMuted,
  isGameOver,
  mute,
  unmute,
}: Props) => {
  const isUserDescriber = useIsUserDescriber();
  const describerOrder = useGameStore((state) => state.describerOrder);
  const players = useGameStore((state) => state.players);

  const describer = Object.values(players).find(
    (player) => player.order === describerOrder
  );

  return (
    <div className="w-full flex justify-center items-center gap-4 h-14">
      {isGameOver ? (
        <div>Game is over. No player is speaking.</div>
      ) : isUserDescriber ? (
        <>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isLoading || isMuted ? "bg-slate-400" : "bg-green-500"
              }`}
            />
            <p className="text-lg w-28">
              {isLoading ? "Connecting..." : isMuted ? "Muted" : "Speaking..."}
            </p>
          </div>
          <button
            className="w-24 py-1 rounded-xl bg-red-700 text-white sm:text-xl disabled:bg-blue-200"
            onClick={isMuted ? unmute : mute}
            disabled={isLoading}
          >
            {isMuted ? "Unmute" : "Mute"}
          </button>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isLoading ? "bg-slate-400" : "bg-green-500"
            }`}
          />
          <p className="text-lg w-28 whitespace-nowrap">
            {describer?.username} is{" "}
            {isLoading ? "connecting..." : "speaking..."}
          </p>
        </div>
      )}
    </div>
  );
};
