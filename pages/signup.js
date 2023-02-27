import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthTemplate from "../components/AuthTemplate";
import { useAuthContext } from "../utils/contexts/AuthContext";
import NextImage from "next/image";
import loader from "../assets/small-loader.png";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [usernameChecker, setUsernameChecker] = useState({
    isValid: null,
    message: "",
  });
  const [emailChecker, setEmailChecker] = useState({
    isValid: null,
    message: "",
  });
  const [passwordChecker, setPasswordChecker] = useState({
    isValid: null,
    message: "",
  });
  const [password2Checker, setPassword2Checker] = useState({
    isValid: null,
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const { setUser, setAccessToken } = useAuthContext();

  const router = useRouter();
  const navigate = router.push;

  useEffect(() => {
    if (!username) {
      setUsernameChecker({ isValid: null, message: "" });
      return;
    }
    if (username.length < 3) {
      setUsernameChecker({ isValid: false, message: "Username too short" });
      return;
    }
    setUsernameChecker({ isValid: true, message: "" });
  }, [username]);

  useEffect(() => {
    if (!email) {
      setEmailChecker({ isValid: null, message: "" });
      return;
    }
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!regex.test(email)) {
      setEmailChecker({ isValid: false, message: "Invalid email" });
      return;
    }
    setEmailChecker({ isValid: true, message: "" });
  }, [email]);

  useEffect(() => {
    if (!password) {
      setPasswordChecker({ isValid: null, message: "" });
      return;
    }
    if (password.length < 6) {
      setPasswordChecker({ isValid: false, message: "Password too short" });
      return;
    }
    if (!/\d/.test(password)) {
      setPasswordChecker({
        isValid: false,
        message: "Password must include a digit",
      });
      return;
    }
    if (!/[a-zA-Z]/.test(password)) {
      setPasswordChecker({
        isValid: false,
        message: "Password must include a letter",
      });
      return;
    }
    setPasswordChecker({ isValid: true, message: "" });
  }, [password]);

  useEffect(() => {
    if (!password2) {
      setPassword2Checker({ isValid: null, message: "" });
      return;
    }
    if (password2 !== password) {
      setPassword2Checker({
        isValid: false,
        message: "Passwords do not match",
      });
      return;
    }
    setPassword2Checker({ isValid: true, message: "" });
  }, [password2]);

  const submitForm = (e) => {
    e.preventDefault();
    setLoading(true);
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
          setUsernameChecker({
            isValid: false,
            message: "This username is taken",
          });
        }
        if (res.status === 410) {
          setEmailChecker({ isValid: false, message: "This email is taken" });
        }
        throw new Error();
      })
      .then((data) => {
        setUser(data.user);
        setAccessToken(data.accessToken);
        setLoading(false);
        navigate("/dashboard");
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  return (
    <AuthTemplate>
      <form
        onSubmit={(e) => submitForm(e)}
        className="px-6 py-4 md:px-8 grid grid-rows-layout3"
      >
        <div className="flex flex-col justify-evenly">
          <div className="py-1 flex flex-col items-start">
            <label className="relative w-full" htmlFor="signup-username">
              <span className="mb-1">Username</span>
              <input
                id="signup-username"
                className="border border-color1-dark rounded-sm focus:outline-2 focus:outline-color1-dark p-1 w-full"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="h-4 text-sm md:text-md font-semibold left-0 text-red-700">
                {usernameChecker.message || ""}
              </div>
            </label>
          </div>
          <div className="py-1 flex flex-col items-start">
            <label className="relative w-full" htmlFor="signup-email">
              <span className="mb-1">Email</span>
              <input
                id="signup-email"
                className="border border-color1-dark rounded-sm focus:outline-2 focus:outline-color1-dark p-1 w-full"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="h-4 min-w-1 text-sm md:text-md font-semibold left-0 text-red-700">
                {emailChecker.message || " "}
              </div>
            </label>
          </div>
          <div className="py-1 flex flex-col items-start">
            <label className="relative w-full" htmlFor="signup-password">
              <span className="mb-1">Password</span>
              <input
                id="signup-password"
                className="border border-color1-dark rounded-sm focus:outline-2 focus:outline-color1-dark p-1 w-full"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                tabIndex="0"
                onClick={() => setShowPassword((prev) => !prev)}
                onKeyDown={(e) =>
                  e.key === "Enter" && setShowPassword((prev) => !prev)
                }
                className=" absolute cursor-pointer top-7 right-2 text-color1-dark font-semibold"
              >
                {showPassword ? "hide" : "show"}
              </span>
              <div className="h-4 min-w-1 text-sm md:text-md font-semibold left-0 text-red-700">
                {passwordChecker.message || " "}
              </div>
            </label>
          </div>
          <div className="py-1 flex flex-col items-start">
            <label className="relative w-full" htmlFor="confirm-password">
              <span className="mb-1">Confirm Password</span>
              <input
                id="confirm-password"
                className="border border-color1-dark rounded-sm focus:outline-2 focus:outline-color1-dark p-1 w-full"
                type={showPassword2 ? "text" : "password"}
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
              <span
                tabIndex="0"
                onClick={() => setShowPassword2((prev) => !prev)}
                onKeyDown={(e) =>
                  e.key === "Enter" && setShowPassword2((prev) => !prev)
                }
                className=" absolute cursor-pointer top-7 right-2 text-color1-dark font-semibold"
              >
                {showPassword2 ? "hide" : "show"}
              </span>
              <div className="h-4 min-w-1 text-sm md:text-md font-semibold left-0 text-red-700">
                {password2Checker.message || " "}
              </div>
            </label>
          </div>
        </div>
        <button
          disabled={
            !usernameChecker.isValid ||
            !emailChecker.isValid ||
            !passwordChecker.isValid ||
            !password2Checker.isValid
          }
          className="mt-4 mb-6 bg-color1 text-white text-lg md:text-xl font-semibold px-6 py-2 flex justify-center items-center rounded-md disabled:bg-color1-lighter disabled:cursor-not-allowed"
        >
          {loading ? (
            <NextImage
              className=""
              src={loader}
              alt="loader"
              width={24}
              height={24}
            />
          ) : (
            "Sign Up"
          )}
        </button>
      </form>
    </AuthTemplate>
  );
}
