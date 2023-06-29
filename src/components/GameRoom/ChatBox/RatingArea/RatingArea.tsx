import { useAuthStore } from "@/stores/AuthStore";
import { useGameStore } from "@/stores/GameStore";
import { useMemo } from "react";
import StarRatings from "react-star-ratings";
import { useRating } from "./useRating";

export const RatingArea = () => {
  const { players, describerIndex } = useGameStore();
  const user = useAuthStore((state) => state.user);

  const describer = Object.values(players).find(
    (p) => p.order === describerIndex
  );

  const isUserDescriber = useMemo(() => {
    return describer?.id === user?.id;
  }, [describer?.id, user?.id]);

  const { rating, finalRating, rate } = useRating();

  return (
    <div className="w-full h-1/3 my-2 p-2 bg-white">
      {isUserDescriber ? (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <>
            {!finalRating ? (
              <p className="text-lg font-semibold text-red-900">
                Please wait for your rating to show up
              </p>
            ) : (
              <p className="text-lg font-semibold text-red-900">
                Your description is rated {finalRating}
              </p>
            )}
            <StarRatings
              rating={finalRating}
              numberOfStars={5}
              starRatedColor="yellow"
            />
          </>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center">
          {rating === 10 ? (
            <p className="text-lg font-semibold text-red-900">
              Thank you for your feedback!
            </p>
          ) : (
            <>
              <p className="font-semibold text-red-900">
                How would you rate {describer?.username ?? "player"}&apos;s
                description?
              </p>
              <StarRatings
                rating={rating}
                changeRating={rate}
                numberOfStars={5}
                starRatedColor="yellow"
                starHoverColor="yellow"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
