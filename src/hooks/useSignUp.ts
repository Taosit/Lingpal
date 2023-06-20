import { useAuthStore } from "@/stores/AuthStore";
import { fetcher } from "@/utils/api";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

type Checker = {
  isValid: null | boolean;
  message: string;
};

export const useSignUp = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const getInitialChecker = () => ({ isValid: null, message: "" });
  const getValidStateChecker = () => ({ isValid: true, message: "" });

  const [usernameChecker, setUsernameChecker] = useState<Checker>(
    getInitialChecker()
  );
  const [emailChecker, setEmailChecker] = useState<Checker>(
    getInitialChecker()
  );

  const router = useRouter();
  const navigate = router.push;

  const onUsernameChange = (value: string) => {
    setFormData({ ...formData, username: value });
    if (!value) {
      setUsernameChecker(getInitialChecker());
      return;
    }
    if (value.length < 3) {
      setUsernameChecker({ isValid: false, message: "Username too short" });
      return;
    }
    setUsernameChecker(getValidStateChecker());
  };

  const onEmailChange = (value: string) => {
    setFormData({ ...formData, email: value });
    if (!value) {
      setEmailChecker(getInitialChecker());
      return;
    }
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!regex.test(value)) {
      setEmailChecker({ isValid: false, message: "Invalid email" });
      return;
    }
    setEmailChecker(getValidStateChecker());
  };

  const passwordChecker = useMemo(() => {
    const { password } = formData;
    if (!password) {
      return { isValid: null, message: "" };
    }
    if (password.length < 6) {
      return { isValid: false, message: "Password too short" };
    }
    if (!/\d/.test(password)) {
      return {
        isValid: false,
        message: "Password must include a digit",
      };
    }
    if (!/[a-zA-Z]/.test(password)) {
      return {
        isValid: false,
        message: "Password must include a letter",
      };
    }
    return { isValid: true, message: "" };
  }, [formData]);

  const signUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    fetcher({
      url: "/api/signup",
      method: "POST",
      body: formData,
    }).then((res) => {
      setLoading(false);
      if (res.ok) {
        const { user, accessToken } = res.data;
        setUser(user);
        setAccessToken(accessToken);
        navigate("/dashboard");
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
    });
  };

  return {
    formData,
    loading,
    usernameChecker,
    emailChecker,
    passwordChecker,
    onUsernameChange,
    onEmailChange,
    onPassowrdChange: (value: string) =>
      setFormData({ ...formData, password: value }),
    signUp,
  };
};
