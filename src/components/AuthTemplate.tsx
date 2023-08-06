import React, { PropsWithChildren } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import lingpalIcon from "../assets/logo.svg";
import girlImage from "../assets/girl.png";
import { Card, CardBody, CardHeader } from "./Card";

const AuthTemplate = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const pathname = router.pathname;
  const navigate = router.push;

  const authType = pathname.includes("signup")
    ? "signUp"
    : pathname.includes("login")
    ? "signIn"
    : "unknown";

  return (
    <div className="cyan-gradient flex flex-col h-screen relative">
      <Link
        href="/"
        className="cursor-pointer flex items-center p-2 sm:py-4 absolute"
      >
        <Image
          className="w-12 md:w-20"
          src={lingpalIcon}
          alt="logo"
          width={50}
          height={50}
        />
        <p className="pl-2 font-bold sm:text-xl md:text-2xl md:pl-4">Lingpal</p>
      </Link>
      <div className="flex grow justify-center items-center">
        <Card className="w-96 max-w-[90%]">
          <CardHeader className="flex gap-4 text-xl pt-4 pb-1 px-6 md:px-8">
            <button
              onClick={() => navigate("/signup")}
              className={`${
                authType === "signUp" ? "border-b-2 border-b-white" : ""
              }`}
            >
              Signup
            </button>
            <button
              onClick={() => navigate("/login")}
              className={` ${
                authType === "signIn" ? "border-b-2 border-b-white" : ""
              }`}
            >
              Login
            </button>
          </CardHeader>
          <CardBody className="w-3xl">{children}</CardBody>
        </Card>
      </div>
      <Image
        className="auth-image"
        src={girlImage}
        alt="woman with laptop"
        width={400}
        height={300}
      />
    </div>
  );
};

export default AuthTemplate;
