import AuthTemplate from "../components/AuthTemplate";
import NextImage from "next/image";
import loader from "@/assets/small-loader.png";
import { useSignUp } from "@/hooks/useSignUp";
import { InputGroup } from "@/components/InputGroup/InputGroup";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Signup() {
  const {
    formData,
    usernameChecker,
    emailChecker,
    passwordChecker,
    loading,
    onUsernameChange,
    onEmailChange,
    onPassowrdChange,
    signUp,
  } = useSignUp();
  const [confirmSignup, setConfirmSignup] = useState(false);

  const router = useRouter();

  return (
    <AuthTemplate>
      {confirmSignup ? (
        <form
          onSubmit={(e) => signUp(e)}
          className="px-6 py-4 md:px-8 grid grid-rows-layout3"
        >
          <div className="flex flex-col justify-evenly">
            <InputGroup
              label="Username"
              value={formData.username}
              onChange={onUsernameChange}
              checker={usernameChecker}
            />
            <InputGroup
              label="Email"
              value={formData.email}
              onChange={onEmailChange}
              checker={emailChecker}
            />
            <InputGroup
              label="Password"
              value={formData.password}
              onChange={onPassowrdChange}
              checker={passwordChecker}
              isPassword
            />
          </div>
          <button
            disabled={
              !usernameChecker.isValid ||
              !emailChecker.isValid ||
              !passwordChecker.isValid
            }
            className="mt-4 mb-6 bg-color1 text-white text-lg md:text-xl font-semibold px-6 py-2 flex justify-center items-center rounded-md disabled:bg-color1-lighter disabled:cursor-not-allowed"
          >
            {loading ? (
              <NextImage src={loader} alt="loader" width={24} height={24} />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
      ) : (
        <div className="px-6 py-6 md:px-8 grid grid-rows-layout3">
          <p>
            There are 8 test accounts with email{" "}
            <span className="text-green-700 font-semibold">test1@test.com</span>{" "}
            through{" "}
            <span className="text-green-700 font-semibold">test8@test.com</span>{" "}
            and password{" "}
            <span className="text-green-700 font-semibold">test123</span>. Would
            you still like to sign up?
          </p>
          <div className="flex flex-col gap-4 justify-evenly mt-6">
            <button
              onClick={() => setConfirmSignup(true)}
              className="bg-color1 text-white text-lg md:text-xl font-semibold px-6 py-2 flex justify-center items-center rounded-md disabled:bg-color1-lighter disabled:cursor-not-allowed"
            >
              Yes, sign me up!
            </button>
            <button
              onClick={() => router.push("/login")}
              className="bg-slate-100 text-[#009a7d] text-lg md:text-xl font-semibold px-6 py-2 flex justify-center items-center rounded-md disabled:bg-color1-lighter disabled:cursor-not-allowed"
            >
              No, send me to login
            </button>
          </div>
          <p className="mt-4 text-red-800 leading-5">
            * Some test accounts may be in use and therefore unavailable
          </p>
        </div>
      )}
    </AuthTemplate>
  );
}
