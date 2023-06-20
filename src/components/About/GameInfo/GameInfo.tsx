import { Card, CardBody, CardHeader } from "@/components/Card";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { InfoContent } from "../InfoContent/InfoContent";
import chevronLeftIcon from "./chevron-left.svg";
import chevronRightIcon from "./chevron-right.svg";

export const GameInfo = () => {
  const [page, setPage] = useState(0);

  const Router = useRouter();
  const navigate = Router.push;

  const goToPrevPage = () => {
    if (page === 1) setPage(0);
    else navigate("/dashboard");
  };

  const goToNextPage = () => {
    if (page === 0) setPage(1);
    else navigate("/dashboard");
  };

  return (
    <Card className="w-11/12 max-w-4xl mx-auto my-4">
      <CardHeader className="py-2">
        <h1 className="text-lg md:text-xl text-center font-semibold text-white">
          {page === 0 ? "How to play" : "Settings"}
        </h1>
      </CardHeader>
      <CardBody className="px-4 md:px-6 py-4">
        <InfoContent page={page} />
        <div className="w-full mt-4 flex justify-between md:justify-evenly items-center">
          <button
            className="flex items-center gap-1 cursor-pointer"
            onClick={goToPrevPage}
          >
            <div className="h-6 w-6 rounded-full bg-color1-lighter flex justify-center items-center">
              <Image
                className="w-4"
                src={chevronLeftIcon}
                alt="Previous"
                width={24}
                height={24}
              />
            </div>
            <p className="pl-1 text-lg text-neutral-500">
              {page === 0 ? "Back" : "General"}
            </p>
          </button>
          <button
            className={"flex items-center gap-1 cursor-pointer"}
            onClick={goToNextPage}
          >
            <p className="pr-1 text-lg text-neutral-500">
              {page === 0 ? "Settings" : "Done"}
            </p>
            <div className="h-6 w-6 rounded-full bg-color1-lighter flex justify-center items-center">
              <Image
                className="w-4"
                src={chevronRightIcon}
                alt="Previous"
                width={24}
                height={24}
              />
            </div>
          </button>
        </div>
      </CardBody>
    </Card>
  );
};
