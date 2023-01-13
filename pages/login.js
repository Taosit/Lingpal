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
        className="px-6 md:px-8 py-4 grid grid-rows-layout3"
      >
        <div className="flex flex-col justify-evenly">
          <div className="py-1 flex flex-col items-start">
            <label className="relative w-full" htmlFor="login-email">
              <span className="mb-1">Email</span>
              <input
                id="login-email"
                className="border border-color1-dark rounded-sm focus:outline-2 focus:outline-color1-dark p-1 w-full"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          </div>
          <div className="py-1 flex flex-col items-start">
            <label className="relative w-full" htmlFor="login-password">
              <span className="mb-1">Password</span>
              <input
                id="login-password"
                className="border border-color1-dark rounded-sm focus:outline-2 focus:outline-color1-dark p-1 w-full"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                tabIndex="0"
                onClick={() => setShowPassword((prev) => !prev)}
                onKeyDown={e => e.key === "Enter" && setShowPassword((prev) => !prev)}
                className=" absolute cursor-pointer top-7 right-2 text-color1-dark font-semibold"
              >
                {showPassword ? "hide" : "show"}
              </span>
            </label>
          </div>
          <div className="py-1 flex flex-col items-start relative">
          <div className="h-4 min-w-1 text-sm md:text-md font-semibold left-0 text-red-700">
              {error || " "}
            </div>
          </div>
        </div>
        <button
          disabled={!email || !password || error}
          className="mt-4 mb-6 bg-color1 text-white text-lg md:text-xl font-semibold px-6 py-2 rounded-md disabled:bg-color1-lighter disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </form>
    </AuthTemplate>
  );
};
