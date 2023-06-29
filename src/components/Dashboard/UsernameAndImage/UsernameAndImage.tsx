import { CardHeader } from "@/components/Card";
import NextImage from "next/image";
import { CldImage } from "next-cloudinary";
import uploadIcon from "./upload-image.svg";
import checkmarkIcon from "./checkmark.svg";
import pencilIcon from "./pencil.svg";
import { useState } from "react";
import { useAuthStore } from "@/stores/AuthStore";
import useAuthAxios from "@/hooks/useAuthAxios";
import { compress } from "@/utils/helpers";

type Props = {
  showErrorMessage: (message: string) => void;
};

export const UsernameAndImage = ({ showErrorMessage }: Props) => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const loading = useAuthStore((state) => state.loading);

  const [username, setUsername] = useState(user?.username || "");
  const [edittingName, setEdittingName] = useState(false);

  const authAxios = useAuthAxios();

  const changeUsername = (name: string) => {
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
        if (!user) {
          throw new Error("User does not exist");
        }
        const newUser = { ...user, username: response.data.username };
        setUser(newUser);
        setEdittingName(false);
      });
  };

  const uploadImage = async (imageFile: File | Blob | undefined) => {
    if (!imageFile) return;
    const allowedType = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedType.includes(imageFile.type)) {
      showErrorMessage("Only .jpg, .jpeg, and .png files are allowed");
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
          if (!user) {
            throw new Error("User does not exist");
          }
          const newUser = { ...user, avatar: response.data.id };
          setUser(newUser);
        });
    };
  };

  return (
    <CardHeader className="flex justify-end pt-6 px-6 pb-1">
      <label className="cursor-pointer absolute left-12 bottom-2 h-8 w-20 p-1 rounded bg-[#D9D9D9B0] flex justify-end items-center">
        <NextImage src={uploadIcon} alt="upload image" width={24} height={24} />
        <input
          tabIndex={0}
          onChange={(e) => uploadImage(e.target.files?.[0])}
          type="file"
          className="hidden"
        />
      </label>
      <div className="absolute w-20 h-20 left-4 bottom-2">
        <CldImage
          className="w-20 h-20 rounded-full object-cover object-center"
          width="100"
          height="100"
          src={loading || !user ? "nruwutqaihxyl7sq6ilm" : user.avatar}
          alt="user avatar"
        />
      </div>
      {edittingName ? (
        <div className="relative mb-1 text-lg text-semibold rounded bg-[#D9D9D9B0] h-8 px-2 py-1 text-color1-dark flex gap-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-32 px-2 py-1 rounded bg-color1-lighter shadow-inner-light text-neutral-700"
          />
          <label id="save-name" className="hidden">
            Edit
          </label>
          <NextImage
            onClick={() => changeUsername(username)}
            onKeyDown={(e) => e.key === "Enter" && changeUsername(username)}
            tabIndex={0}
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
          <p>{loading || !user ? "" : user.username}</p>
          <label id="change-name" className="hidden">
            Edit
          </label>
          <NextImage
            onClick={() => setEdittingName(true)}
            onKeyDown={(e) => e.key === "Enter" && setEdittingName(true)}
            tabIndex={0}
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
  );
};
