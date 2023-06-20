import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import homeIcon from "./home.svg";
import chevronLeftIcon from "./chevron-left.svg";
import chevronRightIcon from "./chevron-right.svg";
import { Card, CardBody, CardHeader } from "../../components/Card";
import { ABOUT_TEXT } from "../../utils/constants";
import { useRouter } from "next/router";

const getContent = (page: number) => {
  const content = ABOUT_TEXT[page];

  return (
    <div key={`page${page}`} className="flex flex-col gap-2">
      {content.map((item, index) => (
        <>
          <div
            key={item.title}
            className="my-2 grid grid-cols-1 lg:grid-cols-[1fr,_2fr] gap-1"
          >
            <div>
              <h2 className="text-lg">{item.title}</h2>
              {page === 1 && (
                <h3 className="text-neutral-500">
                  {(item as (typeof ABOUT_TEXT)[1][number]).subtitle}
                </h3>
              )}
            </div>
            <div>
              <p>{item.text}</p>
            </div>
          </div>
          {index !== content.length - 1 && <hr />}
        </>
      ))}
    </div>
  );
};

export default function About() {
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
    <div className="cyan-gradient md:h-screen overflow-hidden flex flex-col">
      <Link
        href="/dashboard"
        className="ml-4 mt-4 md:ml-8 py-1 px-6 flex items-center gap-2 cursor-pointer bg-color1-lighter shadow-inner-light rounded-full text-neutral-700 self-start"
      >
        <p>Home</p>
        <Image
          className="w-5 h-5"
          src={homeIcon}
          alt="home"
          width={24}
          height={24}
        />
      </Link>
      <Card className="w-11/12 max-w-4xl mx-auto my-4">
        <CardHeader className="py-2">
          <h1 className="text-lg md:text-xl text-center font-semibold text-white">
            {page === 0 ? "How to play" : "Settings"}
          </h1>
        </CardHeader>
        <CardBody className="px-4 md:px-6 py-4">
          {getContent(page)}
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
    </div>
  );
}
