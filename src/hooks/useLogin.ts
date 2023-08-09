import { useAuthStore } from "@/stores/AuthStore";
import { fetcher } from "@/utils/api";
import { useRouter } from "next/router";
import { useState } from "react";

export const useLogIn = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const [email, setEmail] = useState("test1@test.com");
  const [password, setPassword] = useState("test123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const navigate = router.push;

  const logIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    fetcher({
      url: "/api/login",
      method: "POST",
      body: { email, password },
    }).then((res) => {
      setLoading(false);
      if (res.ok) {
        const { user, accessToken } = res.data;
        setUser(user);
        setAccessToken(accessToken);
        navigate("/dashboard");
        return;
      }
      if (res.status === 400) {
        setError("Please fill in the required fields");
        return;
      }
      if (res.status === 401) {
        setError("Incorrect credientials");
        return;
      }
    });
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    logIn,
  };
};
