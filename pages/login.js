import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthTemplate from "../components/AuthTemplate";
import { useAuthContext } from "../utils/contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("test123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const { setUser, setAccessToken } = useAuthContext();

  const router = useRouter()
	const navigate = router.push;

  useEffect(() => {
    setError(null);
  }, [email, password]);

  const submitForm = (e) => {
    e.preventDefault();
    const body = JSON.stringify({ email, password });
    fetch("/api/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        const errorMessage =
          res.status === 400
            ? "Please fill in the required fields"
            : "Incorrect credientials";
        throw new Error(errorMessage);
      })
      .then((data) => {
        setUser(data.user);
        setAccessToken(data.accessToken);
        navigate("/dashboard");
      })
      .catch((e) => {
        console.log(e.message);
        setError(e.message);
      });
  };

  return (
    <AuthTemplate>
      <form
        onSubmit={(e) => submitForm(e)}
        className="px-6 md:px-8 grid grid-rows-layout3"
      >
        <div className="flex flex-col justify-evenly">
          <div className="py-1 flex flex-col items-start">
            <label className="text-lg md:text-lg mb-1" htmlFor="sign-in-email">
              Email{" "}
            </label>
            <input
              id="sign-in-email"
              className="border border-orange-500 rounded-sm focus:outline-2 focus:outline-orange-500 p-1 w-full"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="py-1 flex flex-col items-start relative">
            <label className="relative w-full" htmlFor="sign-in-password">
              <span className="text-lg mb-1">Password</span>
              <input
                id="sign-in-password"
                className="border border-orange-500 rounded-sm focus:outline-2 focus:outline-orange-500 p-1 w-full"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                tabIndex='0'
                onClick={() => setShowPassword((prev) => !prev)}
                onKeyDown={e => e.key === "Enter" && setShowPassword((prev) => !prev)}
                className="absolute  cursor-pointer top-8 right-2 text-orange-500 font-semibold"
              >
                {showPassword ? "hide" : "show"}
              </span>
            </label>
            {error && (
              <div className="absolute -bottom-8 text-sm md:text-md font-semibold left-0 text-red-700">
                {error}
              </div>
            )}
          </div>
        </div>
        <button
          disabled={!email || !password || error}
          className="mt-4 mb-6 bg-orange-500 text-white text-lg md:text-xl font-bold px-6 py-2 rounded-md disabled:bg-orange-300"
        >
          Submit
        </button>
      </form>
    </AuthTemplate>
  );
};
