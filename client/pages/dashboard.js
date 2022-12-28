import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import NextImage from 'next/image'
import Image from "cloudinary-react"
import Compressor from "compressorjs";
import { useAuthContext } from "../utils/contexts/AuthContext";
import useAuthAxios from "../utils/hooks/useAuthAxios";
import lingpalIcon from "../assets/lingpal.png";
import notesIcon from "../assets/notes.png";
import recordingsIcon from "../assets/recordings.png";
import uploadIcon from "../assets/upload-image.png";
import infoIcon from "../assets/info.png";
import { useGameContext } from "../utils/contexts/GameContext";
import { URL } from "../utils/constants";

export default function Dashboard(){
  const { setPlayers, setInGame, setRoomId, setRound, setDescriberIndex } =
    useGameContext();
  const { user, setUser} = useAuthContext();
  const authAxios = useAuthAxios();
  console.log(process.env.NEXT_PUBLIC_CLOUDINARY_NAME)

  const win = !user.total ? 0 : ((user.win * 100) / user.total).toFixed(1);
  const hardPlayer = !user.total
    ? 0
    : ((user.advanced * 100) / user.total).toFixed(1);

  const compress = (file, options) => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        ...options,
        success(result) {
          resolve(result);
        },
        error(err) {
          reject(err);
        },
      });
    });
  };

  const router = useRouter()
	const navigate = router.push;

  const uploadImage = async (imageFile) => {
    console.log("uploading");
    if (!imageFile) return;
    const allowedType = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedType.includes(imageFile.type)) {
      console.log("file not supported");
      return;
    }
    if (imageFile.size > 100000) {
      imageFile = await compress(imageFile, { maxWidth: 500 });
    }
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = () => {
      authAxios
        .post("/api/change_avatar", {
          data: reader.result,
        })
        .then((response) => {
          setUser((prev) => ({ ...prev, avatar: response.data.id }));
        });
    };
  };

  const play = () => {
    initializeSettings();
    navigate("/game_settings");
  };

  const initializeSettings = () => {
    setRound(0);
    setDescriberIndex(0);
    setPlayers({});
    setInGame(false);
    setRoomId(null);
  };

  const logout = () => {
    fetch("/api/logout", {
      credentials: "include",
    }).then(() => {
      setUser(null);
    });
  };

  return (
    <div className="light-yellow h-screen overflow-hidden">
      <div className="relative top-0 z-10 w-full flex justify-start">
        <div className="flex items-center m-2 sm:ml-8 sm:mt-4">
          <div className="w-12">
          <NextImage
            src={lingpalIcon}
            alt="Logo"
            width={50}
            height={50}
          />
          </div>
          <p className="pl-2 font-bold sm:text-xl md:text-2xl md:pl-4">
            Lingpal
          </p>
        </div>
      </div>
      <div className="h-2/3 sm:h-5/6 w-5/6 md:w-2/3 max-w-4xl mx-auto relative">
        <h1
          data-text="dashboard"
          className="mb-8 text-3xl md:text-4xl text-orange-700 font-semibold text-center"
        >
          dashboard
        </h1>
        <Link href="/about">
          <div className="absolute right-0 top-0 flex items-center cursor-pointer">
            <NextImage
              src={infoIcon}
              alt="about the game"
              width={24}
              height={24}
            />
            <h5 className="text-orange-400 ml-1 font-semibold">about</h5>
          </div>
        </Link>
        <div className="bg-transparent-50 w-full p-4 rounded-2xl flex items-center border-orange-700 border-2">
          <div className="w-full flex justify-center items-center">
            <div className="flex flex-col items-start">
              <div className="flex justify-center items-center">
                <div className="relative">
                  <div
                    className={`w-12 h-12 md:w-16 md:h-16 rounded-full default-background-color overflow-hidden`}
                  >
                    {/* <Image
                      className="rounded-full object-contain object-center"
                      cloudName="del89ro4h"
                      publicId={user.avatar || "nruwutqaihxyl7sq6ilm"}
                      width="300"
                      crop="scale"
                    /> */}
                  </div>
                  <label className="absolute bottom-0 -right-2 cursor-pointer">
                    <span>
                      <NextImage
                        src={uploadIcon}
                        alt="upload image"
                        width={24}
                        height={24}
                      />
                    </span>
                    <input
                      onChange={(e) => uploadImage(e.target.files[0])}
                      type="file"
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="pl-2 sm:pl-4 md:text-xl font-bold">
                  {user.username}
                </p>
              </div>
              <p className="pt-4 text-sm sm:text-base md:text-lg">
                Learning <span className="font-semibold">English</span>
              </p>
            </div>
          </div>
          <div className="w-full h-full flex justify-center items-center">
            <div className="flex flex-col items-start">
              <div className="text-sm py-1 sm:text-base md:text-lg">
                <span className="font-semibold">Played</span>:{" "}
                {` ${user.total}`}
              </div>
              <div className="text-sm py-1 sm:text-base md:text-lg">
                <span className="font-semibold">Win</span>: {` ${win}%`}
              </div>
              <div className="text-sm py-1 sm:text-base md:text-lg">
                <span className="font-semibold">Hard Player</span>:{" "}
                {` ${hardPlayer}%`}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end">
          <p
            onClick={logout}
            className="mt-2 cursor-pointer text-red-700 font-semibold"
          >
            Logout
          </p>
        </div>
        <div className="w-full my-4 md:my-8 grid grid-cols-1 gap-2 md:grid-cols-2">
          <div className="p-4 cursor-pointer flex justify-center items-center rounded-xl bg-orange-300">
            <div className="w-12 aspect-square">
              <NextImage
                src={notesIcon}
                alt="view notes"
                width={50}
                height={50}
              />
            </div>
            <h3 className="ml-2 text-lg sm:text-xl">Notes</h3>
          </div>
          <div className="p-4 cursor-pointer flex justify-center items-center rounded-xl bg-green-300">
            <div className="w-12 aspect-square">
              <NextImage
                src={recordingsIcon}
                alt="view recordings"
                width={50}
                height={50}
              />
            </div>
            <h3 className="ml-2 text-lg sm:text-xl">Recordings</h3>
          </div>
        </div>

        <div className="w-full pb-8 flex flex-col">
          <button className="play-button self-center" onClick={play}>
            Play
          </button>
        </div>
      </div>
    </div>
  );
};

Dashboard.requireAuth = true
