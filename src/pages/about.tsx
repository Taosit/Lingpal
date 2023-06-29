import Link from "next/link";
import Image from "next/image";
import homeIcon from "@/assets/home.svg";
import { GameInfo } from "@/components/About/GameInfo/GameInfo";

export default function About() {
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
      <GameInfo />
    </div>
  );
}
