import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthTemplate from "../components/AuthTemplate";
import { useAuthContext } from "../utils/contexts/AuthContext";
import { URL } from "../utils/constants";

export default () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [usernameChecker, setUsernameChecker] = useState(null);
  const [emailChecker, setEmailChecker] = useState(null);
  const [passwordChecker, setPasswordChecker] = useState(null);
  const [password2Checker, setPassword2Checker] = useState(null);

  const { setUser, setAccessToken } = useAuthContext();

  const router = useRouter()
	const navigate = router.push;

  useEffect(() => {
    if (username) setUsernameChecker(null);
  }, [username]);

  useEffect(() => {
    if (!email) {
      setEmail(null);
      return;
    }
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!regex.test(email)) {
      setEmailChecker("Invalid email");
      return;
    }
    setEmailChecker(null);
  }, [email]);

  useEffect(() => {
    if (!password) {
      setPasswordChecker(null);
      return;
    }
    if (password.length < 6) {
      setPasswordChecker("Password too short");
      return;
    }
    if (!/\d/.test(password)) {
      setPasswordChecker("Password must include a digit");
      return;
    }
    if (!/[a-zA-Z]/.test(password)) {
      setPasswordChecker("Password must include a letter");
      return;
    }
    setPasswordChecker(null);
  }, [password]);

  useEffect(() => {
    if (!password2) {
      setPassword2Checker(null);
      return;
    }
    if (password2 !== password) {
      setPassword2Checker("Password does not match");
      return;
    }
    setPassword2Checker(null);
  }, [password2]);

  const submitForm = (e) => {
    e.preventDefault();
    const body = JSON.stringify({ username, email, password });
    fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        if (res.status === 409) {
          setUsernameChecker("This username is taken");
        }
        if (res.status === 410) {
          setEmailChecker("This email is in use");
        }
        throw new Error();
      })
      .then((data) => {
        setUser(data.user);
        setAccessToken(data.accessToken);
        navigate("/dashboard");
      })
      .catch((e) => {
        console.log(e);
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
            <label className="relative w-full" htmlFor="signup-username">
              <span className="text-lg md:text-lg mb-1">Username</span>

              <input
                id="signup-username"
                className="border border-orange-500 rounded-sm focus:outline-2 focus:outline-orange-500 p-1 w-full"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {usernameChecker && (
                <div className="absolute -bottom-6 text-sm md:text-md font-semibold left-0 text-red-700">
                  !{` ${usernameChecker}`}
                </div>
              )}
            </label>
          </div>
          <div className="py-1 flex flex-col items-start">
            <label className="relative w-full" htmlFor="signup-email">
              <span className="text-lg md:text-lg mb-1">Email</span>
              <input
                id="signup-email"
                className="border border-orange-500 rounded-sm focus:outline-2 focus:outline-orange-500 p-1 w-full"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailChecker && (
                <div className="absolute -bottom-6 text-sm md:text-md font-semibold left-0 text-red-700">
                  !{` ${emailChecker}`}
                </div>
              )}
            </label>
          </div>
          <div className="py-1 flex flex-col items-start">
            <label className="relative w-full" htmlFor="signup-password">
              <span className="text-lg md:text-lg mb-1">Password</span>
              <input
                id="signup-password"
                className="border border-orange-500 rounded-sm focus:outline-2 focus:outline-orange-500 p-1 w-full"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className=" absolute cursor-pointer top-8 right-2 text-orange-500 font-semibold"
              >
                {showPassword ? "hide" : "show"}
              </span>
              {passwordChecker && (
                <div className="absolute -bottom-6 text-sm md:text-md font-semibold left-0 text-red-700">
                  !{` ${passwordChecker}`}
                </div>
              )}
            </label>
          </div>
          <div className="py-1 flex flex-col items-start">
            <label className="relative w-full" htmlFor="confirm-password">
              <span className="text-lg md:text-lg mb-1">Confirm Password</span>
              <input
                id="confirm-password"
                className="border border-orange-500 rounded-sm focus:outline-2 focus:outline-orange-500 p-1 w-full"
                type={showPassword2 ? "text" : "password"}
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
              <span
                onClick={() => setShowPassword2((prev) => !prev)}
                className=" absolute cursor-pointer top-8 right-2 text-orange-500 font-semibold"
              >
                {showPassword2 ? "hide" : "show"}
              </span>
              {password2Checker && (
                <div className="absolute -bottom-6 text-sm md:text-md font-semibold left-0 text-red-700">
                  !{` ${password2Checker}`}
                </div>
              )}
            </label>
          </div>
        </div>
        <button
          disabled={
            !username ||
            usernameChecker ||
            emailChecker ||
            passwordChecker ||
            password2Checker
          }
          className="mt-4 mb-6 bg-orange-500 text-white text-lg md:text-xl font-bold px-6 py-2 rounded-md disabled:bg-orange-300"
        >
          Submit
        </button>
      </form>
    </AuthTemplate>
  );
};
