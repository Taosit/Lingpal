import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import NextImage from "next/image";
import { useAuthStore } from "../stores/AuthStore";
import lingpalIcon from "../assets/logo.svg";
import infoIcon from "../assets/about.svg";
import { Card } from "../components/Card";
import { UsernameAndImage } from "@/components/Dashboard/UsernameAndImage/UsernameAndImage";
import { PlayerStats } from "@/components/Dashboard/PlayerStats/PlayerStats";
import { useGameStore } from "@/stores/GameStore";
import { useSocketContext } from "@/contexts/SocketContext";

export default function Dashboard() {
  const initalizeSettings = useGameStore((state) => state.initializeSettings);
  const setUser = useAuthStore((state) => state.setUser);
  const { disconnectSocket } = useSocketContext();

  const [error, setError] = useState({ hasError: false, message: "" });

  const router = useRouter();
  const navigate = router.push;

  useEffect(() => {
    disconnectSocket();
  }, [disconnectSocket]);

  const showErrorMessage = (message: string) => {
    setError({ hasError: true, message });
    setTimeout(() => {
      setError({ hasError: false, message: "" });
    }, 3000);
  };

  const play = () => {
    initalizeSettings();
    navigate("/game-settings");
  };

  const logout = () => {
    fetch("/api/logout", {
      credentials: "include",
    }).then(() => {
      setUser(null);
    });
  };

  return (
    <div className="cyan-gradient h-screen overflow-hidden">
      <div className="relative top-0 z-10 w-full flex justify-between items-end">
        <Link href="/" className="flex items-center m-2 sm:ml-8 sm:mt-4">
          <div className="w-12">
            <NextImage src={lingpalIcon} alt="Logo" width={50} height={50} />
          </div>
          <p className="pl-2 font-bold sm:text-xl md:text-2xl md:pl-4">
            Lingpal
          </p>
        </Link>
        <Link
          href="/about"
          className="sm:mr-8 py-1 px-6 flex items-center gap-2 cursor-pointer bg-color1-lighter shadow-inner-light rounded-full text-neutral-700"
        >
          <p>About</p>
          <NextImage
            className="w-5 h-5"
            src={infoIcon}
            alt="about the game"
            width={24}
            height={24}
          />
        </Link>
      </div>
      <div className="w-96 max-w-[90%] mx-auto flex flex-col">
        <Card className="mt-8">
          <UsernameAndImage showErrorMessage={showErrorMessage} />
          <PlayerStats />
        </Card>
        <div className="self-end">
          <button
            onClick={logout}
            className="mt-2 cursor-pointer text-color1-dark font-semibold"
          >
            Logout
          </button>
        </div>
        <button className="play-button self-center" onClick={play}>
          Play
        </button>
      </div>
      {error.hasError && (
        <div
          data-testid="error-message"
          className="absolute left-1/2 -translate-x-1/2 bottom-8 py-2 px-8 bg-transparent-50 text-red-800 font-semibold rounded"
        >
          {error.message || ""}
        </div>
      )}
    </div>
  );
}

Dashboard.requireAuth = true;
