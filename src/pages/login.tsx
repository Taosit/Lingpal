import AuthTemplate from "../components/AuthTemplate";
import NextImage from "next/image";
import loader from "@/assets/small-loader.png";
import { useLogIn } from "@/hooks/useLogin";
import { InputGroup } from "@/components/InputGroup/InputGroup";

export default function Login() {
  const { email, password, setEmail, setPassword, loading, error, logIn } =
    useLogIn();

  return (
    <AuthTemplate>
      <form
        onSubmit={(e) => logIn(e)}
        className="px-6 md:px-8 py-4 grid grid-rows-layout3"
      >
        <div className="flex flex-col justify-evenly">
          <InputGroup
            label="Email"
            value={email}
            onChange={setEmail}
            checker={{
              isValid: !error,
              message: error,
            }}
          />
          <InputGroup
            label="Password"
            value={password}
            onChange={setPassword}
            checker={{
              isValid: null,
              message: "",
            }}
            isPassword
          />
        </div>
        <button
          type="submit"
          disabled={!email || !password || !!error}
          className="mt-4 mb-6 bg-color1 text-white text-lg md:text-xl font-semibold px-6 py-2 rounded-md disabled:bg-color1-lighter disabled:cursor-not-allowed flex justify-center items-center"
        >
          {loading ? (
            <NextImage src={loader} alt="loader" width={24} height={24} />
          ) : (
            "Log In"
          )}
        </button>
      </form>
    </AuthTemplate>
  );
}
