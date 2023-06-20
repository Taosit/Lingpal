import AuthTemplate from "../components/AuthTemplate";
import NextImage from "next/image";
import loader from "@/assets/small-loader.png";
import { useSignUp } from "@/hooks/useSignUp";
import { InputGroup } from "@/components/InputGroup/InputGroup";

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

  return (
    <AuthTemplate>
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
    </AuthTemplate>
  );
}
