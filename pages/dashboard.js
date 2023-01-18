import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import NextImage from 'next/image'
import { CldImage } from "next-cloudinary"
import Compressor from "compressorjs";
import { useAuthContext } from "../utils/contexts/AuthContext";
import useAuthAxios from "../utils/hooks/useAuthAxios";
import lingpalIcon from "../assets/logo.svg";
import uploadIcon from "../assets/upload-image.svg";
import checkmarkIcon from "../assets/checkmark.svg";
import pencilIcon from "../assets/pencil.svg";
import gamelIcon from "../assets/game.svg";
import badgeIcon from "../assets/badge.svg";
import gearsIcon from "../assets/gears.svg";
import infoIcon from "../assets/about.svg";
import { useGameContext } from "../utils/contexts/GameContext";
import { Card, CardBody, CardHeader } from "../components/Card";

export default function Dashboard(){
  const { setPlayers, setInGame, setRoomId, setRound, setDescriberIndex } =
    useGameContext();
  const { loading, user, setUser} = useAuthContext();
  const authAxios = useAuthAxios();

  const [username, setUsername] = useState(user?.username || "");
  const [edittingName, setEdittingName] = useState(false);
  const [error, setError] = useState({hasError: false, message: ""});

  const win = user?.total ? ((user.win * 100) / user.total).toFixed(1) : 0;
  const hardPlayer = user?.total? ((user.advanced * 100) / user.total).toFixed(1) : 0;

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

  const changeUsername = (name) => {
    if (name.length < 3) {
      showErrorMessage("Username must be at least 3 characters");
      return;
    }
    if (name.length > 10) {
      showErrorMessage("Username must be at most 10 characters");
      return;
    }
    if (name === user?.username) {
      setEdittingName(false);
      return;
    }
    authAxios
      .post("/api/change_username", {
        data: name,
      })
      .then((response) => {
        setUser((prev) => ({ ...prev, username: response.data.username }));
        setEdittingName(false);
      });
  };

  const uploadImage = async (imageFile) => {
    if (!imageFile) return;
    const allowedType = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedType.includes(imageFile.type)) {
      showErrorMessage("Only .jpg, .jpeg, and .png files are allowed")
      return;
    }
    if (imageFile.size > 10000) {
      imageFile = await compress(imageFile, { maxWidth: 100 });
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

  const showErrorMessage = (message) => {
    setError({hasError: true, message});
    setTimeout(() => {
      setError({hasError: false, message: ""});
    }, 3000);
  }

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
    <div className="cyan-gradient h-screen overflow-hidden">
      <div className="relative top-0 z-10 w-full flex justify-between items-end">
        <Link href="/" className="flex items-center m-2 sm:ml-8 sm:mt-4">
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
        </Link>
        <Link href="/about" className="sm:mr-8 py-1 px-6 flex items-center gap-2 cursor-pointer bg-color1-lighter shadow-inner-light rounded-full text-neutral-700">
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
          <CardHeader className='flex justify-end pt-6 px-6 pb-1'>
            <label 
            className="cursor-pointer absolute left-12 bottom-2 h-8 w-20 p-1 rounded bg-[#D9D9D9B0] flex justify-end items-center">
              <NextImage
                src={uploadIcon}
                alt="upload image"
                width={24}
                height={24}
              />
              <input
                tabIndex="0"
                onChange={(e) => uploadImage(e.target.files[0])}
                type="file"
                className="hidden"
              />
            </label>
            <div className="absolute w-20 h-20 left-4 bottom-2">
              <CldImage
                className="w-20 h-20 rounded-full object-cover object-center"
                width="100"
                height="100" 
                src={loading? "nruwutqaihxyl7sq6ilm" : user.avatar}
                alt="user avatar"
              />
            </div>
            {edittingName ? (
              <div className="relative mb-1 text-lg text-semibold rounded bg-[#D9D9D9B0] h-8 px-2 py-1 text-color1-dark flex gap-2">
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-32 px-2 py-1 rounded bg-color1-lighter shadow-inner-light text-neutral-700"/>
                <label id="save-name" className="hidden">Edit</label>
                <NextImage
                  onClick={() => changeUsername(username)}
                  onKeyDown={(e) => e.key === "Enter" && changeUsername(username)}
                  tabIndex="0"
                  role="button"
                  aria-labelledby="save-name"
                  src={checkmarkIcon}
                  alt="pencil"
                  width={24}
                  height={24}
                />
              </div>
            ) : (
              <div className="relative mb-1 text-lg text-semibold rounded bg-[#D9D9D9B0] h-8 px-2 py-1 text-color1-dark flex gap-2">
              <p>{loading? "" : user.username}</p>
              <label id="change-name" className="hidden">Edit</label>
              <NextImage
                onClick={() => setEdittingName(true)}
                onKeyDown={(e) => e.key === "Enter" && setEdittingName(true)}
                tabIndex="0"
                role="button"
                aria-labelledby="change-name"
                src={pencilIcon}
                alt="pencil"
                width={24}
                height={24}
              />
            </div>
            )}
          </CardHeader>
          <CardBody className='px-6 py-4'>
            <div className="flex flex-col">
              <div className="my-6 md:text-lg flex justify-between">
                <span className="flex gap-2">
                  <NextImage
                    src={gamelIcon}
                    alt="game"
                    width={24}
                    height={24}
                  />
                  <p>Total</p>
                </span>
                <span className="">{loading? 0 : user.total}</span>
              </div>
              <hr/>
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
                <span className="">{loading? 0 : win}%</span>
              </div>
              <hr/>
              <div className="my-6 md:text-lg flex justify-between">
                <span className="flex gap-2">
                  <NextImage
                    src={gearsIcon}
                    alt="3 gears"
                    width={24}
                    height={24}
                  />
                  <p>Hard</p>
                </span>
                <span className="">{loading? 0 : hardPlayer}%</span>
              </div>
            </div>
          </CardBody>
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
      {error.hasError && <div className="absolute left-1/2 -translate-x-1/2 bottom-8 py-2 px-8 bg-transparent-50 text-red-800 font-semibold rounded">{error.message || ""}</div>}
    </div>
  );
};

Dashboard.requireAuth = true
