import { CardBody } from "@/components/Card";
import { useAuthStore } from "@/stores/AuthStore";
import NextImage from "next/image";
import gamelIcon from "./game.svg";
import badgeIcon from "./badge.svg";
import gearsIcon from "./gears.svg";

export const PlayerStats = () => {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  const win = user?.total ? ((user.win * 100) / user.total).toFixed(1) : 0;
  const hardPlayer = user?.total
    ? ((user.advanced * 100) / user.total).toFixed(1)
    : 0;

  return (
    <CardBody className="px-6 py-4">
      <div className="flex flex-col">
        <div className="my-6 md:text-lg flex justify-between">
          <span className="flex gap-2">
            <NextImage src={gamelIcon} alt="game" width={24} height={24} />
            <p>Total</p>
          </span>
          <span data-testid="total" className="">
            {loading || !user ? 0 : user.total}
          </span>
        </div>
        <hr />
        <div className="my-6 md:text-lg flex justify-between">
          <span className="flex gap-2">
            <NextImage
              src={badgeIcon}
              alt="winning badge"
              width={24}
              height={24}
            />
            <p>Win</p>
          </span>
          <span data-testid="win" className="">
            {loading || !user ? 0 : win}%
          </span>
        </div>
        <hr />
        <div className="my-6 md:text-lg flex justify-between">
          <span className="flex gap-2">
            <NextImage src={gearsIcon} alt="3 gears" width={24} height={24} />
            <p>Hard</p>
          </span>
          <span className="">{loading || !user ? 0 : hardPlayer}%</span>
        </div>
      </div>
    </CardBody>
  );
};
